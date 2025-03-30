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
    assignmentSubmissionsMap: Map<number, Submission[]>
) {
    // TODO: Complete this function, remove debug console logs.
    console.log(assignmentGroups)
    console.log(assignmentSubmissionsMap)

    return ''
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
        'Grade Percentage',
        'Assignment Group',
        dataset.labels,
        dataset.data
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
        // Calculate grade statistics
        const assignmentPointsPossibleMap = createAssignmentPointsPossibleMap(
            assignmentGroup.assignments
        )
        const submissions = groupSubmissionsMap.get(assignmentGroup.id)!
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
 * Creates a configuration object for a bar chart using Chart.js.
 * See https://www.chartjs.org/docs/latest/configuration/
 *
 * @param {string} chartTitle - The title placed on top of the chart.
 * @param {string} yTitle - The title placed next to the y axis.
 * @param {string} xTitle - The title placed next to the x axis
 * @param {string[]} labels - An array of labels for the X-axis of the chart.
 * @param {number[]} data - An array of data points corresponding to the labels.
 * @throws {Error} Throws an error if the lengths of labels and data do not match.
 * @returns A Chart.js configuration object for the bar chart.
 */
function createBarChartConfigObject(
    chartTitle: string,
    yTitle: string,
    xTitle: string,
    labels: string[],
    data: number[]
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
                min: 0.6, // Set the minimum value of the Y-axis
                max: 1.0, // Set the maximum value of the Y-axis
                ticks: {
                    // Convert decimal to percent (e.g. 0.1 -> 10%)
                    callback: (value) => {
                        if (typeof value !== 'number') return value
                        return `${(value * 100).toFixed(0)}%`
                    },
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
        console.log(assignmentGroup) // TODO: remove debug log
        for (const assignment of assignmentGroup.assignments) {
            console.log('iterated') // TODO: remove debug log
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
