/**
 * Sets the web-components docs `current.label` in docusaurus.config.ts.
 * Used by the update-wc-docs workflow after a new major.minor is snapshotted.
 *
 * Env: MAJOR_MINOR (required)
 * Arg: path to docusaurus.config.ts (default: repo root)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setCurrentLabel } from './wc-current-label.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const configPath = path.resolve(process.argv[2] || path.join(rootDir, 'docusaurus.config.ts'));
const label = (process.env.MAJOR_MINOR || '').trim();

if (!label) {
  console.error('wc-set-current-label: MAJOR_MINOR is required');
  process.exit(1);
}

const config = fs.readFileSync(configPath, 'utf8');

let next;
try {
  next = setCurrentLabel(config, label);
} catch (err) {
  console.error(`wc-set-current-label: ${err.message}`);
  process.exit(1);
}

fs.writeFileSync(configPath, next);
console.log(`wc-set-current-label: versions.current.label -> ${label}`);
