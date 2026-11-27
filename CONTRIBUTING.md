# Contributing Guide

Thank you for considering contributing to **Layered Shade**! 🎉 Everyone is welcome: first-time contributors, designers, translators and people who only want to report a bug.

## 🌱 Your first contribution

- **No code needed:** report a bug, suggest a feature, improve a sentence in the docs or fix a translation. [Open an issue](https://github.com/Franklyn-R-Silva/Layered-Shade/issues/new/choose).
- **Small code change:** pick an issue labelled [good first issue](https://github.com/Franklyn-R-Silva/Layered-Shade/labels/good%20first%20issue). Each one names the files to touch and says when it is done.
- **Not sure where to start?** Comment on any issue and ask; you will get an answer.

Every pull request starts from an issue, so the change is agreed before the work. Comment on the issue to say you are taking it, and put `Closes #<issue>` in the pull request.

[🇧🇷 Português](docs/pt-BR/CONTRIBUTING.md)

## 📋 How to Contribute

### 1. Fork and Clone

```bash
# Fork the project on GitHub, then:
git clone https://github.com/YOUR-USERNAME/Layered-Shade.git
cd Layered-Shade
```

### 2. Install Dependencies

```bash
npm ci   # installs exactly what package-lock.json pins (Node 20.19+)
```

### 3. Create a Branch

```bash
git checkout -b feature/my-new-feature
```

### 4. Make Your Changes

- Follow the existing code style and architecture (pure logic in `src/lib/shadow.ts`, UI in `src/lib/components/`)
- **Every behavior change comes with tests**: logic changes get unit tests in `src/lib/shadow.test.ts`; UI behavior gets a case in `src/App.test.ts`. Bug fixes include a test that fails without the fix.
- Before opening the PR, all of these must pass (CI runs the same on every pull request and blocks the merge otherwise):

  ```bash
  npm run lint    # ESLint, zero warnings allowed
  npm run check   # svelte-check type-check, zero warnings allowed
  npm test        # Vitest
  npm run build   # production build
  ```

### 5. Commit and Push

```bash
git add .
git commit -m "feat: add new feature X"
git push origin feature/my-new-feature
```

### 6. Open a Pull Request

Go to the original repository and open a PR describing your changes.

---

## 📏 Code Standards

### TypeScript and Svelte

- TypeScript everywhere; Svelte 5 components with runes (`$state`, `$derived`, `$props`)
- Keep `src/lib/shadow.ts` free of Svelte and DOM so it stays unit-testable
- Variable names in `camelCase`, components in `PascalCase`
- A short doc comment on every exported function
- UI copy in Portuguese (pt-BR); docs in English with a pt-BR mirror under `docs/pt-BR/`

### CSS

- Use the tokens in `src/styles/variables.css`; the visual system is described in [DESIGN.md](DESIGN.md)
- Global CSS by class name, one module per region in `src/styles/modules/`
- Every control keeps a visible label, keyboard access and a visible focus state

### Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type        | Description                  |
| ----------- | ---------------------------- |
| `feat:`     | New feature                  |
| `fix:`      | Bug fix                      |
| `docs:`     | Documentation                |
| `style:`    | Formatting (no logic change) |
| `refactor:` | Code refactoring             |
| `test:`     | Adding/fixing tests          |
| `chore:`    | Maintenance tasks            |

---

## 🧪 Running Tests

```bash
# Run tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

---

## 🐛 Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/Franklyn-R-Silva/Layered-Shade/issues)
2. If not, open a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)

---

## 💡 Suggesting Features

Open an [Issue](https://github.com/Franklyn-R-Silva/Layered-Shade/issues) with the `enhancement` label describing:

- The problem the feature solves
- How you imagine it would work
- Alternatives considered

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
