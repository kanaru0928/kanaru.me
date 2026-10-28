import cf from "cloudfront";

// cms の本文のハッシュ (MD5 の 16 進数表記)
const HASH_PATTERN = /^[0-9a-f]{32}$/;
const MARKDOWN_PATH_PATTERN = /^\/articles\/([^/]+)\.md$/;
// app-stack.ts の WEB_ORIGIN_ID と値を揃える
const WEB_ORIGIN_ID = "web";

// /articles/{slug}.md?h={hash} を S3 の articles/{slug}/{hash}.md に変換する
// ハッシュがなければ、最新版として SSR に振り分ける
// biome-ignore lint/correctness/noUnusedVariables: CloudFront Functions が handler を呼び出す
function handler(event) {
  const request = event.request;
  const hash = request.querystring.h;

  if (!hash) {
    cf.selectRequestOriginById(WEB_ORIGIN_ID);
    return request;
  }

  const match = request.uri.match(MARKDOWN_PATH_PATTERN);
  if (!match || !HASH_PATTERN.test(hash.value)) {
    return { statusCode: 400, statusDescription: "Bad Request" };
  }

  request.uri = `/articles/${match[1]}/${hash.value}.md`;
  request.querystring = {};

  return request;
}
