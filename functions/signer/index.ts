import { CloudFrontRequestEvent, CloudFrontRequestHandler } from "aws-lambda";

export const handler: CloudFrontRequestHandler = async (event) => {
  const request = event.Records[0].cf.request;

  if (!request.body) {
    return request;
  }

  const body = Buffer.from(request.body.data, "base64").toString("utf-8");

  // ボディのハッシュを計算
  const encoder = new TextEncoder().encode(body);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // ヘッダーにハッシュを追加
  request.headers["x-amz-content-sha256"] = [
    { key: "x-amz-content-sha256", value: hashHex },
  ];

  return request;
};
