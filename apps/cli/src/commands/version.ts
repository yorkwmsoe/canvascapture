import type { CommandBuilder } from "yargs";
import { VERSION } from "../constants/base-info";

export const command: string = "version";
export const desc: string = "Outputs the version number of the CLI";

export const builder: CommandBuilder = (yargs) => yargs;

export const handler = (): void => {
  process.stdout.write(`v ${VERSION}\n`);
  process.exit(0);
};
