import { Command } from '../types/command'
import { state } from '../state'
import { generate } from '@/modules/markdown/generate'
import { loadPyodide } from 'pyodide'
import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

export const getDocumentsPath = () => resolve('output')

export const generateCommand = {
    name: 'generate',
    description: 'Generate markdown files.',
    run: generateCmd,
    category: 'general',
} satisfies Command

const initPyodide = async () => {
    const pyodide = await loadPyodide()
    await pyodide.loadPackage('micropip')
    const micropip = pyodide.pyimport('micropip')
    await micropip.install('fpdf2')
    await pyodide.FS.mkdir('/files')

    const documentsPath = getDocumentsPath()
    if (!existsSync(documentsPath)) mkdirSync(documentsPath)
    await pyodide.FS.mount(pyodide.FS.filesystems.NODEFS, { root: getDocumentsPath() }, '/files')
    return pyodide
}

export async function generateCmd() {
    const pyodide = await initPyodide()
    if (state.courses && state.assignments) {
        console.log('Generating...')
        const htmlData = await generate(state.courses, state.assignments, '', '', 'generation', 'output')
        // This just gets piped straight into Python, which doesn't care about the type anyway
        // @ts-expect-error noImplicitAny
        globalThis.htmlData = htmlData
        pyodide.runPython(`
        import os
        from fpdf import FPDF
        import js
        
        for item in js.htmlData:
          pdf = FPDF()
          pdf.add_page()
          pdf.write_html(item.content)
          pdf.output("/files/" + item.filePath + ".pdf")
        `)
    }
}
