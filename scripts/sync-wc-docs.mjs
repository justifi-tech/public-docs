import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const docsJsonPath = require.resolve('@justifi/webcomponents-docs/docs.json');
const pkgDir = path.dirname(docsJsonPath);
const targetDir = path.resolve(rootDir, '.wc-current');

function clearDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return;
  }
  for (const entry of fs.readdirSync(dir)) {
    if (entry === 'node_modules') continue;
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
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
fs.rmSync(destNodeModules, { recursive: true, force: true });
if (fs.existsSync(srcNodeModules)) {
  // Local link case: package has its own node_modules
  fs.symlinkSync(srcNodeModules, destNodeModules);
} else if (path.basename(parentNodeModules) === 'node_modules') {
  // pnpm virtual store case: deps are siblings in containing node_modules
  fs.symlinkSync(parentNodeModules, destNodeModules);
}

console.log(`Synced @justifi/webcomponents-docs → ${targetDir}`);
