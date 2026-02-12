```markdown
# Contributing

Thanks for your interest in contributing to the Mini E-Commerce API. Follow these guidelines to make collaboration smooth and efficient.

## How to contribute

1. Fork the repository and create a branch for your change:
   - git checkout -b feature/your-feature
2. Make your changes and add tests where appropriate.
3. Run the test suite:
   - npm install
   - npm test
4. Commit your changes with a descriptive message:
   - git commit -m "feat: add X"
5. Push your branch and open a Pull Request against `main`.

## Branching & PR rules

- Base development on `main`.
- Use feature branches named `feature/*` or `fix/*`.
- Each PR should contain:
  - A clear title and description
  - The problem you are solving and how you solved it
  - Any migration or DB changes
  - Basic steps to reproduce
- Keep PRs small and focused for easier review.

## Coding style

- JavaScript (Node.js) — follow standard ESLint rules if present.
- Use consistent indentation (2 spaces).
- Add JSDoc comments for complex functions.

## Tests

- Add unit/integration tests for new features and bug fixes.
- Tests should be runnable with `npm test`.
- Cover authentication, critical business logic (orders, stock deduction), and public endpoints.

## Security

- Do NOT commit secrets (API keys, passwords, JWT secrets). Use `.env` and add it to `.gitignore`.
- If secrets are accidentally committed, rotate them immediately and notify maintainers.

## Reporting bugs

- Open an issue with:
  - Title
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Logs or screenshots if applicable

## Getting help

If you need help, open an issue describing your question or join the project maintainers by requesting review on your PR.
```