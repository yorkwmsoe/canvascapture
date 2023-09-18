import { Command } from "../types/command";

export const exitCommand = {
  name: "exit",
  description: "Exits the application",
  run: exit,
} satisfies Command;

export function exit() {
  process.exit(0);
}
