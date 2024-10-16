import gradient from 'gradient-string'
import figlet from 'figlet'
import { theme } from '@constants/theme'
import { TITLE_TEXT } from '@constants/base-info'

export function generateTitle() {
    const titleGradient = gradient(Object.values(theme))
    return titleGradient.multiline(figlet.textSync(TITLE_TEXT, { font: 'Standard' }))
}

export const convertTwoArraysToObject = <T, U>(array1: T[], array2: U[]): Record<string, U> => {
    const map = new Map<T, U>()
    array1.forEach((value, index) => {
        map.set(value, array2[index])
    })
    return Object.fromEntries(map)
}

export const generatePaddedColumn = (column: string, width: number) => {
    const padding = width - column.length
    const paddingString = padding > 0 ? ' '.repeat(padding) : ''
    return `${column}${paddingString}`
}
