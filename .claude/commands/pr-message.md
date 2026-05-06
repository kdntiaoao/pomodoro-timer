---
description: 現在ブランチと base ブランチの差分から PR タイトル / 本文 draft を生成
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git log:*), Bash(git diff:*), Bash(git rev-parse:*), Bash(git fetch:*)
---

現在ブランチと base ブランチ間の差分・コミット履歴を読み取り、`.claude/rules/common/git-workflow.md` の "Pull Request Workflow" / "Pull Request Title Rules" / "Pull Request Body Rules" / "PR Template Handling" 規約に従った PR タイトル / 本文 draft を提案。**PR 作成 (`gh pr create` 等) は実行しない。** 提案出力のみ。

## 対象範囲

- 現在ブランチを `git branch --show-current` で取得
- base ブランチは `$ARGUMENTS` 第 1 引数として扱う。省略時は以下の優先順で解決:
  1. `origin/main` が `git rev-parse --verify` で存在 → `origin/main`
  2. ローカル `main` が存在 → `main`
  3. いずれも未解決 → 1 行で「base ブランチ未解決。`$ARGUMENTS` で base 指定」と報告して終了
- 比較範囲: `<base>...HEAD` (3 ドット、merge base 起点)
- `$ARGUMENTS` 残余は意図ヒントとして内部勘案のみ。出力には反映しない

## 手順

1. 状態確認 — 以下を並列実行:
   - `git status -sb`
   - `git branch --show-current`
   - `git rev-parse --verify <base 候補>` (存在確認)
2. base 解決後、以下を並列実行:
   - `git log <base>...HEAD --oneline`
   - `git log <base>...HEAD --reverse --pretty=format:'%H%n%s%n%n%b%n---'`
   - `git diff --stat <base>...HEAD`
   - `git diff <base>...HEAD`
3. 比較対象差分が空 → 1 行で「PR 化対象差分なし。base ブランチ確認、またはコミット追加後再実行」と報告して終了
4. PR template 検出:
   - `.github/pull_request_template.md` または `.github/PULL_REQUEST_TEMPLATE.md` を Read
   - 存在 → その section 構造に従い各 section を差分・コミット履歴から埋める。section 削除不可。プレースホルダ (`<!-- ... -->` / 「〜してください」等の指示文) は具体内容置換、差分から判断不能な section は「該当なし」と明記
   - 未存在 → git-workflow.md "PR Body Default Structure" (目的 / 実施内容 / 影響範囲 / 確認方法) を使用
5. タイトル / 本文 draft 生成

## タイトル規則

- 日本語、簡潔
- prefix (`feat:` / `update:` / `fix:` / `chore:`) は任意。付ける場合の用途分類は commit-message.md と同一
- 文末句点無し

## 本文規則

- 日本語
- 敬語・丁寧語禁止、体言止め・用言止め
  - 修正しました → 修正
  - 対応しています → 対応
  - 追加しました → 追加
- 各 section は差分・コミット履歴から具体内容を抽出
- スクリーンショット / 動画 section は「該当時レビュアー追記」等簡潔注記

## 出力

- 以下フォーマット **のみ** 出力。前置き・後置き・補足説明・対象 base 案内・PR 作成案内など一切付加しない:

  ```text
  Title:
  <PR タイトル>

  Body:
  <PR 本文>
  ```

- 例外: 比較対象差分が空 / base ブランチ未解決 の場合のみ、コードブロックの代わりに 1 行で原因と対処を報告 (「対象範囲」末尾 / 手順 3 参照)
