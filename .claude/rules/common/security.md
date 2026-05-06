# Security Guidelines

## Mandatory Security Checks

すべての commit で必ず確認:

- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] Error messages don't leak sensitive data

security-sensitive な変更時 (auth, user input handling, file I/O, external API call, payment, DB query) に追加で確認:

- [ ] All user inputs validated
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitized HTML)
- [ ] Authentication/authorization verified
- [ ] CSRF protection enabled — context-dependent (Next.js Server Actions は自動対応、外部 form / API endpoint 追加時に明示確認)
- [ ] Rate limiting — context-dependent (公開 endpoint / abuse リスク endpoint に適用)

## Secret Management

- NEVER hardcode secrets in source code
- ALWAYS use environment variables or a secret manager
- Validate that required secrets are present at startup
- Rotate any secrets that may have been exposed

## Security Response Protocol

If security issue found:

1. STOP immediately
2. Use **security-reviewer** agent
3. Fix CRITICAL issues before continuing
4. Rotate any exposed secrets
5. Review entire codebase for similar issues
