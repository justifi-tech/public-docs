/**
 * Publishes the site for LLMs, following https://llmstxt.org:
 *
 * - `<page>.md` beside every docs page, converted from the built HTML so content
 *   rendered by components (web component props tables, for one) is kept.
 * - `api-spec/<tag>.md` for every API tag, rendered from the OpenAPI document.
 * - `llms.txt`, an index in sidebar order, and `llms-full.txt`, every page in one file.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { renderApiReference } from './openapi.mjs';

const introFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'intro.md');

const classes = (node) => node.properties?.className ?? [];
const hasClass = (node, name) => classes(node).includes(name);

const find = (node, test) => {
  if (test(node)) return node;
  for (const child of node.children ?? []) {
    const found = find(child, test);
    if (found) return found;
  }
  return null;
};

const text = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(text).join('');

const DROPPED_TAGS = new Set(['button', 'svg', 'script', 'style', 'noscript']);

const cleanHtml = (node) => {
  node.children = (node.children ?? [])
    .filter((child) => !(DROPPED_TAGS.has(child.tagName) || hasClass(child, 'hash-link')))
    .map((child) => {
      if (child.type !== 'element') return child;
      if (classes(child).some((name) => name.startsWith('theme-admonition-'))) {
        const heading = find(child, (n) => classes(n).some((name) => name.startsWith('admonitionHeading')));
        const body = find(child, (n) => classes(n).some((name) => name.startsWith('admonitionContent')));
        const label = text(heading ?? { children: [] }).trim();
        const title = label.charAt(0).toUpperCase() + label.slice(1);
        return cleanHtml({
          type: 'element',
          tagName: 'blockquote',
          properties: {},
          children: [
            { type: 'element', tagName: 'p', properties: {}, children: [
              { type: 'element', tagName: 'strong', properties: {}, children: [{ type: 'text', value: title }] },
            ] },
            ...(body?.children ?? []),
          ],
        });
      }
      // Prism puts the language on <pre>; rehype-remark reads it from <code>.
      if (child.tagName === 'pre') {
        const language = classes(child).find((name) => name.startsWith('language-'));
        const code = child.children.find((n) => n.tagName === 'code');
        if (language && code) code.properties.className = [language];
      }
      return cleanHtml(child);
    });
  return node;
};

const absoluteLinks = (origin) => () => (tree) => {
  const visit = (node) => {
    if ((node.type === 'link' || node.type === 'image') && node.url.startsWith('/')) {
      node.url = origin + node.url;
    }
    (node.children ?? []).forEach(visit);
  };
  visit(tree);
};

const htmlToMarkdown = (html, origin) =>
  String(
    unified()
      .use(rehypeParse)
      .use(() => (tree) => {
        const article = find(tree, (node) => hasClass(node, 'theme-doc-markdown'));
        if (!article) throw new Error('no .theme-doc-markdown element');
        return { type: 'root', children: [cleanHtml(article)] };
      })
      .use(rehypeRemark)
      .use(absoluteLinks(origin))
      .use(remarkGfm)
      .use(remarkStringify, { bullet: '-', rule: '-' })
      .processSync(html),
  );

const sidebarDocIds = (items) =>
  items.flatMap((item) => {
    if (item.type === 'doc') return [item.id];
    if (item.type === 'category') {
      return [...(item.link?.type === 'doc' ? [item.link.id] : []), ...sidebarDocIds(item.items)];
    }
    return [];
  });

const listItem = ({ title, url, note }) => `- [${title}](${url})${note ? `: ${note}` : ''}`;

const withSource = (markdown, url) => markdown.replace(/^(# .*\n)/, `$1\nSource: ${url}\n`);

const writeFiles = (dir, files) =>
  Promise.all(
    files.map(async ({ relative, markdown }) => {
      const file = path.join(dir, relative);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, markdown);
    }),
  );

const BUILD_ONLY = 'Converted from the built HTML, so it only exists after `pnpm run build`. Run `pnpm run build && pnpm run serve` to see it.\n';

export default function llmsTxtPlugin(context, { docs, apiSpec }) {
  const { siteConfig, baseUrl, generatedFilesDir } = context;
  const origin = siteConfig.url;
  const siteUrl = (relative) => `${origin}${baseUrl}${relative}`;
  // `pnpm start` has no built HTML and never runs postBuild; its dev server serves this instead.
  const devDir = path.join(generatedFilesDir, 'llms-txt');
  let docPages = [];
  let apiPages = [];
  let files = [];
  let intro;

  return {
    name: 'llms-txt',

    async allContentLoaded({ allContent }) {
      const docsContent = allContent['docusaurus-plugin-content-docs'];
      const docSections = docs.flatMap(({ pluginId, sidebarId, sectionPrefix = '' }) => {
        const version = docsContent[pluginId].loadedVersions.find((v) => v.versionName === 'current');
        const byId = new Map(version.docs.map((doc) => [doc.id, doc]));
        return version.sidebars[sidebarId].map((item) => ({
          title: sectionPrefix + (item.label ?? byId.get(item.id).title),
          pages: sidebarDocIds([item]).map((id) => {
            const doc = byId.get(id);
            // Category index docs have a trailing-slash permalink but build to `<dir>.html`.
            const relative = doc.permalink.slice(baseUrl.length).replace(/\/$/, '');
            return { title: doc.title, note: doc.description, page: relative, relative: `${relative}.md`, url: siteUrl(`${relative}.md`) };
          }),
        }));
      });
      docPages = docSections.flatMap((section) => section.pages);

      const { route, pluginId } = apiSpec;
      const referenceUrl = siteUrl(route);
      const spec = allContent['docusaurus-plugin-redoc'][pluginId].bundle;
      const api = renderApiReference(spec, { referenceUrl });
      const apiPage = (title, note, slug, markdown) => ({
        title,
        note,
        markdown,
        relative: `${route}/${slug}.md`,
        url: siteUrl(`${route}/${slug}.md`),
      });
      const apiSections = [
        {
          title: 'API Reference',
          pages: [
            {
              title: 'OpenAPI specification',
              url: siteUrl(`redocusaurus/${pluginId}.yaml`),
              note: 'the complete API as one OpenAPI 3.0 YAML document',
            },
            apiPage('API introduction', 'authentication, idempotency, pagination, testing and error codes', 'introduction', api.introduction),
          ],
        },
        ...api.groups.map((group) => ({
          title: `API Reference: ${group.name}`,
          pages: group.pages.map((page) => apiPage(page.title, page.note, page.slug, page.markdown)),
        })),
      ];
      apiPages = apiSections.flatMap((section) => section.pages).filter((page) => page.markdown);

      intro = (await fs.readFile(introFile, 'utf8')).trim();
      const llmsTxt = [
        intro,
        `Every page below is Markdown. The full text of all of them is in one file: ${siteUrl('llms-full.txt')}. The human-readable docs are at ${siteUrl('')}, and the interactive API reference is at ${referenceUrl}.`,
        ...[...docSections, ...apiSections].map(({ title, pages }) =>
          [`## ${title}`, '', ...pages.map(listItem)].join('\n'),
        ),
      ].join('\n\n');
      files = [{ relative: 'llms.txt', markdown: `${llmsTxt}\n` }, ...apiPages];

      await fs.rm(devDir, { recursive: true, force: true });
      await writeFiles(devDir, [
        ...files,
        ...[...docPages, { relative: 'llms-full.txt' }].map(({ relative }) => ({ relative, markdown: BUILD_ONLY })),
        // redocusaurus writes this one itself, but only at build time.
        { relative: `redocusaurus/${pluginId}.yaml`, markdown: yaml.dump(spec) },
      ]);
    },

    configureWebpack() {
      return { devServer: { static: [{ publicPath: baseUrl, directory: devDir, watch: false }] } };
    },

    async postBuild({ outDir }) {
      const converted = await Promise.all(
        docPages.map(async (page) => {
          const html = await fs.readFile(path.join(outDir, `${page.page}.html`), 'utf8');
          try {
            return { ...page, markdown: htmlToMarkdown(html, origin) };
          } catch (error) {
            throw new Error(`llms-txt: ${page.page}: ${error.message}`);
          }
        }),
      );
      const llmsFull = [
        intro,
        ...converted.map((page) => withSource(page.markdown, siteUrl(page.page)).trim()),
        ...apiPages.map((page) => page.markdown.trim()),
      ].join('\n\n---\n\n');
      await writeFiles(outDir, [...files, ...converted, { relative: 'llms-full.txt', markdown: `${llmsFull}\n` }]);
    },
  };
}
