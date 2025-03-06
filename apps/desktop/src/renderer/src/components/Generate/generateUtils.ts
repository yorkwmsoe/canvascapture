/**
 * @fileoverview This file contains helper functions related to the generation of reports.
 *
 * Exported Functions:
 *
 * - `generateTOC()`
 *   Generates a Table of Contents for the provided HTML content.
 *
 * - `generateAssignmentAndSubmissionContent()`
 *   Generates content for the provided assignment or quiz, including its description (and related info), and submissions categorized by high, median, and low scores.
 */


import {
    Assignment,
    Auth,
    Course,
    Quiz,
    Submission,
    assembleQuizQuestionsAndComments,
    assembleQuizQuestionsAndAnswers,
    generateQuizDescription,
    generateQuizSubmission,
    generateAssignmentDescription,
    generateAssignmentSubmission,
} from '@canvas-capture/lib'
import { maxBy, minBy } from 'lodash'
import { canvasApi } from '@renderer/apis/canvas.api'


/**
 * Generates a Table of Contents (TOC) for a given HTML content string.
 *
 * This function parses the provided HTML content to extract all `<h1>` and `<h2>` elements.
 * For each heading element, it generates an anchor link, assigns a unique `id` to the heading,
 * and creates an entry in the TOC with proper styling. The generated TOC includes clickable
 * links that navigate to the corresponding headings.
 *
 * @param htmlContent - The HTML content as a string from which the TOC should be generated.
 * @returns A string containing the HTML representation of the generated Table of Contents.
 */
export function generateTOC(htmlContent: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')

    const headings = doc.querySelectorAll('h1, h2')
    const tocEntries: string[] = []

    headings.forEach((heading, index) => {
        const level = heading.tagName.toLowerCase()
        const text = heading.textContent || ''
        const anchorId = `toc-${index}`
        heading.id = anchorId

        let tocEntry = ''
        if (
            ['Submission', 'Rubric', 'Feedback', 'Description'].includes(text)
        ) {
            tocEntry = `<li class="toc-${level}" style="list-style-type: '-';"><a href="#${anchorId}">${text}</a></li>`
        } else {
            tocEntry = `<li class="toc-${level}" style="padding-top: 5px;"><a href="#${anchorId}">${text}</a></li>`
        }

        tocEntries.push(tocEntry)
    })

    const tocHTML = `
    <div class="toc" style="text-align: center;">
      <h2>Table of Contents</h2>
      <ul style="list-style-position: inside; list-style-type: none; padding-left: 0;">
        ${tocEntries.join('')}
      </ul>
    </div>
  `
    return tocHTML
}


/**
 * Generates content for an assignment or quiz, as well as associated submissions
 * (high, median, and low score submissions).
 * "Content" refers to the grouping of the assignment or quiz description and the high, median, and low submissions.
 *
 * @param course - The course object containing information about the course.
 * @param assignment - The assignment object for which content is being generated.
 * @param submissions - The list of submissions for the assignment or quiz.
 * @param quiz - An optional quiz object, if the assignment is associated with a quiz.
 * @param canvasAccessToken - The access token used for authenticating API requests to Canvas.
 * @param canvasDomain - The domain of the Canvas platform.
 * @returns An object containing the generated description content and submission contents
 * (high, median, and low score submissions), or `undefined` if no submissions exist.
 */
export async function generateAssignmentAndSubmissionContent(
    course: Course,
    assignment: Assignment,
    submissions: Submission[],
    quiz: Quiz | undefined,
    canvasAccessToken: string,
    canvasDomain: string
) {
    const { highSubmission, medianSubmission, lowSubmission } =
        getHighMedianLowSubmissions(submissions)

    const descriptionContent = await generateAssignmentOrQuizDescription(
        course,
        assignment,
        quiz,
        canvasAccessToken,
        canvasDomain
    )

    const highSubmissionContent =
        highSubmission === undefined
            ? undefined
            : await generateAssignmentOrQuizSubmission(
                course,
                assignment,
                highSubmission,
                quiz,
                canvasAccessToken,
                canvasDomain
            )

    const medianSubmissionContent =
        medianSubmission === undefined
            ? undefined
            : await generateAssignmentOrQuizSubmission(
                course,
                assignment,
                medianSubmission,
                quiz,
                canvasAccessToken,
                canvasDomain
            )

    const lowSubmissionContent =
        lowSubmission === undefined
            ? undefined
            : await generateAssignmentOrQuizSubmission(
                course,
                assignment,
                lowSubmission,
                quiz,
                canvasAccessToken,
                canvasDomain
            )

    return {
        descriptionContent: descriptionContent,
        highSubmissionContent: highSubmissionContent,
        medianSubmissionContent: medianSubmissionContent,
        lowSubmissionContent: lowSubmissionContent,
    }
}

const generateAssignmentOrQuizDescription = async (
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

const generateAssignmentOrQuizSubmission = async (
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

function getHighMedianLowSubmissions(submissions: Submission[]): {
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
        case 0:
            return {
                highSubmission: undefined,
                medianSubmission: undefined,
                lowSubmission: undefined,
            }

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

function median(arr: number[]) {
    const s = arr.toSorted((a, b) => a - b)
    const mid = Math.floor(s.length / 2)
    const res = s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]
    return Math.ceil(res)
}
