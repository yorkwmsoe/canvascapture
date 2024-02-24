import { generate, median } from '../generate'
import * as generateFunctions from '../generate'
import { testCourses, testAssignments, testSubmissions } from '../../command/commands/tests/data'
import { state } from '@modules/command/state'

jest.mock('@modules/canvas_api/api', () => ({
    getSubmissions: jest.fn(() => testSubmissions),
}))

jest.mock('fs', () => ({
    rmSync: jest.fn().mockReturnValue(undefined),
    mkdirSync: jest.fn().mockReturnValue(undefined),
    writeFileSync: jest.fn().mockReturnValue(undefined),
}))

describe('generate', () => {
    it('should log no courses selected', async () => {
        state.courses = []
        const log = jest.spyOn(console, 'log')

        await generate([], [], '', '', '', '')

        expect(log).toHaveBeenCalledWith('No courses selected')
    })
    it('should log no assignments selected', async () => {
        const log = jest.spyOn(console, 'log')

        await generate([testCourses[0]], [], '', '', '', '')

        expect(log).toHaveBeenCalledWith(`No assignments selected for course ${testCourses[0].name}`)
    })
    it('should generate an assignment', async () => {
        const generatePairs = jest.spyOn(generateFunctions, 'generatePairs')

        await generate(testCourses, testAssignments, '', '', '', '')

        expect(generatePairs).toHaveBeenCalledTimes(testAssignments.length)
    })
})

describe('median', () => {
    it('should be a valid median function', () => {
        expect(median([1])).toBe(1)
        expect(median([1, 2])).toBe(2)
        expect(median([1, 2, 3])).toBe(2)
    })
})

describe('generatePairs', () => {
    it('should return high, median, and low', async () => {
        const submissions = testSubmissions
        const pairs = await generateFunctions.generatePairs(testAssignments[0], submissions, undefined, '', '', '')
        expect(pairs.length).toEqual(3)
        expect(pairs.find((x) => x.filePath.includes('high'))).toBeDefined()
        expect(pairs.find((x) => x.filePath.includes('median'))).toBeDefined()
        expect(pairs.find((x) => x.filePath.includes('low'))).toBeDefined()
    })

    it('should return high and low', async () => {
        const submissions = [testSubmissions[0], testSubmissions[1]]
        const pairs = await generateFunctions.generatePairs(testAssignments[0], submissions, undefined, '', '', '')
        expect(pairs.length).toEqual(2)
        expect(pairs.find((x) => x.filePath.includes('high'))).toBeDefined()
        expect(pairs.find((x) => x.filePath.includes('low'))).toBeDefined()
    })

    it('should return high', async () => {
        const submissions = [testSubmissions[0]]
        const pairs = await generateFunctions.generatePairs(testAssignments[0], submissions, undefined, '', '', '')
        expect(pairs.length).toEqual(1)
        expect(pairs.find((x) => x.filePath.includes('high'))).toBeDefined()
    })
})
