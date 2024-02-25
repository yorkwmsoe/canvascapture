import { Course } from '../canvas_api/types/course.js'
import { Assignment } from '../canvas_api/types/assignment.js'
import { Settings, defaultSettings } from '@constants/settings.js'
import { Config, defaultConfig } from '@lib/config.js'

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
