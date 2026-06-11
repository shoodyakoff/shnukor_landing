import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();
const CARD_SIZE = 1254;
const SOURCE_DIR = path.join(ROOT, "src", "assets", "price-preview-generated", "round-podium-v1");
const OUTPUT_DIR = path.join(ROOT, "public", "price-preview");

const entries = [
  {
    id: "p2",
    label: "5 000 - 10 000",
    source: "price-5000-10000.png",
    out: "price-5000-10000.webp",
  },
  {
    id: "p3",
    label: "10 000 - 15 000",
    source: "price-10000-15000.png",
    out: "price-10000-15000.webp",
  },
  {
    id: "p4",
    label: "15 000 - 20 000",
    source: "price-15000-20000.png",
    out: "price-15000-20000.webp",
  },
  {
    id: "p5",
    label: "20 000 - 30 000",
    source: "price-20000-30000.png",
    out: "price-20000-30000.webp",
  },
  {
    id: "p6",
    label: "30 000+",
    source: "price-30000-plus.png",
    out: "price-30000-plus.webp",
  },
  {
    id: "any",
    label: "Any price",
    source: "price-any.png",
    out: "price-any.webp",
  },
];

async function renderCard(entry) {
  const inputPath = path.join(SOURCE_DIR, entry.source);
  const outputPath = path.join(OUTPUT_DIR, entry.out);

  await sharp(inputPath)
    .resize(CARD_SIZE, CARD_SIZE, { fit: "cover", position: "center" })
    .webp({ quality: 86, effort: 6, smartSubsample: true })
    .toFile(outputPath);

  const { size } = await stat(outputPath);
  return { ...entry, outputPath, size };
}

async function renderContactSheet(results) {
  const thumb = 360;
  const labelHeight = 48;
  const gap = 28;
  const cols = 3;
  const rows = 2;
  const width = cols * thumb + (cols + 1) * gap;
  const height = rows * (thumb + labelHeight) + (rows + 1) * gap;

  const labels = results
    .map((result, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = gap + col * (thumb + gap);
      const y = gap + row * (thumb + labelHeight + gap);
      return `<text x="${x}" y="${y + thumb + 32}" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#111">${result.id}: ${result.label}</text>`;
    })
    .join("");

  const baseSvg = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f7f7f4"/>
      ${labels}
    </svg>
  `);

  const composites = await Promise.all(
    results.map(async (result, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = gap + col * (thumb + gap);
      const y = gap + row * (thumb + labelHeight + gap);
      const input = await sharp(result.outputPath)
        .resize(thumb, thumb, { fit: "cover", position: "center" })
        .png()
        .toBuffer();
      return { input, left: x, top: y };
    }),
  );

  await sharp(baseSvg)
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUTPUT_DIR, "price-preview-contact-sheet.png"));
}

await mkdir(OUTPUT_DIR, { recursive: true });

const results = [];
for (const entry of entries) {
  results.push(await renderCard(entry));
}
await renderContactSheet(results);

for (const result of results) {
  console.log(`${result.out}: ${Math.round(result.size / 1024)} KB`);
}
