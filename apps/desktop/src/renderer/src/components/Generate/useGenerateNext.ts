/**
 * Defines a method (and related helper methods) to facilitate generation
 *
 * See individual method definitions below for more details
 */
import {
    Assignment,
    AssignmentDataNode,
    Course,
    CourseDataNode,
    DataNode,
    FileDataNode,
    isAssignmentDataNode,
    isCourseDataNode,
    Quiz,
    Submission,
} from '@canvas-capture/lib'
import { canvasApi } from '@renderer/apis/canvas.api'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { useSettingsStore } from '@renderer/stores/settings.store'
import {
    generateHierarchyId,
    generateHierarchyIdNext,
    parseHierarchyId,
} from '@renderer/utils/assignments'
import { isNil, uniqBy } from 'lodash'
import { useCallback, useMemo } from 'react'
import { generateAssignmentAndSubmissionContent } from './generateUtils'
import { generate } from './generate'
import { ipcRenderer } from 'electron'
import { getDocumentsPath } from '@renderer/utils/config'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { App } from 'antd'
import { MessageInstance } from 'antd/es/message/interface'

/**
 * The hook provides methods for:
 * - Pre-generating content nodes (`runPreGenerate`) to scaffold the data structure for report generation.
 * - Generating reports (`runGenerate`) based on prepared content nodes or external data.
 *
 * @return runPregenerate: () => Promise<DataNode[]>
 * @return
 * - `runPreGenerate`: A callback that generates a list of DataNode trees that represented the structured Canvas LMS data.
 *      - The list returned will be a list of DataNodes with the following structure:
 *          CourseDataNode -> AssignmentDataNode -> FileDataNode (FileDataNodes represent assignment data, such as
 *          descriptions or submissions).
 *
 * - `runGenerate`: A function that generates the pdf for the report using the pre-generated DataNode structure or
 *      the provided one.
 *
 *   @See canvas-capture/src/generation/generation.types.ts
 */
export const useGenerateNext = () => {
    const { canvasAccessToken, canvasDomain, isStudent } = useSettingsStore()
    const { assignments, selectedAssignments } = useAssignments()
    const { getCourseById } = useCourses()
    const { generationName, requestedCharts } = useGenerationStore()
    const documentsPath = getDocumentsPath()
    const { message } = App.useApp()

    // Create the DataNode tree structure.
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
                            allSubmissions: [],
                        }
                    }),
                assignmentGroups: [],
            }
        })
    }, [assignments, getCourseById])

    const runPreGenerate = useCallback(() => {
        return preGenerate(
            getCourseById,
            dataNodes,
            canvasAccessToken,
            canvasDomain,
            isStudent,
            message
        )
    }, [dataNodes])

    const runGenerate = async (data?: DataNode[]) => {
        await ipcRenderer.invoke(
            'generate',
            await generate(
                data ?? (await runPreGenerate()),
                generationName,
                documentsPath,
                requestedCharts
            )
        )
    }

    return {
        runPreGenerate,
        runGenerate,
    }
}
// This will generate the FileDataNodes for the description and the low/median/high
// submissions of the given assignment (or quiz). A FileDataNode specifies content
// and "file" location. Which I believe is utilized by the markdown editor to
// determine report structure.
async function generateContentPairs(
    course: Course,
    assignment: Assignment,
    submissions: Submission[],
    quiz: Quiz | undefined,
    canvasAccessToken: string,
    canvasDomain: string,
    isStudent: boolean,
    message: MessageInstance
) {
    const contentPairs: FileDataNode[] = []

    if (isStudent && assignment.is_quiz_assignment) {
        message.error({
            key: 'STUDENTQUIZERROR',
            content: 'Students cannot access quiz questions',
            duration: 5,
        })
    } else {
        const {
            descriptionContent,
            highSubmissionContent,
            medianSubmissionContent,
            lowSubmissionContent,
        } = await generateAssignmentAndSubmissionContent(
            course,
            assignment,
            submissions,
            quiz,
            canvasAccessToken,
            canvasDomain
        )

        contentPairs.push({
            type: 'file',
            key: generateHierarchyIdNext(
                assignment.course_id.toString(),
                assignment.id.toString(),
                'description'
            ),
            name: 'description',
            content: descriptionContent,
        })

        if (highSubmissionContent !== undefined) {
            contentPairs.push({
                type: 'file',
                key: generateHierarchyIdNext(
                    assignment.course_id.toString(),
                    assignment.id.toString(),
                    'high'
                ),
                name: 'high',
                content: highSubmissionContent,
            })
        }

        if (medianSubmissionContent !== undefined) {
            contentPairs.push({
                type: 'file',
                key: generateHierarchyIdNext(
                    assignment.course_id.toString(),
                    assignment.id.toString(),
                    'median'
                ),
                name: 'median',
                content: medianSubmissionContent,
            })
        }

        if (lowSubmissionContent !== undefined) {
            contentPairs.push({
                type: 'file',
                key: generateHierarchyIdNext(
                    assignment.course_id.toString(),
                    assignment.id.toString(),
                    'low'
                ),
                name: 'low',
                content: lowSubmissionContent,
            })
        }
    }

    return contentPairs
}

/**
 * This function processes each given DataNode tree (e.g., course or assignment nodes)
 * and fills it with corresponding content related to assignments, submissions, and
 * assignment group data where applicable.
 *
 * The function performs the following tasks:
 * - Iterates over each node in the provided array of DataNodes.
 * - Handles each node according to its type (`CourseDataNode` or `AssignmentDataNode`)
 *   using the `handleNode` helper function, which fetches and attaches relevant data.
 * - Recursively processes child nodes (if any) to populate their structure as well.
 *
 * Returns:
 * - A promise that resolves to a new array of DataNodes, each populated with content.
 */
async function preGenerate(
    getCourse: (courseId: number) => Course | undefined,
    nodes: DataNode[],
    canvasAccessToken: string,
    canvasDomain: string,
    isStudent: boolean,
    message: MessageInstance
) {
    const copyNodes = [...nodes]
    const validNodes: DataNode[] = []
    for (const n of copyNodes) {
        await handleNode(
            getCourse,
            n,
            canvasAccessToken,
            canvasDomain,
            isStudent,
            message
        )
        if (isAssignmentDataNode(n) || isCourseDataNode(n)) {
            if (n.children.length > 0) {
                await preGenerate(
                    getCourse,
                    n.children,
                    canvasAccessToken,
                    canvasDomain,
                    isStudent,
                    message
                )
                validNodes.push(n)
            }
        } else {
            validNodes.push(n)
        }
    }
    return validNodes
}

// Helper function used by "preGenerate".
async function handleNode(
    getCourse: (courseId: number) => Course | undefined,
    node: DataNode,
    canvasAccessToken: string,
    canvasDomain: string,
    isStudent: boolean,
    message: MessageInstance
) {
    if (isCourseDataNode(node)) {
        node.assignmentGroups = await canvasApi.getAssignmentGroups({
            canvasAccessToken,
            canvasDomain,
            courseId: node.course.id,
        })
    } else if (isAssignmentDataNode(node)) {
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

        if (course) {
            const quiz = node.assignment.is_quiz_assignment
                ? await canvasApi.getQuiz({
                      canvasAccessToken,
                      canvasDomain,
                      courseId: node.assignment.course_id,
                      quizId: node.assignment.quiz_id,
                  })
                : undefined
            node.children = await generateContentPairs(
                course,
                node.assignment,
                uniqueSubmissions,
                quiz,
                canvasAccessToken,
                canvasDomain,
                isStudent,
                message
            )
            node.allSubmissions = uniqueSubmissions
        }
    }
}
