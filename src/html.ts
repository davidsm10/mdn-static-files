import { load } from "cheerio";

export function escapeText(text: string) {
  return load("").root().text(text).html();
}
