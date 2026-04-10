/**
 * Compares incoming @justifi/webcomponents semver to the web-components docs
 * `current.label` in docusaurus.config.ts. Used by the update-wc-docs workflow.
 *
 * Env: WC_VERSION (required), GITHUB_OUTPUT (optional, set by Actions)
 * Arg: path to docusaurus.config.ts (default: repo root)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const configPath = path.resolve(process.argv[2] || path.join(rootDir, 'docusaurus.config.ts'));
const wcVersionRaw = process.env.WC_VERSION;

if (!wcVersionRaw) {
  console.error('wc-version-gate: WC_VERSION is required');
  process.exit(1);
}

const config = fs.readFileSync(configPath, 'utf8');
const labelMatch = config.match(
  /id:\s*['"]web-components['"][\s\S]*?versions:\s*\{[\s\S]*?current:\s*\{[^}]*\blabel:\s*'([^']*)'/,
);

if (!labelMatch) {
  console.error('wc-version-gate: could not find versions.current.label in docusaurus.config.ts');
  process.exit(1);
}

const currentLabel = labelMatch[1];
const normalized = wcVersionRaw.trim().replace(/^v/i, '');
const parts = normalized.split('.').filter(Boolean);
const incomingMajorMinor =
  parts.length >= 2 ? `${parts[0]}.${parts[1]}` : (parts[0] ?? '');

const shouldSnapshot = incomingMajorMinor !== currentLabel;

const lines = [
  `major_minor=${incomingMajorMinor}`,
  `should_snapshot=${shouldSnapshot}`,
  `current_label=${currentLabel}`,
];

const ghOutput = process.env.GITHUB_OUTPUT;
if (ghOutput) {
  fs.appendFileSync(ghOutput, `${lines.join('\n')}\n`);
} else {
  console.log(
    JSON.stringify(
      {
        major_minor: incomingMajorMinor,
        should_snapshot: shouldSnapshot,
        current_label: currentLabel,
      },
      null,
      2,
    ),
  );
}
