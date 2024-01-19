# Canvas Capture Desktop

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

```bash
# For the demo app that shows you how to use most of the libraries in this project
$ npm run dev:demo
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
$ npm run test
```

```bash
# For the vitest ui
$ npm run test:ui
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Coding Standards

[React Handbook](https://reacthandbook.dev/)

Note: the `features` folder is now the `pages` folder

## Project Libraries

- [TanStack Router](https://tanstack.com/router/v1/docs/overview)
- [Ant Design](https://ant.design/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Redux Toolkit](https://redux-toolkit.js.org/)
