# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

記事管理のためのREST API。Hono + AWS Lambda + DynamoDBによるサーバーレスアーキテクチャ。

## 技術スタック

- **フレームワーク**: Hono (OpenAPI対応)
- **ランタイム**: AWS Lambda (Node.js 20)
- **データベース**: DynamoDB
- **ストレージ**: S3
- **テスティング**: Vitest
- **バリデーション**: Zod
- **言語**: TypeScript
- **パッケージマネージャー**: pnpm

## 開発コマンド

```bash
# 開発サーバー起動（ポート3010）
pnpm dev

# 型チェック
pnpm type-check

# テスト実行
pnpm test

# テストUI起動
pnpm test:ui

# ビルド
pnpm build

# Lambda関数のデプロイ（ビルド→zip→AWS Lambda更新）
pnpm deploy
```

### テストコマンド詳細

```bash
# 単一テストファイル実行
pnpm test tests/unit/CreateArticleUseCase.test.ts

# 統合テストのみ実行
pnpm test tests/integration/

# ユニットテストのみ実行
pnpm test tests/unit/

# watchモード
pnpm test --watch
```

## アーキテクチャ

### クリーンアーキテクチャの4層構造

```
src/
├── domain/              # ドメイン層（ビジネスロジック）
│   ├── entities/        # エンティティ（Article）
│   ├── repositories/    # リポジトリインターフェース
│   └── errors/          # ドメインエラー
├── application/         # アプリケーション層（ユースケース）
│   └── usecases/        # ユースケース（CRUD操作）
├── infrastructure/      # インフラ層（実装詳細）
│   ├── container/       # DIコンテナ
│   ├── repositories/    # DynamoDB実装
│   └── storage/         # S3実装
└── interface/           # インターフェース層（API）
    ├── routes/          # ルート定義
    ├── schemas/         # OpenAPIスキーマ
    ├── validators/      # バリデータ
    └── dto/             # DTO
```

### 依存性の注入

- **DIコンテナ**: `infrastructure/container/DIContainer.ts`でシングルトンパターンを実装
- **セットアップ**: `infrastructure/container/setup.ts`で全依存関係を登録
- **環境変数**: 初回リクエスト時に取得しキャッシュ（Lambda Cold Startを最小化）

### エントリポイント

- **Lambda**: `src/handler.ts` - AWS Lambdaハンドラー
- **開発環境**: `src/dev-server.ts` - ローカル開発サーバー（`@hono/node-server`）
- **アプリケーション本体**: `src/app.ts` - Honoアプリ定義

### ミドルウェア構成

1. 環境変数取得・DIコンテナセットアップ（初回のみ、以降はキャッシュ）
2. CORS設定（環境変数`ALLOWED_ORIGINS`から動的に設定）
3. グローバルエラーハンドラ（`DomainError`を適切なHTTPステータスに変換）

## API設計

### OpenAPI仕様

- **ドキュメント**: `/api/openapi.json`
- **Swagger UI**: `/api/docs`
- **スキーマ定義**: `src/interface/schemas/articleSchemas.ts`（Zodスキーマ）

### ルート構造

```
GET    /api                      - ヘルスチェック
GET    /api/articles             - 記事一覧取得
POST   /api/articles             - 記事作成
GET    /api/articles/:id         - 記事詳細取得
PUT    /api/articles/:id         - 記事メタデータ更新
PUT    /api/articles/:id/content - 記事コンテンツ更新
DELETE /api/articles/:id         - 記事削除
```

## テスト戦略

### テスト構成

```
tests/
├── unit/           # ユニットテスト（UseCase単体）
├── integration/    # 統合テスト（ルートのE2Eテスト）
└── mocks/          # モック実装（Repository、Storage、Container）
```

### テストのベストプラクティス

- **ユニットテスト**: UseCaseの各メソッドをモックしたRepository/Storageでテスト
- **統合テスト**: ルートハンドラをモックしたコンテナで実際のHTTPリクエスト/レスポンスをテスト
- **モック**: `tests/mocks/`配下のファクトリ関数を使用（`createMockArticleRepository`等）

## コーディング規約

### 新機能追加時の手順

1. **ドメイン層**: エンティティやインターフェースを定義（必要に応じて）
2. **アプリケーション層**: UseCaseを作成（`application/usecases/`）
3. **インフラ層**: 実装を追加し、DIコンテナに登録（`infrastructure/container/setup.ts`）
4. **インターフェース層**:
   - スキーマ定義（`interface/schemas/`）
   - バリデータ作成（`interface/validators/`）
   - ルート追加（`interface/routes/`）
5. **テスト**: ユニットテストと統合テストを作成

### エラーハンドリング

- **ドメインエラー**: `domain/errors/DomainError.ts`を継承
- **エラーの種類**:
  - `NotFoundError` (404)
  - `ValidationError` (400)
  - `ConflictError` (409)
- **グローバルハンドラ**: `app.ts`の`onError`で自動的にHTTPレスポンスに変換

### 環境変数

必須の環境変数（`src/config/env.ts`でバリデーション）:

- `DYNAMODB_TABLE_NAME`: DynamoDBテーブル名
- `S3_BUCKET_NAME`: S3バケット名
- `AWS_REGION`: AWSリージョン
- `ALLOWED_ORIGINS`: CORS許可オリジン（カンマ区切り）

開発環境では`.env`ファイルから読み込み（`tsx --env-file=.env`）。

## デプロイ

```bash
# ビルド→zip→AWS Lambda更新
pnpm deploy
```

デプロイコマンドは以下を順次実行:

1. `pnpm build` - esbuildでバンドル（`dist/index.js`）
2. `pnpm zip` - Lambda用zipファイル作成
3. `pnpm update` - AWS CLIでLambda関数コード更新（関数名: `hello`）
