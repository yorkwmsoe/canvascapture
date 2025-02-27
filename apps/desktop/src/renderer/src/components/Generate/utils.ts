/**
 * Defines util methods to assist with generation
 *
 * See individual method definitions below for more details
 */
import {
    Assignment,
    Auth,
    Course,
    Quiz,
    Submission,
    assembleQuizQuestionsAndComments,
    assembleQuizQuestionsAndAnswers,
    generateQuiz,
    generateQuizDescription,
    generateQuizSubmission,
    generateAssignment,
    generateAssignmentDescription,
    generateAssignmentSubmission,
} from '@canvas-capture/lib'
import { maxBy, minBy } from 'lodash'
import { canvasApi } from '@renderer/apis/canvas.api'

// https://stackoverflow.com/a/70806192
export const median = (arr: number[]): number => {
    const s = arr.toSorted((a, b) => a - b)
    const mid = Math.floor(s.length / 2)
    const res = s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]
    return Math.ceil(res)
}

export const generateAssignmentOrQuiz = async (
    course: Course,
    assignment: Assignment,
    submission: Submission,
    quiz: Quiz | undefined,
    canvasAccessToken: string,
    canvasDomain: string
) => {
    if (
        assignment.is_quiz_assignment &&
        !assignment.locked_for_user &&
        quiz !== undefined
    ) {
        const quizSubmission = await canvasApi.getQuizSubmission({
            canvasAccessToken,
            canvasDomain,
            courseId: assignment.course_id,
            quizId: quiz.id,
            submissionId: submission.id,
        })
        const auth: Auth = {
            canvasAccessToken: canvasAccessToken,
            canvasDomain: canvasDomain,
        }
        const quizQuestions = await assembleQuizQuestionsAndComments(
            auth,
            course,
            assignment,
            submission
        )
        return generateQuiz(
            assignment,
            submission,
            quiz,
            quizSubmission,
            quizQuestions,
            true
        )
    } else {
        return generateAssignment(assignment, submission, true)
    }
}

export const generateAssignmentOrQuizDescription = async (
    course: Course,
    assignment: Assignment,
    quiz: Quiz | undefined,
    canvasAccessToken: string,
    canvasDomain: string
) => {
    if (
        assignment.is_quiz_assignment &&
        !assignment.locked_for_user &&
        quiz !== undefined
    ) {
        const auth: Auth = {
            canvasAccessToken: canvasAccessToken,
            canvasDomain: canvasDomain,
        }
        const quizQuestions = await assembleQuizQuestionsAndAnswers(
            auth,
            course,
            assignment
        )
        return generateQuizDescription(assignment, quiz, quizQuestions, true)
    } else {
        return generateAssignmentDescription(assignment, true)
    }
}

export const generateAssignmentOrQuizSubmission = async (
    course: Course,
    assignment: Assignment,
    submission: Submission,
    quiz: Quiz | undefined,
    canvasAccessToken: string,
    canvasDomain: string
) => {
    if (
        assignment.is_quiz_assignment &&
        !assignment.locked_for_user &&
        quiz !== undefined
    ) {
        const quizSubmission = await canvasApi.getQuizSubmission({
            canvasAccessToken,
            canvasDomain,
            courseId: assignment.course_id,
            quizId: quiz.id,
            submissionId: submission.id,
        })
        const auth: Auth = {
            canvasAccessToken: canvasAccessToken,
            canvasDomain: canvasDomain,
        }
        const quizQuestions = await assembleQuizQuestionsAndComments(
            auth,
            course,
            assignment,
            submission
        )
        return generateQuizSubmission(
            assignment,
            submission,
            quizSubmission,
            quizQuestions
        )
    } else {
        return generateAssignmentSubmission(assignment, submission, true)
    }
}

export function getHighMedianLowSubmissions(submissions: Submission[]): {
    highSubmission: Submission | undefined
    medianSubmission: Submission | undefined
    lowSubmission: Submission | undefined
} {
    const highSubmission = maxBy(submissions, (s) => s.score) ?? submissions[0]
    const medianSubmission =
        submissions.filter(
            (s) => s.score === median(submissions.map((x) => x.score))
        )[0] ?? submissions[0]
    const lowSubmission = minBy(submissions, (s) => s.score) ?? submissions[0]

    switch (submissions.length) {
        case 1:
            return {
                highSubmission: highSubmission,
                medianSubmission: undefined,
                lowSubmission: undefined,
            }
        case 2:
            return {
                highSubmission: highSubmission,
                medianSubmission: undefined,
                lowSubmission: lowSubmission,
            }
        default:
            return {
                highSubmission: highSubmission,
                medianSubmission: medianSubmission,
                lowSubmission: lowSubmission,
            }
    }
}
