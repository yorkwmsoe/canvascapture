import { Assignment, Quiz, Submission } from '@canvas-capture/lib'
import { canvasApi } from '@renderer/apis/canvas.api'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { useSettingsStore } from '@renderer/stores/settings.store'
import {
    generateHierarchyId,
    generateHierarchyIdNext,
    parseHierarchyId,
} from '@renderer/utils/assignments'
import { uniqBy, isNil, maxBy, minBy } from 'lodash'
import { useCallback, useMemo } from 'react'
import { generateV2 } from './generate.v2'
import { ipcRenderer } from 'electron'
import { getDocumentsPath } from '@renderer/utils/config'
import { useGenerationStore } from '@renderer/stores/generation.store'
import {
    FileDataNode,
    DataNode,
    isAssignmentDataNode,
    isCourseDataNode,
    CourseDataNode,
    AssignmentDataNode,
} from '@canvas-capture/lib'
import { generateAssignmentOrQuiz, median } from './utils'
import { Course } from '@canvas-capture/lib'

async function getHML(
    course: Course,
    assignment: Assignment,
    submissions: Submission[],
    quiz: Quiz | undefined,
    canvasAccessToken: string,
    canvasDomain: string
) {
    const highSubmission = maxBy(submissions, (s) => s.score) ?? submissions[0]
    const highPair: FileDataNode = {
        type: 'file',
        key: generateHierarchyIdNext(
            assignment.course_id.toString(),
            assignment.id.toString(),
            'high'
        ),
        name: 'high',
        content: await generateAssignmentOrQuiz(
            course,
            assignment,
            highSubmission,
            quiz,
            canvasAccessToken,
            canvasDomain
        ),
    }

    const medianSubmission =
        submissions.filter(
            (s) => s.score === median(submissions.map((x) => x.score))
        )[0] ?? submissions[0]
    const medianPair: FileDataNode = {
        type: 'file',
        key: generateHierarchyIdNext(
            assignment.course_id.toString(),
            assignment.id.toString(),
            'median'
        ),
        name: 'median',
        content: await generateAssignmentOrQuiz(
            course,
            assignment,
            medianSubmission,
            quiz,
            canvasAccessToken,
            canvasDomain
        ),
    }

    const lowSubmission = minBy(submissions, (s) => s.score) ?? submissions[0]
    const lowPair: FileDataNode = {
        type: 'file',
        key: generateHierarchyIdNext(
            assignment.course_id.toString(),
            assignment.id.toString(),
            'low'
        ),
        name: 'low',
        content: await generateAssignmentOrQuiz(
            course,
            assignment,
            lowSubmission,
            quiz,
            canvasAccessToken,
            canvasDomain
        ),
    }

    switch (submissions.length) {
        case 1:
            return [highPair]
        case 2:
            return [highPair, lowPair]
        default:
            return [highPair, medianPair, lowPair]
    }
}

async function handleNode(
    getCourse: (courseId: number) => Course | undefined,
    node: DataNode,
    canvasAccessToken: string,
    canvasDomain: string,
    isStudent: boolean
) {
    if (isAssignmentDataNode(node)) {
        const { courseId, assignmentId } = parseHierarchyId(node.key)
        const submissions = await canvasApi.getSubmissions({
            canvasAccessToken,
            canvasDomain,
            isStudent,
            courseId: courseId,
            assignmentId: assignmentId,
        })
        const uniqueSubmissions = uniqBy(
            submissions.filter((s) => !isNil(s.score)),
            (s) => s.score
        )
        const course = getCourse(courseId)

        if (uniqueSubmissions.length > 0 && course) {
            const quiz = node.assignment.is_quiz_assignment
                ? await canvasApi.getQuiz({
                      canvasAccessToken,
                      canvasDomain,
                      courseId: node.assignment.course_id,
                      quizId: node.assignment.quiz_id,
                  })
                : undefined
            const data = await getHML(
                course,
                node.assignment,
                uniqueSubmissions,
                quiz,
                canvasAccessToken,
                canvasDomain
            )
            node.children = data
        }
    }
}

async function preGenerate(
    getCourse: (courseId: number) => Course | undefined,
    nodes: DataNode[],
    canvasAccessToken: string,
    canvasDomain: string,
    isStudent: boolean
) {
    const copyNodes = [...nodes]
    for (const n of copyNodes) {
        await handleNode(
            getCourse,
            n,
            canvasAccessToken,
            canvasDomain,
            isStudent
        )
        if (isAssignmentDataNode(n) || isCourseDataNode(n)) {
            await preGenerate(
                getCourse,
                n.children,
                canvasAccessToken,
                canvasDomain,
                isStudent
            )
        }
    }
    return copyNodes
}

export const useGenerateNext = () => {
    const { canvasAccessToken, canvasDomain, isStudent } = useSettingsStore()
    const { assignments, selectedAssignments } = useAssignments()
    const { getCourseById } = useCourses()
    const { generationName } = useGenerationStore()
    const documentsPath = getDocumentsPath()

    const dataNodes = useMemo(() => {
        return assignments.map<CourseDataNode>((assignment) => {
            const course = getCourseById(assignment.courseId)
            return {
                type: 'course',
                course: course!,
                key: assignment.courseId.toString(),
                children: assignment.assignments
                    .filter((a) =>
                        selectedAssignments.includes(
                            generateHierarchyId(assignment.courseId, a.id)
                        )
                    )
                    .map<AssignmentDataNode>((individualAssignment) => {
                        return {
                            type: 'assignment',
                            key: generateHierarchyId(
                                assignment.courseId,
                                individualAssignment.id
                            ),
                            assignment: individualAssignment,
                            children: [],
                        }
                    }),
            }
        })
    }, [assignments, getCourseById])

    const runPreGenerate = useCallback(() => {
        return preGenerate(
            getCourseById,
            dataNodes,
            canvasAccessToken,
            canvasDomain,
            isStudent
        )
    }, [dataNodes])

    const runGenerate = async (data?: DataNode[]) => {
        await ipcRenderer.invoke(
            'generate',
            generateV2(
                data ?? (await runPreGenerate()),
                generationName,
                documentsPath
            )
        )
    }

    return {
        runPreGenerate,
        runGenerate,
    }
}
