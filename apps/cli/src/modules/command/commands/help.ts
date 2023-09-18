import { commandMap } from "..";
import { Command } from "../types/command";

export const helpCommand = {
  name: "help",
  description: "Prints the help of the application",
  run: help,
} satisfies Command;

export function help() {
  commandMap.forEach((command) => {
    console.log(
      `${command.name} ${generateInputString(command.inputs)} - ${
        command.description
      }`
    );
  });
}

function generateInputString(inputs?: string[]) {
  if (!inputs) return "";
  return inputs.map((input) => `<${input}>`).join(" ");
}
