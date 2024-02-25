import { Command } from './types/command.js'
import { helpCommand, versionCommand, greetCommand, exitCommand, coursesCommand, assignmentsCommand, generateCommand } from './commands/index.js'
import { settingsCommand } from './commands/settings.js'
import { setupCommand } from './commands/setup.js'

export const commands = {
    [helpCommand.name.toLowerCase()]: helpCommand,
    [versionCommand.name.toLowerCase()]: versionCommand,
    [greetCommand.name.toLowerCase()]: greetCommand,
    [exitCommand.name.toLowerCase()]: exitCommand,
    [coursesCommand.name.toLowerCase()]: coursesCommand,
    [assignmentsCommand.name.toLowerCase()]: assignmentsCommand,
    [generateCommand.name.toLowerCase()]: generateCommand,
    [settingsCommand.name.toLowerCase()]: settingsCommand,
    [setupCommand.name.toLowerCase()]: setupCommand,
} satisfies Record<string, Command>

export const commandMap = new Map<string, Command>(Object.entries(commands))

export const getCommand = (commandName: string) => commandMap.get(commandName)
