import { expect, describe, it } from 'vitest'
import { checkbox, getCourses, getAssignments } from './mocks.js'
import { select_courses } from '../courses.js'
import { testCourses, testAssignments } from './data.js'
import { state } from '@modules/command/state.js'

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
})
