/**
 * Merges the synced Payables spec into the main JustiFi spec, producing the single
 * document redocusaurus renders at /api-spec. Run from prebuild/prestart.
 *
 * Neither input is edited. Output goes beside index.yaml so its relative $refs still
 * resolve, and is gitignored — regenerate it, never commit it.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mainIndex = path.join(rootDir, 'openapi/multi-yaml/index.yaml');
const mainDescription = path.join(rootDir, 'openapi/docs/description.md');
const payablesSpec = path.join(rootDir, 'openapi/payables/public.bundled.json');
const outFile = path.join(rootDir, 'openapi/multi-yaml/index.merged.yaml');

// Payables' own /oauth/token is the same operation as the main spec's, down to the
// operationId — duplicates would make the merged document invalid.
const DROPPED_PATHS = ['/oauth/token'];

// Main already has a `Bank Account` tag and a `Webhook Delivery` tag; near-duplicates
// sitting next to them in one reference read as mistakes.
const TAG_RENAMES = {
  'Bank Accounts': 'Payee Bank Accounts',
  Webhooks: 'Payables Events',
};

// Payables names its operations for its own document, where `ListBankAccounts` is
// unambiguous. Here it is not: main already uses that id, and two more besides.
// Scoping every payables id keeps them unique by construction rather than by luck.
const OPERATION_ID_PREFIX = 'Payables';

// The group payables declares, and the heading we render it under.
const PAYABLES_GROUP = 'Payables';
const PAYABLES_GROUP_LABEL = 'Payables (Beta)';
const GROUP_AFTER = 'Card Present Resources';

const SCOPING_MARKER = 'A request is scoped to a payer account';

// Everything else in payables' lead restates Getting Started and Pagination.
const LEAD_SECTIONS_SKIPPED = ['Authentication', 'Conventions'];

// Inside a group already called Payables, a Payables prefix says nothing. These names
// say which resource the section is about instead, and none collides with the main spec.
const LEAD_SECTION_TAGS = {
  Provisioning: 'Payer Account Provisioning',
  'Payment lifecycle': 'Payee Payment lifecycle',
};

const fail = (message) => {
  console.error(`merge-payables-spec: ${message}`);
  process.exit(1);
};

/** OpenAPI 3.1 `type: [x, "null"]` has no 3.0 equivalent but `nullable: true`. */
const downgradeNullable = (node) => {
  if (Array.isArray(node)) return node.map(downgradeNullable);
  if (!node || typeof node !== 'object') return node;

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === 'type' && Array.isArray(value)) {
      const concrete = value.filter((t) => t !== 'null');
      if (concrete.length > 1) {
        fail(`cannot express a union type in 3.0: ${JSON.stringify(value)}`);
      }
      out.type = concrete[0];
      if (value.includes('null')) out.nullable = true;
      continue;
    }
    out[key] = downgradeNullable(value);
  }
  return out;
};

const renameTags = (node) => {
  if (Array.isArray(node)) return node.map(renameTags);
  if (!node || typeof node !== 'object') return node;

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === 'tags' && Array.isArray(value) && value.every((v) => typeof v === 'string')) {
      out.tags = value.map((t) => TAG_RENAMES[t] ?? t);
      continue;
    }
    if (key === 'name' && typeof value === 'string' && TAG_RENAMES[value]) {
      out.name = TAG_RENAMES[value];
      continue;
    }
    out[key] = renameTags(value);
  }
  return out;
};

const scopeOperationIds = (pathItems) => {
  for (const item of Object.values(pathItems)) {
    for (const op of Object.values(item ?? {})) {
      if (op && typeof op === 'object' && op.operationId) {
        op.operationId = `${OPERATION_ID_PREFIX}${op.operationId}`;
      }
    }
  }
};

/** operationIds the main spec declares, which live in the files its $refs point at. */
const mainOperationIds = (doc, baseDir) => {
  const ids = [];
  const visit = (item) => {
    if (!item || typeof item !== 'object') return;
    if (typeof item.$ref === 'string' && !item.$ref.startsWith('#')) {
      const file = path.resolve(baseDir, item.$ref.split('#')[0]);
      if (!fs.existsSync(file)) return;
      const loaded = yaml.load(fs.readFileSync(file, 'utf8'));
      for (const op of Object.values(loaded ?? {})) {
        if (op && typeof op === 'object' && op.operationId) ids.push(op.operationId);
      }
      return;
    }
    for (const op of Object.values(item)) {
      if (op && typeof op === 'object' && op.operationId) ids.push(op.operationId);
    }
  };
  Object.values(doc.paths ?? {}).forEach(visit);
  Object.values(doc['x-webhooks'] ?? {}).forEach(visit);
  return ids;
};

/**
 * Turns the payables lead sections with no counterpart in the main lead into
 * documentation-only tags. As description sections they render above the whole API
 * reference, which is the wrong place for rules that apply to one group; Redoc's
 * x-traitTag puts them in the sidebar inside the Payables group instead.
 */
const payablesTraitTags = (description) => {
  const tags = [];

  const at = description.indexOf(SCOPING_MARKER);
  if (at === -1) {
    console.warn(`merge-payables-spec: no "${SCOPING_MARKER}…" sentence found; skipping it`);
  } else {
    const scoping = description.slice(at).split('\n\n')[0].replace(/\s*\n\s*/g, ' ').trim();
    tags.push({
      name: 'Payer Account Scope',
      description:
        `${scoping} Obtaining a token is unchanged — see ` +
        `[API Credentials](#tag/API-Credentials).`,
      'x-traitTag': true,
    });
  }

  // Every `##` section that is not a restatement of the main lead, in source order, so a
  // new explainer in payables arrives here without this script being taught about it.
  let current = null;
  for (const line of description.split('\n')) {
    const heading = /^## (.+)$/.exec(line);
    if (heading) {
      const title = heading[1].trim();
      current = LEAD_SECTIONS_SKIPPED.includes(title)
        ? null
        : { name: LEAD_SECTION_TAGS[title] ?? title, body: [], 'x-traitTag': true };
      if (current) tags.push(current);
      continue;
    }
    current?.body.push(line);
  }

  if (!tags.some((t) => t.name === LEAD_SECTION_TAGS.Provisioning)) {
    fail('payables description has no `## Provisioning` section');
  }

  return tags.map(({ body, ...tag }) =>
    body ? { ...tag, description: body.join('\n').trim() } : tag,
  );
};

for (const file of [mainIndex, mainDescription, payablesSpec]) {
  if (!fs.existsSync(file)) fail(`missing input: ${path.relative(rootDir, file)}`);
}

const main = yaml.load(fs.readFileSync(mainIndex, 'utf8'));
const payables = renameTags(downgradeNullable(JSON.parse(fs.readFileSync(payablesSpec, 'utf8'))));
scopeOperationIds(payables.paths);
scopeOperationIds(payables.webhooks ?? {});

// --- paths -------------------------------------------------------------------------
// Main's server carries the /v1 prefix; payables' paths carry it themselves.
const mainServer = main.servers?.[0]?.url ?? '';
const stripPrefix = mainServer.endsWith('/v1') ? '/v1' : '';

const merged = { ...main };
merged.paths = { ...main.paths };

for (const [route, item] of Object.entries(payables.paths)) {
  if (DROPPED_PATHS.includes(route)) continue;

  const rebased = stripPrefix && route.startsWith(`${stripPrefix}/`)
    ? route.slice(stripPrefix.length)
    : route;

  if (merged.paths[rebased]) fail(`path collision on ${rebased}`);
  // The root server already covers these; a per-operation override would render a
  // redundant server box on every payables operation.
  for (const op of Object.values(item)) {
    if (op && typeof op === 'object') delete op.servers;
  }
  merged.paths[rebased] = item;
}

// --- tags --------------------------------------------------------------------------
const mainTagNames = new Set(main.tags.map((t) => t.name));
const traitTags = payablesTraitTags(payables.info.description);
const newTags = [...traitTags, ...payables.tags.filter((t) => !mainTagNames.has(t.name))];

const collidingTraits = traitTags.filter((t) => mainTagNames.has(t.name));
if (collidingTraits.length) {
  fail(`trait tag name(s) already used: ${collidingTraits.map((t) => t.name).join(', ')}`);
}

merged.tags = [...main.tags, ...newTags];

// Main's paths are $ref stubs here, so counting ids in the merged root alone would
// see only payables' and call any collision clean.
const mainIds = mainOperationIds(main, path.dirname(mainIndex));
const mainIdSet = new Set(mainIds);

const preExisting = [...new Set(mainIds.filter((id, i) => mainIds.indexOf(id) !== i))];
if (preExisting.length) {
  console.warn(`merge-payables-spec: main spec already repeats: ${preExisting.join(', ')}`);
}

const introduced = [];
for (const [route, item] of Object.entries(payables.paths)) {
  if (DROPPED_PATHS.includes(route)) continue;
  for (const op of Object.values(item ?? {})) {
    if (op?.operationId && mainIdSet.has(op.operationId)) introduced.push(op.operationId);
  }
}
if (introduced.length) {
  fail(`payables operationId(s) already used by the main spec: ${introduced.join(', ')}`);
}

// --- tag groups --------------------------------------------------------------------
const groups = main['x-tagGroups'].map((g) => ({ ...g, tags: [...g.tags] }));
const groupByName = new Map(groups.map((g) => [g.name, g]));
const newTagNames = new Set(newTags.map((t) => t.name));

for (const group of payables['x-tagGroups']) {
  const tags = group.tags.filter((t) => newTagNames.has(t));
  if (!tags.length) continue;

  const existing = groupByName.get(group.name);
  if (existing) {
    existing.tags.push(...tags.filter((t) => !existing.tags.includes(t)));
    continue;
  }

  const at = groups.findIndex((g) => g.name === GROUP_AFTER);
  // Traits first: they explain how the group works before listing what it exposes.
  const leading = group.name === PAYABLES_GROUP ? traitTags.map((t) => t.name) : [];
  const label = group.name === PAYABLES_GROUP ? PAYABLES_GROUP_LABEL : group.name;
  const inserted = { name: label, tags: [...leading, ...tags] };
  groups.splice(at === -1 ? groups.length : at + 1, 0, inserted);
  groupByName.set(group.name, inserted);
}
merged['x-tagGroups'] = groups;

const grouped = new Set(groups.flatMap((g) => g.tags));
const ungrouped = merged.tags.map((t) => t.name).filter((n) => !grouped.has(n));
if (ungrouped.length) {
  console.warn(`merge-payables-spec: tags in no group: ${ungrouped.join(', ')}`);
}

// --- webhooks ----------------------------------------------------------------------
// 3.1 states webhooks natively; the 3.0 document uses Redoc's x-webhooks extension.
merged['x-webhooks'] = { ...(main['x-webhooks'] ?? {}) };
for (const [name, item] of Object.entries(payables.webhooks ?? {})) {
  const key = merged['x-webhooks'][name] ? `payables_${name}` : name;
  merged['x-webhooks'][key] = item;
}
delete merged.webhooks;

// --- lead --------------------------------------------------------------------------
merged.info = { ...main.info, description: fs.readFileSync(mainDescription, 'utf8').trimEnd() };

fs.writeFileSync(
  outFile,
  `# GENERATED by scripts/merge-payables-spec.mjs — do not edit, do not commit.\n` +
    `# Sources: openapi/multi-yaml/index.yaml + openapi/payables/public.bundled.json\n` +
    yaml.dump(merged, { lineWidth: -1, noRefs: true }),
);

const added = Object.keys(merged.paths).length - Object.keys(main.paths).length;
console.log(
  `merge-payables-spec: wrote ${path.relative(rootDir, outFile)} ` +
    `(+${added} paths, +${newTags.length} tags, ` +
    `+${Object.keys(payables.webhooks ?? {}).length} webhooks)`,
);
