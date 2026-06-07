# Copilot Instructions

## Commit Message Rules

コミットメッセージ提案時は `.claude/commands/commit-message.md` と `.claude/rules/common/git-workflow.md` を最優先で遵守。

### Scope Selection

- staged 差分がある場合: staged 差分のみ対象
- staged 差分が空の場合: unstaged 差分 + 未追跡ファイルを対象
- 差分が完全に空の場合: `コミット可能な差分なし` を返す

### Subject Format

- 形式: `<prefix>: <日本語の簡潔なフレーズ>`
- 利用可能 prefix: `feat:`, `update:`, `fix:`, `chore:`
- 文末に句点を付けない
- 変更の主旨を簡潔かつ具体に表現

### Body Format

- 必要な場合のみ記述
- 日本語で記述
- 敬語・丁寧語を使わない (`です` / `ます` / `ございます` 禁止)
- subject と body の間に空行 1 行

### Output Contract

- 出力はコミットメッセージのコードブロックのみ
- 前置き・後置き・補足説明を付けない
- 差分が空の場合のみ、コードブロックではなく `コミット可能な差分なし` を 1 行で返す

### Prohibitions

- コミット実行を行わない
- `git add` / `git commit` / `git push` を実行しない
