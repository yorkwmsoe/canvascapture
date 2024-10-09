import { join } from 'path'
import { getCourseName } from '@renderer/utils/courses'
import { sanitizePath } from '@renderer/utils/sanitize-path'
import markdownit from 'markdown-it'
import { mkdirSync, rmSync, writeFileSync } from 'fs'
import { DataNode, isCourseDataNode } from '@canvas-capture/lib'
import { FilePathContentPair } from './types'

export function generateV2(
    data: DataNode[],
    generationName: string,
    documentsPath: string
) {
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

    // Write markdown and generate HTML for each course
    const htmlData: FilePathContentPair[] = Object.keys(
        courseMarkdownContent
    ).map((courseName) => {
        const markdownContent = courseMarkdownContent[courseName]
        const filePath = join(
            documentsPath,
            sanitizePath(join(generationName, `${courseName}.md`))
        )

        // Write the markdown file for the course
        writeFileSync(filePath, markdownContent)

        // Convert markdown to HTML
        const htmlContent = md.render(markdownContent)

        return {
            filePath: sanitizePath(join(generationName, `${courseName}.md`)),
            content: htmlContent,
        }
    })

    // Return the array of file paths and their HTML content
    return htmlData
}
