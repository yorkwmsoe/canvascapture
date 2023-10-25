import { checkbox, getAssignments } from './mocks'
import { select_assignments } from '../assignments'
import { testCourses, testAssignments } from './data'
import { state } from '@modules/command/state'

describe('assignments', () => {
    it('should log no courses selected', async () => {
        const consoleSpy = jest.spyOn(console, 'log')

        await select_assignments()

        expect(consoleSpy).toHaveBeenCalledWith('No courses selected')
    })
    it('should return an assignment', async () => {
        state.courses = testCourses
        checkbox.mockReturnValue([testAssignments[0].id])
        getAssignments.mockReturnValue(Promise.resolve(testAssignments))

        await select_assignments()

        expect(state.assignments).toMatchObject(testAssignments)
    })
})
