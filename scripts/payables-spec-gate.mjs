/**
 * Decides whether an incoming Payables spec should replace the committed one.
 * Used by the update-payables-spec workflow.
 *
 * Env: SOURCE_SHA, SOURCE_COMMITTED_AT, INCOMING_SPEC (required), GITHUB_OUTPUT (set by Actions)
 * Outputs: should_update, reason
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publishedDir = path.join(rootDir, 'openapi', 'payables');
const publishedSpec = path.join(publishedDir, 'public.bundled.json');
const publishedSource = path.join(publishedDir, 'source.json');

const fail = (message) => {
  console.error(`payables-spec-gate: ${message}`);
  process.exit(1);
};

const { SOURCE_SHA, SOURCE_COMMITTED_AT, INCOMING_SPEC } = process.env;

if (!SOURCE_SHA) fail('SOURCE_SHA is required');
if (!SOURCE_COMMITTED_AT) fail('SOURCE_COMMITTED_AT is required');
if (!INCOMING_SPEC) fail('INCOMING_SPEC is required');
if (!fs.existsSync(INCOMING_SPEC)) fail(`no spec at ${INCOMING_SPEC}`);

const incomingBytes = fs.readFileSync(INCOMING_SPEC);

let incoming;
try {
  incoming = JSON.parse(incomingBytes.toString('utf8'));
} catch (error) {
  fail(`incoming spec is not valid JSON: ${error.message}`);
}

if (!incoming.openapi || !incoming.paths) {
  fail('incoming spec declares no `openapi` version or no `paths` — refusing to publish it');
}

// The sender already refuses to build a document with an internal surface in it. Assert it
// again here: this is the last point before a customer reads it, and the cost of being wrong
// is publishing JustiFi's internal API.
const internalPaths = Object.keys(incoming.paths).filter((p) => p.startsWith('/internal'));
const schemes = incoming.components?.securitySchemes ?? {};

if (internalPaths.length > 0) {
  fail(`incoming spec carries ${internalPaths.length} internal path(s): ${internalPaths.join(', ')}`);
}
if (Object.prototype.hasOwnProperty.call(schemes, 'ServiceJWT')) {
  fail('incoming spec carries the ServiceJWT security scheme, which is service-to-service only');
}

const incomingAt = Date.parse(SOURCE_COMMITTED_AT);
if (Number.isNaN(incomingAt)) fail(`SOURCE_COMMITTED_AT is not a date: ${SOURCE_COMMITTED_AT}`);

const decide = () => {
  if (!fs.existsSync(publishedSource)) {
    return { shouldUpdate: true, reason: `first import, from ${SOURCE_SHA.slice(0, 7)}` };
  }

  const published = JSON.parse(fs.readFileSync(publishedSource, 'utf8'));
  const publishedAt = Date.parse(published.source_committed_at);

  if (Number.isNaN(publishedAt)) {
    fail(`committed source.json has an unreadable source_committed_at: ${published.source_committed_at}`);
  }

  // Two merges can land close enough together that their dispatches finish out of order.
  // Whichever commit is older loses, whichever arrives second.
  if (incomingAt <= publishedAt) {
    return {
      shouldUpdate: false,
      reason:
        `${SOURCE_SHA.slice(0, 7)} (${SOURCE_COMMITTED_AT}) is not newer than the published ` +
        `${String(published.source_sha).slice(0, 7)} (${published.source_committed_at})`,
    };
  }

  // Most payables commits under openapi/ leave the customer-facing document untouched:
  // internal-only prose is stripped from it, and README/tooling edits never reach it.
  if (fs.existsSync(publishedSpec) && fs.readFileSync(publishedSpec).equals(incomingBytes)) {
    return { shouldUpdate: false, reason: 'the derived spec is byte-identical to the published one' };
  }

  return { shouldUpdate: true, reason: `updating to ${SOURCE_SHA.slice(0, 7)}` };
};

const { shouldUpdate, reason } = decide();

console.log(`payables-spec-gate: ${shouldUpdate ? 'publishing' : 'skipping'} — ${reason}`);

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `should_update=${shouldUpdate}\nreason=${reason}\n`,
  );
}
