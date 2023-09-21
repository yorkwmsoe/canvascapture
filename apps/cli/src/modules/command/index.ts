import { Command } from "./types/command";
import {
  helpCommand,
  versionCommand,
  greetCommand,
  exitCommand,
  coursesCommand,
} from "./commands";

export const commands = {
  [helpCommand.name.toLowerCase()]: helpCommand,
  [versionCommand.name.toLowerCase()]: versionCommand,
  [greetCommand.name.toLowerCase()]: greetCommand,
  [exitCommand.name.toLowerCase()]: exitCommand,
  [coursesCommand.name.toLowerCase()]: coursesCommand,
} satisfies Record<string, Command>;

export const commandMap = new Map<string, Command>(Object.entries(commands));

export const getCommand = (commandName: string) => commandMap.get(commandName);
