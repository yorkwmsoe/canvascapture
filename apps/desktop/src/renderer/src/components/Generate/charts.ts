/**
 * This file provides functions to generate visual representations of grading-related data using Chart.js.
 * These charts include:
 *
 * 1. A chart showing the number of days it took to grade assignments after submission (`generateChart`).
 * 2. A chart displaying the average grades for assignments (`generateAvgGradeChart`).
 *
 * The functions temporarily render charts on a canvas in the DOM, capture them as images, and return the images' HTML strings.
 * The Chart.js library is utilized to create visually appealing and customizable charts.
 */
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
import { Assignment, AssignmentGroup, Submission } from '@canvas-capture/lib'

// This registers essential components for Chart.js.
// Note: These components only need to be registered once.
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

// This specifies the background color of the generated charts.
const BACKGROUND_COLOR: string = '#e8e8e8' //`#d6d6d6`

export function generateGradingTurnaroundChart(
    assignmentGroups: AssignmentGroup[],
    assignmentSubmissionsMap: Map<Assignment, Submission[]>
) {
    // TODO: Complete this function, remove debug console logs.
    console.log(assignmentGroups)
    console.log(assignmentSubmissionsMap)
}

export function generateAverageGradeChart(
    assignmentGroups: AssignmentGroup[],
    assignmentSubmissionsMap: Map<Assignment, Submission[]>
) {
    // TODO: Complete this function, remove debug console logs.
    console.log(assignmentGroups)
    console.log(assignmentSubmissionsMap)
}

/**
 * Generates a chart that displays the time taken to grade assignments.
 *
 * This function processes a list of submissions to compute the number of days
 * it took for each assignment to be graded after being submitted. A line chart
 * is generated using Chart.js to visually present the grading time data. The
 * chart is temporarily rendered on a canvas in the DOM, captured as an image,
 * and then converted into an HTML string to be returned for reuse elsewhere.
 *
 * @param allSubmissions - An array of submissions containing assignment IDs and timestamps.
 * @returns A promise that resolves to a string containing the HTML of the generated chart image.
 */
export async function generateChart(
    allSubmissions: Submission[]
): Promise<string> {
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
                        backgroundColor: BACKGROUND_COLOR,
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

/**
 * Generates a chart that displays the average grades for assignments.
 *
 * This function processes a list of submissions and assignments to compute
 * the average grade for each assignment. A line chart is generated using Chart.js
 * to visually present the average grades. The chart is temporarily rendered on a
 * canvas in the DOM, captured as an image, and then converted into an HTML string
 * to be returned for reuse elsewhere.
 *
 * @param allSubmissions - An array of submissions containing assignment IDs and scores.
 * @param allAssignments - An array of assignments containing assignment details like ID and points possible.
 * @returns A promise that resolves to a string containing the HTML of the generated chart image.
 */
export async function generateAvgGradeChart(
    allSubmissions: Submission[],
    allAssignments: Assignment[]
): Promise<string> {
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
                        backgroundColor: BACKGROUND_COLOR,
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
