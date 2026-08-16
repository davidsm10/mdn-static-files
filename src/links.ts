import { CheerioAPI } from "cheerio";
import fs from "node:fs";
import path from "node:path";

interface RedirectsData {
  [from: string]: string;
}
const redirectsFile = path.join(
  process.cwd(),
  "content/files/en-us/_redirects.txt",
);

export function modifyLinks(dom: CheerioAPI) {
  const redirects = getRedirects(redirectsFile);
  dom("a").each((_, el) => {
    const link = dom(el);
    const href = link.attr("href");
    if (href) {
      const newHref = modifyLinkUrl(href, redirects);
      link.attr("href", newHref);
    }
  });
}

export function modifyLinkUrl(sourceUrl: string, redirects: RedirectsData) {
  if (!sourceUrl.startsWith("/")) return sourceUrl;
  
  const url = new URL("http://localhost" + sourceUrl);
  url.pathname = url.pathname.toLowerCase();
  url.pathname = redirects[url.pathname] || url.pathname;
  url.pathname = url.pathname.replace("/en-us/docs", "");
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  url.pathname += "index.html";
  url.pathname = url.pathname
    .replaceAll("::", "_doblecolon_")
    .replaceAll(":", "_colon_");

  return url.pathname + url.hash;
}

export function getRedirects(filePath: string) {
  const redirectsData = fs.readFileSync(filePath, {
    encoding: "utf-8",
  });
  const lines = redirectsData.split("\n");
  const redirects: { [from: string]: string } = {};
  for (const line of lines) {
    const [from, to] = line.split("\t").map((val) => val.trim().toLowerCase());
    redirects[from] = to;
  }

  return redirects;
}
