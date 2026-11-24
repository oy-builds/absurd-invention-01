// One-Sentence Absurd Invention Pitch — entry writer.
//
// Reads the pitch from entry.txt beside this script (falling back to the
// embedded copy below if the file is missing) and writes it, unchanged,
// to /output/entry.txt for the gate and judge.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FALLBACK_ENTRY =
  "The Puddle Scout is a bath mat that saves your socks from surprise puddles by floating a tiny paper boat across every wet patch and ringing a ship's bell the moment one sets sail.";

// The gate accepts UTF-8 text of 1 to 220 characters, not only white space.
const MAX_ENTRY_CHARS = 220;

function loadEntry(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const entryPath = join(here, "entry.txt");
  if (existsSync(entryPath)) {
    return readFileSync(entryPath, "utf8");
  }
  return FALLBACK_ENTRY;
}

function assertGateValid(entry: string): void {
  const chars = [...entry].length;
  if (chars < 1 || chars > MAX_ENTRY_CHARS || entry.trim().length === 0) {
    throw new Error(
      `entry fails the gate: ${chars} characters (need 1-${MAX_ENTRY_CHARS}, non-blank)`,
    );
  }
}

function main(): void {
  const entry = loadEntry();
  assertGateValid(entry);
  const outputPath = process.env.OUTPUT_FILE ?? "/output/entry.txt";
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, entry, "utf8");
  // Read the file back so a silent short write can never reach the judge.
  const written = readFileSync(outputPath, "utf8");
  if (written !== entry) {
    throw new Error("read-back mismatch: /output/entry.txt differs from the entry");
  }
}

main();
