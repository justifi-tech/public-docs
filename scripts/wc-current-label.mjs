/**
 * Single source of truth for reading and writing `versions.current.label` on the
 * web-components docs plugin in docusaurus.config.ts.
 *
 * This pattern used to be duplicated inline in .github/workflows/update-wc-docs.yml
 * with a stricter shape (`label: 'x' } }`). It stopped matching the moment
 * `banner: 'none'` was added to that object, and String.replace() with no match is
 * a silent no-op — so the workflow stayed green while the label never moved and the
 * site advertised a stale "latest" version. Keep the pattern in one place, and make
 * a failed write loud.
 */

// Anchored to the web-components plugin block, capturing only the label value, so
// other keys in the object (banner, etc.) are irrelevant.
const LABEL_RE =
  /(id:\s*['"]web-components['"][\s\S]*?versions:\s*\{[\s\S]*?current:\s*\{[^}]*?\blabel:\s*')([^']*)(')/;

/** @returns {string|null} the current label, or null if the block was not found */
export function readCurrentLabel(config) {
  const match = config.match(LABEL_RE);
  return match ? match[2] : null;
}

/** @returns {string} the config with the label replaced; throws if it could not be written */
export function setCurrentLabel(config, label) {
  const current = readCurrentLabel(config);
  if (current === null) {
    throw new Error('could not find versions.current.label for the web-components plugin');
  }
  // Function replacer: a string replacement would reinterpret $-sequences.
  const next = config.replace(LABEL_RE, (_, before, _old, after) => `${before}${label}${after}`);
  if (next === config && current !== label) {
    throw new Error(`label replace was a no-op (wanted '${label}', found '${current}')`);
  }
  return next;
}
