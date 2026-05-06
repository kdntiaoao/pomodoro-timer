# Code Review Standards

## Purpose

Code review ensures quality, security, and maintainability before code is merged. This rule defines when and how to conduct code reviews.

## When to Review

**MANDATORY review triggers:**

- After writing or modifying code
- Before any commit to shared branches
- When security-sensitive code is changed (auth, payments, user data)
- When architectural changes are made
- Before merging pull requests

**Pre-Review Requirements:**

Before requesting review, ensure:

- `pnpm type-check` / `pnpm lint` / `pnpm test` がローカルで通っている
- Merge conflicts are resolved
- Branch is up to date with target branch

## Review Checklist

Before marking code complete:

- [ ] Code is readable and well-named
- [ ] Functions are focused (目安: 50 行以下、超える場合は責務分割を検討)
- [ ] Files are cohesive (目安: 800 行以下、超える場合はモジュール抽出を検討)
- [ ] No deep nesting (目安: 4 段以下、超える場合は early return / 関数抽出)
- [ ] Errors are handled at system boundaries (詳細は coding-style.md)
- [ ] No hardcoded secrets or credentials
- [ ] No console.log or debug statements
- [ ] Tests exist for new functionality

## Security Review Triggers

**STOP and use security-reviewer agent when:**

- Authentication or authorization code
- User input handling
- Database queries
- File system operations
- External API calls
- Cryptographic operations
- Payment or financial code

## Review Severity Levels

| Level    | Meaning                                  | Action                             |
| -------- | ---------------------------------------- | ---------------------------------- |
| CRITICAL | Security vulnerability or data loss risk | **BLOCK** - Must fix before merge  |
| HIGH     | Bug or significant quality issue         | **WARN** - Should fix before merge |
| MEDIUM   | Maintainability concern                  | **INFO** - Consider fixing         |
| LOW      | Style or minor suggestion                | **NOTE** - Optional                |

## Agent Usage

Use these agents for code review:

| Agent                   | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| **code-reviewer**       | General code quality, patterns, best practices |
| **security-reviewer**   | Security vulnerabilities, OWASP Top 10         |
| **typescript-reviewer** | TypeScript/JavaScript specific issues          |

## Review Workflow

```
1. Run git diff to understand changes
2. Check security checklist first
3. Review code quality checklist
4. Run relevant tests
5. Use appropriate agent for detailed review
```

## Common Issues to Catch

### Security

- Hardcoded credentials (API keys, passwords, tokens)
- SQL injection (string concatenation in queries)
- XSS vulnerabilities (unescaped user input)
- Path traversal (unsanitized file paths)
- CSRF protection missing
- Authentication bypasses

### Code Quality

- Large functions (目安 >50 lines) - 責務単位で分割検討
- Large files (目安 >800 lines) - モジュール抽出検討
- Deep nesting (目安 >4 levels) - early return / 関数抽出
- Missing error handling at boundaries - boundary 層で明示処理
- Mutation patterns - 原則 immutable、ただし local mutation が妥当な場面は許容
- Missing tests - 重要分岐 / async flow に test 追加

### Performance

- N+1 queries - use JOINs or batching
- Missing pagination - add LIMIT to queries
- Unbounded queries - add constraints
- Missing caching - cache expensive operations

## Approval Criteria

- **Approve**: No CRITICAL or HIGH issues
- **Warning**: Only HIGH issues (merge with caution)
- **Block**: CRITICAL issues found

## Integration with Other Rules

This rule works with:

- [security.md](security.md) - Security checklist
- [git-workflow.md](git-workflow.md) - Commit standards
- [agents.md](agents.md) - Agent delegation
