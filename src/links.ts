import { CheerioAPI } from "cheerio";
import fs from "node:fs";
import path from "node:path";

type MdnPath = string;
type SourcePath = string;
type MdnToSourcePathsMap = { [mdnPath: MdnPath]: SourcePath };
const mdnToSourcePathsMap = getMdnToSourcePathsMap();

export default function modifyLinks(dom: CheerioAPI) {
  dom("a").each((_, el) => {
    const link = dom(el);
    const href = link.attr("href");
    if (href) {
      const newHref = modifyLinkUrl(href);
      link.attr("href", newHref);
    }
  });
}

function modifyLinkUrl(mdnUrl: string) {
  if (!mdnUrl.startsWith("/")) return mdnUrl;
  const url = new URL("http://localhost" + mdnUrl);
  url.pathname = mdnToSourcePathsMap[url.pathname] || url.pathname;
  url.pathname = url.pathname.replace("/en-us", "");
  url.pathname += "/index.html";
  return url.pathname + url.hash;
}

function getMdnToSourcePathsMap() {
  const metadataFilePath = path.join(
    process.cwd(),
    "content/build/en-us/metadata.json",
  );
  interface FileMetadata {
    mdn_url: string;
    source: {
      folder: string;
    };
  }
  const filesMetadata = JSON.parse(
    fs.readFileSync(metadataFilePath, { encoding: "utf-8" }),
  ) as FileMetadata[];

  const pathsMap: MdnToSourcePathsMap = {};
  for (const entry of filesMetadata) {
    pathsMap[entry.mdn_url] = entry.source.folder;
  }

  return pathsMap;
}
