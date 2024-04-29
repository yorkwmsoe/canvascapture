import { it, expect } from 'vitest'
import { describe } from 'node:test'
import { sanitizePath } from '../sanitize-path'

describe('sanitizePath', () => {
    it('should return path with _ instead of spaces', () => {
        expect(sanitizePath('path with spaces')).toBe('path_with_spaces')
    })
})
