export const sanitizePath = (pathStr: string) => {
    return pathStr.replace(/[^0-9a-z-A-Z/\\]/g, '_')
}
