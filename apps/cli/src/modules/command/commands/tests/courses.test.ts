import { expect, describe, it, vi } from 'vitest'
import { checkbox, getCourses, getAssignments } from './mocks'
import { select_courses } from '../courses'
import { testCourses, testAssignments } from './data'
import { state } from '@modules/command/state'
const { execSync } = require('child_process')

describe('courses', () => {
    it('should return a course', async () => {
        checkbox.mockReturnValue([testCourses[0].id])
        getCourses.mockReturnValue(Promise.resolve(testCourses))
        getAssignments.mockReturnValue(Promise.resolve(testAssignments))

        await select_courses()

        expect(state.courses).toMatchObject(testCourses)
    })
    it('should filter out courses with no assignments', async () => {
        checkbox.mockReturnValue([testCourses[0].id])
        getCourses.mockReturnValue(Promise.resolve(testCourses))
        getAssignments.mockReturnValue(Promise.resolve([]))

        await select_courses()

        expect(state.courses).toBeUndefined()
    })
    it('should log no courses found', async () => {
        const consoleSpy = vi.spyOn(console, 'log')
        checkbox.mockReturnValue([])
        getCourses.mockReturnValue(Promise.resolve([]))
        getAssignments.mockReturnValue(Promise.resolve([]))

        await select_courses()

        expect(consoleSpy).toHaveBeenCalledWith('No courses found')
    })

    it('should handle an error when getting courses', async () => {
        const consoleSpy = vi.spyOn(console, 'log')
        // Mock getCourses to throw an error
        getCourses.mockReturnValue(Promise.reject(new Error('Failed to fetch courses')))

        await select_courses()

        // Check that the function logs the correct error message
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch courses')
    })

    it('should select courses even if some have no assignments', async () => {
        // Mock getCourses to return testCourses
        getCourses.mockReturnValue(Promise.resolve(testCourses))
        // Mock getAssignments to return testAssignments for the first course and an empty array for the second course
        getAssignments.mockImplementation((options) => {
            if (options.courseId === testCourses[0].id) {
                return Promise.resolve(testAssignments)
            } else {
                return Promise.resolve([])
            }
        })
        // Mock checkbox to select all courses
        checkbox.mockReturnValue(testCourses.map((c) => c.id))

        await select_courses()

        // Check that all courses are selected
        expect(state.courses).toStrictEqual(testCourses)
    })

    it('should print all courses with checkbox', async () => {
        //const consoleSpy = vi.spyOn(console, 'log');
        const util = require('util')
        // Assuming checkbox returns an array of selected course IDs
        checkbox.mockReturnValue([testCourses[0].id])

        getCourses.mockReturnValue(Promise.resolve(testCourses))
        getAssignments.mockReturnValue(Promise.resolve(testAssignments))

        await select_courses()
        //console.log('Logged arguments:', util.inspect(consoleSpy.mock.calls, { depth: null }));
        const stdoutBuffer = execSync('bun run src/cli.ts')

        // Assert that console.log was called with the expected output
        //expect(consoleSpy).toBe(`[ ] ${testCourses[0].name}`);
        const stdoutString = stdoutBuffer.toString()
        console.log('Captured stdout:', stdoutString)

        expect(stdoutString).toContain(`[ ] ${testCourses[0].name}`)

        // Restore the original implementation of console.log
        //consoleSpy.mockRestore();
    })
})
