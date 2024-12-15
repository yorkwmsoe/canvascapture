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
import { oneYearExport, AverageAssignmentGradeExport } from '../Statistics'
import {
    Chart,
    LinearScale,
    CategoryScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

const allSubmissions: Submission[] = []
const allAssignments: Assignment[] = []

Chart.register(
    LinearScale, // for the y-axis scale
    CategoryScale, // for the x-axis scale
    LineController, // for creating line charts
    LineElement, // for line elements in the chart
    PointElement, // for point elements in the chart
    Title, // for chart titles
    Tooltip, // for tooltips
    Legend // for the chart legend
)
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
            allAssignments.push(assignment)
            const submissions = await canvasApi.getSubmissions({
                canvasAccessToken,
                canvasDomain,
                isStudent,
                courseId: course.id,
                assignmentId: assignment.id,
            })
            for (let ivar = 0; ivar < submissions.length; ivar++) {
                allSubmissions.push(submissions[ivar])
            }

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

    let oneYearStat
    let avgAssignGrade
    if (oneYearExport()) {
        oneYearStat = await generateChart()
    }
    if (AverageAssignmentGradeExport()) {
        avgAssignGrade = await generateAvgGradeChart()
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
        let htmlContentEditable = htmlContentWithTOC

        if (oneYearStat != undefined) {
            htmlContentEditable += oneYearStat
        }
        if (avgAssignGrade != undefined) {
            htmlContentEditable += avgAssignGrade
        }
        return {
            filePath: join(generationName, `${courseName}`),
            content: htmlContentEditable,
        }
    })

    return htmlData
}

async function generateChart() {
    let oneYearStat2
    const ctx = document.createElement('canvas')
    ctx.width = 200
    ctx.height = 200
    const allUniqueSubmissions: Submission[] = []
    const submittedAt: Date[] = []
    const gradedAt: Date[] = []
    for (let ivar = 0; ivar < allSubmissions.length; ivar++) {
        const isFound = allUniqueSubmissions.find(
            (x) => x.id == allSubmissions[ivar].id
        )

        if (!isFound) {
            allUniqueSubmissions.push(allSubmissions[ivar])
        }
    }

    for (let ivar = 0; ivar < allUniqueSubmissions.length; ivar++) {
        submittedAt.push(allUniqueSubmissions[ivar].submitted_at)
        gradedAt.push(allUniqueSubmissions[ivar].graded_at)
    }

    const timeToGrade: number[] = []
    const assignmentCount: number[] = []
    let passed = 0
    for (let ivar = 0; ivar < submittedAt.length; ivar++) {
        if (gradedAt[ivar] != null && submittedAt[ivar] != null) {
            passed++
            const months =
                parseInt((gradedAt[ivar] + '').substring(5, 7)) -
                parseInt((submittedAt[ivar] + '').substring(5, 7))
            let days
            if (months == 0) {
                days =
                    parseInt((gradedAt[ivar] + '').substring(8, 10)) -
                    parseInt((submittedAt[ivar] + '').substring(8, 10))
            } else {
                days =
                    parseInt((gradedAt[ivar] + '').substring(8, 10)) +
                    (months * 30 -
                        parseInt((submittedAt[ivar] + '').substring(8, 10)))
            }

            timeToGrade.push(days) //graded at - submitted at.
            assignmentCount.push(passed)
        }
    }

    // Append the canvas to the body temporarily
    document.body.appendChild(ctx)

    return new Promise((resolve) => {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: assignmentCount,
                datasets: [
                    {
                        label: 'Days to Grade',
                        data: timeToGrade,
                        borderWidth: 1,
                        pointBackgroundColor: 'cyan',
                        borderColor: '#008b8b',
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                animation: {
                    onComplete: function () {
                        // Now that the chart is rendered, capture the canvas as an image
                        const imgData = ctx.toDataURL()

                        const wrap = document.createElement('div')
                        const img = document.createElement('img')
                        img.src = imgData // Set the image as the source of the img element
                        img.width = 800
                        img.height = 800

                        wrap.appendChild(img)

                        oneYearStat2 = wrap.innerHTML

                        // Remove the canvas from the DOM
                        document.body.removeChild(ctx)

                        resolve(oneYearStat2) // Resolve the promise with the image HTML
                    },
                },
            },
        })
    })
}

async function generateAvgGradeChart() {
    let avgAssignGrade2
    const ctx = document.createElement('canvas')
    ctx.width = 200
    ctx.height = 200

    const assignmentCount: number[] = [] //TODO: delete

    const gradesByAssignent: number[][] = []
    let gbalength = 0
    for (let ivar = 0; ivar < allAssignments.length; ivar++) {
        //Adds ONE OF EACH assignemnt to GBA
        const isInGBA = gradesByAssignent.find(
            (x) => x[0] == allAssignments[ivar].id
        )
        if (!isInGBA) {
            gradesByAssignent.push([])
            gradesByAssignent[gbalength].push(allAssignments[ivar].id)
            gbalength++
        }
    }

    for (let ivar = 0; ivar < allSubmissions.length; ivar++) {
        for (let xvar = 0; xvar < gradesByAssignent.length; xvar++) {
            if (
                allSubmissions[ivar].assignment_id == gradesByAssignent[xvar][0]
            ) {
                gradesByAssignent[xvar].push(allSubmissions[ivar].score)
            }
        }
    }

    for (let ivar = 0; ivar < gradesByAssignent.length; ivar++) {
        if (gradesByAssignent[ivar][1] === undefined) {
            gradesByAssignent.splice(ivar, 1)
            ivar--
        }
    }

    const temparr: number[] = []

    for (let ivar = 0; ivar < gradesByAssignent.length; ivar++) {
        assignmentCount.push(ivar + 1)
        let sum = 0
        const pp = allAssignments.find(
            (as) => as.id == gradesByAssignent[ivar][0]
        )?.points_possible

        for (let xvar = 1; xvar < gradesByAssignent[ivar].length; xvar++) {
            if (pp != undefined) {
                sum += gradesByAssignent[ivar][xvar] * (100 / pp)
            } else {
                sum += gradesByAssignent[ivar][xvar]
            }
        }
        if (gradesByAssignent[ivar].length > 1) {
            //if statement in case no-one turns it in
            sum /= gradesByAssignent[ivar].length - 1
        }

        temparr.push(sum)
    }

    // Append the canvas to the body temporarily
    document.body.appendChild(ctx)

    return new Promise((resolve) => {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: assignmentCount,
                datasets: [
                    {
                        label: 'Avg Assignment Grade',
                        data: temparr,
                        borderWidth: 1,
                        pointBackgroundColor: 'cyan',
                        borderColor: '#008b8b',
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                animation: {
                    onComplete: function () {
                        // Now that the chart is rendered, capture the canvas as an image
                        const imgData = ctx.toDataURL()

                        const wrap = document.createElement('div')
                        const img = document.createElement('img')
                        img.src = imgData // Set the image as the source of the img element
                        img.width = 800
                        img.height = 800

                        wrap.appendChild(img)

                        avgAssignGrade2 = wrap.innerHTML

                        // Remove the canvas from the DOM
                        document.body.removeChild(ctx)

                        resolve(avgAssignGrade2) // Resolve the promise with the image HTML
                    },
                },
            },
        })
    })
}
