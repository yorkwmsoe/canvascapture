import { expect, describe, it, vi } from 'vitest'
import { checkbox, getCourses, getAssignments } from './mocks'
import { select_courses } from '../courses'
import { testCourses, testAssignments } from './data'
import { state } from '@modules/command/state'

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
})
