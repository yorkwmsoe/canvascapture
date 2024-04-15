## Project Setup

### Install

from the root directory not `apps/desktop`

```bash
$ pnpm i
```

### Development

```bash
$ pnpm desktop dev
```

```bash
# For the demo app that shows you how to use most of the libraries in this project
$ pnpm desktop dev:demo
```

#### Adding a new API

1. Create a new file in the `api` folder
2. Add the api to the `spi/store.ts` file
3. Add the api domain to the `connect-src` in the `index.html` file `Content-Security-Policy` meta tag

#### Adding a new page

1. Create a new folder in the `pages` folder
2. Create a `index.tsx` file in the new folder
3. Create a new file in the `routes` folder (ex. `{page}.route.ts`)
4. Add the route to the `root.route.ts` file

### Test

```bash
$ pnpm desktop test
```

```bash
# For the vitest ui
$ pnpm desktop test:ui
```

### Build

```bash
# For windows
$ pnpm desktop build:win

# For macOS
$ pnpm desktop build:mac

# For Linux
$ pnpm desktop build:linux
```

## Coding Standards

[React Handbook](https://reacthandbook.dev/)

Note: the `features` folder is now the `pages` folder