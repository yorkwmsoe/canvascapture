import { it, expect } from 'vitest'
import {
    generateHierarchyId,
    parseHierarchyId,
    generateHierarchyIdNext,
} from '../assignments'
import { describe } from 'node:test'

describe('generateHierarchyId', () => {
    it('should generate a hierarchy id', () => {
        const id = generateHierarchyId(1, 2)
        expect(id).toBe('1:2')
    })
})

describe('parseHierarchyId', () => {
    it('should parse a hierarchy id', () => {
        const id = generateHierarchyId(1, 2)
        const { courseId, assignmentId } = parseHierarchyId(id)
        expect(courseId).toBe(1)
        expect(assignmentId).toBe(2)
    })
})

describe('generateHierarchyIdNext', () => {
    it('should generate a hierarchy id', () => {
        const id = generateHierarchyIdNext('1', '2')
        expect(id).toBe('1:2')
    })
})
