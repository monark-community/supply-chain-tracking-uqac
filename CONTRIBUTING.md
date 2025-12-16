# Contributing to ChainProof

Thank you for your interest in contributing to **ChainProof**! We welcome contributions of all kinds: bug reports, feature requests, documentation improvements, and code.

By contributing, you agree to the following terms and that your contributions will be made available under the project's [LICENSE](./LICENSE) (Apache License 2.0).

---

## 1. How to Contribute

1. **Fork the repository** and create a feature branch:

```bash
git checkout -b feature/my-feature
```

2. **Make your changes** following the project's code style and tests.

3. **Commit your changes** using conventional commit messages:

```bash
git commit -m "feat: short descriptive message"
```

4. **Push your branch** to your fork:

```bash
git push origin feature/my-feature
```

5. **Open a Pull Request** against the `main` branch of this repository and fill the PR template (if present).

---

## 2. Code Style

- Follow existing project formatting and lint rules. Run linters before submitting.
- Keep functions small and well-documented. Add tests where appropriate.
- If you add or modify API routes, keep OpenAPI-style comments up to date in `backend/src/routes/`.

## 3. Commit Messages

- Follow Conventional Commits (https://www.conventionalcommits.org/). Examples:
  - `feat: add new verification endpoint`
  - `fix: correct db query for units`
  - `chore: update dependencies`

## 4. Reporting Issues

- Use the **Issues** tab to report bugs or request features.
- Provide steps to reproduce, expected behavior, and screenshots or logs when possible.

---

## 5. Pull Request Checklist

- [ ] Code builds and passes local tests
- [ ] Linting/formatting applied
- [ ] Relevant documentation updated (`README.md`, `mock-blockchain/README.md`, or API comments)
- [ ] PR description explains the why and what

---

## 6. Legal / Licensing

- By contributing, you agree that your contributions will be licensed under the project's [LICENSE](./LICENSE) (Apache License 2.0).
- Do not submit code that you do not have the right to contribute (e.g., proprietary code from your employer) unless you have explicit permission.

Example copyright notice for substantial contributions:

```text
Copyright [Year] [Contributor Name]
Licensed under the Apache License, Version 2.0
```

---

## 7. Code of Conduct

We expect all contributors to follow a respectful and collaborative approach. See `CODE_OF_CONDUCT.md` for details.

---

Thank you for helping improve **ChainProof**! Your contributions are highly appreciated.
