import { expect, describe, it, vi } from 'vitest'
import { checkbox, getAssignments, getCourses, getSubmissions } from './mocks'
import { select_assignments } from '../assignments'
import { testCourses, testAssignments, testSubmissions } from './data'
import { state } from '@modules/command/state'
import { canvasApi } from '@lib/canvas.api'
import { execSync } from 'child_process'

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

    it('should log "No assignments found" if no assignments have submissions', async () => {
        state.courses = testCourses
        getAssignments.mockReturnValue(Promise.resolve(testAssignments))
        // Mock getSubmissions to return unsubmitted submissions for all assignments
        getSubmissions.mockReturnValue(Promise.resolve(testSubmissions.map((x) => ({ ...x, workflow_state: 'unsubmitted' }))))
        const consoleSpy = vi.spyOn(console, 'log')

        await select_assignments()

        expect(consoleSpy).toHaveBeenCalledWith('No assignments found')
    })

    it('should handle undefined state.courses', async () => {
        const consoleSpy = vi.spyOn(console, 'log')

        state.courses = undefined

        await select_assignments()

        expect(consoleSpy).toHaveBeenCalledWith('No courses selected')
    })

    it('should handle null state.courses', async () => {
        const consoleSpy = vi.spyOn(console, 'log')

        state.courses = null

        await select_assignments()

        expect(consoleSpy).toHaveBeenCalledWith('No courses selected')
    })

    it('should handle error in getAssignments call', async () => {
        const consoleSpy = vi.spyOn(console, 'log')
        state.courses = testCourses

        const error = new Error('Failed to fetch assignments')
        const getAssignmentsMock = vi.fn(() => Promise.reject(error))
        vi.spyOn(canvasApi, 'getAssignments').mockImplementation(getAssignmentsMock)

        await select_assignments()

        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch assignments')
    })

    it('should handle error in getSubmissions call', async () => {
        const consoleSpy = vi.spyOn(console, 'log')
        state.courses = testCourses

        vi.spyOn(canvasApi, 'getAssignments').mockResolvedValue(testAssignments)

        const error = new Error('Failed to fetch submissions')
        const getSubmissionsMock = vi.fn(() => Promise.reject(error))
        vi.spyOn(canvasApi, 'getSubmissions').mockImplementation(getSubmissionsMock)

        await select_assignments()

        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch submissions')
    })

    it('should print all assignments with checkbox', async () => {
        const util = require('util')

        checkbox.mockReturnValue([testAssignments[0].id])
        getCourses.mockReturnValue(Promise.resolve(testCourses))
        getAssignments.mockReturnValue(Promise.resolve(testAssignments))

        const stdoutBuffer = execSync('bun run src/cli.ts')

        const stdoutString = stdoutBuffer.toString()
        console.log('stdoutString:', stdoutString)

        expect(stdoutString).toContain(`[ ] ${testAssignments[0].name}`)
    })
})
