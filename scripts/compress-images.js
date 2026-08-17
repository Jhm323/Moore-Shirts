import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetDir = path.join(__dirname, "..", "src", "assets", "products");

const VALID_EXT = new Set([".jpg", ".jpeg", ".png"]);
const MAX_EDGE = 1600;
const QUALITY = 82;

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`;
}

async function main() {
  const files = fs
    .readdirSync(targetDir)
    .filter((name) => VALID_EXT.has(path.extname(name).toLowerCase()))
    .sort();

  const rows = [];
  let totalOriginal = 0;
  let totalNew = 0;

  for (const file of files) {
    const srcPath = path.join(targetDir, file);
    const base = path.basename(file, path.extname(file));
    const destPath = path.join(targetDir, `${base}.webp`);

    const originalSize = fs.statSync(srcPath).size;

    await sharp(srcPath)
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(destPath);

    const newSize = fs.statSync(destPath).size;
    fs.unlinkSync(srcPath);

    const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
    rows.push({ file, base, originalSize, newSize, reduction });
    totalOriginal += originalSize;
    totalNew += newSize;
  }

  const pad = (s, n) => String(s).padEnd(n);
  console.log(pad("FILE", 24), pad("ORIGINAL", 12), pad("NEW", 12), "REDUCTION");
  for (const r of rows) {
    console.log(
      pad(`${r.base}.webp`, 24),
      pad(formatKb(r.originalSize), 12),
      pad(formatKb(r.newSize), 12),
      `${r.reduction}%`
    );
  }

  const totalReduction = (((totalOriginal - totalNew) / totalOriginal) * 100).toFixed(1);
  console.log("");
  console.log(`Total: ${files.length} files`);
  console.log(`Original total: ${formatKb(totalOriginal)} (${(totalOriginal / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`New total:      ${formatKb(totalNew)} (${(totalNew / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`Overall reduction: ${totalReduction}%`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
