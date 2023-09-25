import { Command } from "../types/command";

export const exitCommand = {
  name: "exit",
  description: "Exits the application",
  run: exit,
  category: "cli",
} satisfies Command;

export function exit() {
  process.exit(0);
}
