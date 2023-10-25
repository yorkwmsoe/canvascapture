import { convertTwoArraysToObject, generateTitle, prompt } from '@lib/utils'
import { getCommand } from '@modules/command'
import { ZodError } from 'zod'
import * as dotenv from 'dotenv'
import { state } from '@modules/command/state'
import { getMode } from 'env'
import { getConfig } from '@lib/config'
import { Command } from '@modules/command/types/command'

dotenv.config({ path: `${__dirname.replace('src', '')}.env` })

async function loadConfig() {
    if (getMode() === 'prod') {
        const config = getConfig()
        if (!config) {
            console.log('No config found. Please run the setup command.')
        } else {
            state.config = config
        }
    } else if (getMode() === 'dev') {
        console.log('Running in development mode')
        console.log('Using .env file for values')
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

    await loadConfig()

    while (true) {
        const result = prompt('Enter a command: ')
        const data = parseCommand(result)
        await handleCommand(data)
    }
}

main()
