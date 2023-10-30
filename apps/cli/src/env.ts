import { state } from '@modules/command/state'

export const getCanvasDomain = () => {
    return state.config.canvasDomain
}

export const getCanvasApiToken = () => {
    return state.config.canvasApiToken
}

export const getCanvasApiBaseUrl = () => {
    return getCanvasDomain() + '/api/v1'
}
