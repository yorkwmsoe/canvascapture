# Build

These instructions are for building & packaging the project.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.0.0 or later)

## Build

cd into the `apps\cli` directory.

1. Install dependencies:

   ```sh
   npm install
   ```

2. Build the project:

   ```sh
   npm run build
   ```

3. The built files are in the `build` directory.

## Package

1. Package the project to an executable file:

   ```sh
    npm run package:{platform}-{arch}
   ```

   - Replace `{platform}` with `linux`, `win`, `macos`.
   - Replace `{arch}` with `x64`, `arm64`.

2. The executable file is in the `release` directory.

3. Run the executable file.
