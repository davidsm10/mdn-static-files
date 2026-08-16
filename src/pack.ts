import fs from "node:fs/promises";
import path from "node:path";
import { createFile } from "tar-xz/file";

const inputDir = path.join(process.cwd(), "output");
const outputFile = path.join(process.cwd(), "mdn.tar.xz");

pack();
async function pack() {
  console.log("Packing files...");
  const archiveEntries = [];
  const entries = await fs.readdir(inputDir, {
    recursive: true,
    withFileTypes: true,
  });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".html")) continue;
    const filePath = path.join(entry.parentPath, entry.name);
    const relativePath = path.relative(inputDir, filePath);
    archiveEntries.push({ name: relativePath, source: filePath });
  }

  await createFile(outputFile.toString(), {
    files: archiveEntries,
    preset: 9,
  });
}
