# Build

These instructions are for building & packaging the project.

## Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18.0.0 or later)

## Build

1. Install dependencies (from the root directory not `apps/cli`):

```bash
$ pnpm i
```

2. Build the project:

```bash
$ pnpm cli build
```

3. The built files are in the `build` directory.

## Package

1. Package the project to an executable file:

```bash
$ pnpm cli package:{platform}-{arch}
```

    - Replace `{platform}` with `linux`, `win`, `macos`.
    - Replace `{arch}` with `x64`, `arm64`.

1. The executable file is in the `release` directory.

2. Run the executable file.