# insider-one-champions-league-web

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

## Available Scripts

### Development

| Command           | Description                                               |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Start Vite dev server with hot-reload at `localhost:5173` |
| `npm run build`   | Type-check and produce a production build in `dist/`      |
| `npm run preview` | Preview the production build locally                      |

### Testing

| Command                | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `npm run test:unit`    | Run Vitest in interactive watch mode (use during development) |
| `npm run test:unit:ci` | Run Vitest once and exit (used by CI)                         |

### Type Checking

| Command              | Description                                                    |
| -------------------- | -------------------------------------------------------------- |
| `npm run type-check` | Run `vue-tsc` to type-check the project without emitting files |

### Linting & Formatting

| Command                | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `npm run lint`         | Run all linters with auto-fix (Oxlint then ESLint)      |
| `npm run lint:check`   | Run all linters in check-only mode (used by CI)         |
| `npm run format`       | Format `src/` with Prettier (writes changes)            |
| `npm run format:check` | Check if `src/` is formatted; fails if not (used by CI) |

### Git Hooks

Hooks are managed by [Husky](https://typicode.github.io/husky/) and install automatically via the `prepare` script after `npm install`.

| Hook         | What it runs                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `pre-commit` | [lint-staged](https://github.com/lint-staged/lint-staged) — ESLint + Prettier on staged files                           |
| `commit-msg` | [commitlint](https://commitlint.js.org/) — enforces [Conventional Commits](https://www.conventionalcommits.org/) format |

### Allowed Commit Types

`feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore` · `ci` · `build`
