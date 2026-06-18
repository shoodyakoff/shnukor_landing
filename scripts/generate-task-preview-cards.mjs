import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();
const CARD_SIZE = 1254;
const OUTPUT_DIR = path.join(ROOT, "public", "task-preview");

const entries = [
  {
    id: "daily",
    source: path.join(
      ROOT,
      "Shnurok MVP Visual",
      "На каждый день",
      "Ретро_ низкие силуэты",
      "IMG_1510.jpg",
    ),
    out: "task-daily.webp",
    subjectWidth: 1100,
    subjectHeight: 500,
    baseline: 705,
  },
  {
    id: "sport",
    source: path.join(
      ROOT,
      "Shnurok MVP Visual",
      "Для спорта",
      "Бег",
      "Городской трейл",
      "IMG_2386.PNG",
    ),
    out: "task-sport.webp",
    subjectWidth: 1120,
    subjectHeight: 560,
    baseline: 715,
  },
];

function isWhiteBackdrop(r, g, b, a) {
  if (a === 0) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max > 236 && min > 228 && max - min < 18;
}

async function extractSubject(inputPath) {
  const { data, info } = await sharp(inputPath).rotate().ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue = [];

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (visited[index]) return;

    const offset = index * channels;
    if (!isWhiteBackdrop(data[offset], data[offset + 1], data[offset + 2], data[offset + 3])) {
      return;
    }

    visited[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const index = queue[cursor];
    const x = index % width;
    const y = Math.floor(index / width);

    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  let left = width;
  let top = height;
  let right = 0;
  let bottom = 0;

  for (let index = 0; index < visited.length; index += 1) {
    const offset = index * channels;
    if (visited[index]) {
      data[offset + 3] = 0;
      continue;
    }

    if (data[offset + 3] > 0) {
      const x = index % width;
      const y = Math.floor(index / width);
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }

  const padding = 10;
  left = Math.max(0, left - padding);
  top = Math.max(0, top - padding);
  right = Math.min(width - 1, right + padding);
  bottom = Math.min(height - 1, bottom + padding);

  return sharp(data, { raw: { width, height, channels } })
    .extract({
      left,
      top,
      width: right - left + 1,
      height: bottom - top + 1,
    })
    .png()
    .toBuffer();
}

function backgroundSvg() {
  return Buffer.from(`
    <svg width="${CARD_SIZE}" height="${CARD_SIZE}" viewBox="0 0 ${CARD_SIZE} ${CARD_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f6f2eb"/>
          <stop offset="0.62" stop-color="#fbf8f2"/>
          <stop offset="1" stop-color="#efe8de"/>
        </linearGradient>
        <radialGradient id="glow" cx="48%" cy="52%" r="62%">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".9"/>
          <stop offset=".62" stop-color="#ffffff" stop-opacity=".32"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1254" height="1254" fill="url(#bg)"/>
      <rect width="1254" height="1254" fill="url(#glow)"/>
      <path d="M-72 315 C162 168 272 408 472 274 S818 96 1068 168 S1358 382 1198 548" fill="none" stroke="#beb8b0" stroke-width="5" stroke-linecap="round" opacity=".28"/>
      <path d="M70 192 C270 310 410 128 586 226 S826 378 1010 250 S1212 236 1332 366" fill="none" stroke="#c9c2bb" stroke-width="3.5" stroke-linecap="round" opacity=".24"/>
      <path d="M-80 980 C184 828 424 982 632 858 S984 704 1332 862" fill="none" stroke="#c8c0b8" stroke-width="4" stroke-linecap="round" opacity=".2"/>
      <path d="M-110 792 C210 690 452 758 636 698 S1020 604 1350 714" fill="none" stroke="#ded8cf" stroke-width="36" stroke-linecap="round" opacity=".22"/>
    </svg>
  `);
}

async function renderCard(entry) {
  const outputPath = path.join(OUTPUT_DIR, entry.out);
  const subject = await sharp(await extractSubject(entry.source))
    .resize({
      width: entry.subjectWidth,
      height: entry.subjectHeight,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png()
    .toBuffer({ resolveWithObject: true });

  const subjectLeft = Math.round((CARD_SIZE - subject.info.width) / 2);
  const subjectTop = Math.round(entry.baseline - subject.info.height);

  const shadow = Buffer.from(`
    <svg width="${CARD_SIZE}" height="${CARD_SIZE}" viewBox="0 0 ${CARD_SIZE} ${CARD_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="627" cy="${entry.baseline + 20}" rx="445" ry="46" fill="#1a1714" opacity=".13"/>
      <ellipse cx="627" cy="${entry.baseline + 10}" rx="315" ry="24" fill="#1a1714" opacity=".07"/>
    </svg>
  `);

  await sharp(backgroundSvg())
    .composite([
      { input: shadow, left: 0, top: 0 },
      { input: subject.data, left: subjectLeft, top: subjectTop },
    ])
    .webp({ quality: 86, effort: 6, smartSubsample: true })
    .toFile(outputPath);

  const { size } = await stat(outputPath);
  return { ...entry, outputPath, size };
}

await mkdir(OUTPUT_DIR, { recursive: true });

const results = [];
for (const entry of entries) {
  results.push(await renderCard(entry));
}

for (const result of results) {
  console.log(`${result.out}: ${Math.round(result.size / 1024)} KB`);
}
