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

/**
 * The hook provides methods for:
 * - Pre-generating content nodes (`runPreGenerate`) to scaffold the data structure for report generation.
 * - Generating reports (`runGenerate`) based on prepared content nodes or external data.
 *
 * Return:
 * - `runPreGenerate`: A callback that generates data nodes to structure the data.
 * - `runGenerate`: A function that generates the pdf for the report using the
 *   pre-generated nodes or provided data.
 */
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
            await generate(
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
    canvasDomain: string
) {
    const contentPairs: FileDataNode[] = []

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

    return contentPairs
}

// Note: This is what I'm guessing this ESSENTIALLY does, based off the code. -EG
// Given a list of nodes, where each node represents a course and its children
// represent assignments, add children to the assignments that represent the
// submission (and description) content along with each "file" location. (the
// "file" location is what structures the report for the markdown editor).
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

// Note: This is what I'm guessing this ESSENTIALLY does, based off the code. -EG
// Given a node, if it does NOT represent an assignment, do nothing.
// If it DOES represent an assignment, generate its children, which are nodes
// that represent the submission (and description) content along with a "file"
// location (the "file" location is what structures the report for the markdown
// editor).
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
                canvasDomain
            )
            node.allSubmissions = uniqueSubmissions
        }
    }
}
