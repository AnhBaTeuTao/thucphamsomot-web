import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "images", "intro");

const WALL_SOURCES = [
  // Left wall — Nguồn hàng tươi
  { out: "wall-produce.webp", src: "public/images/categories/rau-cu-qua.png" },
  { out: "wall-meat.webp", src: "public/images/categories/thit-ca.png" },
  { out: "wall-seafood.webp", src: "public/images/tps1-meat-seafood.png" },
  { out: "wall-frozen.webp", src: "public/images/categories/dong-lanh.png" },
  { out: "wall-spices.webp", src: "public/images/categories/gia-vi.png" },
  { out: "wall-vegan.webp", src: "public/images/categories/chay.png" },
  { out: "wall-veggies.webp", src: "public/images/tps1-vegetables.jpg" },
  // Right wall — Vận hành và gian bếp
  { out: "wall-truck.webp", src: "public/images/tps1-real-delivery-truck.jpg" },
  { out: "wall-loading.webp", src: "public/images/tps1-kitchen.jpg" },
  { out: "wall-warehouse.webp", src: "public/images/tps1-warehouse-wide.jpg" },
  { out: "wall-canteen.webp", src: "public/images/industries/bep-an-tap-the-vn.png" },
  { out: "wall-restaurant.webp", src: "public/images/industries/nha-hang-khach-san-vn.png" },
  { out: "wall-school.webp", src: "public/images/industries/truong-hoc-vn.png" },
  { out: "wall-catering.webp", src: "public/images/industries/suat-an-cong-nghiep-vn.png" },
];

const MEDAL_SOURCES = [
  { out: "medal-produce.webp", src: "public/images/categories/rau-cu-qua.png" },
  { out: "medal-meat.webp", src: "public/images/categories/thit-ca.png" },
  { out: "medal-seafood.webp", src: "public/images/tps1-meat-seafood.png" },
  { out: "medal-frozen.webp", src: "public/images/categories/dong-lanh.png" },
  { out: "medal-spices.webp", src: "public/images/categories/gia-vi.png" },
  { out: "medal-vegan.webp", src: "public/images/categories/chay.png" },
];

async function encodeWithinLimit(inputPath, outPath, width, height, maxBytes, startQuality) {
  let quality = startQuality;
  while (quality >= 48) {
    const buf = await sharp(inputPath)
      .resize(width, height, { fit: "cover", position: "attention" })
      .modulate({ saturation: 1.06 })
      .webp({ quality, effort: 6 })
      .toBuffer();

    if (buf.length <= maxBytes || quality <= 52) {
      fs.writeFileSync(outPath, buf);
      return { bytes: buf.length, quality };
    }
    quality -= 6;
  }
  throw new Error(`Could not encode ${outPath}`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const uniqueOriginalPaths = new Set([
    ...WALL_SOURCES.map((i) => i.src),
    ...MEDAL_SOURCES.map((i) => i.src),
  ]);
  let beforeBytes = 0;
  for (const rel of uniqueOriginalPaths) {
    beforeBytes += fs.statSync(path.join(ROOT, rel)).size;
  }

  let afterWallBytes = 0;
  let afterMedalBytes = 0;
  const rows = [];

  for (const item of WALL_SOURCES) {
    const inPath = path.join(ROOT, item.src);
    const outPath = path.join(OUT_DIR, item.out);
    const { bytes, quality } = await encodeWithinLimit(inPath, outPath, 360, 450, 32 * 1024, 74);
    afterWallBytes += bytes;
    rows.push({ kind: "wall", file: item.out, kb: (bytes / 1024).toFixed(1), quality });
  }

  for (const item of MEDAL_SOURCES) {
    const inPath = path.join(ROOT, item.src);
    const outPath = path.join(OUT_DIR, item.out);
    const { bytes, quality } = await encodeWithinLimit(inPath, outPath, 160, 160, 11.5 * 1024, 74);
    afterMedalBytes += bytes;
    rows.push({ kind: "medal", file: item.out, kb: (bytes / 1024).toFixed(1), quality });
  }

  const totalAfter = afterWallBytes + afterMedalBytes;
  console.table(rows);
  console.log(
    JSON.stringify(
      {
        uniqueSourceFiles: uniqueOriginalPaths.size,
        beforeKB: +(beforeBytes / 1024).toFixed(1),
        beforeMB: +(beforeBytes / (1024 * 1024)).toFixed(2),
        wallKB: +(afterWallBytes / 1024).toFixed(1),
        medalKB: +(afterMedalBytes / 1024).toFixed(1),
        totalAfterKB: +(totalAfter / 1024).toFixed(1),
        reductionPct: +((1 - totalAfter / beforeBytes) * 100).toFixed(1),
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
