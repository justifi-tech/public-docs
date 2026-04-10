import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const docsJsonPath = require.resolve('@justifi/webcomponents-docs/docs.json');
const pkgDir = path.dirname(docsJsonPath);
const targetDir = path.resolve(rootDir, '.wc-current');

function forceRemove(p) {
  let stat;
  try {
    stat = fs.lstatSync(p);
  } catch {
    return;
  }
  if (stat.isSymbolicLink()) {
    fs.unlinkSync(p);
  } else {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

function clearDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return;
  }
  for (const entry of fs.readdirSync(dir)) {
    forceRemove(path.join(dir, entry));
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

clearDir(targetDir);
copyDir(pkgDir, targetDir);

// Symlink the source package's node_modules so webpack can resolve its deps
// (e.g. @justifi/webcomponents, miragejs) without installing them in public-docs
const srcNodeModules = path.join(pkgDir, 'node_modules');
// pnpm virtual store: scoped pkg deps are siblings in grandparent node_modules
const parentNodeModules = path.resolve(pkgDir, '..', '..');
const destNodeModules = path.join(targetDir, 'node_modules');
forceRemove(destNodeModules);
if (fs.existsSync(srcNodeModules)) {
  // Local link case: package has its own node_modules
  fs.symlinkSync(srcNodeModules, destNodeModules);
} else if (path.basename(parentNodeModules) === 'node_modules') {
  // pnpm virtual store case: deps are siblings in containing node_modules
  fs.symlinkSync(parentNodeModules, destNodeModules);
}

console.log(`Synced @justifi/webcomponents-docs → ${targetDir}`);

// Install dependencies for each versioned docs directory so each version
// resolves its own pinned @justifi/webcomponents and helper packages.
const versionedDocsRoot = path.resolve(rootDir, 'web-components_versioned_docs');
if (fs.existsSync(versionedDocsRoot)) {
  for (const entry of fs.readdirSync(versionedDocsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith('version-')) continue;
    const versionDir = path.join(versionedDocsRoot, entry.name);
    const pkgJson = path.join(versionDir, 'package.json');
    if (!fs.existsSync(pkgJson)) continue;

    const nmPath = path.join(versionDir, 'node_modules');
    let needsInstall = false;

    try {
      const stat = fs.lstatSync(nmPath);
      if (stat.isSymbolicLink()) {
        // Remove symlinks left over from old CI runs
        fs.unlinkSync(nmPath);
        needsInstall = true;
      } else {
        // Real directory — reinstall if package.json is newer
        const pkgMtime = fs.statSync(pkgJson).mtimeMs;
        const nmMtime = stat.mtimeMs;
        if (pkgMtime > nmMtime) needsInstall = true;
      }
    } catch {
      needsInstall = true; // node_modules doesn't exist
    }

    if (needsInstall) {
      console.log(`Installing deps for ${entry.name}...`);
      execSync('npm install --include=dev', {
        cwd: versionDir,
        stdio: 'inherit',
      });
    } else {
      console.log(`Deps up-to-date for ${entry.name}, skipping install.`);
    }
  }
}
