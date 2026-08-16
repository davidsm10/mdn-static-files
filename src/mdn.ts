export interface BodySection {
  type: "prose" | string;
  value: {
    id: string | null;
    title: string | null;
    isH3: boolean;
    content: string;
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

  let finalOutput = "";

  const title = mdnFileData.doc.titleHTML;
  finalOutput += `<h1>${title}</h1>`;
  for (const section of mdnFileData.doc.body) {
    if (section.type === "prose" && section.value.content) {
      const value = section.value;
      if (value.title) {
        if (value.isH3) {
          finalOutput += `<h3 id="${value.id}">${value.title}</h3>`;
        } else {
          finalOutput += `<h2 id="${value.id}">${value.title}</h2>`;
        }
      }

      finalOutput += value.content;
    }
  }

  const mdnUrl = "https://developer.mozilla.org" + mdnFileData.doc.mdn_url;
  const sourceUrl = mdnFileData.doc.source.github_url;

  finalOutput += `<h2>Upstream</h2>
  <ul>
  <li>
  <a href="${mdnUrl}" target="_blank">Page</a>
  </li>
  <li>
  <a href="${sourceUrl}" target="_blank">Source</a>
  </li>
  </ul>
  `;

  return finalOutput;
}
