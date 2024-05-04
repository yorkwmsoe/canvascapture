import { it, expect } from 'vitest'
import { describe } from 'node:test'
import { getCourseName } from '../courses'
import { testCourses } from '@canvas-capture/lib'

describe('getCourseName', () => {
    it('should return course name', () => {
        expect(getCourseName(testCourses[0])).toBe('Test Course 1')
    })

    it('should return course name', () => {
        expect(getCourseName(testCourses[1])).toBe('Noice Name')
    })

    it('should return course name', () => {
        expect(getCourseName(undefined)).toBe('Unknown Course')
    })
})
