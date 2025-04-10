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
import { mkdirSync, rmSync } from 'fs'
import {
    Submission,
    DataNode,
    isCourseDataNode,
    CourseDataNode,
    AssignmentGroup,
} from '@canvas-capture/lib'
import { FilePathContentPair } from './types'
import { prependTOC } from './generateUtils'

import {
    generateAverageGradeByAssignmentChart,
    generateAverageGradeChart,
    generateGradingTurnaroundByAssignmentChart,
    generateGradingTurnaroundChart,
} from '@renderer/components/Generate/charts'

// Utilized to convert markdown into HTML
const md = markdownit({ linkify: true, html: true })

/**
 * Generates course reports and exports them as Markdown and HTML files
 * with optional statistical graphs.
 *
 * The function first processes all provided course data nodes, extracting
 * assignment and submission details. Then, it generates per-course Markdown
 * content, converts it to HTML, and optionally includes statistical graphs.
 *
 * Any non-CourseDataNodes are simply ignored.
 *
 * @param data - The hierarchical course data nodes containing assignments and files.
 * @param generationName - The name of the generation project (used for directory naming).
 * @param documentsPath - The root path where generated files will be stored.
 * @param requestedCharts - A record indicating which optional charts to include in the report.
 *                          Keys represent chart types (e.g., "averageGradeChart", "gradeTurnaroundChart"),
 *                          and values are booleans specifying whether the chart should be included.
 * @returns An array of objects containing file paths and their generated HTML content.
 *          Each object represents a single course's export, including optional graphs.
 */
export async function generate(
    data: DataNode[],
    generationName: string,
    documentsPath: string,
    requestedCharts: Record<string, boolean> = {}
) {
    const courses = data.filter((n) => isCourseDataNode(n))

    // Remove existing directory to start fresh
    rmSync(join(documentsPath, sanitizePath(generationName)), {
        recursive: true,
        force: true,
    })

    // Create directory in which the generated report will be stored.
    mkdirSync(join(documentsPath, sanitizePath(generationName)), {
        recursive: true,
    })

    // Mappings from a course's data node to its markdown and chart content.
    const htmlByCourse = await createCourseHTMLMapping(courses, requestedCharts)

    const htmlData: FilePathContentPair[] = []
    for (const courseNode of htmlByCourse.keys()) {
        const courseName = getCourseName(courseNode.course)

        // Combine HTML content.
        let htmlContent: string = htmlByCourse.get(courseNode)!

        // Attach TOC
        htmlContent = prependTOC(htmlContent)

        htmlData.push({
            filePath: join(
                generationName,
                `${courseName.replaceAll('/', '_')}`
            ),
            content: htmlContent,
        })
    }

    // Return the array of file paths and their HTML content
    return htmlData
}

/**
 * Creates mappings for course HTML, associating each course's data node with its generated HTML content.
 * This function is a helper for the `generate` function and simplifies the construction of course-specific report content.
 *
 * @param data - An array of `DataNode` objects representing the hierarchical course structure,
 *               which includes assignments, submissions, and associated metadata.
 * @param requestedCharts - A record specifying which charts to generate, with keys as chart names
 *                          (e.g., "averageGradeChart", "gradeTurnaroundChart") and boolean values
 *                          indicating whether the chart should be generated.
 * @returns A promise that resolves to a mapping from CourseDataNode to its corresponding HTML.
 *      The returned map will have a key-value pair for every unique CourseDataNode given.
 */
async function createCourseHTMLMapping(
    data: CourseDataNode[],
    requestedCharts: Record<string, boolean>
) {
    const htmlByCourse = new Map<CourseDataNode, string>()
    const chartsByCourse = await createCourseChartMapping(data, requestedCharts)

    // Generate separate HTML content for each course.
    for (const courseNode of data) {
        // If a course has no assignments, skip generation.
        if (
            courseNode.children === undefined ||
            courseNode.children.length === 0
        ) {
            htmlByCourse.set(courseNode, '')
            continue
        }

        // Start document with course title.
        let courseHTMLDocument: string = `<h1 id="${courseNode.key}">${getCourseName(courseNode.course)}</h1>`

        // Convert and append each assignment's content to the document.
        for (const assignmentNode of courseNode.children) {
            // Ensure this assignment has "children" (a description or a submission) associated with it.
            if (
                assignmentNode.children === undefined ||
                assignmentNode.children.length === 0
            ) {
                continue
            }

            // For each "child" (description/assignment) node, convert its contents to HTML and append it
            //  to the document.
            for (const childNode of assignmentNode.children) {
                // Surround child node's content with a labeled div.
                // This steps "embeds" the structure onto the resulting document.
                const div: HTMLDivElement = document.createElement('div')
                div.id = childNode.key // label the div with the nodes key
                div.innerHTML = md.render(childNode.content.join('\n')) // insert actual content to div

                // Append child content to assignment's total content.
                courseHTMLDocument += div.outerHTML
            }
        }

        // Append charts to the document
        courseHTMLDocument += chartsByCourse.get(courseNode)

        // Add resulting document to the map.
        htmlByCourse.set(courseNode, courseHTMLDocument)
    }

    return htmlByCourse
}

/**
 * Creates mappings for course charts, associating each course's data node chart HTML content. This function is a
 * for the `generate` function and simplifies the construction of course-specific report content.
 *
 * @param data - An array of `DataNode` objects representing the hierarchical course structure,
 *               which includes assignments, submissions, and associated metadata.
 * @param requestedCharts - A record specifying which charts to generate, with keys as chart names
 *                          (e.g., "averageGradeChart", "gradeTurnaroundChart") and boolean values
 *                          indicating whether the chart should be generated.
 * @returns `courseChartMap`: A promise that resolves to a mapping of each course node to its generated chart HTML content.
 */
async function createCourseChartMapping(
    data: CourseDataNode[],
    requestedCharts: Record<string, boolean>
) {
    // A mapping from a course's data node to its corresponding chart HTML content.
    // The use of a Map instead of an Object ensured iteration are done in
    //  insertion order.
    const courseChartMap = new Map<CourseDataNode, string>()

    // Create each course's charts.
    for (const courseNode of data) {
        if (!isCourseDataNode(courseNode)) continue

        // The assignment groups for the course.
        const assignmentGroups = courseNode.assignmentGroups

        // Prepare AssignmentGroup objects for assignment pushes.
        // NOTE: This clears the previous assignments.
        assignmentGroups.forEach((assignmentGroup) => {
            assignmentGroup.assignments = []
        })

        // This maps an assignment group ID to its corresponding AssignmentGroup object.
        const idAssignmentGroupMap =
            createIdAssignmentGroupMap(assignmentGroups)

        // This maps an assignment ID to all the assignment's submissions.
        const assignmentSubmissionsMap = new Map<number, Submission[]>()

        // This loop does the following:
        // 1) Collect all assignments into the corresponding AssignmentGroup object (utilized for chart generation).
        // 2) Creates the mapping from assignments to submissions (utilized for chart generation).
        for (const assignmentNode of courseNode.children) {
            // Add assignment to its corresponding AssignmentGroup object.
            idAssignmentGroupMap
                .get(assignmentNode.assignment.assignment_group_id)
                ?.assignments.push(assignmentNode.assignment)

            // Stop here if there are no submissions.
            if (
                assignmentNode.allSubmissions === undefined ||
                assignmentNode.allSubmissions.length === 0
            )
                continue

            // Add entry to assignmentSubmissions map.
            assignmentSubmissionsMap.set(
                assignmentNode.assignment.id,
                assignmentNode.allSubmissions
            )
        }

        // Generate requested charts.
        const averageGradeByGroupChart = requestedCharts.averageGradeByGroup
            ? await generateAverageGradeChart(
                  courseNode.assignmentGroups,
                  assignmentSubmissionsMap
              )
            : ''
        const averageGradeByAssignmentChart =
            requestedCharts.averageGradeByAssignment
                ? await generateAverageGradeByAssignmentChart(
                      courseNode.assignmentGroups,
                      assignmentSubmissionsMap
                  )
                : ''
        const gradeTurnaroundByGroupChart =
            requestedCharts.gradingTurnaroundByGroup
                ? await generateGradingTurnaroundChart(
                      courseNode.assignmentGroups,
                      assignmentSubmissionsMap
                  )
                : ''
        const gradeTurnaroundByAssignmentChart =
            requestedCharts.gradingTurnaroundByAssignment
                ? await generateGradingTurnaroundByAssignmentChart(
                      courseNode.assignmentGroups,
                      assignmentSubmissionsMap
                  )
                : ''
        let charts =
            averageGradeByGroupChart +
            averageGradeByAssignmentChart +
            gradeTurnaroundByGroupChart +
            gradeTurnaroundByAssignmentChart
        if (charts.trim().length > 0)
            charts = '<h1>Statistic Charts</h1>' + charts

        courseChartMap.set(courseNode, charts)
    }
    return courseChartMap
}

/**
 * Maps assignment group IDs to their corresponding assignment group objects for faster lookup.
 */
function createIdAssignmentGroupMap(
    assignmentGroups: AssignmentGroup[]
): Map<number, AssignmentGroup> {
    const idAssignmentGroupMap = new Map<number, AssignmentGroup>()
    for (const assignmentGroup of assignmentGroups) {
        idAssignmentGroupMap.set(assignmentGroup.id, assignmentGroup)
    }
    return idAssignmentGroupMap
}
