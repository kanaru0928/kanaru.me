## コーディング規約

### スタイリング

スタイリングにはDaisyUIを使用してください。補助的にTailwindCSSも使用可能です。Module CSSは使用しないでください。
DaisyUIのコンポーネントを優先的に使用し、必要に応じてTailwindCSSでカスタマイズしてください。
DaisyUIの詳細の取得はcontext7 MCPを使用できます。

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
