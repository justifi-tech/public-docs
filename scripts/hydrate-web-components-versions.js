'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const tar = require('tar');

const REGISTRY_URL = 'https://registry.npmjs.org/@justifi%2Fwebcomponents';
const PACKAGE_NAME = '@justifi/webcomponents';
const SITE_ROOT = path.resolve(__dirname, '..');
const TMP_ROOT = path.join(SITE_ROOT, '.wc-tmp');
const VERSIONED_DOCS_ROOT = path.join(
  SITE_ROOT,
  'versioned_docs',
  'version-web-components'
);
const VERSIONS_FILE = path.join(SITE_ROOT, 'versions-web-components.json');
const CURRENT_DOCS_SRC = path.join(
  SITE_ROOT,
  'node_modules',
  '@justifi',
  'webcomponents',
  'docs'
);
const CURRENT_DOCS_DEST = path.join(SITE_ROOT, '.wc-current');

function readMinorVersions() {
  const fromEnv = process.env.WC_VERSIONS;
  if (fromEnv) {
    try {
      const parsed = JSON.parse(fromEnv);
      if (Array.isArray(parsed) && parsed.length) return parsed.map(String);
    } catch {}
  }
  const configPath = path.join(__dirname, 'wc-versions.json');
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) return parsed.map(String);
  }
  // Fallback to latest minor only at runtime by resolving from installed package version
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkgJson = require(
      path.join(
        SITE_ROOT,
        'node_modules',
        '@justifi',
        'webcomponents',
        'package.json'
      )
    );
    const [maj, min] = String(pkgJson.version).split('.').slice(0, 2);
    return [`${maj}.${min}`];
  } catch {
    console.warn(
      "WC_VERSIONS not provided and no wc-versions.json found. Defaulting to ['1.0']."
    );
    return ['1.0'];
  }
}

async function fetchJson(url) {
  if (typeof fetch !== 'undefined') {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok)
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    return await res.json();
  }
  // Node <18 fallback not required; engines specify >=18
  throw new Error('Global fetch not available in this Node version.');
}

function compareSemver(a, b) {
  const pa = a.split('.').map((n) => parseInt(n, 10));
  const pb = b.split('.').map((n) => parseInt(n, 10));
  for (let i = 0; i < 3; i += 1) {
    const da = pa[i] || 0;
    const db = pb[i] || 0;
    if (da !== db) return da - db;
  }
  return 0;
}

function highestPatchForMinor(allVersions, minor) {
  const candidates = Object.keys(allVersions).filter((v) =>
    v.startsWith(`${minor}.`)
  );
  if (!candidates.length) return null;
  candidates.sort(compareSemver); // ascending
  return candidates[candidates.length - 1];
}

async function downloadAndExtractDocs(tarballUrl, destDir) {
  await fs.promises.mkdir(destDir, { recursive: true });
  const res = await fetch(tarballUrl);
  if (!res.ok)
    throw new Error(
      `Failed to download tarball: ${res.status} ${res.statusText}`
    );
  // Stream directly to tar extractor
  await tar.x(
    {
      cwd: destDir,
      strip: 1, // strip 'package/'
    },
    res.body
  );
}

function dirExistsAndNotEmpty(dirPath) {
  try {
    const stat = fs.statSync(dirPath);
    if (!stat.isDirectory()) return false;
    const entries = fs.readdirSync(dirPath);
    return entries.length > 0;
  } catch {
    return false;
  }
}

function findDocsSourceDir(tmpDir) {
  // Common candidates in published packages
  const candidates = [
    path.join(tmpDir, 'docs', 'web-components'),
    path.join(tmpDir, 'docs'),
    path.join(tmpDir, 'dist', 'docs'),
    path.join(tmpDir, 'packages', 'web-components', 'docs'),
  ];
  for (const candidate of candidates) {
    if (dirExistsAndNotEmpty(candidate)) return candidate;
  }
  // Fallback: recursively search for a folder literally named "docs"
  const stack = [tmpDir];
  const visited = new Set();
  while (stack.length) {
    const current = stack.pop();
    if (!current || visited.has(current)) continue;
    visited.add(current);
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
          continue;
        }
        if (entry.name === 'docs' && dirExistsAndNotEmpty(full)) {
          return full;
        }
        stack.push(full);
      }
    }
  }
  return null;
}

async function copyDocsToVersion(tmpDir, minor) {
  const src = findDocsSourceDir(tmpDir);
  if (!src) {
    throw new Error(`Docs folder not found in tarball: ${path.join(tmpDir, 'docs')}`);
  }
  const dest = path.join(VERSIONED_DOCS_ROOT, `version-${minor}`);
  await fs.promises.rm(dest, { recursive: true, force: true });
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  // Node 18+ supports fs.cp
  await fs.promises.cp(src, dest, { recursive: true });
  return dest;
}

function isMarkdown(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ext === '.md' || ext === '.mdx';
}

function transformFrontMatter(content, relativePath) {
  if (!content.startsWith('---')) return content;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return content;
  const headerRaw = content.slice(3, end).trim();
  const body = content.slice(end + 4); // skip \n---
  const lines = headerRaw.split('\n');
  let foundId = null;
  let originalSlugLine = null;
  const kept = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith('id:')) {
      const val = line.split(':').slice(1).join(':').trim();
      // remove surrounding quotes if present
      foundId = val.replace(/^['"]|['"]$/g, '');
      continue; // drop id
    }
    if (trimmed.toLowerCase().startsWith('slug:')) {
      originalSlugLine = line;
      continue; // slug will be regenerated when possible
    }
    kept.push(line);
  }
  if (foundId) {
    let slug =
      foundId.startsWith('/') || foundId.startsWith('./')
        ? foundId.replace(/^\.\//, '')
        : `/${foundId}`;
    kept.push(`slug: ${slug}`);
  } else if (originalSlugLine) {
    kept.push(originalSlugLine);
  }
  const newHeader = kept.join('\n');
  return `---\n${newHeader}\n---${body}`;
}

async function copyCurrentDocsWithTransform() {
  // If the package is not installed, skip silently
  if (!fs.existsSync(CURRENT_DOCS_SRC)) return;
  // Reset destination
  await fs.promises.rm(CURRENT_DOCS_DEST, { recursive: true, force: true });
  await fs.promises.mkdir(CURRENT_DOCS_DEST, { recursive: true });
  // Recursive copy with transform for md/mdx, and skip templates/
  async function recurse(srcDir, destDir) {
    const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'templates') continue; // skip templates
        await fs.promises.mkdir(destPath, { recursive: true });
        await recurse(srcPath, destPath);
      } else if (entry.isFile()) {
        if (isMarkdown(entry.name)) {
          const raw = await fs.promises.readFile(srcPath, 'utf8');
          const rel = path.relative(CURRENT_DOCS_SRC, srcPath);
          const transformed = transformFrontMatter(raw, rel);
          await fs.promises.writeFile(destPath, transformed, 'utf8');
        } else {
          // Copy as-is (helpers, assets, etc.)
          await fs.promises.copyFile(srcPath, destPath);
        }
      }
    }
  }
  await recurse(CURRENT_DOCS_SRC, CURRENT_DOCS_DEST);
}

async function writeVersionsFile(minors) {
  await fs.promises.writeFile(
    VERSIONS_FILE,
    JSON.stringify(minors, null, 2) + '\n',
    'utf8'
  );
}

async function main() {
  const minors = readMinorVersions();
  const registry = await fetchJson(REGISTRY_URL);
  const allVersions = registry.versions || {};

  // Newest -> oldest order by semver
  const minorsSorted = [...new Set(minors)].sort(
    (a, b) => -compareSemver(`${a}.0`, `${b}.0`)
  );

  await fs.promises.mkdir(TMP_ROOT, { recursive: true });
  await fs.promises.mkdir(VERSIONED_DOCS_ROOT, { recursive: true });

  // Prepare current docs (installed package) by transforming front matter
  await copyCurrentDocsWithTransform();

  const hydratedMinors = [];
  for (const minor of minorsSorted) {
    const version = highestPatchForMinor(allVersions, minor);
    if (!version) {
      console.warn(`No version found for minor ${minor}; skipping.`);
      continue;
    }
    const meta = allVersions[version];
    const tarballUrl = meta?.dist?.tarball;
    if (!tarballUrl) {
      console.warn(`No tarball URL for ${PACKAGE_NAME}@${version}; skipping.`);
      continue;
    }
    const tmpDir = path.join(TMP_ROOT, version);
    await fs.promises.rm(tmpDir, { recursive: true, force: true });
    await fs.promises.mkdir(tmpDir, { recursive: true });
    console.log(
      `Hydrating Web Components docs ${PACKAGE_NAME}@${version} → minor ${minor}`
    );
    await downloadAndExtractDocs(tarballUrl, tmpDir);
    const src = findDocsSourceDir(tmpDir);
    if (!src) {
      console.warn(
        `No docs found in ${PACKAGE_NAME}@${version}; skipping minor ${minor}.`
      );
      continue;
    }
    await copyDocsToVersion(tmpDir, minor);
    hydratedMinors.push(minor);
  }

  // Write versions file for the plugin instance
  await writeVersionsFile(hydratedMinors);

  // Cleanup tmp
  try {
    await fs.promises.rm(TMP_ROOT, { recursive: true, force: true });
  } catch {}

  console.log('Hydration complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
