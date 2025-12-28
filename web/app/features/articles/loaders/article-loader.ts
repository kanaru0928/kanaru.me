import { extractURLsFromMarkdown, fetchMultipleOGP } from "./ogp";

export function fetchOgpMap(contentBody: string) {
  // URL抽出
  const urls = extractURLsFromMarkdown(contentBody);

  // OGP取得
  const ogpMap = fetchMultipleOGP(urls);

  return ogpMap;
}
