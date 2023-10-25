import { state } from '@modules/command/state'

export const getCanvasDomain = () => {
    return process.env.CANVAS_DOMAIN ?? state.config.canvasDomain
}

export const getCanvasApiToken = () => {
    return process.env.CANVAS_ACCESS_TOKEN ?? state.config.canvasApiToken
}

export const getCanvasApiBaseUrl = () => {
    return getCanvasDomain() + '/api/v1'
}

export const getMode = () => {
    return (process.env.MODE as 'dev' | 'prod') ?? 'prod'
}
