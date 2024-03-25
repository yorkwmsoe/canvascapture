import { expect, describe, test, vi } from 'vitest'
import { exit } from '../exit'

describe('exit', () => {
    test('exit', () => {
        // @ts-expect-error(TS2345)
        const processExit = vi.spyOn(process, 'exit').mockImplementation(() => {})
        exit()
        expect(processExit).toBeCalledTimes(1)
        expect(processExit).toBeCalledWith(0)
    })
})
