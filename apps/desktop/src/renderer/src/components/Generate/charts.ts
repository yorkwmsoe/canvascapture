/**
 * This file provides functions to generate visual representations of grading-related data using Chart.js.
 * These charts include:
 *
 * 1. A chart displaying the average grades for assignments (`generateAverageGradeChart`).
 *
 * The functions temporarily render charts on a canvas in the DOM, capture them as images, and return the images' HTML strings.
 * The Chart.js library is utilized to create visually appealing and customizable charts.
 */
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    ChartData,
    LinearScale,
    Title,
} from 'chart.js'
import { Assignment, AssignmentGroup, Submission } from '@canvas-capture/lib'
import {
    calculateDescriptiveStatistics,
    DescriptiveStatistics,
} from '@renderer/utils/statistics'

/**
 * This registers only the components utilized from Chart.js, reducing program bloat.
 * If a new type of chart is added, or current charts are expanded, the required components
 *  will need to be imported and registered also.
 * @see https://www.chartjs.org/docs/latest/getting-started/integration.html
 */
Chart.register(
    BarController, // Controller for bar charts
    BarElement, // Render bar charts
    CategoryScale, // X-axis categories
    LinearScale, // Y-axis numerical data
    Title // Chart title
)

// Default chart settings are accessed through Chart.defaults
// See https://www.chartjs.org/docs/latest/api/interfaces/Defaults.html
Chart.defaults.backgroundColor = 'rgba(255,0,0,0.75)'
Chart.defaults.borderColor = 'rgb(62,62,62)'
Chart.defaults.color = 'rgb(0,0,0)'

export async function generateGradingTurnaroundChart(
    assignmentGroups: AssignmentGroup[],
    assignmentSubmissionsMap: Map<number, Submission[]>,
    width: number = 400,
    height: number = 400
) {
    const dataset = createGradingTurnaroundDataSet(
        assignmentGroups,
        assignmentSubmissionsMap
    )
    const barChartConfig = createBarChartConfigObject(
        'Grading Turnaround by Assignment Group',
        dataset.labels,
        dataset.data,
        'Days past due date.',
        'Assignment Group',
        -5, // From -1 business week (for early grading)
        10 // To two business weeks.
    )
    return `<img src="${await createChartImage(barChartConfig, width, height)}" alt="Average Grade Chart">`
}

/**
 * Generates an image element representing a bar chart of the average grades for assignment groups.
 *
 * @param {AssignmentGroup[]} assignmentGroups - An array of assignment groups containing group metadata.
 * @param {Map<number, Submission[]>} assignmentSubmissionsMap - A map linking assignment IDs to a list of its submissions.
 * @param {number} width - The width of the image, by default 500
 * @param {number} height - The height of the image, by default 500
 * @return {string} The generated chart HTMLImageElement depicting the average grades.
 */
export async function generateAverageGradeChart(
    assignmentGroups: AssignmentGroup[],
    assignmentSubmissionsMap: Map<number, Submission[]>,
    width: number = 400,
    height: number = 400
): Promise<string> {
    const dataset = createAverageGradeDataSet(
        assignmentGroups,
        assignmentSubmissionsMap
    )
    const barChartConfig = createBarChartConfigObject(
        'Average Grade by Assignment Group',
        dataset.labels,
        dataset.data,
        'Grade Percentage',
        'Assignment Group',
        0.7,
        1.0,
        (value: number) => `${(value * 100).toFixed(0)}%`
    )
    return `<img src="${await createChartImage(barChartConfig, width, height)}" alt="Average Grade Chart">`
}

/**
 * Generates a base64 encoded image of a chart based on the provided chart configuration.
 * This function creates a chart, renders it to a temporary canvas, and extracts the base64 image
 * after the chart rendering is complete. The chart instance is destroyed afterward to prevent memory leaks.
 *
 * @param chartConfig - The configuration object for the chart to be rendered and converted into an image.
 * @param width
 * @param height
 * @return {Promise<string>} A promise that resolves to a base64 encoded string representing the generated chart image.
 */
async function createChartImage(
    chartConfig: any,
    width: number,
    height: number
): Promise<string> {
    return new Promise((resolve, reject) => {
        // This function generates a base64 image of the chart once the rendering is complete.
        // It is injected into the `onComplete` field of the `animation` option in the chart configuration.
        // After generating the image, it destroys the chart instance to prevent memory leaks
        // and resolves/rejects the promise based on success or failure.
        const generateImage = (animation) => {
            const chart: Chart = animation.chart
            try {
                const chartImage = chart.toBase64Image('image/png', 1) // Setting second argument 1 ensures max quality based on canvas element size.
                chart.destroy()
                resolve(chartImage)
            } catch (error) {
                chart.destroy()
                reject(error)
            }
        }

        // This HTMLCanvasElement will temporarily house the chart.
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        // Inject generateImage function into the chartConfig object, so that
        // it executes when the chart is fully rendered.
        if (!chartConfig.options) chartConfig.options = {}
        if (!chartConfig.options.animation) chartConfig.options.animation = {}
        chartConfig.options.animation.onComplete = generateImage

        new Chart(canvas, chartConfig)
    })
}

/**
 * Creates a dataset containing average grade statistics for assignment groups.
 *
 * @param {AssignmentGroup[]} assignmentGroups - An array of assignment groups to process.
 * @param {Map<Assignment, Submission[]>} assignmentSubmissionsMap - A map linking assignments to their corresponding submissions.
 * @return {{ labels: string[], data: number[] }} An object containing `labels`, which are the names of assignment groups,
 * and `data`, which are the mean grade statistics for each group.
 */
function createAverageGradeDataSet(
    assignmentGroups: AssignmentGroup[],
    assignmentSubmissionsMap: Map<number, Submission[]>
): { labels: string[]; data: number[] } {
    const dataset = {
        labels: [] as string[],
        data: [] as number[],
    }

    const groupSubmissionsMap = createGroupSubmissionsMap(
        assignmentGroups,
        assignmentSubmissionsMap
    )

    for (const assignmentGroup of assignmentGroups) {
        // Collect all on-time and graded submissions
        const submissions = groupSubmissionsMap
            .get(assignmentGroup.id)!
            .filter((submission) => {
                return (
                    !submission.missing &&
                    !submission.late &&
                    submission.grade !== null
                )
            })

        // Calculate grade statistics.
        const assignmentPointsPossibleMap = createAssignmentPointsPossibleMap(
            assignmentGroup.assignments
        )
        const gradeStatistics = calculateGradeStatistics(
            submissions,
            assignmentPointsPossibleMap
        )
        if (gradeStatistics === null) continue

        // Push to data set
        dataset.labels.push(assignmentGroup.name)
        dataset.data.push(gradeStatistics.mean)
    }

    return dataset
}

/**
 * Creates a dataset containing grading turnaround statistics for assignment groups.
 * Turnaround time is determined as business days between due date and submission grade.
 * Late/missing submissions are not included in this calculation and early grading
 *  is counted as negative days.
 *
 * @param {AssignmentGroup[]} assignmentGroups - An array of assignment groups to process.
 * @param {Map<Assignment, Submission[]>} assignmentSubmissionsMap - A map linking assignments to their corresponding submissions.
 * @return {{ labels: string[], data: number[] }} An object containing `labels`, which are the names of assignment groups,
 * and `data`, which are the mean grade statistics for each group.
 */
function createGradingTurnaroundDataSet(
    assignmentGroups: AssignmentGroup[],
    assignmentSubmissionsMap: Map<number, Submission[]>
): { labels: string[]; data: number[] } {
    const dataset = {
        labels: [] as string[],
        data: [] as number[],
    }

    const groupSubmissionsMap = createGroupSubmissionsMap(
        assignmentGroups,
        assignmentSubmissionsMap
    )

    for (const assignmentGroup of assignmentGroups) {
        // Collect all graded submissions
        const submissions = groupSubmissionsMap
            .get(assignmentGroup.id)!
            .filter((submission) => submission.grade !== null)

        // Calculate turnaround statistics.
        const assignmentDueDateMap = createAssignmentDueDateMap(
            assignmentGroup.assignments.filter((assignment) => {
                return assignment.due_at !== null
            })
        )
        const turnaroundStatistics = calculateGradingTurnaroundStatistics(
            submissions,
            assignmentDueDateMap
        )
        if (turnaroundStatistics === null) continue

        // Push to data set
        dataset.labels.push(assignmentGroup.name)
        dataset.data.push(turnaroundStatistics.mean)
    }

    return dataset
}

/**
 * Creates a configuration object for a bar chart using Chart.js.
 * See https://www.chartjs.org/docs/latest/configuration/
 *
 * @param {string} chartTitle - The title placed on top of the chart.
 * @param {string[]} labels - An array of labels for the X-axis of the chart.
 * @param {number[]} data - An array of data points corresponding to the labels.
 * @param {string} yTitle - The title placed next to the y axis.
 * @param {string} xTitle - The title placed next to the x axis
 * @param {number} yMin - The minimum value displayed on the Y-axis.
 * @param {number} yMax - The maximum value displayed on the Y-axis.
 * @param {(value: number) => string} tickFnc - A function to customize the display of tick labels on the Y-axis.
 * @throws {Error} Throws an error if the lengths of labels and data do not match.
 * @returns A Chart.js configuration object for the bar chart.
 */
function createBarChartConfigObject(
    chartTitle: string,
    labels: string[],
    data: number[],
    yTitle: string,
    xTitle: string,
    yMin: number,
    yMax: number,
    tickFnc: (value: number) => string = (value) => `${value}`
) {
    if (labels.length != data.length)
        throw new Error('Labels and data must be of the same length')
    const chartData: ChartData<'bar'> = {
        labels: labels,
        datasets: [
            {
                data: data,
            },
        ],
    }

    const chartOptions = {
        responsive: false,
        plugins: {
            title: {
                display: true,
                text: chartTitle,
            },
        },
        scales: {
            y: {
                min: yMin, // Set the minimum value of the Y-axis
                max: yMax, // Set the maximum value of the Y-axis
                ticks: {
                    callback: tickFnc, // For custom y-tick labels.
                },
                title: {
                    display: true,
                    text: yTitle,
                },
            },
            x: {
                ticks: {
                    align: 'center', // Ensures the labels align to the center of the bars
                },
                grid: {
                    offset: true, // Forces alignment between labels and the bars
                },
                title: {
                    display: true,
                    text: xTitle,
                },
            },
        },
    }
    return {
        type: 'bar',
        data: chartData,
        options: chartOptions,
    }
}

/**
 * Creates a map of group IDs to a list of submissions for the assignments in each group.
 *
 * For proper use of this function, each AssignmentGroup object must be prepped by populating the
 *  Assignments field with an array of type Assignment[]. The Canvas API request can be modified to
 *  include all assignments. See: https://canvas.instructure.com/doc/api/assignment_groups.html
 *
 * @param {AssignmentGroup[]} assignmentGroups - An array of assignment groups, where each group contains assignments.
 * @param {Map<Assignment, Submission[]>} assignmentSubmissionsMap - A map linking assignments to their corresponding submissions.
 * @return {Map<string, Submission[]>} A map where the key is the group name and the value is an array of submissions for assignments in that group.
 */
function createGroupSubmissionsMap(
    assignmentGroups: AssignmentGroup[],
    assignmentSubmissionsMap: Map<number, Submission[]>
): Map<number, Submission[]> {
    const allSubmissionsByGroup: Map<number, Submission[]> = new Map()
    for (const assignmentGroup of assignmentGroups) {
        for (const assignment of assignmentGroup.assignments) {
            if (!assignmentSubmissionsMap.has(assignment.id)) continue
            const submissions = assignmentSubmissionsMap.get(assignment.id)!
            allSubmissionsByGroup.set(assignmentGroup.id, submissions)
        }
    }
    return allSubmissionsByGroup
}

/**
 * Creates a map of assignments and their corresponding points possible.
 *
 * @param {Assignment[]} assignments - An array of assignment objects, each containing an `id` and `points_possible` property.
 * @return {Map<number, number>} A map where the keys are assignment IDs and the values are the points possible for each assignment.
 */
function createAssignmentPointsPossibleMap(
    assignments: Assignment[]
): Map<number, number> {
    const pointsPossibleByAssignment = new Map<number, number>()
    for (const assignment of assignments) {
        pointsPossibleByAssignment.set(
            assignment.id,
            assignment.points_possible
        )
    }
    return pointsPossibleByAssignment
}

/**
 * Creates a map of assignment IDs to their corresponding due dates.
 *
 * @param {Assignment[]} assignments - An array of assignment objects, each containing the assignment details, including ID and due date.
 * @return {Map<number, Date>} A map where the keys are assignment IDs and the values are the corresponding due dates as Date objects.
 */
function createAssignmentDueDateMap(
    assignments: Assignment[]
): Map<number, Date> {
    const dueDateByAssignment = new Map<number, Date>()
    for (const assignment of assignments) {
        if (assignment.due_at === null) continue
        dueDateByAssignment.set(assignment.id, new Date(assignment.due_at!))
    }
    return dueDateByAssignment
}

/**
 * Calculates descriptive statistics for standardized grade percentages (0 = 0%, 1 = 100%) based on submissions and points possible.
 *
 * Grades are standardized as percentages by dividing the score by the points possible for each assignment.
 * All assignments are weighted equally, regardless of their total points (e.g., 8/10 is equivalent to 80/100).
 *
 * @param {Submission[]} submissions - An array of submission objects containing assignment-related scores.
 * @param {Map<number, number>} assignmentPointsPossibleMap - A map where keys are assignment IDs and values are the total points possible for each assignment.
 * @return {DescriptiveStatistics | null} Descriptive statistics for grade percentages (0 = 0%, 1 = 100%), or null if no submissions.
 **/
function calculateGradeStatistics(
    submissions: Submission[],
    assignmentPointsPossibleMap: Map<number, number>
): DescriptiveStatistics | null {
    if (submissions.length === 0) return null

    const gradePercentages = submissions.map((submission) => {
        const pointsPossible = assignmentPointsPossibleMap.get(
            submission.assignment_id
        )
        if (pointsPossible === undefined) return 0
        return submission.score / pointsPossible
    })

    return calculateDescriptiveStatistics(gradePercentages)
}

/**
 * Calculates the descriptive statistics for grading turnaround times based on student submissions and assignment due dates.
 *
 * @param {Submission[]} submissions - An array of submissions where each submission contains information about the assignment and grading details.
 * @param {Map<number, Date>} assignmentDueDateMap - A map where the key is the assignment ID and the value is the corresponding due date.
 * @return {DescriptiveStatistics | null} The descriptive statistics of grading turnaround times in business days, or null if there are no submissions.
 */
function calculateGradingTurnaroundStatistics(
    submissions: Submission[],
    assignmentDueDateMap: Map<number, Date>
): DescriptiveStatistics | null {
    if (submissions.length === 0) return null

    // Calculate days between submission and graded.
    const gradingTurnaround = submissions
        .map((submission) => {
            if (
                !submission.graded_at ||
                !assignmentDueDateMap.has(submission.assignment_id)
            )
                return null
            const dueDate = assignmentDueDateMap.get(submission.assignment_id!)!
            const gradeDate = new Date(submission.graded_at!)
            return calculateBusinessDays(dueDate, gradeDate)
        })
        .filter((value) => value !== null)

    return calculateDescriptiveStatistics(gradingTurnaround)
}

/**
 * Calculates the number of business days (non-weekend days) between two dates.
 * If the start date is after the end date, the calculation will return a negative count.
 *
 * @param {Date} startDate - The starting date of the calculation.
 * @param {Date} endDate - The ending date of the calculation.
 * @return {number} The number of business days between the start and end dates.
 *                  A negative count is returned if the start date is after the end date.
 */
function calculateBusinessDays(startDate: Date, endDate: Date): number {
    let count = 0
    let forward = true

    // Determine the direction of calculation
    if (startDate > endDate) {
        forward = false
        // Swap the dates to calculate correctly
        ;[startDate, endDate] = [endDate, startDate]
    }

    let currentDate = new Date(startDate)
    currentDate.setHours(0, 0, 0, 0) // Normalize startDate to midnight
    const normalizedEndDate = new Date(endDate)
    normalizedEndDate.setHours(0, 0, 0, 0) // Normalize endDate to midnight

    // While there are at least 24 hours between the current date and the end date
    while (
        currentDate.getTime() + 24 * 60 * 60 * 1000 <=
        normalizedEndDate.getTime()
    ) {
        const day = currentDate.getDay() // 0 = Sunday, 6 = Saturday
        if (day !== 0 && day !== 6) {
            count++ // Count only business (non-weekend) days
        }
        currentDate.setDate(currentDate.getDate() + 1) // Move to the next day
    }

    // If the calculation was in reverse, make the count negative
    return forward ? count : -count
}
