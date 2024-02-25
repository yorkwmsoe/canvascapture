import { expect, describe, it, vi } from 'vitest'
import { VERSION_TEXT } from '@constants/base-info.js'
import { version } from '../version.js'

describe('version', () => {
    it('should return the version', () => {
        const log = vi.spyOn(console, 'log').mockImplementation(() => {})
        version()
        expect(log).toHaveBeenCalledWith(`v ${VERSION_TEXT}`)
    })
})
