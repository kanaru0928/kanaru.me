# cms-cli

API ディレクトリ以下にある API をコマンドライン経由で実行する CLI ツール。

## 目的

記事管理 API（cms）をコマンドラインから操作し、記事の投稿・取得・同期を行う。

## 技術スタック

- **CLI フレームワーク**: Commander.js
- **テストフレームワーク**: Vitest
- **サムネイル生成**: Puppeteer、sharp

## 前提条件

- Cognito の CLI 用 App Client（AppStack の出力 `CmsCliClientId`）が作成済みであること
- ログイン時にポート 8976 でコールバックを待ち受けるため、同ポートが空いていること

## インストール

```bash
pnpm install
```

## 基本的な使い方

### 環境変数

`.env.example` を参考に、カレントディレクトリの `.env` またはシェルの環境変数で以下を設定する。

- `API_BASE_URL` - API のベース URL
- `COGNITO_DOMAIN` - Cognito ドメインの URL（AppStack の出力 `CognitoDomainUrl`）
- `COGNITO_CLIENT_ID` - CLI 用 App Client の ID（AppStack の出力 `CmsCliClientId`）

### 認証

API を呼び出すコマンドは、実行時にブラウザで Cognito にログインする（Authorization Code + PKCE）。ブラウザが開かない場合は、ターミナルに表示された URL を開く。

## コマンド

### list - 記事一覧の表示

現在投稿されている記事の一覧を表示する。

```bash
cms-cli list [options]
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
```

### post - 記事の投稿

指定した Markdown ファイル（.md または.mdx）を投稿する。

```bash
cms-cli post <file> [options]
```

#### 引数

- `<file>` - 投稿する Markdown ファイルのパス（必須）

#### オプション

- `--title <title>` - 記事タイトル（frontmatter がない場合に使用）
- `--tags <tags>` - タグ（カンマ区切り、frontmatter がない場合に使用）。1 件以上必須

#### 動作

1. 指定されたファイルを読み込む
2. frontmatter が存在する場合、そこからメタデータを抽出
3. frontmatter が存在しない場合、オプションからメタデータを取得
4. frontmatter に `thumbnailUrl` がない場合、タイトルとタグを入れた OGP 画像（1200x630）を Puppeteer で生成し、WebP に変換してアップロード
5. コンテンツは frontmatter を含めてそのまま投稿（削除不要）。`source` は `kanaru.me` 固定

#### 使用例

```bash
# frontmatterありのファイルを投稿
cms-cli post ./articles/my-post.md

# frontmatterなしのファイルをオプション指定で投稿
cms-cli post ./draft.md --title "新しい記事" --tags "tech,javascript"
```

#### frontmatter の例

```markdown
---

title: 記事タイトル
tags: [tech, javascript, aws]
published: true
thumbnailUrl: /thumbnails/xxxx.webp
---

記事の本文...
```

`thumbnailUrl` を省略した場合は OGP 画像を生成する。

生成する OGP 画像の左側には、以下の項目でアイキャッチを表示できる。両方を指定した場合は画像を優先し、どちらも指定しない場合はアイキャッチを表示しない。

- `eyecatchImage` - 画像ファイルのパス（Markdown ファイルからの相対パス。png、jpg、webp、gif、svg に対応）
- `eyecatchEmoji` - 絵文字

### sync - 記事の同期

投稿されている記事を取得して、指定したディレクトリに格納する。

```bash
cms-cli sync <directory>
```

#### 引数

- `<directory>` - 記事を保存するディレクトリパス（必須）

#### 動作

1. API から全記事（最大 100 件）を取得
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
cms-cli sync /path/to/articles
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

### upload-image - 画像のアップロード

画像を WebP に変換し、API が発行した署名付き URL へアップロードする。アップロード後の URL を標準出力に出力する。

```bash
cms-cli upload-image <file> [--max-size <number>] [--quality <number>]
```

## 開発

### テストの実行

```bash
pnpm test
```

### ビルド

```bash
pnpm build
```
