# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

React Router v7 (旧Remix) をベースとした個人ポートフォリオサイト。SSR対応のフルスタックアプリケーション。

### モノレポ構成

- `web/` - フロントエンドアプリケーション (React Router v7)
- `api/` - バックエンドAPI (Hono + AWS Lambda)
- `infrastructure/` - インフラストラクチャ (AWS CDK)
- `functions/` - サーバーレス関数

## 開発コマンド

### Webアプリケーション (web/)

```bash
# 開発サーバー起動
cd web && pnpm dev

# 型チェック
cd web && pnpm typecheck

# ビルド
cd web && pnpm build

# プロダクション起動
cd web && pnpm start

# Lintとフォーマット (Biome)
cd web && pnpm biome check --write
```

### リポジトリルート

```bash
# 依存関係インストール
pnpm install

# Husky初期化（Git hooks）
pnpm prepare
```

## アーキテクチャ

### プロジェクト構造

```
web/
├── app/
│   ├── routes/           # ページルート（ファイルベースルーティング）
│   ├── features/         # 機能別モジュール
│   │   ├── top-page/     # トップページ関連
│   │   └── navbar/       # ナビゲーション関連
│   ├── components/       # 共通コンポーネント
│   ├── root.tsx          # アプリケーションルート
│   └── routes.ts         # ルート設定（flatRoutes使用）
```

### 技術スタック

- **フレームワーク**: React Router v7 (SSR対応)
- **スタイリング**: DaisyUI + TailwindCSS v4
- **ビルドツール**: Vite
- **Linter/Formatter**: Biome
- **言語**: TypeScript
- **パッケージマネージャー**: pnpm

### ルーティング

- ファイルベースルーティング（`@react-router/fs-routes`）
- `app/routes/` 配下のファイルが自動的にルートとして認識される
- `_index.tsx` がインデックスルート、他のファイル名がパスに対応

### レイアウトシステム

- `root.tsx` の `Layout` コンポーネントが全ページ共通レイアウトを提供
- `NavbarProvider` でナビゲーションバーを全ページに配置
- エラーバウンダリーも `root.tsx` で定義

## コーディング規約

### スタイリング

スタイリングにはDaisyUIを使用してください。補助的にTailwindCSSも使用可能です。Module CSSは使用しないでください。
DaisyUIのコンポーネントを優先的に使用し、必要に応じてTailwindCSSでカスタマイズしてください。
DaisyUIの詳細の取得はcontext7 MCPを使用できます。

### コードスタイル

- Biomeでフォーマットとリントを実施
- ダブルクォート使用（`quoteStyle: "double"`）
- インポート自動整理有効

## テスト

- **E2Eテスト**: UI作成後は必ずPlaywright MCPツールを活用してテストを実施してください。

## Playwright MCP使用ルール

### 絶対的な禁止事項

1. **いかなる形式のコード実行も禁止**
   - Python、JavaScript、Bash等でのブラウザ操作
   - MCPツールを調査するためのコード実行
   - subprocessやコマンド実行によるアプローチ

2. **利用可能なのはMCPツールの直接呼び出しのみ**
   - playwright:browser_navigate
   - playwright:browser_screenshot
   - 他のPlaywright MCPツール

3. **エラー時は即座に報告**
   - 回避策を探さない
   - 代替手段を実行しない
   - エラーメッセージをそのまま伝える

## サーチ戦略の自動化

- **曖昧な指示への対応**: 「探して」「調べて」「確認して」などの指示があった場合、以下を自動で実行します：
  1. `mcp__serena__get_symbols_overview({ relative_path: "." })` - プロジェクト全体のシンボル概要取得
  2. `mcp__serena__get_symbols_overview({ relative_path: "src" })` - ソースコードディレクトリのシンボル概要取得
  3. 必要に応じて `mcp__serena__find_symbol` で詳細調査

## **必須**: プロジェクト構造発見プロトコル

### セッション開始時の自動実行

セッション開始時、以下のコマンドを必ず自動実行してください：

```bash
# 1. 既存知識の確認
mcp__serena__check_onboarding_performed
mcp__serena__list_memories

# 2. プロジェクト構造のスキャン
mcp__serena__list_dir({ relative_path: ".", recursive: false })
mcp__serena__get_symbols_overview({ relative_path: "src" })

# 3. 設定ファイルの確認
mcp__serena__find_file({ file_mask: "package.json", relative_path: "." })
mcp__serena__find_file({ file_mask: "*.config.*", relative_path: "." })
```

### Serenaツール利用優先度

1. **シンボル・関数検索**: まず `find_symbol` を優先して使用
2. **テキスト・文字列検索**: `search_for_pattern` を使用
3. **複数置換**: 3件以上の類似パターン変更時は `replace_regex` を使用
