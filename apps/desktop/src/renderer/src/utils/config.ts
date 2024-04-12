import { CONFIG_FILE_NAME } from '@renderer/utils/base-info'
import { app } from '@electron/remote'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// DO NOT CHANGE AFTER RELEASE (BREAKS CONFIG)
export const getConfigPath = () => app.getPath('userData')

export const getConfigFile = () => join(getConfigPath(), CONFIG_FILE_NAME)

export const getDocumentsPath = () =>
    join(app.getPath('documents'), 'canvas-capture-desktop')

export type Config = {
    canvasDomain: string
    canvasAccessToken: string
    markdownEditor: boolean
    isStudent: boolean
}

export const defaultConfig: Config = {
    canvasDomain: 'https://msoe.instructure.com',
    canvasAccessToken: '',
    markdownEditor: false,
    isStudent: false,
}

export const doesConfigExist = () => {
    return existsSync(getConfigFile())
}

export const getConfig = () => {
    const file = getConfigFile()

    if (!doesConfigExist()) return defaultConfig

    try {
        return JSON.parse(readFileSync(file, 'utf-8')) as Config
    } catch (e) {
        return defaultConfig
    }
}

export const setConfig = (config: Config) => {
    const path = getConfigPath()
    const file = getConfigFile()

    if (!doesConfigExist()) mkdirSync(path, { recursive: true })

    return writeFileSync(file, JSON.stringify(config, null, 2))
}
