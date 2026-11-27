# Security Policy

[🇧🇷 Português](docs/pt-BR/SECURITY.md)

## Supported versions

Only the latest release, deployed at [layeredshade.netlify.app](https://layeredshade.netlify.app/), gets fixes.

| Version | Supported |
| ------- | --------- |
| 2.x     | ✅ Yes    |
| < 2.0   | ❌ No     |

## Reporting a vulnerability

Please **do not** open a public issue. Report it privately, in either of these ways:

1. **GitHub**: open the [Security tab](https://github.com/Franklyn-R-Silva/Layered-Shade/security) and click **Report a vulnerability** (private vulnerability reporting is enabled).
2. **E-mail**: `franklyn.dev.mobile@gmail.com`

Include a description of the issue, steps to reproduce, the potential impact and a suggested fix if you have one.

### Response time

- **Acknowledgment**: within 48 hours
- **Initial assessment**: within 1 week
- **Resolution**: depends on severity

You will be kept updated and credited in the fix if you want.

## Scope

Layered Shade is a static frontend tool with no backend. Relevant issues include:

- XSS (cross-site scripting) or code injection through the generated code or the UI
- Vulnerable dependencies (npm, GitHub Actions)
- Weaknesses in the deployed HTTP headers

## What the project does

- No user data is collected or stored; there is no backend, database or analytics.
- The site is served with a Content Security Policy that only allows the app's own scripts, styles and fonts, plus `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, a strict referrer policy and a permissions policy (see `netlify.toml`).
- Fonts are self-hosted; the page loads nothing from third parties.
- Dependabot alerts and grouped security updates, secret scanning with push protection, and CodeQL code scanning are enabled on the repository.
- CI installs from the lockfile (`npm ci`) and runs lint, tests and a type-checked build on every pull request.
