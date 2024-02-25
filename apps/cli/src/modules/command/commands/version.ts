import { VERSION_TEXT } from '@constants/base-info.js'
import { Command } from '../types/command.js'

export const versionCommand = {
    name: 'version',
    description: 'Prints the version of the application',
    run: version,
    category: 'cli',
} satisfies Command

export function version() {
    console.log(`v ${VERSION_TEXT}`)
}
