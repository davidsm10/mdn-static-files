import { escapeText } from "./html.js";

export interface BodySection {
  type: "prose" | "specifications";
  value: {
    id: string | null;
    title: string | null;
    isH3: boolean;
    content?: string;
    specifications?: {
      bcdSpecificationURL: string;
      title: string;
    }[];
  };
}

export interface MdnFileData {
  doc: {
    title: string;
    titleHTML: string;
    body: BodySection[];
    mdn_url: string;
    source: {
      github_url: string;
    };
  };
}

export function getHtml(fileContent: string): string {
  const mdnFileData = JSON.parse(fileContent) as MdnFileData;

  let body = "";

  const title = mdnFileData.doc.titleHTML;
  body += `<h1>${title}</h1>`;
  for (const section of mdnFileData.doc.body) {
    if (section.type === "prose" || section.type === "specifications") {
      const value = section.value;
      if (value.title) {
        if (value.isH3) {
          body += `<h3 id="${value.id}">${value.title}</h3>`;
        } else {
          body += `<h2 id="${value.id}">${value.title}</h2>`;
        }
      }

      let content: string;
      if (value.content) {
        content = value.content;
      } else if (value.specifications) {
        content = `<ul>
        ${value.specifications.map((spec) => {
          return `<li><a href="${spec.bcdSpecificationURL}" target="_blank">${spec.title}</a></li>`;
        })}
        </ul>`;
      }

      body += content!;
    }
  }

  const mdnUrl = "https://developer.mozilla.org" + mdnFileData.doc.mdn_url;

  body +=
    "<footer>" +
    `<a href="${mdnUrl}" target="_blank">${escapeText(mdnFileData.doc.title)}</a> by <a href="${mdnUrl + "/contributors.txt"}" target="_blank">Mozilla contributors</a>, ` +
    `licensed under <a href="https://creativecommons.org/licenses/by-sa/2.5/" target="_blank">CC-BY-SA 2.5</a>.` +
    "</footer>";

  const document =
    '<!DOCTYPE html><html lang="en"><head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    `<title>${mdnFileData.doc.title}</title>\n` +
    `</head><body>${body}</body></html>`;

  return document;
}
