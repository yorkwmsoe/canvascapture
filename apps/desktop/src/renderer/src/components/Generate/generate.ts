/**
 * Defines methods for generating reports
 *
 * generateAssignmentAndSubmissionContent() returns the contents of an assignment
 * description and the high, median, and low submissions.
 * See the method definition below for more details.
 *
 * generate() is used to facilitate the actual generation of the pdf
 * See the method definition below for more details.
 *
 * generateChart() and generateAvgGradeChart are used to generate statistics charts
 * See the method definitions below for more details
 */

import { join } from 'path'
import { getCourseName } from '@renderer/utils/courses'
import { sanitizePath } from '@renderer/utils/sanitize-path'
import markdownit from 'markdown-it'
import { mkdirSync, rmSync, writeFileSync } from 'fs'
import { Assignment, Course, Quiz, Submission, DataNode, isCourseDataNode } from '@canvas-capture/lib'
import { FilePathContentPair } from './types'
import { generateTOC } from '@renderer/components/Generate/generateTOC'
import { AverageAssignmentGradeExport, oneYearExport } from '@renderer/components/Statistics'
import { canvasApi } from '@renderer/apis/canvas.api'

import {
    generateAssignmentOrQuizDescription,
    generateAssignmentOrQuizSubmission,
    getHighMedianLowSubmissions,
} from './utils'

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
    Filler,
} from 'chart.js'

Chart.register(
    LinearScale, // for the y-axis scale
    CategoryScale, // for the x-axis scale
    LineController, // for creating line charts
    LineElement, // for line elements in the chart
    PointElement, // for point elements in the chart
    Title, // for chart titles
    Tooltip, // for tooltips
    Legend, // for the chart legend
    Filler
)

export async function generate(
    data: DataNode[],
    generationName: string,
    documentsPath: string,
    canvasAccessToken: string,
    canvasDomain: string,
    isStudent: boolean,
) {

    // Find all assignments and submissions. Utilized for chart/graph creation.
    const allAssignments: Assignment[] = []
    const allSubmissions: Submission[] = []
    for (const course of data) {
        if (isCourseDataNode(course)) {
            for (const assignment of course.children) {
                if (assignment.assignment) {
                    allAssignments.push(assignment.assignment)
                    const submissions = await canvasApi.getSubmissions({
                        canvasAccessToken,
                        canvasDomain,
                        isStudent,
                        courseId: course.course.id,
                        assignmentId: assignment.assignment.id,
                    });

                    // Add all submissions to allSubmissions
                    for (let ivar = 0; ivar < submissions.length; ivar++) {
                        allSubmissions.push(submissions[ivar]);
                    }
                }
            }
        }
    }

    // Remove existing directory to start fresh
    rmSync(join(documentsPath, sanitizePath(generationName)), {
        recursive: true,
        force: true,
    })

    const md = markdownit({ linkify: true, html: true })

    // Object to hold combined markdown content for each course
    const courseMarkdownContent: { [courseName: string]: string } = {}

    // Iterate through courses and their assignments
    data.forEach((course) => {
        if (isCourseDataNode(course)) {
            let courseContent = `# ${getCourseName(course.course)}\n\n` // Start course-level markdown content with a title

            // Loop through assignments and combine their content
            course.children.forEach((assignment) => {
                mkdirSync(join(documentsPath, generationName), {
                    recursive: true,
                })

                assignment.children.forEach((file) => {
                    courseContent += `${file.content.join('\n')}\n\n` // Append file content
                })
            })

            // Store the combined content for this course
            courseMarkdownContent[course.course.name] = courseContent
        }
    })

    // If any graphs are to be generated, generate them.
    const oneYearStatGraph = oneYearExport()
        ? await generateChart(allSubmissions) : undefined
    const avgAssignGradeGraph = AverageAssignmentGradeExport()
        ? await generateAvgGradeChart(allSubmissions, allAssignments) : undefined


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
        writeFileSync(filePath, markdownContent)

        // Convert markdown to HTML
        const htmlContent = md.render(markdownContent)

        // Add table of contents and charts
        const htmlContentWithTocAndCharts =
            generateTOC(htmlContent) + '\n\n\n'
            + htmlContent
            + (oneYearStatGraph !== undefined ? oneYearStatGraph : "")
            + (avgAssignGradeGraph !== undefined ? avgAssignGradeGraph : "")

        return {
            filePath: join(generationName, `${courseName}`),
            content: htmlContentWithTocAndCharts,
        }
    })

    // Return the array of file paths and their HTML content
    return htmlData
}

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

    const descriptionContent = (
        await generateAssignmentOrQuizDescription(
            course,
            assignment,
            quiz,
            canvasAccessToken,
            canvasDomain
        )
    )

    const highSubmissionContent =
        highSubmission === undefined
            ? undefined
            : (
                  await generateAssignmentOrQuizSubmission(
                      course,
                      assignment,
                      highSubmission,
                      quiz,
                      canvasAccessToken,
                      canvasDomain
                  )
              )

    const medianSubmissionContent =
        medianSubmission === undefined
            ? undefined
            : (
                  await generateAssignmentOrQuizSubmission(
                      course,
                      assignment,
                      medianSubmission,
                      quiz,
                      canvasAccessToken,
                      canvasDomain
                  )
              )

    const lowSubmissionContent =
        lowSubmission === undefined
            ? undefined
            : (
                  await generateAssignmentOrQuizSubmission(
                      course,
                      assignment,
                      lowSubmission,
                      quiz,
                      canvasAccessToken,
                      canvasDomain
                  )
              )

    return {
        descriptionContent: descriptionContent,
        highSubmissionContent: highSubmissionContent,
        medianSubmissionContent: medianSubmissionContent,
        lowSubmissionContent: lowSubmissionContent,
    }
}

const bgc: string = '#e8e8e8' //`#d6d6d6`
export async function generateChart(allSubmissions: Submission[]) {
    let oneYearStat2
    const ctx = document.createElement('canvas')
    ctx.width = 800
    ctx.height = 800
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
    Chart.defaults.font.size = 32
    return new Promise((resolve) => {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: assignmentCount,
                datasets: [
                    {
                        label: 'Days to Grade',
                        data: timeToGrade,
                        borderWidth: 5,
                        pointBackgroundColor: 'cyan',
                        borderColor: '#008b8b',
                        fill: 'origin',
                        backgroundColor: bgc,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Assignments',
                        },
                    },
                    y: {
                        beginAtZero: true,

                        title: {
                            display: true,
                            text: 'Days since submitted',
                        },
                    },
                },
                animation: {
                    onComplete: function () {
                        // Now that the chart is rendered, capture the canvas as an image
                        const imgData = ctx.toDataURL()

                        const wrap = document.createElement('div')
                        const img = document.createElement('img')
                        img.src = imgData // Set the image as the source of the img element
                        img.width = 400
                        img.height = 400

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

export async function generateAvgGradeChart(allSubmissions: Submission[], allAssignments: Assignment[]) {
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
    const minValue: number = Math.min(...temparr)
    const chartMin: number = minValue * 0.9
    return new Promise((resolve) => {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: assignmentCount,
                datasets: [
                    {
                        label: 'Avg Assignment Grade',
                        data: temparr,
                        borderWidth: 5,
                        pointBackgroundColor: 'cyan',
                        borderColor: '#008b8b',
                        fill: true,
                        backgroundColor: bgc,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Assignments',
                        },
                    },
                    y: {
                        min: chartMin,
                        title: {
                            display: true,
                            text: 'Average Percent Grade',
                        },
                    },
                },
                animation: {
                    onComplete: function () {
                        // Now that the chart is rendered, capture the canvas as an image
                        const imgData = ctx.toDataURL()

                        const wrap = document.createElement('div')
                        const img = document.createElement('img')
                        img.src = imgData // Set the image as the source of the img element
                        img.width = 400
                        img.height = 400

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
