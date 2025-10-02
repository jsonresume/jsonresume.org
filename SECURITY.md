# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version       | Supported          |
| ------------- | ------------------ |
| latest (main) | :white_check_mark: |
| < latest      | :x:                |

**Note:** We recommend always using the latest version from the `master` branch for the most up-to-date security patches.

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. **DO NOT** Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### 2. Report Privately

**Email:** security@jsonresume.org (or contact [@thomasdavis](https://github.com/thomasdavis) directly)

**Include:**

- Type of vulnerability (e.g., XSS, SQL injection, authentication bypass)
- Full paths of affected source file(s)
- Location of the affected code (tag/branch/commit/direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact assessment and potential attack scenarios

### 3. Response Timeline

- **Initial Response:** Within 48 hours of report
- **Status Update:** Within 7 days with preliminary assessment
- **Fix Timeline:** Depends on severity
  - **Critical:** 1-7 days
  - **High:** 7-30 days
  - **Medium/Low:** 30-90 days

### 4. Disclosure Policy

- We follow **responsible disclosure** practices
- Security fixes are released as soon as possible
- Public disclosure occurs **after** a fix is available
- We will credit reporters (unless they prefer to remain anonymous)

## Security Best Practices

### For Users

1. **Keep Dependencies Updated**

   ```bash
   pnpm install  # Update to latest versions
   pnpm audit    # Check for vulnerabilities
   ```

2. **Environment Variables**

   - Never commit `.env` files
   - Use strong, unique secrets for production
   - Rotate credentials regularly
   - Use different credentials for dev/staging/production

3. **Authentication**
   - Use OAuth providers (GitHub) for authentication
   - Enable 2FA on your GitHub account
   - Review OAuth app permissions regularly

### For Contributors

1. **Code Review**

   - All code changes require review
   - Security-sensitive changes require extra scrutiny
   - Run `pnpm audit` before submitting PRs

2. **Dependencies**

   - Keep dependencies up to date
   - Review dependency changes carefully
   - Prefer well-maintained packages with active security policies

3. **Sensitive Data**
   - Never log sensitive information (API keys, tokens, passwords)
   - Sanitize user input
   - Use parameterized queries for database operations
   - Validate and escape all user-provided data

## Known Security Considerations

### Current Vulnerabilities

See our [Security Advisory](https://github.com/jsonresume/jsonresume.org/security) page for disclosed vulnerabilities and their status.

**Latest Status:** 11 vulnerabilities (as of latest audit)

- 2 High (in unmaintained theme dependencies - no fixes available)
- 9 Moderate (in theme dependencies)

See [Issue #200](https://github.com/jsonresume/jsonresume.org/issues/200) for details and mitigation strategies.

### Security Measures in Place

- ✅ Regular dependency audits
- ✅ Automated security scanning (Dependabot)
- ✅ HTTPS enforcement
- ✅ OAuth authentication via GitHub
- ✅ Rate limiting on API endpoints
- ✅ Input validation and sanitization
- ✅ CSRF protection
- ✅ XSS prevention (React auto-escaping)

## Security Tools & Resources

- **Dependency Scanning:** `pnpm audit`
- **GitHub Security:** [Security Advisories](https://github.com/jsonresume/jsonresume.org/security)
- **Dependabot:** Automated dependency updates

## Questions?

For general security questions (not vulnerabilities), please open a discussion in our [GitHub Discussions](https://github.com/jsonresume/jsonresume.org/discussions).

---

Last updated: 2025-10-03
