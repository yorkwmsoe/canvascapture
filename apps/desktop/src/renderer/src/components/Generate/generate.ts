import { rm, writeFile } from 'fs/promises'
import markdownit from 'markdown-it'
import _ from 'lodash'
import { mkdirSync } from 'fs'
import { join } from 'path'
import {
    Assignment,
    Course,
    Quiz,
    Submission,
    generateAssignment,
    generateQuiz,
} from '@canvas-capture/lib'
import {canvasApi} from "../../apis/canvas.api";

// https://stackoverflow.com/a/70806192
export const median = (arr: number[]): number => {
    const s = arr.toSorted((a, b) => a - b)
    const mid = Math.floor(s.length / 2)
    const res = s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]
    return Math.ceil(res)
}

type FilePathContentPair = {
    filePath: string
    content: string
}

// FIXME: I hate that I have to do this
const generateAssignmentOrQuiz = async (
    assignment: Assignment,
    submission: Submission,
    quiz: Quiz | undefined,
    canvasAccessToken: string,
    canvasDomain: string
) => {
    if (assignment.is_quiz_assignment && quiz !== undefined) {
        const quizSubmission = await canvasApi.getQuizSubmission({
            canvasAccessToken,
            canvasDomain,
            courseId: assignment.course_id,
            quizId: quiz.id,
            submissionId: submission.id,
        })
        return generateQuiz(assignment, submission, quiz, quizSubmission)
    } else {
        return generateAssignment(assignment, submission)
    }
}

export const generatePairs = async (
    assignment: Assignment,
    submissions: Submission[],
    quiz: Quiz | undefined,
    assignmentsPath: string,
    canvasAccessToken: string,
    canvasDomain: string
): Promise<FilePathContentPair[]> => {
    const highSubmission =
        _.maxBy(submissions, (s) => s.score) ?? submissions[0]
    const highPair = {
        filePath: join(assignmentsPath, 'high'),
        content: (
            await generateAssignmentOrQuiz(
                assignment,
                highSubmission,
                quiz,
                canvasAccessToken,
                canvasDomain
            )
        ).join('\n'),
    }

    const medianSubmission =
        submissions.filter(
            (s) => s.score === median(submissions.map((x) => x.score))
        )[0] ?? submissions[0]
    const medianPair = {
        filePath: join(assignmentsPath, 'median'),
        content: (
            await generateAssignmentOrQuiz(
                assignment,
                medianSubmission,
                quiz,
                canvasAccessToken,
                canvasDomain
            )
        ).join('\n'),
    }

    const lowSubmission = _.minBy(submissions, (s) => s.score) ?? submissions[0]
    const lowPair = {
        filePath: join(assignmentsPath, 'low'),
        content: (
            await generateAssignmentOrQuiz(
                assignment,
                lowSubmission,
                quiz,
                canvasAccessToken,
                canvasDomain
            )
        ).join('\n'),
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

export async function generate(
    courses: Course[],
    assignments: Assignment[],
    canvasAccessToken: string,
    canvasDomain: string,
    generationName: string,
    documentsPath: string
) {
    await rm(join(documentsPath, generationName), {
        recursive: true,
        force: true,
    })

    const pairs: FilePathContentPair[] = []
    for (const course of courses) {
        const filteredAssignments = assignments.filter(
            (a) => a.course_id === course.id
        )

        for (const assignment of filteredAssignments) {
            const submissions = await canvasApi.getSubmissions({
                canvasAccessToken,
                canvasDomain,
                courseId: course.id,
                assignmentId: assignment.id,
            })
            const uniqueSubmissions = _.uniqBy(
                submissions.filter((s) => !_.isNil(s.score)),
                (s) => s.score
            )
            if (uniqueSubmissions.length > 0) {
                const assignmentsPath = join(
                    generationName,
                    course.name,
                    assignment.name
                )
                mkdirSync(join(documentsPath, assignmentsPath), {
                    recursive: true,
                })
                const quiz = assignment.is_quiz_assignment
                    ? await canvasApi.getQuiz({
                          canvasAccessToken,
                          canvasDomain,
                          courseId: assignment.course_id,
                          quizId: assignment.quiz_id,
                      })
                    : undefined
                pairs.push(
                    ...(await generatePairs(
                        assignment,
                        uniqueSubmissions,
                        quiz,
                        assignmentsPath,
                        canvasAccessToken,
                        canvasDomain
                    ))
                )
            }
        }
    }

    pairs.forEach((x) =>
        writeFile(join(documentsPath, x.filePath + '.md'), x.content)
    )

    const md = markdownit({ linkify: true })

    const htmlData: FilePathContentPair[] = pairs.map((x) => {
        return {
            filePath: x.filePath,
            content: md.render(x.content),
        }
    })
    return htmlData
}
