import { expect, describe, it, vi } from 'vitest'
import { checkbox, getAssignments, getSubmissions } from './mocks.js'
import { select_assignments } from '../assignments.js'
import { testCourses, testAssignments, testSubmissions } from './data.js'
import { state } from '@modules/command/state.js'

describe('assignments', () => {
    it('should log no courses selected', async () => {
        const consoleSpy = vi.spyOn(console, 'log')

        await select_assignments()

        expect(consoleSpy).toHaveBeenCalledWith('No courses selected')
    })
    it('should return an assignment', async () => {
        state.courses = testCourses
        checkbox.mockReturnValue([testAssignments[0].id])
        getAssignments.mockReturnValue(Promise.resolve(testAssignments))
        getSubmissions.mockReturnValue(Promise.resolve(testSubmissions))

        await select_assignments()

        expect(state.assignments).toMatchObject(testAssignments)
    })

    it('should filter out assignments with no submissions', async () => {
        state.courses = testCourses
        checkbox.mockReturnValue([testAssignments[0].id])
        getAssignments.mockReturnValue(Promise.resolve(testAssignments))
        getSubmissions.mockReturnValue(Promise.resolve(testSubmissions.map((x) => ({ ...x, workflow_state: 'unsubmitted' }))))

        await select_assignments()

        expect(state.assignments).toStrictEqual([])
    })
})
