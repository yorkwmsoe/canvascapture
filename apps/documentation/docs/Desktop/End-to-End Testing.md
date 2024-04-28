PBIs
  - https://gitlab.com/msoe.edu/sdl/sdl/canvascapture/-/issues/97

## Running

The End-to-End (e2e) tests are not part of the pipeline, as they take a long time to run, and it is difficult to run Electron, which these tests use, in a Docker container. Instead, run them on your computer as described below.

To run the e2e tests, run the following command:  
```pnpm install && pnpm package && pnpm install && pnpm desktop build:linux --dir && pnpm desktop wdio```

Broken down:
  - `pnpm install && pnpm package && pnpm install`: installs everything, including the private module.
  - `pnpm desktop build:linux --dir`: Uses electron-builder to create an unpackaged, built variant of the desktop app, which will be used by webdriverio. Specifying `--dir` avoids creating exes, debs, and other types of packages that take a lot of time and which webdriverio doesn't need. Replace `linux` with `windows` or `mac` if you are testing on those platforms.
  - `pnpm desktop wdio`: Runs webdriverio, which actually runs the tests.

## Troubleshooting

If the tests do not run, try running them in Linux (in a VM, WSL2, or bare-metal), ideally on something Debian-based (Debian or Ubuntu). Additionally, try removing the `node_modules` folders (root of the project, desktop folder, cli folder, and private module folder), and if that doesn't work, also remove the pnpm cache (on Linux, this is located in: `~/.local/share/pnpm/store`).