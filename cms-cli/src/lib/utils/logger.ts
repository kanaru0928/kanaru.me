/**
 * ログ出力ユーティリティ
 */

export const logger = {
	info: (message: string) => {
		console.log(message);
	},

	success: (message: string) => {
		console.log(`✓ ${message}`);
	},

	error: (message: string) => {
		console.error(`✗ ${message}`);
	},

	warn: (message: string) => {
		console.warn(`⚠ ${message}`);
	},

	skip: (message: string) => {
		console.log(`- ${message}`);
	},
};
