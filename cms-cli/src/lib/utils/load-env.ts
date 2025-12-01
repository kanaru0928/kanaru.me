import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * .envファイルを優先順位に従って読み込む
 *
 * 優先順位（高→低）:
 * 1. カレントディレクトリの .env
 * 2. cms-cli ディレクトリの .env
 * 3. SSM Parameter Store
 * 4. シェル環境変数
 */
export function loadEnvFiles(): void {
	// カレントディレクトリ（CLIを実行した場所）
	const currentDir = process.cwd();

	// カレントディレクトリの .env
	const currentEnvPath = resolve(currentDir, ".env");

	// 2. カレントディレクトリの .env を読み込む（最優先）
	// cms-cliディレクトリと同じ場合はスキップ
	if (existsSync(currentEnvPath)) {
		dotenv.config({ path: currentEnvPath, override: true });
	}
}
