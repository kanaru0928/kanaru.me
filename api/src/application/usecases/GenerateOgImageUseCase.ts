import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	type SKRSContext2D,
	createCanvas,
	GlobalFonts,
	loadImage,
} from "@napi-rs/canvas";
import { NotFoundError } from "../../domain/errors/DomainError";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";

const ASSETS_DIR = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"assets",
);
const FONT_PATH = path.join(ASSETS_DIR, "fonts/SourceHanSansJP-Bold.otf");
const BG_IMAGE_PATH = path.join(ASSETS_DIR, "og-background.png");

export class GenerateOgImageUseCase {
  private static fontRegistered = false;
  private static readonly CANVAS_WIDTH = 1200;
  private static readonly CANVAS_HEIGHT = 630;
  private static readonly FONT_FAMILY = "Source Han Sans JP";
  private static readonly MAX_LINES = 3;

  constructor(private repository: IArticleRepository) {
    // フォント登録（初回のみ）
    if (!GenerateOgImageUseCase.fontRegistered) {
      GlobalFonts.registerFromPath(FONT_PATH, GenerateOgImageUseCase.FONT_FAMILY);
      GenerateOgImageUseCase.fontRegistered = true;
    }
  }

  async execute(slug: string): Promise<Buffer> {
    // 1. 記事取得
    const article = await this.repository.findBySlug(slug);
    if (!article) {
      throw new NotFoundError(`Article with slug "${slug}" not found`);
    }

    // 2. Canvas初期化
    const canvas = createCanvas(
      GenerateOgImageUseCase.CANVAS_WIDTH,
      GenerateOgImageUseCase.CANVAS_HEIGHT,
    );
    const ctx = canvas.getContext("2d");

    // 3. 背景描画
    const bgImageBuffer = readFileSync(BG_IMAGE_PATH);
    const bgImage = await loadImage(bgImageBuffer);
    ctx.drawImage(
      bgImage,
      0,
      0,
      GenerateOgImageUseCase.CANVAS_WIDTH,
      GenerateOgImageUseCase.CANVAS_HEIGHT,
    );

    // 4. タイトル描画
    ctx.font = `bold 60px '${GenerateOgImageUseCase.FONT_FAMILY}'`;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // テキスト折り返し処理
    this.drawText(
      ctx,
      article.title,
      GenerateOgImageUseCase.CANVAS_WIDTH / 2,
      GenerateOgImageUseCase.CANVAS_HEIGHT / 2,
      950, // 最大幅
    );

    // 5. PNG Buffer返却
    return canvas.toBuffer("image/png");
  }

  /**
   * テキストを折り返して描画
   */
  private drawText(
    ctx: SKRSContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
  ): void {
    const lines = this.wrapText(ctx, text, maxWidth);
    const lineHeight = 80; // 行間
    const totalHeight = lines.length * lineHeight;
    const startY = y - totalHeight / 2 + lineHeight / 2;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, startY + i * lineHeight);
    }
  }

  /**
   * テキストをトークンに分割
   * 英単語は単語単位、日本語・記号は1文字ずつ
   */
  private tokenize(text: string): string[] {
    const tokens: string[] = [];
    let i = 0;

    while (i < text.length) {
      const char = text[i];

      // 英数字の場合、単語として抽出
      if (/[a-zA-Z0-9]/.test(char)) {
        let word = "";
        // 英数字を収集
        while (i < text.length && /[a-zA-Z0-9]/.test(text[i])) {
          word += text[i];
          i++;
        }
        // 直後の句読点やスペースを含める
        while (i < text.length && /[\s.,!?;:]/.test(text[i])) {
          word += text[i];
          i++;
        }
        tokens.push(word);
      }
      // 日本語・記号の場合、1文字ずつ
      else {
        tokens.push(char);
        i++;
      }
    }

    return tokens;
  }

  /**
   * 長いトークンを文字単位で分割
   */
  private splitLongToken(
    ctx: SKRSContext2D,
    token: string,
    maxWidth: number,
    currentLineCount: number,
  ): { lines: string[]; remainder: string } {
    const lines: string[] = [];
    let current = "";

    for (const char of token) {
      const test = current + char;

      if (ctx.measureText(test).width > maxWidth) {
        if (current !== "") {
          lines.push(current);
          current = char;

          if (currentLineCount + lines.length >= GenerateOgImageUseCase.MAX_LINES) {
            return { lines, remainder: current };
          }
        } else {
          lines.push(char);
          current = "";
        }
      } else {
        current = test;
      }
    }

    return { lines, remainder: current };
  }

  /**
   * 最後の行に省略記号を追加
   */
  private truncateWithEllipsis(
    ctx: SKRSContext2D,
    lines: string[],
    maxWidth: number,
  ): string[] {
    let lastLine = lines[lines.length - 1];

    while (ctx.measureText(`${lastLine}...`).width > maxWidth && lastLine.length > 0) {
      lastLine = lastLine.slice(0, -1);
    }

    lines[lines.length - 1] = `${lastLine}...`;

    return lines.slice(0, GenerateOgImageUseCase.MAX_LINES);
  }

  /**
   * テキストを指定幅で折り返し
   * 英単語は途中で改行せず、単語単位で折り返す
   */
  private wrapText(
    ctx: SKRSContext2D,
    text: string,
    maxWidth: number,
  ): string[] {
    const lines: string[] = [];
    let currentLine = "";

    const tokens = this.tokenize(text);

    for (const token of tokens) {
      const testLine = currentLine + token;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth) {
        if (currentLine === "") {
          // 単一トークンがmaxWidthを超える場合
          const splitResult = this.splitLongToken(ctx, token, maxWidth, lines.length);
          lines.push(...splitResult.lines);
          currentLine = splitResult.remainder;

          if (lines.length >= GenerateOgImageUseCase.MAX_LINES) {
            return this.truncateWithEllipsis(ctx, lines, maxWidth);
          }
        } else {
          // 現在行を確定し、新しい行を開始
          lines.push(currentLine.trim());
          currentLine = token;

          if (lines.length >= GenerateOgImageUseCase.MAX_LINES) {
            return this.truncateWithEllipsis(ctx, lines, maxWidth);
          }
        }
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine.trim() !== "" && lines.length < GenerateOgImageUseCase.MAX_LINES) {
      lines.push(currentLine.trim());
    }

    return lines;
  }
}
