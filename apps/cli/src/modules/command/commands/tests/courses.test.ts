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
})
