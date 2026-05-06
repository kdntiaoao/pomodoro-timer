# Development Workflow

> This file extends [common/git-workflow.md](./git-workflow.md) with the full feature development process that happens before git operations.

The Feature Implementation Workflow describes the development pipeline: research, planning, TDD, code review, and then committing to git.

## Feature Implementation Workflow

0. **Research & Reuse** _(mandatory before any new implementation)_
   - **GitHub code search first:** Run `gh search repos` and `gh search code` to find existing implementations, templates, and patterns before writing anything new.
   - **Library docs second:** Use Context7 or primary vendor docs to confirm API behavior, package usage, and version-specific details before implementing.
   - **Exa only when the first two are insufficient:** Use Exa for broader web research or discovery after GitHub search and primary docs.
   - **Check package registries:** Search npm, PyPI, crates.io, and other registries before writing utility code. Prefer battle-tested libraries over hand-rolled solutions.
   - **Search for adaptable implementations:** Look for open-source projects that solve 80%+ of the problem and can be forked, ported, or wrapped.
   - Prefer adopting or porting a proven approach over writing net-new code when it meets the requirement.

1. **Plan First**
   - 規模に応じて **planner** / **architect** agent で設計 outline を作成
   - 大規模な機能・アーキテクチャ変更時は設計ドキュメントを残す
   - 日常的な block 追加 / UI 修正 / 軽微な bug fix では plan agent 起動は不要
   - Identify dependencies and risks
   - Break down into phases

2. **Tests**
   - 重要分岐 / async flow には test を書く（AGENTS.md テストガイドライン準拠）
   - 本プロジェクトは TDD 不採用、テスト先行は必須でない
   - Vitest + happy-dom、test 配置は `src/**/*.test.{ts,tsx}`

3. **Code Review**
   - Use **code-reviewer** agent immediately after writing code
   - TS/TSX 中心の変更は **typescript-reviewer** agent も併用
   - Address CRITICAL and HIGH issues
   - Fix MEDIUM issues when possible

4. **Commit & Push**
   - Detailed commit messages
   - Follow conventional commits format
   - See [git-workflow.md](./git-workflow.md) for commit message format and PR process

5. **Pre-Review Checks**
   - `pnpm type-check` / `pnpm lint` / `pnpm test` がローカル通過
   - Resolve any merge conflicts
   - Ensure branch is up to date with target branch
   - Only request review after these checks pass
