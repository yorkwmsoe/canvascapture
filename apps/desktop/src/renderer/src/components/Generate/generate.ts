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
import {
    Assignment,
    Submission,
    DataNode,
    isCourseDataNode,
    CourseDataNode,
} from '@canvas-capture/lib'
import { FilePathContentPair } from './types'
import { generateTOC } from './generateUtils'
import {
    AverageAssignmentGradeExport,
    oneYearExport,
} from '@renderer/components/Statistics'
import {
    generateAvgGradeChart,
    generateChart,
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
 *
 * @returns An array of objects containing file paths and their generated HTML content.
 *          Each object represents a single course's export, including optional graphs.
 */
export async function generate(
    data: DataNode[],
    generationName: string,
    documentsPath: string
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
        const courseAssignments: Assignment[] = []
        const courseSubmissions: Submission[] = []

        // Create the course's markdown content by combining the markdown content of its assignments and submissions.
        // Additionally, collect all assignments and submissions for this course.
        if (!isCourseDataNode(courseNode)) continue
        let markdownContent = `# ${getCourseName(courseNode.course)}\n\n` // Start course-level markdown content with a title
        for (const assignmentNode of courseNode.children) {
            // Append description and submission content
            for (const fileContent of assignmentNode.children) {
                markdownContent += `${fileContent.content.join('\n')}\n\n`
            }

            if (
                assignmentNode.allSubmissions === undefined ||
                assignmentNode.allSubmissions.length === 0
            )
                continue

            // Collect course's assignments and submissions for chart generation.
            courseAssignments.push(assignmentNode.assignment)
            courseSubmissions.push(...assignmentNode.allSubmissions)
        }
        courseMarkdownMap.set(courseNode, markdownContent) // Add content to the map for later use.

        // Create the course's chart HTML content.
        const oneYearStatChart = oneYearExport() // Check if chart should be created
            ? await generateChart(courseSubmissions)
            : ''
        const avgAssignGradeChart = AverageAssignmentGradeExport() // Check if chart should be created
            ? await generateAvgGradeChart(courseSubmissions, courseAssignments)
            : ''
        courseChartMap.set(courseNode, oneYearStatChart + avgAssignGradeChart) // Add content to the map for later use.
    }

    const htmlData: FilePathContentPair[] = []
    const md = markdownit({ linkify: true, html: true })
    for (const courseNode of courseMarkdownMap.keys()) {
        const courseName = getCourseName(courseNode.course)
        const markdownContent = courseMarkdownMap.get(courseNode)!

        // TODO: This functionality has been removed from dev. Remove when
        //  merging.
        // Write the markdown file for the course
        writeFileSync(
            join(documentsPath, join(generationName, `${courseName}`) + '.md'),
            markdownContent
        )

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
