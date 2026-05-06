---
description: staged 差分 (空時 unstaged) から conventional commit message を生成
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git ls-files:*)
---

現在の git 差分を読み取り、`.claude/rules/common/git-workflow.md` 規約に従ったコミットメッセージを提案。**コミット自体は実行しない。** 提案出力のみ。

## 対象範囲

- **第一優先: staged 差分**。staged 差分がある場合はそれのみを対象とし、unstaged / 未追跡は無視
- **fallback: staged が空の場合は unstaged 差分 (modified) + 未追跡ファイルを統合対象**
  - 追跡中ファイル変更: `git diff`
  - 未追跡ファイル: `git ls-files --others --exclude-standard` で一覧取得、`Read` tool で内容確認 (`git add -N` 含む index 更新は不可)
- staged / unstaged / 未追跡 全て空の場合のみ「コミット可能な差分なし」と報告して終了

## 手順

1. 状態確認 — 以下を並列実行:
   - `git status -sb` (staged / unstaged の概況把握)
   - `git diff --cached --stat`
   - `git diff --cached`
   - `git log --oneline -10` (リポジトリの commit message 慣習把握用)
2. 対象差分判定:
   - staged 差分が非空 → staged を対象に手順 4 へ
   - staged 差分が空 → 手順 3 へ
3. unstaged + 未追跡ファイル取得 (staged 空時のみ、並列実行):
   - `git diff --stat`
   - `git diff`
   - `git ls-files --others --exclude-standard`
   - 未追跡ファイル検出時、各ファイルを `Read` tool で内容確認
   - unstaged 差分 / 未追跡ファイル いずれも空なら「コミット可能な差分なし」と報告して終了
4. 対象差分を一貫したコミット意図に集約し、message draft 生成

## Commit Message 規則

### Subject

prefix:

| prefix    | 用途                                                                            |
| --------- | ------------------------------------------------------------------------------- |
| `feat:`   | 新機能                                                                          |
| `update:` | 振る舞いの改善・軽微な機能変更                                                  |
| `fix:`    | バグ修正・リファクタリング                                                      |
| `chore:`  | ドキュメント更新、運用ルール変更、agent / skill 設定更新、CI 更新、依存関係更新 |

- prefix 後ろは短い日本語フレーズ
- 文末句点無し
- 主旨を簡潔具体に

### Body

- 日本語
- 敬語・丁寧語禁止（です / ます / ございます 不可）、体言止め・用言止め
  - 修正しました → 修正
  - 対応しています → 対応
  - 追加しました → 追加
- 変更内容理解に役立つ場合のみ記述
- subject と body の間に空行 1 行

## Format

```text
<prefix>: <日本語の簡潔なフレーズ>

<日本語の body>
```

## 出力

- コミットメッセージのコードブロック **のみ** 出力。前置き・後置き・補足説明・対象差分の種別案内 (staged / unstaged) ・コミット実行案内など一切付加しない
- `$ARGUMENTS` は意図ヒントとして内部勘案のみ。出力には反映しない
- 例外: staged / unstaged / 未追跡 全て空の場合のみ、コードブロックの代わりに 1 行で「コミット可能な差分なし」と報告 (出力不能時の必須報告)
