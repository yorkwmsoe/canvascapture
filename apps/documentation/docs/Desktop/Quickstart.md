## Project Setup

### Install

Follow the instructions on the [Getting Started Quickstart page](/sdl/sdl/canvascapture/docs/Getting%20Started/Quickstart) (if you haven't already done so).

### Development
Use the following command to run your locally developed version of the application:

```bash
pnpm desktop dev
```

#### Changing the Canvas Domain

1. Navigate to `apps/desktop/src/renderer/src/utils/base-info.ts`
2. Change the `CANVAS_DOMAIN` constant to your Canvas domain
   1. Example: `export const CANVAS_DOMAIN = 'http://sdlstudentvm09.msoe.edu/'` for the development Canvas instance
   2. **Remember to change the constant back before publishing a new release.**
3. Navigate to `apps/desktop/src/renderer/index.html`
4. Add your Canvas domain to the `connect-src` in the `Content-Security-Policy` meta tag
5. Run `pnpm desktop dev` (if it is not already running)
6. Input your Canvas Access Token from your Canvas instance into the Settings page of the application (if you haven't already done so)

#### Adding a new page

1. Create a new folder in the `pages` folder
2. Create a `index.tsx` file in the new folder
3. Create a new file in the `routes` folder (ex. `{page}.route.ts`)
4. Add the route to the `root.route.ts` file

### Test

```bash
pnpm desktop test
```

```bash
# For the vitest ui
pnpm desktop test:ui
```

### Build

```bash
# For windows
pnpm desktop build:win

# For macOS
pnpm desktop build:mac

# For Linux
pnpm desktop build:linux
```

## Coding Standards

[React Handbook](https://reacthandbook.dev/)
