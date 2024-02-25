import { describe, it, expect } from 'vitest'
import { testAssignments, testSubmissions } from '../mocks/canvas.api.mocks.js'
import { generateAssignment } from '../generators.js'

describe('generateAssignment', () => {
    it('should generate a items for markdown', () => {
        const result = generateAssignment(
            testAssignments[0],
            testSubmissions[0]
        )
        expect(result.length).toBeGreaterThan(0)
    })

    it('should generate all headers', () => {
        const result = generateAssignment(
            testAssignments[0],
            testSubmissions[0]
        )
        expect(result[0]).toBeDefined()
        expect(result[2]).toBeDefined()
        expect(result[4]).toBeDefined()
        expect(result[6]).toBeDefined()
        expect(result[8]).toBeDefined()
    })

    it('should generate all bodies', () => {
        const result = generateAssignment(
            testAssignments[0],
            testSubmissions[0]
        )
        expect(result[1]).toBeDefined()
        expect(result[3]).toBeDefined()
        expect(result[5]).toBeDefined()
        expect(result[7]).toBeDefined()
        expect(result[9]).toBeDefined()
    })

    it('should generate a table', () => {
        testAssignments[0].rubric = [
            {
                id: '1',
                points: 10,
                description: 'Test criterion 1',
                long_description: 'Test criterion 1',
                criterion_use_range: false,
                ignore_for_scoring: false,
                ratings: [],
            },
        ]
        const result = generateAssignment(
            testAssignments[0],
            testSubmissions[0]
        )
        expect(result[7]).toContain('|')
    })

    it('should handle online_quiz', () => {
        testSubmissions[0].submission_type = 'online_quiz'
        const result = generateAssignment(
            testAssignments[0],
            testSubmissions[0]
        )
        expect(result[9]).toBe('No submission')
    })

    it('should generate a list', () => {
        testSubmissions[0].submission_comments = [
            {
                comment: 'Test comment 1',
                author: {
                    id: 1,
                    short_name: 'Test User 1',
                    html_url: 'https://test.instructure.com/courses/1/users/1',
                },
                author_name: 'Test User 1',
                author_id: 1,
                created_at: new Date(),
                id: 1,
                edited_at: new Date(),
                media_comment: {
                    'content-type': 'video/mp4',
                    media_type: 'video/mp4',
                    display_name: 'Test Video 1',
                    media_id: '1',
                    url: 'https://test.instructure.com/courses/1/files/1/download?download_frd=1&verifier=1',
                },
            },
        ]
        const result = generateAssignment(
            testAssignments[0],
            testSubmissions[0]
        )
        expect(result[7]).toContain('-')
    })

    it('should have no description', () => {
        testAssignments[0].description = ''
        const result = generateAssignment(
            testAssignments[0],
            testSubmissions[0]
        )
        expect(result[5]).toBe('No description')
    })

    it('should have a decsription', () => {
        testAssignments[0].description = 'Test description'
        const result = generateAssignment(
            testAssignments[0],
            testSubmissions[0]
        )
        expect(result[5]).toBe('Test description')
    })
})
