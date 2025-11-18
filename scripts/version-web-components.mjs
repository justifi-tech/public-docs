#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const version = process.argv[2];
if (!version) {
  console.error("Usage: node scripts/version-web-components.mjs <version>");
  process.exit(1);
}

try {
  // Pass plugin id to version the secondary docs instance
  execFileSync(
    process.execPath,
    [
      "./node_modules/.bin/docusaurus",
      "docs:version",
      version,
      "--",
      "--id",
      "web-components",
    ],
    { stdio: "inherit" },
  );
} catch (e) {
  process.exit(e?.status || 1);
}
