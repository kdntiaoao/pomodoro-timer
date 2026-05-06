# CLAUDE.md

このファイルは Claude Code (claude.ai/code) が本リポジトリで作業する際のガイドライン。

@AGENTS.md

## Commands

パッケージマネージャは **pnpm** (`pnpm-lock.yaml` 参照)。

| コマンド      | 用途                                                 |
| ------------- | ---------------------------------------------------- |
| `pnpm dev`    | Next.js dev server (Next 16 は Turbopack デフォルト) |
| `pnpm build`  | プロダクションビルド                                 |
| `pnpm start`  | ビルド済みプロダクションサーバ起動                   |
| `pnpm lint`   | ESLint (flat config, `eslint.config.mjs`)            |
| `pnpm format` | Prettier 全体書き込み                                |

`type-check` script・テストランナーは未設定。型チェック単発実行は `pnpm exec tsc --noEmit`。共通 rules では Vitest 言及あるが本リポジトリ未導入 → ユーザ確認なしにテスト導入しない。

## Stack

- **Next.js 16.2.4** + **React 19.2.4** — 最新版。`AGENTS.md` 警告どおり訓練データの Next.js API 知識は誤りの可能性。バンドル済 docs は `node_modules/next/dist/docs/{01-app,02-pages,03-architecture,04-community}/` 配下 → framework に触れるコード書く前に該当 guide を読む。
- **Tailwind CSS v4** — `tailwind.config.{js,ts}` なし。設定は `app/globals.css` の `@theme inline { ... }` による CSS-first 方式、PostCSS plugin は `@tailwindcss/postcss`。import は `@import "tailwindcss";` (v3 の `@tailwind base/components/utilities` ディレクティブ不可)。
- **TypeScript strict mode**, ES2017 target, `moduleResolution: "bundler"`。

## Project Layout

- `app/` は **repo root 直下** (`src/app/` ではない)。path alias `@/*` は repo root (`./*`) 解決 → `@/app/page` は有効、`@/components` 等は未整備。
- `app/layout.tsx` で `next/font/google` 経由 Geist + Geist Mono を `--font-geist-sans` / `--font-geist-mono` CSS 変数として公開し、`globals.css` の `@theme inline` で消費。font 追加時も同方式 (CSS 変数 → `@theme` マッピング)、`tailwind.config` 経由不可。
- `pnpm-workspace.yaml` は `ignoredBuiltDependencies` (`sharp`, `unrs-resolver`) 指定用のみ。**マルチパッケージ workspace ではない**。

## Tooling Conventions

- ESLint は `eslint-config-next/core-web-vitals` と `eslint-config-next/typescript` を継承、末尾に `eslint-config-prettier` 配置でスタイル系ルール無効化。`eslint-config-next` の default ignore は `eslint.config.mjs` 内で上書き → 別途 `.eslintignore` 作らず同ファイルで管理。
- Prettier は `prettier-plugin-tailwindcss` 使用、class 関数として `clsx` / `cn` / `cva` 認識 (`.prettierrc` 参照)。VSCode の `tailwindCSS.classFunctions` も同期済 → ヘルパー追加時両方更新。

## Project Rules

詳細な coding / git / review 規約は `.claude/rules/common/*.md` と `.claude/rules/typescript/*.md` 配下。日常作業で影響する重要点:

- **Hands-off git policy** (`git-workflow.md`): Claude は `git add` / `commit` / `push` / `gh pr create` 等を実行しない。read-only git は可、staging・commit はユーザ担当。プラン承認は破壊的・index 更新コマンドの実行承認を兼ねない。
- **Commit/PR 言語**: 日本語、terse declarative (体言止め・用言止め、です/ます禁止)。Subject prefix は `feat:` / `update:` / `fix:` / `chore:`。PR body は `.github/PULL_REQUEST_TEMPLATE.md` が存在すれば従う。
- **デフォルト応答言語**: 日本語、terse style。ユーザが英語に切り替えた時のみ英語 (`language.md`)。
