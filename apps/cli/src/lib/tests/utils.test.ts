import { expect, describe, test, vi } from 'vitest'
import { convertTwoArraysToObject, generatePaddedColumn, generateTitle } from '@lib/utils.js'
import { textSync } from 'figlet'

vi.mock('figlet', () => ({
    textSync: vi.fn(),
}))

describe('convertTwoArraysToObject', () => {
    test('two empty array = empty object', () => {
        expect(convertTwoArraysToObject([], [])).toMatchObject({})
    })

    test('two arrays with same length', () => {
        expect(convertTwoArraysToObject(['a', 'b'], [1, 2])).toMatchObject({
            a: 1,
            b: 2,
        })
    })

    test('two arrays with different length', () => {
        expect(convertTwoArraysToObject(['a', 'b'], [1, 2, 3])).toMatchObject({
            a: 1,
            b: 2,
        })
    })
})

describe('generatePaddedColumn', () => {
    test('empty string', () => {
        expect(generatePaddedColumn('', 10)).toBe('          ')
    })

    test('string with length less than column length', () => {
        expect(generatePaddedColumn('abc', 10)).toBe('abc       ')
    })

    test('string with length equal to column length', () => {
        expect(generatePaddedColumn('abcdefghij', 10)).toBe('abcdefghij')
    })

    test('string with length greater than column length', () => {
        expect(generatePaddedColumn('abcdefghijk', 10)).toBe('abcdefghijk')
    })
})

describe('generateTitle', () => {
    test('generate title', () => {
        expect(generateTitle()).toBeDefined()
        expect(textSync).toBeCalledTimes(1)
    })
})
