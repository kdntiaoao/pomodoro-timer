# tools/

## worktree 関連

```sh
# git worktree 作成 + pnpm install 実行
pnpm dlx tsx tools/worktree-setup.ts feature/xxxx
```

```sh
# git worktree 削除 + branch 削除
pnpm dlx tsx tools/worktree-remove.ts feature/xxxx
```
