import { join } from 'path'
import { getCourseName } from '@renderer/utils/courses'
import { sanitizePath } from '@renderer/utils/sanitize-path'
import markdownit from 'markdown-it'
import { mkdir, rm, writeFile } from 'fs/promises'
import { DataNode, isCouseDataNode } from './useGenerateNext'

type FilePathContentPair = {
    filePath: string
    content: string
}

export async function generateV2(
    data: DataNode[],
    generationName: string,
    documentsPath: string
) {
    await rm(join(documentsPath, sanitizePath(generationName)), {
        recursive: true,
        force: true,
    })

    const files: FilePathContentPair[] = []
    data.forEach((course) => {
        if (isCouseDataNode(course)) {
            course.children.forEach(async (assignment) => {
                const assignmentsPath = sanitizePath(
                    join(
                        generationName,
                        getCourseName(course.course),
                        assignment.assignment.name
                    )
                )
                await mkdir(join(documentsPath, assignmentsPath), {
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

    files.forEach(async (x) => {
        await writeFile(join(documentsPath, x.filePath + '.md'), x.content)
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
