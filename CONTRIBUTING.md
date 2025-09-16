# Contributing to Locsync

Thank you for your interest in contributing to Locsync! We welcome contributions from the community.
This document provides guidelines and information for contributors.

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to abide
by its terms.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. Check the [existing issues](https://github.com/wyMinLwin/locsync/issues) to see if it's already
   reported
2. If not, create a new issue with:
    - Clear title and description
    - Steps to reproduce (for bugs)
    - Expected vs actual behavior
    - Environment details (browser, OS, etc.)

### Contributing Code

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Sync upstream** periodically:
    ```bash
    git remote add upstream https://github.com/wyMinLwin/locsync.git || true
    git fetch upstream
    git checkout main
    git pull upstream main
    ```
4. **Create a branch** (prefix with `feat/`, `fix/`, `docs/`, etc.):
    ```bash
    git checkout -b feat/descriptive-name
    ```
5. **Install dependencies**:
    ```bash
    pnpm install
    ```
6. **Write code & tests** (keep changes focused)
7. **Run quality checks**:
    ```bash
    pnpm run lint
    pnpm run build
    ```
8. **Commit** (see Conventional Commits below)
9. **Rebase** on latest `main` if needed:
    ```bash
    git fetch upstream && git rebase upstream/main
    ```
10. **Push & open a PR** with a clear description and rationale

### Development Setup

#### Prerequisites

- Node.js 18+
- pnpm 8+

#### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/locsync.git
cd locsync

# Install dependencies
pnpm install

# Start development
pnpm run build
```

#### Available Scripts

- `pnpm run build` – Build the library (CJS / ESM / UMD)
- `pnpm run clean` – Remove `dist/`
- `pnpm run lint` – ESLint + Prettier check mode
- `pnpm run format` – Auto-format codebase

### Coding Standards

#### TypeScript

- Use TypeScript for all new code
- Follow the existing type definitions in `src/types.ts`
- Use strict type checking

#### Code Style

- Follow the ESLint configuration
- Use Prettier for consistent formatting
- Write clear, descriptive variable and function names
- Add comments for complex logic

#### Commit Messages (Conventional Commits)

Format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Scopes are optional; keep messages imperative and concise.

Examples:

```
feat: add optional change callback
fix: avoid double writes when value unchanged
refactor: simplify key iteration logic
docs: expand advanced usage section
```

If a commit closes an issue:

```
fix: correct key prefix logic (#42)
```

### Testing

- Test your changes in multiple browsers
- Ensure existing functionality still works
- Add tests for new features when possible

### Pull Request Process

Checklist before opening:

- [ ] Builds succeed (`pnpm run build`)
- [ ] Lint passes (`pnpm run lint`)
- [ ] Scope of change documented in README if user-facing
- [ ] No unrelated formatting noise
- [ ] Added / updated examples if feature

PR Template (include these sections):

```
## Summary
Concise explanation of what & why.

## Changes
- bullet list

## Impact
Backward compatible? Any breaking changes?

## Testing
How you verified.
```

Maintainers may request: rebase, squash, or additional tests.

### Release Process (Maintainers)

1. Ensure `main` is green
2. Determine version bump (semver): patch / minor / major
3. Update `CHANGELOG.md`
4. Bump `package.json` version
5. Tag & publish:
    ```bash
    git commit -am "chore(release): vX.Y.Z"
    git tag vX.Y.Z
    git push origin main --tags
    pnpm publish --access public
    ```
6. Announce in release notes

### Areas for Contribution

- **Bug Fixes** – correctness & edge cases (quota, key collisions)
- **Performance** – micro-optimizations, reduced allocations
- **Features** – optional callbacks, adapters, config flags
- **Documentation** – recipes, patterns, comparisons
- **Tooling** – test harness, benchmarks, CI workflows
- **Types** – stricter / safer API surfaces

### Questions?

If you have questions about contributing:

- Check existing issues and discussions
- Create a new discussion for general questions
- Contact maintainers directly

### Quality Guidelines

- Keep bundle size minimal; question additions
- Avoid over-abstraction—prioritize clarity
- Prefer small pure functions over side-effect heavy code
- Document any trade-offs in code comments

### Security & Privacy

- Do not introduce code that implicitly stores sensitive data
- Avoid adding dependencies without justification

Thank you for contributing to Locsync! 🎉
