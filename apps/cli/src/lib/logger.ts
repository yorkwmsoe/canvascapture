import { truncateSync } from 'fs'
import pino from 'pino'

function getLogger() {
    truncateSync('./canvas-capture.log', 0)
    return pino(
        {
            timestamp: pino.stdTimeFunctions.isoTime,
        },
        pino.destination({
            dest: './canvas-capture.log',
            sync: false,
        })
    )
}

export const logger = getLogger()
