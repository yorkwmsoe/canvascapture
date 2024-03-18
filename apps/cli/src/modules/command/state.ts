import { Assignment, Course } from '@canvas-capture/lib'
import { Settings, defaultSettings } from '@constants/settings'
import { Config, defaultConfig } from '@lib/config'

export type State = {
    courses?: Course[]
    assignments?: Assignment[]
    settings: Settings
    config: Config
}

export const state: State = {
    courses: undefined,
    assignments: undefined,
    settings: defaultSettings,
    config: defaultConfig,
}
