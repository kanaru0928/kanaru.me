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
		// 外部依存関係
		"commander",
		"gray-matter",
		"openapi-fetch",
		"dotenv",
		"sharp",
		"puppeteer",
		// Node.js組み込みモジュール
		"node:fs/promises",
		"node:fs",
		"node:path",
		"node:crypto",
		"node:url",
		"node:child_process",
		"node:http",
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
