/**
 * Exports the types and methods from generation.types.ts
 */
import {
    isCourseDataNode,
    isAssignmentDataNode,
    isFileDataNode,
} from './generation.types'

import type {
    DataNode,
    CourseDataNode,
    AssignmentDataNode,
    FileDataNode,
} from './generation.types'

export type { DataNode, CourseDataNode, AssignmentDataNode, FileDataNode }

export { isCourseDataNode, isAssignmentDataNode, isFileDataNode }
