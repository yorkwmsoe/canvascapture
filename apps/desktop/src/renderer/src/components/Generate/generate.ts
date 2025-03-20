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
 * @param canvasAccessToken
 * @param canvasDomain
 * @param isStudent
 *
 * @returns An array of objects containing file paths and their generated HTML content.
 *          Each object represents a single course's export, including optional graphs.
 */
export async function generate(
    data: DataNode[],
    generationName: string,
    documentsPath: string,
) {
    // TODO: Replace above code block with this, if it works properly.
    const allAssignments: Assignment[] = []
    const allSubmissions: Submission[] = []
    for (const course of data) {
        if (!isCourseDataNode(course)) continue;
        for (const assignment of course.children) {
            allAssignments.push(assignment.assignment)
            if (assignment.allSubmissions)
                allSubmissions.push(...assignment.allSubmissions)
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
        ? await generateChart(allSubmissions)
        : undefined
    const avgAssignGradeGraph = AverageAssignmentGradeExport()
        ? await generateAvgGradeChart(allSubmissions, allAssignments)
        : undefined

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
            generateTOC(htmlContent) +
            '\n\n\n' +
            htmlContent +
            (oneYearStatGraph !== undefined ? oneYearStatGraph : '') +
            (avgAssignGradeGraph !== undefined ? avgAssignGradeGraph : '')

        return {
            filePath: join(generationName, `${courseName}`),
            content: htmlContentWithTocAndCharts,
        }
    })

    // Return the array of file paths and their HTML content
    return htmlData
}
