import { input } from '@inquirer/prompts'
import { Command } from '../types/command.js'
import { state } from '../state.js'
import { Config, setConfig } from '@lib/config.js'

export const setupCommand = {
    name: 'setup',
    description: 'Setup the CLI',
    run: setup,
    category: 'cli',
} satisfies Command

export async function setup() {
    const config = state.config
    const temp = new Map(Object.entries(config))
    for (const key of temp.keys()) {
        const answer = await input({ message: `Enter ${key}`, default: temp.get(key) })
        temp.set(key, answer)
    }
    state.config = Object.fromEntries(temp.entries()) as Config
    setConfig(state.config)
}
