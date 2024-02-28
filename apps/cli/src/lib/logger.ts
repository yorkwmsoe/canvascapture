import { LOG_FILE } from '@constants/base-info'
import { existsSync, truncateSync } from 'fs'
import pino from 'pino'

function getLogger() {
    if (existsSync(LOG_FILE)) truncateSync(LOG_FILE, 0)
    return pino(
        {
            timestamp: pino.stdTimeFunctions.isoTime,
        },
        pino.destination({
            dest: LOG_FILE,
            sync: false,
        })
    )
}

export const logger = getLogger()
