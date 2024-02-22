export function isKeyArray(value: unknown): value is React.Key[] {
    return Array.isArray(value)
}
