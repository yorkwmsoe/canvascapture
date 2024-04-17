import { join } from 'path'
import { getCourseName } from '@renderer/utils/courses'
import { sanitizePath } from '@renderer/utils/sanitize-path'
import markdownit from 'markdown-it'
import { DataNode, isCouseDataNode } from './useGenerateNext'
import { mkdirSync, rmSync, writeFileSync } from 'fs'

type FilePathContentPair = {
    filePath: string
    content: string
}

export function generateV2(
    data: DataNode[],
    generationName: string,
    documentsPath: string
) {
    rmSync(join(documentsPath, sanitizePath(generationName)), {
        recursive: true,
        force: true,
    })

    const files: FilePathContentPair[] = []
    data.forEach((course) => {
        if (isCouseDataNode(course)) {
            course.children.forEach((assignment) => {
                const assignmentsPath = sanitizePath(
                    join(
                        generationName,
                        getCourseName(course.course),
                        assignment.assignment.name
                    )
                )
                mkdirSync(join(documentsPath, assignmentsPath), {
                    recursive: true,
                })
                assignment.children.forEach((file) => {
                    files.push({
                        filePath: join(assignmentsPath, file.name),
                        content: file.content.join('\n'),
                    })
                })
            })
        }
    })

    files.forEach((x) => {
        writeFileSync(join(documentsPath, x.filePath + '.md'), x.content)
    })

    const md = markdownit({ linkify: true, html: true })

    const htmlData: FilePathContentPair[] = files.map((x) => {
        return {
            filePath: x.filePath,
            content: md.render(x.content),
        }
    })

    return htmlData
}
