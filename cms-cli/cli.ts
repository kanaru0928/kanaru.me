import { Command } from "commander";
import { listCommand } from "./src/commands/list.js";
import { postCommand } from "./src/commands/post.js";
import { syncCommand } from "./src/commands/sync.js";
import { uploadImageCommand } from "./src/commands/upload-image.js";
import { createAuthManager } from "./src/lib/api/auth.js";
import { createApiClient } from "./src/lib/api/client.js";
import { getEnvConfig } from "./src/lib/utils/env.js";
import { loadEnvFiles } from "./src/lib/utils/load-env.js";
import { logger } from "./src/lib/utils/logger.js";

// 環境変数を読み込む（コマンドパース前に実行）
loadEnvFiles();

const program = new Command();

program
	.name("cms-cli")
	.description(
		"Lambda でホスティングされている記事管理 API をコマンドラインから操作",
	)
	.version("1.0.0")
	.option("--profile <name>", "AWS プロファイル名")
	.option("--function <name>", "Lambda 関数名")
	.option("--env <name>", "環境名 (デフォルト: prod)");

// listコマンド
program
	.command("list")
	.description("記事一覧を表示")
	.option("--page <number>", "ページ番号", "1")
	.action(async (options) => {
		try {
			const globalOpts = program.opts();
			const envConfig = await getEnvConfig({
				profile: globalOpts.profile,
				functionName: globalOpts.function,
				env: globalOpts.env,
			});

			const authManager = createAuthManager({
				initialToken: envConfig.initialBearerToken,
				functionName: envConfig.functionName,
				region: envConfig.awsRegion,
				profile: envConfig.awsProfile,
			});

			const apiClient = createApiClient({
				baseUrl: envConfig.apiBaseUrl,
				authManager,
			});

			await listCommand(apiClient, {
				page: Number.parseInt(options.page, 10),
			});
		} catch (error) {
			if (error instanceof Error) {
				logger.error(error.message);
			}
			process.exit(1);
		}
	});

// postコマンド
program
	.command("post <file>")
	.description("記事を投稿")
	.option("--title <title>", "記事タイトル")
	.option("--tags <tags>", "タグ（カンマ区切り）")
	.action(async (file, options) => {
		try {
			const globalOpts = program.opts();
			const envConfig = await getEnvConfig({
				profile: globalOpts.profile,
				functionName: globalOpts.function,
				env: globalOpts.env,
			});

			const authManager = createAuthManager({
				initialToken: envConfig.initialBearerToken,
				functionName: envConfig.functionName,
				region: envConfig.awsRegion,
				profile: envConfig.awsProfile,
			});

			const apiClient = createApiClient({
				baseUrl: envConfig.apiBaseUrl,
				authManager,
			});

			await postCommand(file, apiClient, {
				title: options.title,
				tags: options.tags,
			});
		} catch (error) {
			if (error instanceof Error) {
				logger.error(error.message);
			}
			process.exit(1);
		}
	});

// syncコマンド
program
	.command("sync <directory>")
	.description("記事を同期")
	.action(async (directory) => {
		try {
			const globalOpts = program.opts();
			const envConfig = await getEnvConfig({
				profile: globalOpts.profile,
				functionName: globalOpts.function,
				env: globalOpts.env,
			});

			const authManager = createAuthManager({
				initialToken: envConfig.initialBearerToken,
				functionName: envConfig.functionName,
				region: envConfig.awsRegion,
				profile: envConfig.awsProfile,
			});

			const apiClient = createApiClient({
				baseUrl: envConfig.apiBaseUrl,
				authManager,
			});

			await syncCommand(directory, apiClient, {});
		} catch (error) {
			if (error instanceof Error) {
				logger.error(error.message);
			}
			process.exit(1);
		}
	});

// upload-imageコマンド
program
	.command("upload-image <file>")
	.description("画像をWebPに変換してS3にアップロード")
	.option("--max-size <number>", "最大サイズ（デフォルト: 1000）", "1000")
	.option("--quality <number>", "WebP品質（0-100、デフォルト: 80）", "80")
	.action(async (file, options) => {
		try {
			const globalOpts = program.opts();
			const envConfig = await getEnvConfig({
				profile: globalOpts.profile,
				functionName: globalOpts.function,
				env: globalOpts.env,
			});

			await uploadImageCommand(
				file,
				{
					maxSize: Number.parseInt(options.maxSize, 10),
					quality: Number.parseInt(options.quality, 10),
				},
				envConfig,
			);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(error.message);
			}
			process.exit(1);
		}
	});

program.parse(process.argv);
