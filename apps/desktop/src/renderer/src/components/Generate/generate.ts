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
import { generateTOC } from './generateUtils'

import {
    generateAverageGradeByAssignmentChart,
    generateAverageGradeChart,
    generateGradingTurnaroundByAssignmentChart,
    generateGradingTurnaroundChart,
} from '@renderer/components/Generate/charts'

/**
 * Generates course reports and exports them as Markdown and HTML files
 * with optional statistical graphs.
 *
 * The function first processes all provided course data nodes, extracting
 * assignment and submission details. Then, it generates per-course Markdown
 * content, converts it to HTML, and optionally includes statistical graphs.
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
    const { courseMarkdownMap, courseChartMap } =
        await createCourseContentMappings(data, requestedCharts)

    const htmlData: FilePathContentPair[] = []
    const md = markdownit({ linkify: true, html: true })
    for (const courseNode of courseMarkdownMap.keys()) {
        const courseName = getCourseName(courseNode.course)
        const markdownContent = courseMarkdownMap.get(courseNode)!

        // Convert markdown to HTML
        const htmlContent = md.render(markdownContent)

        // Add table of contents and charts
        const htmlContentWithTocAndCharts =
            generateTOC(htmlContent) +
                '\n\n\n' +
                htmlContent +
                courseChartMap.get(courseNode) || ''

        htmlData.push({
            filePath: join(generationName, `${courseName}`),
            content: htmlContentWithTocAndCharts,
        })
    }

    // Return the array of file paths and their HTML content
    return htmlData
}

/**
 * Creates mappings for course content, associating each course's data node with its generated
 * Markdown and chart HTML content. This function is a helper for the `generate` function and
 * simplifies the construction of course-specific report content.
 *
 * @param data - An array of `DataNode` objects representing the hierarchical course structure,
 *               which includes assignments, submissions, and associated metadata.
 * @param requestedCharts - A record specifying which charts to generate, with keys as chart names
 *                          (e.g., "averageGradeChart", "gradeTurnaroundChart") and boolean values
 *                          indicating whether the chart should be generated.
 * @returns An object containing:
 *          - `courseMarkdownMap`: A mapping of each course node to its generated Markdown content.
 *          - `courseChartMap`: A mapping of each course node to its generated chart HTML content.
 */
async function createCourseContentMappings(
    data: DataNode[],
    requestedCharts: Record<string, boolean>
) {
    // A mapping from a course's data node to its corresponding markdown content.
    // The use of a Map instead of an Object ensured iteration are done in
    //  insertion order.
    const courseMarkdownMap = new Map<CourseDataNode, string>()

    // A mapping from a course's data node to its corresponding chart HTML content.
    // The use of a Map instead of an Object ensured iteration are done in
    //  insertion order.
    const courseChartMap = new Map<CourseDataNode, string>()

    // Create each course's content.
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
        // 1) Create the course's markdown content by combining the markdown content of its assignments and submissions.
        // 2) Collect all assignments into the corresponding AssignmentGroup object (utilized for chart generation).
        // 3) Creates the mapping from assignments to submissions (utilized for chart generation).
        let markdownContent = `# ${getCourseName(courseNode.course)}\n\n` // Start course-level markdown content with a title
        for (const assignmentNode of courseNode.children) {
            // Add assignment to its corresponding AssignmentGroup object.
            idAssignmentGroupMap
                .get(assignmentNode.assignment.assignment_group.id)
                ?.assignments.push(assignmentNode.assignment)

            // Append description and submission content
            for (const fileContent of assignmentNode.children) {
                markdownContent += `${fileContent.content.join('\n')}\n\n`
            }

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
        courseMarkdownMap.set(courseNode, markdownContent) // Add content to the map for later use.

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
        const charts =
            averageGradeByGroupChart +
            averageGradeByAssignmentChart +
            gradeTurnaroundByGroupChart +
            gradeTurnaroundByAssignmentChart

        courseChartMap.set(courseNode, charts)
    }
    return { courseMarkdownMap, courseChartMap }
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
