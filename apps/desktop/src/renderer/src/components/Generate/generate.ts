import { rm, writeFile } from 'fs/promises'
import markdownit from 'markdown-it'
import _ from 'lodash'
import { mkdirSync } from 'fs'
import { join } from 'path'
import { Assignment, Course, Quiz, Submission } from '@canvas-capture/lib'
import { canvasApi } from '../../apis/canvas.api'
import { getCourseName } from '@renderer/utils/courses'
import { sanitizePath } from '@renderer/utils/sanitize-path'
import { FilePathContentPair } from './types'
import { generateAssignmentOrQuiz, median } from './utils'
import { generateTOC } from './generateTOC'

export const generatePairs = async (
    course: Course,
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
                course,
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
                course,
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
                course,
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
    isStudent: boolean,
    generationName: string,
    documentsPath: string
) {
    await rm(join(documentsPath, sanitizePath(generationName)), {
        recursive: true,
        force: true,
    })

    const md = markdownit({ linkify: true, html: true })

    // Object to hold combined markdown content for each course
    const courseMarkdownContent: { [courseId: string]: string } = {}

    for (const course of courses) {
        const filteredAssignments = assignments.filter(
            (a) => a.course_id === course.id
        )
        let courseContent = `# ${getCourseName(course)}\n\n` // Start course-level markdown content with a title
        mkdirSync(join(documentsPath, generationName), { recursive: true })

        for (const assignment of filteredAssignments) {
            const submissions = await canvasApi.getSubmissions({
                canvasAccessToken,
                canvasDomain,
                isStudent,
                courseId: course.id,
                assignmentId: assignment.id,
            })

            const uniqueSubmissions = _.uniqBy(
                submissions.filter((s) => !_.isNil(s.score)),
                (s) => s.score
            )

            if (uniqueSubmissions.length > 0) {
                const quiz = assignment.is_quiz_assignment
                    ? await canvasApi.getQuiz({
                          canvasAccessToken,
                          canvasDomain,
                          courseId: assignment.course_id,
                          quizId: assignment.quiz_id,
                      })
                    : undefined
                const pairs = await generatePairs(
                    course,
                    assignment,
                    uniqueSubmissions,
                    quiz,
                    sanitizePath(join(generationName, getCourseName(course))),
                    canvasAccessToken,
                    canvasDomain
                )

                pairs.forEach((pair) => {
                    courseContent += `${pair.content}\n\n` // Append assignment content
                })
            }
        }

        // Store the combined content for this course
        courseMarkdownContent[course.name] = courseContent
    }

    // Write markdown and generate HTML for each course
    const htmlData: FilePathContentPair[] = Object.keys(
        courseMarkdownContent
    ).map((courseName) => {
        const markdownContent = courseMarkdownContent[courseName]
        const filePath = join(
            documentsPath,
            join(generationName, `${courseName}`) + '.md'
        )

        // Write the markdown file for the course
        writeFile(filePath, markdownContent)

        // Convert markdown to HTML
        const htmlContent = md.render(markdownContent)
        const tocContent = generateTOC(htmlContent)
        const htmlContentWithTOC = tocContent + '\n\n\n' + htmlContent

        return {
            filePath: join(generationName, `${courseName}`),
            content: htmlContentWithTOC,
        }
    })

    return htmlData // Return HTML content for PDF generation
}
