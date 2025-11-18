#!/usr/bin/env node
/**
 * Sync Web Component Library docs into this Docusaurus site.
 * - Copies markdown/mdx from:
 *   - packages/webcomponents/src/docs/** -> wc-docs/{overview|guides}
 *   - packages/webcomponents/src/components/*/ //docs; /** -> wc-docs/components/<Component>/**
//  * - Copies referenced image assets to static/img/web-components/**
//  * - Rewrites relative image links in MD/MDX to /img/web-components/** paths
//  */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoOwner = "justifi-tech";
const repoName = "web-component-library";
const branch = "new-docs-test";

const workspaceRoot = path.resolve(__dirname, "..");
const wcDocsRoot = path.join(workspaceRoot, "wc-docs");
const staticImgRoot = path.join(
  workspaceRoot,
  "static",
  "img",
  "web-components",
);

const apiBase = "https://api.github.com";
const headers = {
  "User-Agent": "public-docs-sync-script",
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
const isImage = (p) => IMAGE_EXT.includes(path.extname(p).toLowerCase());
const isMd = (p) => [".md", ".mdx"].includes(path.extname(p).toLowerCase());

async function fetchJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFileSyncSafe(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function mapGeneralDocDest(relPath) {
  // relPath is path after packages/webcomponents/src/docs/
  if (relPath.startsWith("overview/")) {
    return path.join(wcDocsRoot, "overview", relPath.slice("overview/".length));
  }
  return path.join(wcDocsRoot, "guides", relPath);
}

function mapComponentDocDest(component, relPath) {
  // relPath is path after packages/webcomponents/src/components/<Component>/docs/
  return path.join(wcDocsRoot, "components", component, relPath);
}

function makeMdxPath(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === ".md") return p.slice(0, -3) + ".mdx";
  return p;
}

function rewriteImageLinks(markdown, replacer) {
  // naive rewrite for (./relative/path.ext) or (../.../path.ext)
  return markdown.replace(
    /(\]\()(\.\/|\.\.\/)[^)]+\.(png|jpg|jpeg|gif|webp|svg)(\))/gi,
    (m) => {
      const match = m.match(/^\]\(([^)]+)\)$/);
      if (!match) return m;
      const rel = match[1];
      const dest = replacer(rel);
      return `](${dest})`;
    },
  );
}

async function main() {
  // Clean target dirs (but keep .gitkeep if present under static/img/web-components)
  ensureDir(wcDocsRoot);
  ensureDir(staticImgRoot);

  // Load repository tree recursively
  const treeUrl = `${apiBase}/repos/${repoOwner}/${repoName}/git/trees/${branch}?recursive=1`;
  const tree = await fetchJson(treeUrl);
  if (!tree || !tree.tree) throw new Error("Invalid repo tree response");

  const files = tree.tree.filter((t) => t.type === "blob").map((t) => t.path);

  // General docs
  const GENERAL_PREFIX = "packages/webcomponents/src/docs/";
  const generalDocs = files.filter((p) => p.startsWith(GENERAL_PREFIX));
  const generalMd = generalDocs.filter(isMd);
  const generalImgs = generalDocs.filter(isImage);

  // Component docs
  const COMPONENT_PREFIX = "packages/webcomponents/src/components/";
  const componentMdEntries = [];
  const componentImgEntries = [];
  for (const file of files) {
    if (!file.startsWith(COMPONENT_PREFIX)) continue;
    const seg = file.slice(COMPONENT_PREFIX.length).split("/");
    if (seg.length < 3) continue;
    const [component, maybeDocs, ...rest] = seg;
    if (maybeDocs !== "docs") continue;
    if (isMd(file)) {
      componentMdEntries.push({ component, file, rel: rest.join("/") });
    } else if (isImage(file)) {
      componentImgEntries.push({ component, file, rel: rest.join("/") });
    }
  }

  // Copy general markdown
  for (const file of generalMd) {
    const rel = file.slice(GENERAL_PREFIX.length);
    const rawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${file}`;
    let content = await fetchText(rawUrl);
    // Rewrite image links to /img/web-components/shared/...
    content = rewriteImageLinks(content, (relLink) => {
      const clean = relLink.replace(/^\.\/|\.\.\//, "");
      return `/img/web-components/shared/${clean}`;
    });
    const dest = makeMdxPath(mapGeneralDocDest(rel));
    writeFileSyncSafe(dest, content);
  }

  // Copy general images
  for (const file of generalImgs) {
    const rel = file.slice(GENERAL_PREFIX.length);
    const rawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${file}`;
    const buf = await fetchBuffer(rawUrl);
    const dest = path.join(staticImgRoot, "shared", rel);
    writeFileSyncSafe(dest, buf);
  }

  // Copy component markdown
  for (const entry of componentMdEntries) {
    const rawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${entry.file}`;
    let content = await fetchText(rawUrl);
    content = rewriteImageLinks(content, (relLink) => {
      const clean = relLink.replace(/^\.\/|\.\.\//, "");
      return `/img/web-components/${entry.component}/${clean}`;
    });
    const dest = makeMdxPath(mapComponentDocDest(entry.component, entry.rel));
    writeFileSyncSafe(dest, content);
  }

  // Copy component images
  for (const entry of componentImgEntries) {
    const rawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${entry.file}`;
    const buf = await fetchBuffer(rawUrl);
    const dest = path.join(staticImgRoot, entry.component, entry.rel);
    writeFileSyncSafe(dest, buf);
  }

  console.log("Web Components docs synced successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
