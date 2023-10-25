import { CONFIG_FILE_NAME } from '@constants/base-info'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { getPaths } from './utils'

export const getConfigPath = () => `${getPaths().config}`

export const getConfigFile = () => `${getConfigPath()}/${CONFIG_FILE_NAME}`

export type Config = {
    canvasDomain: string | undefined
    canvasApiToken: string | undefined
}

export const defaultConfig: Config = {
    canvasDomain: 'https://msoe.instructure.com',
    canvasApiToken: undefined,
}

export const doesConfigExist = () => {
    return existsSync(getConfigFile())
}

export const getConfig = () => {
    const file = getConfigFile()

    if (!doesConfigExist()) return

    return JSON.parse(readFileSync(file, 'utf-8')) as Config
}

export const setConfig = (config: Config) => {
    const path = getConfigPath()
    const file = getConfigFile()

    if (!doesConfigExist()) mkdirSync(path, { recursive: true })

    return writeFileSync(file, JSON.stringify(config, null, 2))
}
