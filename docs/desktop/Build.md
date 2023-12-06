# Build

These instructions are for building & packaging the project.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.0.0 or later)
- [Rust](https://www.rust-lang.org/tools/install) (v1.73.0 or later)

## Build

cd into the `apps\desktop` directory.

1. Install dependencies:

   ```sh
   npm install
   ```

2. Build the project:

   ```sh
   npm run tauri build
   ```

3. The executable files are in the `src-tauri\target\release` directory.
