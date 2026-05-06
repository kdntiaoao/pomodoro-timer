# Coding Style

## Immutability

原則 immutable: 新しい object を返し、既存を mutate しない。

```
// Pseudocode
WRONG:  modify(original, field, value) → changes original in-place
CORRECT: update(original, field, value) → returns new copy with change
```

Rationale: Immutable data prevents hidden side effects, makes debugging easier, and enables safe concurrency.

例外: DOM ref / animation engine (gsap 等) / editor instance (Tiptap 等) のように local mutation が必須な API はこの限りでない。

## Core Principles

### KISS (Keep It Simple)

- Prefer the simplest solution that actually works
- Avoid premature optimization
- Optimize for clarity over cleverness

### DRY (Don't Repeat Yourself)

- Extract repeated logic into shared functions or utilities
- Avoid copy-paste implementation drift
- Introduce abstractions when repetition is real, not speculative

### YAGNI (You Aren't Gonna Need It)

- Do not build features or abstractions before they are needed
- Avoid speculative generality
- Start simple, then refactor when the pressure is real

## File Organization

MANY SMALL FILES > FEW LARGE FILES:

- High cohesion, low coupling
- 目安: 200-400 lines typical、800 lines を超えるなら分割検討
- Extract utilities from large modules
- Organize by feature/domain, not by type

## Error Handling

エラー処理は **system boundary** で行う:

- 境界の例: user input, external API response, file I/O, DB クエリ結果
- 境界では schema validation / try-catch / 明示的な error 型を用いる
- UI-facing code では user 向けの error message を提供
- server side では detailed error context を log
- 内部コードでは framework / SDK 保証に依拠し、起こらないシナリオへの fallback / null check / try-catch を追加しない
- 意味のあるエラーを silently swallow しない

## Input Validation

ALWAYS validate at system boundaries:

- Validate all user input before processing
- Use schema-based validation where available (本リポジトリは Valibot)
- Fail fast with clear error messages
- Never trust external data (API responses, user input, file content)

## Naming Conventions

- Variables and functions: `camelCase` with descriptive names
- Booleans: prefer `is`, `has`, `should`, or `can` prefixes
- Interfaces, types, and components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Custom hooks: `camelCase` with a `use` prefix

## Code Smells to Avoid

### Deep Nesting

Prefer early returns over nested conditionals once the logic starts stacking.

### Magic Numbers

Use named constants for meaningful thresholds, delays, and limits.

### Long Functions

Split large functions into focused pieces with clear responsibilities.

## Code Quality Checklist

Before marking work complete:

- [ ] Code is readable and well-named
- [ ] Functions are small (目安: <50 lines)
- [ ] Files are focused (目安: <800 lines)
- [ ] No deep nesting (目安: <4 levels)
- [ ] Error handling は boundary 層で実施 (内部信頼境界では追加しない)
- [ ] No hardcoded values (use constants or config)
- [ ] 原則 immutable patterns (例外は Immutability セクション参照)
