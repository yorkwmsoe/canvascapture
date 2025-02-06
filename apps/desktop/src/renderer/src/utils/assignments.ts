/**
 * Defines util methods related to assignments
 *
 * See the individual definitions below for more details
 */
export function generateHierarchyId(courseId: number, assignmentId: number) {
    return `${courseId}:${assignmentId}`
}

export function generateHierarchyIdNext(...args: string[]) {
    return args.join(':')
}

export function parseHierarchyId(hierarchyId: string) {
    const [courseId, assignmentId] = hierarchyId.split(':')
    return {
        courseId: parseInt(courseId, 10),
        assignmentId: parseInt(assignmentId, 10),
    }
}
