export const sanitizePath = (pathStr) => {
    return pathStr.replace(/[^0-9a-z-A-Z/\\]/g, "_")
}