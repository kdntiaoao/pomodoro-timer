# メモ

## コマンド

### node_modules削除コマンド

```
find . -type d -name "node_modules" -prune -exec rm -rf '{}' +
```

### turborepoのキャッシュ削除

```shell
# 削除するディレクトリを確認
printf '%s\n' ./**/.turbo
# 削除する
rm -rf ./**/.turbo
rm -rf ./**/.next
rm -rf ./**/dist
rm -rf ./**/tsconfig.tsbuildinfo
rm -rf ./**/node_modules

pnpm install --frozen-lockfile
pnpm build && pnpm -F consumer start

```

### worktree のスクリプト

```shell
# worktree の作成
pnpm dlx tsx tools/worktree-setup.ts feature/xxxx

# worktree の削除
pnpm dlx tsx tools/worktree-remove.ts feature/xxxx
```

### tree コマンド

```shell
tree . -I "node_modules|.turbo|.next|dist" -do tree.txt
```

### GIF へ変換

```shell
ffmpeg -i /Users/tanok/Desktop/input.mov -vf "fps=10,scale=332:-1:flags=lanczos,palettegen" -y /Users/tanok/Desktop/palette.png
ffmpeg -i /Users/tanok/Desktop/input.mov -i /Users/tanok/Desktop/palette.png -filter_complex "fps=10,scale=332:-1:flags=lanczos[x];[x][1:v]paletteuse" -y /Users/tanok/Desktop/screenshot.gif

ffmpeg -i /Users/tanok/Desktop/input.mov -vf "fps=10,scale=1920:-1:flags=lanczos,palettegen" -y /Users/tanok/Desktop/palette.png
ffmpeg -i /Users/tanok/Desktop/input.mov -i /Users/tanok/Desktop/palette.png -filter_complex "fps=10,scale=1920:-1:flags=lanczos[x];[x][1:v]paletteuse" -y /Users/tanok/Desktop/screenshot.gif
```

### トークン確認

```shell
# ref: https://github.com/ryoppippi/ccusage
# Claude Code
pnpm dlx ccusage
pnpm dlx ccusage monthly

# Codex
pnpm dlx @ccusage/codex
pnpm dlx @ccusage/codex monthly
```

### git worktree

```shell
# 新しいブランチとworktreeを同時に作成
git worktree add -b feature/new-ui ../origin-toshu-chot-xxxx
git worktree add -b feature/cms/update-brand-banner ../origin-toshu-chot-cms-update-brand-banner

# 既存のブランチでworktreeを作成
git worktree add ../origin-toshu-chot-xxxx hotfix/bug-123

# worktreeの一覧表示
git worktree list

# worktreeを削除
git worktree remove ../origin-toshu-chot-xxxx
git worktree remove ../origin-toshu-chot-feature-xxxx

# フォルダを直接削除した場合
rm -rf ../origin-toshu-chot-xxxx
# Gitに削除されたworktreeの情報を整理させる
git worktree prune
```
