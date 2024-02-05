export function generateHierarchyId(courseId: number, submissionId: number) {
  return `${courseId}:${submissionId}`
}

export function parseHierarchyId(hierarchyId: string) {
  const [courseId, submissionId] = hierarchyId.split(':')
  return {
    courseId: parseInt(courseId, 10),
    submissionId: parseInt(submissionId, 10)
  }
}
