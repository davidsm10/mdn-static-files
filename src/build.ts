import path from "node:path";
import fs from "node:fs/promises";
import { getHtml } from "./mdn.js";
import modifyLinks from "./links.js";
import { load as loadCheerioInstance } from "cheerio";

const inputDir = path.join(process.cwd(), "content/build/en-us/docs");
const outputDir = path.join(process.cwd(), "output");

build();
async function build() {
  console.log("Building files...");
  await fs.rm(outputDir, {
    recursive: true,
    force: true,
  });
  const entries = await fs.readdir(inputDir, {
    recursive: true,
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (entry.isDirectory()) continue;
    if (entry.name !== "index.json") continue;
    const filePath = path.join(entry.parentPath, entry.name);
    const relativePath = path.relative(inputDir, filePath);
    const outputFilePath = path.join(
      outputDir,
      path.dirname(relativePath),
      "index.html",
    );
    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    const fileContent = await fs.readFile(filePath, { encoding: "utf-8" });
    let html = getHtml(fileContent);
    const dom = loadCheerioInstance(html, {}, false);
    modifyLinks(dom);
    html = dom.html();
    await fs.writeFile(outputFilePath, html);
  }
}
