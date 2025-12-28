import { logger } from "~/lib/logger";

export async function fetchArticleCode(hash: string) {
  logger.debug(
    "Fetching article code for url:",
    `${import.meta.env.VITE_BASE_URL}/articles/code/${hash}`
  );

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/articles/code/${hash}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch article code");
  }
  return response.text();
}

export async function fetchArticleContent(hash: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/static/articles/${hash}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch article content");
  }
  return response.text();
}
