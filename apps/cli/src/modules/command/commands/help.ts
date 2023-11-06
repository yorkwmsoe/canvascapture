import { generatePaddedColumn } from '@lib/utils'
import { commandMap } from '..'
import { Command } from '../types/command'
import { HELP_COMMAND_WIDTH, HELP_DESCRIPTION_WIDTH, HELP_INPUT_WIDTH } from '@constants/base-info'
import { commandCategories } from '../categories'

export const helpCommand = {
    name: 'help',
    description: 'Prints the help of the application',
    run: help,
    category: 'cli',
} satisfies Command

export function help() {
    commandCategories.forEach((category) => {
        console.log(`\n${category.toUpperCase()}:`)
        printCommands(category)
    })
}

function printCommands(category: string) {
    const commands = commandMap.values()
    const commandsInCategory = [...commands].filter((command) => command.category === category)
    commandsInCategory.forEach(printCommand)
}

function printCommand(command: Command) {
    const name = generatePaddedColumn(command.name, HELP_COMMAND_WIDTH)
    const input = generatePaddedColumn(generateInputString(command.inputs), HELP_INPUT_WIDTH)
    const description = generatePaddedColumn(command.description, HELP_DESCRIPTION_WIDTH)
    console.log(`\t${name} ${input} ${description}`)
}

function generateInputString(inputs?: string[]) {
    if (!inputs) return ''
    return inputs.map((input) => `<${input}>`).join(' ')
}
