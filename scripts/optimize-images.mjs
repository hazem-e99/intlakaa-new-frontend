import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const srcAssetsDir = path.join(projectRoot, "src", "assets");

const rasterExtensions = new Set([".png", ".jpg", ".jpeg"]);
const skipDirNames = new Set(["thumbnails"]);

const targets = [
  path.join(srcAssetsDir, "logo.png"),
  path.join(publicDir, "hero section.png"),
  path.join(publicDir, "download.png"),
  path.join(publicDir, "rocket.png"),
  path.join(publicDir, "rocket2.jpg"),
  path.join(publicDir, "Logos"),
  path.join(publicDir, "Customerslogos"),
];

const stats = {
  converted: 0,
  skipped: 0,
  bytesBefore: 0,
  bytesAfter: 0,
};

const gatherFiles = async (entry) => {
  try {
    const info = await fs.stat(entry);

    if (info.isFile()) {
      const ext = path.extname(entry).toLowerCase();
      return rasterExtensions.has(ext) ? [entry] : [];
    }

    if (!info.isDirectory()) return [];

    const dirName = path.basename(entry);
    if (skipDirNames.has(dirName)) return [];

    const children = await fs.readdir(entry);
    const nested = await Promise.all(
      children.map((child) => gatherFiles(path.join(entry, child)))
    );

    return nested.flat();
  } catch {
    return [];
  }
};

const toWebpPath = (filePath) => {
  const parsed = path.parse(filePath);
  return path.join(parsed.dir, `${parsed.name}.webp`);
};

const optimizeOne = async (filePath) => {
  const sourceBuffer = await fs.readFile(filePath);
  const sourceSize = sourceBuffer.byteLength;
  const destinationPath = toWebpPath(filePath);

  const isLogoLike = /logo|logos|icon|brand/i.test(filePath);

  const webpBuffer = await sharp(sourceBuffer)
    .webp({
      quality: isLogoLike ? 84 : 78,
      effort: 6,
      alphaQuality: 90,
      smartSubsample: true,
    })
    .toBuffer();

  const webpSize = webpBuffer.byteLength;

  if (webpSize >= sourceSize * 0.98) {
    stats.skipped += 1;
    return;
  }

  await fs.writeFile(destinationPath, webpBuffer);
  stats.converted += 1;
  stats.bytesBefore += sourceSize;
  stats.bytesAfter += webpSize;
};

const formatKB = (bytes) => `${(bytes / 1024).toFixed(1)}KB`;

const run = async () => {
  const all = (await Promise.all(targets.map((entry) => gatherFiles(entry)))).flat();

  const unique = [...new Set(all)];

  for (const filePath of unique) {
    await optimizeOne(filePath);
  }

  const reduced = stats.bytesBefore - stats.bytesAfter;

  console.log(`Scanned: ${unique.length}`);
  console.log(`Converted: ${stats.converted}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Savings: ${formatKB(reduced)} (${stats.bytesBefore ? ((reduced / stats.bytesBefore) * 100).toFixed(1) : "0.0"}%)`);
};

run().catch((error) => {
  console.error("Image optimization failed:", error);
  process.exit(1);
});
