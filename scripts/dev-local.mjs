import { fileURLToPath } from 'url';
import path from 'path';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const linkPath = process.argv.find((a, i) => i > 1 && a !== '--');
if (!linkPath) {
  console.error('Usage: pnpm run dev:local -- /path/to/web-component-library/docs');
  process.exit(1);
}

const resolvedPath = path.resolve(linkPath);
const run = (cmd) => execSync(cmd, { cwd: rootDir, stdio: 'inherit' });

run(`pnpm link ${resolvedPath}`);
run('node scripts/sync-wc-docs.mjs');
run('pnpm start');
