export async function fetchArticleCode(hash: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/articles/code/${hash}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch article code");
  }
  const codeJson = await response.json();
  if (!codeJson.code) {
    throw new Error("Article code is missing in the response");
  }

  return codeJson.code;
}

export async function fetchArticleContent(hash: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/static/articles/${hash}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch article content");
  }
  return response.text();
}
