import { VERSION_TEXT } from "@constants/base-info";
import { Command } from "../types/command";

export const versionCommand = {
  name: "version",
  description: "Prints the version of the application",
  run: version,
} satisfies Command;

export function version() {
  console.log(`v ${VERSION_TEXT}`);
}
