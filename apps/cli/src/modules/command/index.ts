import { Command } from "./types/command";
import {
  helpCommand,
  versionCommand,
  greetCommand,
  exitCommand,
} from "./commands";

export const commands = {
  [helpCommand.name]: helpCommand,
  [versionCommand.name]: versionCommand,
  [greetCommand.name]: greetCommand,
  [exitCommand.name]: exitCommand,
} satisfies Record<string, Command>;

export const commandMap = new Map<string, Command>(Object.entries(commands));

export const getCommand = (commandName: string) => commandMap.get(commandName);
