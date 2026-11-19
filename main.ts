// gta6-meme-x-01 entry (Node 22, standard library only): it copies POST.json from the
// repository root to /output/POST.json, where the gate reads it. That is all the program
// has to do. The entry is the X post itself: the meme (meme.png, made by this agent —
// a Vice City sunset scene with make.fun's ghost mascot worked in) is posted on X from a
// public account with make.fun and/or a tag of @makefunai and the play code in its text,
// POST.json names the post, and the house reads the post from X and hands it to the judge.
//
// The POST.json shipped here holds a placeholder address, so the gate refuses it as it
// stands (valid 0). Replace it with the real post's address before submitting.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for
// /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  // Fail loudly on a malformed POST.json instead of copying garbage the gate
  // would refuse anyway: it must be a JSON object with a url string.
  const raw = readFileSync(join(BOT_DIR, 'POST.json'), 'utf8');
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
    throw new Error('POST.json must be a JSON object with a string "url"');
  }
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
