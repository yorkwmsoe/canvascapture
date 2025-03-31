/**
 * Defines methods to make API calls using the private module
 * and formats the results for use by the desktop application
 *
 * See individual definitions for more details
 */
import { useSettingsStore } from '@renderer/stores/settings.store'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { parseHierarchyId } from '@renderer/utils/assignments'
import {
    Assignment,
    Auth,
    Course,
    createCanvasApi,
    GetAssignmentsRequest,
} from '@canvas-capture/lib'

export const canvasApi = createCanvasApi()

export const getAssignments = async (
    args: GetAssignmentsRequest & Auth
): Promise<{
    courseId: number
    assignments: Assignment[]
}> => {
    return {
        courseId: args.courseId,
        assignments: await canvasApi.getAssignments(args),
    }
}

// Hooks
export const useGetSubmissions = () => {
    const { canvasDomain, canvasAccessToken, isStudent } = useSettingsStore()
    const { assignments } = useGenerationStore()
    return useQueries({
        queries: assignments.map((courseAssignmentId) => {
            const { courseId, assignmentId } =
                parseHierarchyId(courseAssignmentId)
            return {
                queryKey: ['submissions', courseId, assignmentId],
                queryFn: () =>
                    canvasApi.getSubmissions({
                        canvasAccessToken,
                        canvasDomain,
                        isStudent,
                        courseId,
                        assignmentId,
                    }),
            }
        }),
    })
}

export const useGetAssignments = () => {
    const { canvasDomain, canvasAccessToken } = useSettingsStore()
    const { courses } = useGenerationStore()
    return useQueries({
        queries: courses.map((courseId) => {
            return {
                queryKey: ['assignments', courseId],
                queryFn: () =>
                    getAssignments({
                        canvasAccessToken,
                        canvasDomain,
                        courseId,
                    }),
            }
        }),
    })
}

export function useGetAssignmentGroups() {
    const { canvasDomain, canvasAccessToken } = useSettingsStore()
    const { courses } = useGenerationStore()
    return useQueries({
        queries: courses.map((courseId) => {
            return {
                queryKey: ['assignment_groups', courseId],
                queryFn: () =>
                    canvasApi.getAssignmentGroups({
                        canvasAccessToken,
                        canvasDomain,
                        courseId,
                    }),
            }
        }),
    })
}

export const useGetCourses = () => {
    const { canvasDomain, canvasAccessToken, setIsStudent } = useSettingsStore()
    return useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const courses = await canvasApi.getCourses({
                canvasAccessToken,
                canvasDomain,
            })
            const availableCourses: Course[] = []
            let numTeacher = 0
            let numStudent = 0
            for (const course of courses) {
                if (
                    course.access_restricted_by_date == undefined ||
                    course.access_restricted_by_date == false
                ) {
                    availableCourses.push(course)
                }
                if (course.enrollments != undefined) {
                    const enrollmentType: string = course.enrollments[0].type
                    if (enrollmentType == 'student') {
                        numStudent++
                    } else if (enrollmentType == 'teacher') {
                        numTeacher++
                    }
                }
                if (numTeacher > 0) {
                    setIsStudent(false)
                } else if (numStudent > 0 && numTeacher == 0) {
                    setIsStudent(true)
                }
            }
            return availableCourses
        },
        enabled: true,
    })
}
