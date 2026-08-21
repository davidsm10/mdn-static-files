import { load } from "cheerio";
import { minify } from "html-minifier-next";

export function escapeText(text: string) {
  return load("").root().text(text).html();
}

export async function minifyHtml(html: string) {
  return await minify(html, {
    preset: "comprehensive",
    continueOnParseError: true,
  });
}
