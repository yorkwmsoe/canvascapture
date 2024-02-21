export function generateHierarchyId(courseId: number, assignmentId: number) {
  return `${courseId}:${assignmentId}`
}

export function parseHierarchyId(hierarchyId: string) {
  const [courseId, assignmentId] = hierarchyId.split(':')
  return {
    courseId: parseInt(courseId, 10),
    assignmentId: parseInt(assignmentId, 10)
  }
}
