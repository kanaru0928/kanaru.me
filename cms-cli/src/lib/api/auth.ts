/**
 * Cognito の Authorization Code + PKCE によるアクセストークン取得
 */
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { logger } from "../utils/logger.js";

// infrastructure の CMS_CLI_CALLBACK_URL と揃える
const CALLBACK_PORT = 8976;
const CALLBACK_PATH = "/callback";
const REDIRECT_URI = `http://localhost:${CALLBACK_PORT}${CALLBACK_PATH}`;
const SCOPES = ["openid", "articles/read", "articles/write"];
const LOGIN_TIMEOUT_MS = 5 * 60 * 1000;

export interface AuthManager {
	getToken(): Promise<string>;
}

export interface AuthManagerOptions {
	cognitoDomain: string;
	clientId: string;
}

/**
 * 認証マネージャーを作成
 */
export function createAuthManager(options: AuthManagerOptions): AuthManager {
	let accessToken: string | null = null;

	return {
		async getToken(): Promise<string> {
			if (accessToken) {
				return accessToken;
			}

			accessToken = await login(options);
			return accessToken;
		},
	};
}

async function login(options: AuthManagerOptions): Promise<string> {
	const codeVerifier = randomBytes(32).toString("base64url");
	const codeChallenge = createHash("sha256")
		.update(codeVerifier)
		.digest("base64url");
	const state = randomBytes(16).toString("base64url");

	const authorizeUrl = new URL("/oauth2/authorize", options.cognitoDomain);
	authorizeUrl.search = new URLSearchParams({
		response_type: "code",
		client_id: options.clientId,
		redirect_uri: REDIRECT_URI,
		scope: SCOPES.join(" "),
		state,
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
	}).toString();

	const codePromise = waitForAuthorizationCode(state);

	logger.info("ブラウザでログインしてください:");
	logger.info(`  ${authorizeUrl.toString()}`);
	openBrowser(authorizeUrl.toString());

	const code = await codePromise;
	return exchangeCodeForToken(options, code, codeVerifier);
}

/**
 * コールバックを待ち受け、認可コードを受け取る
 */
function waitForAuthorizationCode(expectedState: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const server = createServer((req, res) => {
			const url = new URL(req.url ?? "/", REDIRECT_URI);
			if (url.pathname !== CALLBACK_PATH) {
				res.writeHead(404).end();
				return;
			}

			const error = url.searchParams.get("error");
			const code = url.searchParams.get("code");
			const state = url.searchParams.get("state");

			res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
			if (error) {
				res.end("ログインに失敗しました。ターミナルを確認してください。");
				finish(new Error(`ログインに失敗しました: ${error}`));
			} else if (state !== expectedState) {
				res.end("ログインに失敗しました。ターミナルを確認してください。");
				finish(new Error("state が一致しません"));
			} else if (!code) {
				res.end("ログインに失敗しました。ターミナルを確認してください。");
				finish(new Error("認可コードが含まれていません"));
			} else {
				res.end("ログインしました。このタブを閉じてください。");
				finish(null, code);
			}
		});

		const timer = setTimeout(() => {
			finish(new Error("ログインがタイムアウトしました"));
		}, LOGIN_TIMEOUT_MS);

		function finish(error: Error | null, code?: string) {
			clearTimeout(timer);
			server.close();
			if (error || !code) {
				reject(error);
			} else {
				resolve(code);
			}
		}

		server.on("error", reject);
		server.listen(CALLBACK_PORT, "localhost");
	});
}

async function exchangeCodeForToken(
	options: AuthManagerOptions,
	code: string,
	codeVerifier: string,
): Promise<string> {
	const response = await fetch(
		new URL("/oauth2/token", options.cognitoDomain),
		{
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "authorization_code",
				client_id: options.clientId,
				code,
				redirect_uri: REDIRECT_URI,
				code_verifier: codeVerifier,
			}),
		},
	);

	if (!response.ok) {
		throw new Error(
			`トークンの取得に失敗しました (${response.status}): ${await response.text()}`,
		);
	}

	const body = (await response.json()) as { access_token?: string };
	if (!body.access_token) {
		throw new Error("アクセストークンがレスポンスに含まれていません");
	}

	return body.access_token;
}

/**
 * 既定のブラウザで URL を開く。失敗しても表示した URL から手動で開ける
 */
function openBrowser(url: string) {
	const command =
		process.platform === "darwin"
			? "open"
			: process.platform === "win32"
				? "explorer"
				: "xdg-open";

	spawn(command, [url], { stdio: "ignore", detached: true })
		.on("error", () => {})
		.unref();
}
