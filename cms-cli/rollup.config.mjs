import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
	input: "cli.ts",
	output: {
		file: "dist/cli.js",
		format: "es",
		banner: "#!/usr/bin/env node",
	},
	external: [
		// AWS SDK
		"@aws-sdk/client-lambda",
		"@aws-sdk/client-s3",
		// 他の外部依存関係
		"commander",
		"gray-matter",
		"openapi-fetch",
		// Node.js組み込みモジュール
		"node:fs/promises",
		"node:path",
		"node:crypto",
	],
	plugins: [
		resolve({
			preferBuiltins: true,
			extensions: [".ts", ".js", ".json"],
		}),
		commonjs(),
		json(),
		typescript({
			tsconfig: "./tsconfig.json",
			declaration: false,
			declarationMap: false,
		}),
	],
};
