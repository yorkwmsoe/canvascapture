import { CONFIG_FILE_NAME } from '@renderer/utils/base-info'
import { app } from '@electron/remote'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'

// DO NOT CHANGE AFTER RELEASE (BREAKS CONFIG)
export const getConfigPath = () => app.getPath('userData')

export const getConfigFile = () => `${getConfigPath()}/${CONFIG_FILE_NAME}`

export type Config = {
  canvasDomain: string
  canvasAccessToken: string
  markdownEditor: boolean
}

export const defaultConfig: Config = {
  canvasDomain: 'https://msoe.instructure.com',
  canvasAccessToken: undefined,
  markdownEditor: false
}

export const doesConfigExist = () => {
  return existsSync(getConfigFile())
}

export const getConfig = () => {
  const file = getConfigFile()

  if (!doesConfigExist()) return defaultConfig

  return JSON.parse(readFileSync(file, 'utf-8')) as Config
}

export const setConfig = (config: Config) => {
  const path = getConfigPath()
  const file = getConfigFile()

  if (!doesConfigExist()) mkdirSync(path, { recursive: true })

  return writeFileSync(file, JSON.stringify(config, null, 2))
}