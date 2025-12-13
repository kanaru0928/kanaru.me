import ogs from "open-graph-scraper";

export type OGPData = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
};

export type OGPResult =
  | { success: true; data: OGPData }
  | { success: false; error: string; url: string };

const OGP_TIMEOUT = 5000;
const OGP_CACHE = new Map<string, OGPData>();

/**
 * URLからOGP情報を取得
 */
export async function fetchOGP(url: string): Promise<OGPResult> {
  const cached = OGP_CACHE.get(url);
  if (cached) {
    return { success: true, data: cached };
  }

  try {
    const { result, error } = await ogs({
      url,
      timeout: OGP_TIMEOUT,
      fetchOptions: {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        },
      },
    });

    if (error || !result.success) {
      return {
        success: false,
        error: "Failed to fetch OGP data",
        url,
      };
    }

    const ogpData: OGPData = {
      url,
      title: result.ogTitle,
      description: result.ogDescription,
      image: result.ogImage?.[0]?.url,
      siteName: result.ogSiteName,
    };

    OGP_CACHE.set(url, ogpData);

    return { success: true, data: ogpData };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      url,
    };
  }
}

/**
 * 複数のURLのOGP情報を並列取得
 */
export async function fetchMultipleOGP(
  urls: string[],
): Promise<Map<string, OGPData>> {
  const results = await Promise.all(urls.map((url) => fetchOGP(url)));

  const ogpMap = new Map<string, OGPData>();

  for (const result of results) {
    if (result.success) {
      ogpMap.set(result.data.url, result.data);
    } else {
      ogpMap.set(result.url, {
        url: result.url,
        title: result.url,
        description: undefined,
        image: undefined,
        siteName: undefined,
      });
    }
  }

  return ogpMap;
}

/**
 * Markdown本文からURLのみの行を抽出
 */
export function extractURLsFromMarkdown(markdown: string): string[] {
  const urlRegex = /^https?:\/\/[^\s]+$/gm;
  const matches = markdown.match(urlRegex);
  return matches ? [...new Set(matches)] : [];
}
