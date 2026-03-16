/**
 * PSDfuel — Asset Watcher
 *
 * Bewaakt _ready/ op nieuwe asset-mappen. Zodra bestanden stabiel zijn
 * (klaar met kopiëren), draait het automatisch:
 *   1. generate-meta.mjs  — AI schrijft meta.json
 *   2. upload-assets.mjs  — uploadt naar Supabase + verplaatst naar _uploaded/
 *
 * Er draait altijd maar één pipeline tegelijk (geen parallelisme).
 *
 * Gebruik:
 *   npm run watch
 */

import { watch } from "fs";
import { readdir, stat } from "fs/promises";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname   = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(__dirname, "..");
const READY_DIR   = resolve(PROJECT_DIR, "../psdfuel-assets/_ready");

// Pipeline-state
let pipelineRunning = false;
let pipelinePending = false;
let debounceTimer   = null;

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
    let lastSnapshot = "";

    const timer = setInterval(async () => {
      // Snapshot van alle map-groottes samen
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

      if (snapshot && snapshot === lastSnapshot) {
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

// ─── Pipeline ─────────────────────────────────────────────────────────────────

async function runPipeline() {
  if (pipelineRunning) {
    // Komt er nog een trigger binnen terwijl we draaien → daarna opnieuw
    pipelinePending = true;
    return;
  }

  // Check of er überhaupt nog assets in _ready staan
  let pendingAssets = [];
  try {
    const entries = await readdir(READY_DIR, { withFileTypes: true });
    pendingAssets = entries.filter(
      (e) => e.isDirectory() && !existsSync(join(READY_DIR, e.name, "meta.json"))
    );
  } catch {}

  if (pendingAssets.length === 0) return;

  pipelineRunning = true;
  console.log(`\n⏳  Wachten tot bestanden klaar zijn met kopiëren...`);

  await waitUntilAllStable();

  console.log(`🤖  Meta genereren via AI...`);
  try {
    await runScript("generate-meta.mjs");
  } catch (err) {
    console.error(`❌  generate-meta mislukt: ${err.message}`);
    pipelineRunning = false;
    return;
  }

  console.log(`⬆️  Uploaden naar Supabase...`);
  try {
    await runScript("upload-assets.mjs");
    console.log(`\n✅  Klaar! Watcher luistert weer...\n`);
  } catch (err) {
    console.error(`❌  upload-assets mislukt: ${err.message}\n`);
  }

  pipelineRunning = false;

  // Was er een nieuwe trigger binnengekomen terwijl we draaiden?
  if (pipelinePending) {
    pipelinePending = false;
    runPipeline();
  }
}

// ─── Trigger met debounce ─────────────────────────────────────────────────────

function trigger() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    runPipeline();
  }, 1000);
}

// ─── Start ────────────────────────────────────────────────────────────────────

console.log(`\n👁  PSDfuel watcher actief`);
console.log(`📁  ${READY_DIR}`);
console.log(`\nSleep een asset-map in _ready/ — de rest gaat automatisch.\n`);

watch(READY_DIR, { persistent: true }, async (_, filename) => {
  if (!filename) return;
  const dir = join(READY_DIR, filename);

  setTimeout(async () => {
    if (!existsSync(dir)) return;
    try {
      const s = await stat(dir);
      if (s.isDirectory()) trigger();
    } catch {}
  }, 500);
});

// Scan bij opstarten — staan er al assets klaar?
trigger();
