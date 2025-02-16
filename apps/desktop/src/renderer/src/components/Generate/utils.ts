/**
 * Defines util methods to assist with generation
 *
 * See individual method definitions below for more details
 */
import {
    Assignment,
    Submission,
    Quiz,
    generateQuiz,
    generateAssignment,
    Auth,
    Course,
    assembleQuizQuestionsAndComments,
} from '@canvas-capture/lib'
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
