import { Command } from "commander";
import { listCommand } from "./src/commands/list.js";
import { postCommand } from "./src/commands/post.js";
import { syncCommand } from "./src/commands/sync.js";
import { createAuthManager } from "./src/lib/api/auth.js";
import { createApiClient } from "./src/lib/api/client.js";
import { getEnvConfig } from "./src/lib/utils/env.js";
import { logger } from "./src/lib/utils/logger.js";

const program = new Command();

program
	.name("cms-cli")
	.description(
		"Lambda でホスティングされている記事管理 API をコマンドラインから操作",
	)
	.version("1.0.0")
	.option("--profile <name>", "AWS プロファイル名")
	.option("--function <name>", "Lambda 関数名");

// listコマンド
program
	.command("list")
	.description("記事一覧を表示")
	.option("--page <number>", "ページ番号", "1")
	.action(async (options) => {
		try {
			const globalOpts = program.opts();
			const envConfig = getEnvConfig({
				profile: globalOpts.profile,
				functionName: globalOpts.function,
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
	.option("--description <desc>", "記事の説明")
	.option("--tags <tags>", "タグ（カンマ区切り）")
	.action(async (file, options) => {
		try {
			const globalOpts = program.opts();
			const envConfig = getEnvConfig({
				profile: globalOpts.profile,
				functionName: globalOpts.function,
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
				description: options.description,
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
			const envConfig = getEnvConfig({
				profile: globalOpts.profile,
				functionName: globalOpts.function,
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

program.parse(process.argv);
