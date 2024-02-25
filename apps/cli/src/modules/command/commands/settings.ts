import { checkbox } from '@inquirer/prompts'
import { Command } from '../types/command.js'
import { state } from '../state.js'

export const settingsCommand = {
    name: 'settings',
    description: 'Enable or disable settings',
    run: settings,
    category: 'cli',
} satisfies Command

export async function settings() {
    const answer = await checkbox({
        message: 'What settings should be used?',
        choices: Object.entries(state.settings).map((setting) => {
            return { name: setting[0], value: setting[0], checked: setting[1] }
        }),
    })

    const newSettings = Object.entries(state.settings).map((setting) => {
        return { [setting[0]]: answer.includes(setting[0]) }
    })

    state.settings = Object.assign({}, ...newSettings)
}
