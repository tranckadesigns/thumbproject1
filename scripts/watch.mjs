/**
 * PSDfuel — Asset Pipeline
 *
 * Verwerkt alle assets in ../psdfuel-assets/_ready/:
 *   1. generate-meta.mjs  — AI schrijft meta.json
 *   2. upload-assets.mjs  — categoriseert, uploadt naar Supabase, verplaatst naar _uploaded/
 *
 * Gebruik:
 *   npm run watch
 *
 * Voer dit handmatig uit wanneer je assets klaar hebt in _ready/.
 * Het script draait één keer en stopt.
 */

import { readdir, stat } from "fs/promises";
import { join, resolve } from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname   = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(__dirname, "..");
const READY_DIR   = resolve(PROJECT_DIR, "../psdfuel-assets/_ready");

// ─── Bestandsstabiliteit ──────────────────────────────────────────────────────

async function getTotalBytes(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    let total = 0;
    for (const e of entries) {
      if (e.isFile()) {
        const { size } = await stat(join(dir, e.name));
        total += size;
      }
    }
    return total;
  } catch {
    return -1;
  }
}

/** Wacht tot alle mappen in _ready stabiel zijn (grootte 3× ongewijzigd à 2s). */
async function waitUntilAllStable() {
  const INTERVAL = 2000;
  const REQUIRED = 3;

  return new Promise((resolve) => {
    let stableCount = 0;
    let lastSnapshot = null;

    const timer = setInterval(async () => {
      let snapshot = "";
      try {
        const entries = await readdir(READY_DIR, { withFileTypes: true });
        for (const e of entries) {
          if (e.isDirectory()) {
            const bytes = await getTotalBytes(join(READY_DIR, e.name));
            snapshot += `${e.name}:${bytes};`;
          }
        }
      } catch {}

      if (snapshot === lastSnapshot) {
        stableCount++;
        if (stableCount >= REQUIRED) {
          clearInterval(timer);
          resolve();
        }
      } else {
        stableCount = 0;
        lastSnapshot = snapshot;
      }
    }, INTERVAL);
  });
}

// ─── Script runner ────────────────────────────────────────────────────────────

function runScript(name) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "node",
      ["--env-file=.env.local", `scripts/${name}`],
      { cwd: PROJECT_DIR, stdio: "inherit" }
    );
    child.on("close", (code) => {
      code === 0 ? resolve() : reject(new Error(`${name} sloot af met code ${code}`));
    });
    child.on("error", reject);
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  // Check of er assets in _ready staan
  let pendingAssets = [];
  try {
    const entries = await readdir(READY_DIR, { withFileTypes: true });
    pendingAssets = entries.filter((e) => e.isDirectory());
  } catch {
    console.error(`❌  _ready/ map niet gevonden: ${READY_DIR}`);
    process.exit(1);
  }

  if (pendingAssets.length === 0) {
    console.log("Geen assets gevonden in _ready/ — klaar.");
    process.exit(0);
  }

  console.log(`\n📦  ${pendingAssets.length} asset(s) gevonden in _ready/`);
  console.log(`⏳  Wachten tot bestanden klaar zijn met kopiëren...`);

  await waitUntilAllStable();

  console.log(`🤖  Meta genereren via AI...`);
  try {
    await runScript("generate-meta.mjs");
  } catch (err) {
    console.error(`❌  generate-meta mislukt: ${err.message}`);
    process.exit(1);
  }

  console.log(`⬆️  Uploaden naar Supabase...`);
  try {
    await runScript("upload-assets.mjs");
  } catch (err) {
    console.error(`❌  upload-assets mislukt: ${err.message}`);
    process.exit(1);
  }

  console.log(`\n✅  Klaar!\n`);
  process.exit(0);
}

run();
