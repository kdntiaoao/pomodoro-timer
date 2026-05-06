# Git Workflow

> Claude は git index / HEAD / refs / remote を更新する操作を一切実行しない。staging・commit・push・PR 作成は全てユーザーが手元で実施する。本書はユーザーが commit / PR を作る際にエージェントへ作業依頼する場合の言語・形式ルール。

## Hands-Off Policy for Claude

Claude は以下の操作を**実行しない**。ユーザー自身が手元で実施する。

- `git add` / `git add -N` / `git add -p` など index 更新全般
- `git commit` / `git commit --amend`
- `git push` / `git push --force` 系
- `git reset` / `git rebase` / `git revert` / `git cherry-pick`
- `git restore` / `git checkout -- <path>` などファイル破棄系
- `git rm` (index + working tree からの削除)
- `git mv` (index 更新を伴う rename)
- `git tag` / `git branch` 作成・削除 / `git switch -c` などブランチ操作
- `gh pr create` / `gh pr merge` / `gh pr close` / `gh issue close` 等の remote 状態変更
- shell の `rm` / `rm -rf` (ファイル削除全般)

許可される git 操作は **read-only** 系のみ (`git status` / `git diff` / `git log` / `git show` / `git ls-files` / `git branch --show-current` 等)。

例外: ユーザーが個別コマンドに対して明示的に指示した場合のみ実行可 (例:「`git rm` してファイル削除」「`rm` で消して」)。**プラン承認 (ExitPlanMode) は個別 git / rm コマンドの実行承認を兼ねない**。プラン内に破壊的・index 更新コマンドを書いた場合も、実行直前に再度承認を求める。Attribution の追記禁止 (`~/.claude/settings.json` でグローバル無効化済)。

## Commit Workflow

ユーザーから「コミットして」と指示された場合の手順。**Claude 自身は staging / commit を実行しない**。差分把握 → commit message draft 提示までを担当し、実 staging と commit はユーザーが行う。

1. 状態確認 — 未コミット差分を全把握 (read-only):
   - `git status -sb`
   - `git diff --cached --stat`
   - `git diff --cached`
   - `git diff --stat`
   - `git diff`
2. 未追跡ファイル確認 (read-only):
   - `git ls-files --others --exclude-standard`
   - 未追跡ファイルの内容確認は `Read` tool で直接読む (`git add -N` 含む index 更新は不可)
3. 全差分を一貫した commit 意図に集約し、message draft を提示:
   - ユーザー影響のある変更・バグ修正を優先
   - フォーマット変更やノイズ的差分は主変更にまとめる (それらが大半なら別扱い)
4. ユーザーが手元で `git add` / `git commit` を実施

## Commit Message Rules

### Subject

必ず以下のプレフィックスのいずれかで始める:

| Prefix    | 用途                                                                                          |
| --------- | --------------------------------------------------------------------------------------------- |
| `feat:`   | 新機能                                                                                        |
| `update:` | 振る舞いの改善・軽微な機能変更                                                                |
| `fix:`    | バグ修正・リファクタリング                                                                    |
| `chore:`  | ドキュメント更新、運用ルール変更、agent / skill 設定更新、CI 更新、依存関係更新などの補助作業 |

- prefix の後ろは短い日本語フレーズ
- 文末に句点を付けない
- 変更の主旨を簡潔かつ具体的に

### Body

- 日本語で記述
- 変更の目的と主な内容を簡潔に説明
- 敬語・丁寧語禁止 (です / ます / ございます 不可)、体言止め・用言止め
  - ❌ 修正しました → ✅ 修正
  - ❌ 対応しています → ✅ 対応
  - ❌ 追加しました → ✅ 追加
- 変更内容の理解に役立つ場合のみ記述

### Format

```text
<prefix>: <日本語の簡潔なフレーズ>

<日本語の body>
```

Body を記述する場合は Subject と Body の間に空行を 1 行入れる。

## Pull Request Workflow

ユーザーから「PR 作って」と指示された場合の手順。

1. 現在の git ブランチ名を取得 (`git branch --show-current`)
2. マージ先ブランチ (デフォルト `main`) との差分を確認 (`git log origin/main..HEAD --oneline` / `git diff origin/main...HEAD`)
3. 差分を分析し変更意図を把握
4. PR タイトルと本文を生成

## Pull Request Title Rules

- 日本語で記述
- 簡潔
- 必要に応じてコミットと同じ prefix (`feat:` / `update:` / `fix:` / `chore:`) を使用

## Pull Request Body Rules

- 日本語で記述
- 敬語・丁寧語禁止、体言止め・用言止め
- 例外: ユーザーから敬語使用指示があった場合のみ可

## PR Template Handling

- `.github/pull_request_template.md` または `.github/PULL_REQUEST_TEMPLATE.md` が存在する場合は読み込む
- そのテンプレート構造に従って本文を生成
- 各セクションは差分内容に基づいて埋める
- セクションは削除しない
- プレースホルダ (`<!-- ... -->`) は適切な内容に置き換える

## PR Body Default Structure (when no template exists)

### 目的

変更の背景・目的

### 実施内容

主な変更点

### 影響範囲

影響がある箇所

### 確認方法

レビュワーによる確認手順

## Output Format

ユーザーへの報告は以下:

```text
Title:
<PR タイトル>

Body:
<PR 本文>
```
