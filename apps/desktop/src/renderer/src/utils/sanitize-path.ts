/**
 * Defines the sanitizePath method
 *
 * See the definition below for more details
 */
export const sanitizePath = (pathStr: string) => {
    return pathStr.replace(/[^0-9a-z-A-Z/\\]/g, '_')
}
