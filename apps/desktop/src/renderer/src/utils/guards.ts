/**
 * Defines the isKeyArray method
 *
 * See the definition below for more details
 */
export function isKeyArray(value: unknown): value is React.Key[] {
    return Array.isArray(value)
}
