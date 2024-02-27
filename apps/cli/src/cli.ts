import { convertTwoArraysToObject, generateTitle } from '@lib/utils.js'
import { getCommand } from '@modules/command/index.js'
import { ZodError } from 'zod'
import { state } from '@modules/command/state.js'
import { getConfig } from '@lib/config.js'
import { Command } from '@modules/command/types/command.js'
import { AxiosError } from 'axios'
import { logger } from '@lib/logger.js'
import { createInterface } from 'readline/promises'

function loadConfig() {
    const config = getConfig()
    if (!config) {
        console.log('No config found. Please run the setup command.')
    } else {
        state.config = config
    }
}

async function handleCommand({ command, args }: { command: Command | undefined; args: Record<string, string> | undefined }) {
    if (command) {
        try {
            await command.run(args)
        } catch (error) {
            if (state.settings.debug) {
                console.log(error)
            } else if (error instanceof ZodError) {
                error.issues.forEach((issue) => {
                    console.log(`Error <${issue.path[0]}>: ${issue.message}`)
                })
            } else {
                console.log('Something went wrong.')
                if (error instanceof AxiosError) {
                    logger.error(error.code)
                    logger.error(error.config?.url)
                    logger.error(error.message)
                } else {
                    logger.error((error as Error).message)
                }
            }
        }
    } else {
        console.log('Command not found')
    }
}

function parseCommand(result: string) {
    const splitResult = result.split(' ')
    const commandName = splitResult[0].toLowerCase()
    const command = getCommand(commandName)
    const args = command?.inputs ? convertTwoArraysToObject(command.inputs, splitResult.slice(1)) : undefined
    return { command, args }
}

const main = async () => {
    console.log(generateTitle())

    loadConfig()

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const prompt = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const result = await prompt.question('Enter a command: ')
        prompt.close();
        const data = parseCommand(result)
        await handleCommand(data)
    }
}

main()
