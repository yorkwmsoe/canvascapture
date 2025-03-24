/**
 * Defines types for Course, Assignment, and File data:
 * CourseDataNode, AssignmentDataNode, and FileDataNode
 * Also defines methods to check if a DataNode (the parent type of
 * each of the other types) is one of the types (ex: isCourseDataNode()
 * checks if the DataNode passed in is a CourseDataNode.
 *
 * See individual type and method definitions below for more details
 */
import { Assignment, AssignmentGroup } from '../types/canvas_api/assignment'
import { Course } from '../types/canvas_api/course'
import { Submission } from '../types/canvas_api/submission'

export interface DataNode {
    type: 'course' | 'assignment' | 'file'
    key: string
    children?: DataNode[] | undefined
}

export interface CourseDataNode extends DataNode {
    type: 'course'
    course: Course
    children: AssignmentDataNode[]
    assignmentGroups: AssignmentGroup[]
}

export interface AssignmentDataNode extends DataNode {
    type: 'assignment'
    assignment: Assignment
    children: FileDataNode[]
    allSubmissions: Submission[]
}

export interface FileDataNode extends DataNode {
    type: 'file'
    name: 'description' | 'high' | 'low' | 'median'
    content: string[]
    children?: undefined
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
