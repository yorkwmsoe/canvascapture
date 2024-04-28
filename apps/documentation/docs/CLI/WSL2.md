PBIs
  - https://gitlab.com/msoe.edu/sdl/sdl/canvascapture/-/issues/110

## Preface

Until Bun fixes [their monorepo support on Windows](https://github.com/oven-sh/bun/issues/10013), the CLI will not run on the Windows version of Bun. In the mean time, you can run the CLI on Windows using WSL2, which is a small, well integrated Linux virtual machine developed by Microsoft that you can use to run the Linux version of Bun, which does not have the monorepo issue. Installation and usage is described below.

## Installing

To install WSL2, open powershell and run the following command: `wsl.exe --install`

Now open "Ubuntu", which was installed by running the previous command, from the start menu. It will prompt you to create a password, where you can put whatever you'd like (I'd recommend using the same password that you use for the computer itself).

Then run the following commands to install nodejs, pnpm, and bun:

`sudo apt update && sudo apt install nodejs`

`npm install -g pnpm`

`curl -fsSL https://bun.sh/install | bash`

## Usage

Use `cd` and `ls` to navigate to the project root, then run `pnpm install && pnpm package && pnpm install` like usual to install the packages. From there, you can launch the CLI with `pnpm cli start`, and the CLI should run without issue.