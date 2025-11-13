# cms-cli

API ディレクトリ以下にある API をコマンドライン経由で実行する CLI ツール。

## 目的

Lambda でホスティングされている記事管理 API をコマンドラインから操作し、記事の投稿・取得・同期を行う。

## 技術スタック

- **CLI フレームワーク**: Commander.js
- **テストフレームワーク**: Vitest
- **AWS SDK**: AWS SDK for JavaScript v3

## 前提条件

- AWS SSO による認証が事前に完了していること
- Lambda 関数への Invoke 権限があること
- 環境変数 `AWS_DEFAULT_PROFILE` または `AWS_PROFILE` が設定されているか、`--profile` オプションで指定できること

## インストール

```bash
pnpm install
```

## 基本的な使い方

### プロファイル指定

全てのコマンドで共通のグローバルオプション（コマンドの最初に指定）:

```bash
cms-cli --profile <profile-name> --function <function-name> <command>
```

#### プロファイル指定

プロファイルの優先順位:

1. `--profile` オプションで指定した値
2. 環境変数 `AWS_PROFILE`
3. 環境変数 `AWS_DEFAULT_PROFILE`

#### Lambda 関数名指定

Lambda 関数名の優先順位:

1. `--function` オプションで指定した値
2. 環境変数 `CMS_FUNCTION_NAME`
3. （デフォルト値が設定されていない場合はエラー）

## コマンド

### list - 記事一覧の表示

現在投稿されている記事の一覧を表示する。

```bash
cms-cli [--profile <name>] [--function <name>] list [options]
```

#### オプション

- `--page <number>` - ページ番号（デフォルト: 1）

#### 動作

- 一度に 10 件ずつ表示
- `--page` オプションでページネーション
- 記事のタイトル、ID、公開日などを表示

#### 使用例

```bash
# 1ページ目を表示
cms-cli list

# 2ページ目を表示
cms-cli list --page 2

# プロファイルを指定して実行
cms-cli --profile my-profile list --page 3

# Lambda関数名を指定して実行
cms-cli --function my-function list

# プロファイルと関数名を両方指定
cms-cli --profile my-profile --function my-function list --page 2
```

### post - 記事の投稿

指定した Markdown ファイル（.md または.mdx）を投稿する。

```bash
cms-cli [--profile <name>] [--function <name>] post <file> [options]
```

#### 引数

- `<file>` - 投稿する Markdown ファイルのパス（必須）

#### オプション

- `--title <title>` - 記事タイトル（frontmatter がない場合に使用）
- `--description <desc>` - 記事の説明（frontmatter がない場合に使用）
- `--tags <tags>` - タグ（カンマ区切り、frontmatter がない場合に使用）

#### 動作

1. 指定されたファイルを読み込む
2. frontmatter が存在する場合、そこからメタデータを抽出
3. frontmatter が存在しない場合、オプションからメタデータを取得
4. コンテンツは frontmatter を含めてそのまま投稿（削除不要）
5. Lambda 関数を呼び出して記事を投稿

#### 使用例

```bash
# frontmatterありのファイルを投稿
cms-cli post ./articles/my-post.md

# frontmatterなしのファイルをオプション指定で投稿
cms-cli post ./draft.md --title "新しい記事" --description "記事の説明" --tags "tech,javascript"

# プロファイル指定
cms-cli --profile my-profile post ./articles/my-post.md

# Lambda関数名を指定
cms-cli --function my-function post ./articles/my-post.md

# プロファイルと関数名を両方指定
cms-cli --profile my-profile --function my-function post ./draft.md --title "記事"
```

#### frontmatter の例

```markdown
---
title: 記事タイトル
description: 記事の説明
tags: [tech, javascript, aws]
published: true
---

記事の本文...
```

### sync - 記事の同期

投稿されている記事を取得して、指定したディレクトリに格納する。

```bash
cms-cli [--profile <name>] [--function <name>] sync <directory>
```

#### 引数

- `<directory>` - 記事を保存するディレクトリパス（必須）

#### 動作

1. Lambda 関数から全記事を取得
2. 指定されたディレクトリに記事をファイルとして保存
3. ファイルが既に存在する場合、更新日を比較して新しい方を優先
4. 以下の情報を標準出力:
   - 新規作成されたファイル
   - 更新されたファイル
   - スキップされたファイル（変更なし）

#### 使用例

```bash
# カレントディレクトリのarticlesフォルダに同期
cms-cli sync ./articles

# 絶対パスで指定
cms-cli --profile my-profile sync /path/to/articles

# Lambda関数名を指定
cms-cli --function my-function sync ./articles

# プロファイルと関数名を両方指定
cms-cli --profile my-profile --function my-function sync ./articles
```

#### 出力例

```
Syncing articles to ./articles...

✓ Created: article-1.md
✓ Updated: article-2.md
- Skipped: article-3.md (no changes)

Summary:
  Created: 1
  Updated: 1
  Skipped: 1
  Total: 3
```

## Lambda 関数の設定

CLI ツールが呼び出す Lambda 関数の設定:

- 関数名: `--function` オプションまたは環境変数 `CMS_FUNCTION_NAME` で指定
- リージョン: AWS プロファイルのデフォルトリージョンを使用

## 開発

### テストの実行

```bash
pnpm test
```

### ビルド

```bash
pnpm build
```

## ライセンス

MIT
