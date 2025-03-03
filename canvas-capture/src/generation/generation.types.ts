/**
 * Defines types for Course, Assignment, and File data:
 * CourseDataNode, AssignmentDataNode, and FileDataNode
 * Also defines methods to check if a DataNode (the parent type of
 * each of the other types) is one of the types (ex: isCourseDataNode()
 * checks if the DataNode passed in is a CourseDataNode.
 *
 * See individual type and method definitions below for more details
 */
import { Assignment } from '../types/canvas_api/assignment'
import { Course } from '../types/canvas_api/course'

export type DataNode = CourseDataNode | AssignmentDataNode | FileDataNode

export type CourseDataNode = {
    type: 'course'
    key: string
    course: Course
    children: AssignmentDataNode[]
}

export type AssignmentDataNode = {
    type: 'assignment'
    key: string
    assignment: Assignment
    children: FileDataNode[]
}

export type FileDataNode = {
    type: 'file'
    key: string
    name: 'description' | 'high' | 'low' | 'median'
    content: string[]
}

export function isCourseDataNode(node: DataNode): node is CourseDataNode {
    return node.type === 'course'
}

export function isAssignmentDataNode(
    node: DataNode
): node is AssignmentDataNode {
    return node.type === 'assignment'
}

export function isFileDataNode(node: DataNode): node is FileDataNode {
    return node.type === 'file'
}
