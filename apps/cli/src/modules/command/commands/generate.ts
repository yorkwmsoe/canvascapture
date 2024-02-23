import { getQuiz, getQuizSubmission, getSubmissions } from '@modules/canvas_api/api'
import { Command } from '../types/command'
import { state } from '../state'
import { Assignment } from '@modules/canvas_api/types/assignment'
import { Course } from '@modules/canvas_api/types/course'
import { generateAssignment, generateQuiz } from '@canvas-capture/lib/src/generators'
import { Submission } from '@modules/canvas_api/types/submission'
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

// https://stackoverflow.com/a/70806192
export const median = (arr: number[]): number => {
    const s = [...arr].sort((a, b) => a - b)
    const mid = Math.floor(s.length / 2)
    const res = s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]
    return Math.ceil(res)
}

export const genAssignment = async (course: Course, assignment: Assignment) => {
    console.log(`\tGenerating ${assignment.name}`)
    const submissions = await getSubmissions(course.id, assignment.id)
    const filteredScores = submissions.filter((a) => a.score !== null && a.score !== undefined).map((b) => b.score)
    if (filteredScores.length > 0) {
        const { high, med, low } = getHighMedLow(submissions)

        if (assignment.is_quiz_assignment) {
            if (high) {
                const quiz = await getQuiz(assignment.course_id, assignment.quiz_id)
                const quizSubmission = await getQuizSubmission(assignment.course_id, quiz.id, high.id)
                generateQuiz(assignment, high, quiz, quizSubmission)
            }
            if (med) {
                const quiz = await getQuiz(assignment.course_id, assignment.quiz_id)
                const quizSubmission = await getQuizSubmission(assignment.course_id, quiz.id, med.id)
                generateQuiz(assignment, med, quiz, quizSubmission)
            }
            if (low) {
                const quiz = await getQuiz(assignment.course_id, assignment.quiz_id)
                const quizSubmission = await getQuizSubmission(assignment.course_id, quiz.id, low.id)
                generateQuiz(assignment, low, quiz, quizSubmission)
            }

        } else {
            if (high) {
                generateAssignment(assignment, high)
            }
            if (med) {
                generateAssignment(assignment, med)
            }
            if (low) {
                generateAssignment(assignment, low)
            }
        }
    } else {
        console.log('\t\tNo submissions for assignment')
    }
}

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
        const htmlData = await generate(
            state.courses,
            state.assignments,
            '',
            '',
            'generation',
            'output'
        )
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

export function getHighMedLow(submissions: Submission[]) {
    //TECH DEBT!!!! Since a user can have multiple attempts AND!!!! that the quiz version can be
    //incremented, a user can have multiple submissions and mess with the median, the high, and the
    //low. Therefore, we need to find the latest attempt from every user and take into account the
    //quiz versions, and then find the high, med, and low that way
    const copySubmissions = [...submissions]
    let high = null
    let med = null
    let low = null

    high = chooseSubmission(copySubmissions, copySubmissions.filter((s) => s.score === Math.max(...getScores(copySubmissions)))[0])

    if (copySubmissions.length >= 1) {
        med = chooseSubmission(copySubmissions, copySubmissions.filter((s) => s.score === median(getScores(copySubmissions)))[0])
    }

    if (copySubmissions.length >= 1) {
        low = chooseSubmission(copySubmissions, copySubmissions.filter((s) => s.score === Math.min(...getScores(copySubmissions)))[0])
    }

    return { high, med, low }
}

function getScores(submissions: Submission[]) {
    return submissions.filter((a) => a.score !== null && a.score !== undefined).map((b) => b.score)
}

function chooseSubmission(submissions: Submission[], submission?: Submission) {
    const index = submissions.findIndex((item) => item.id === submission?.id)

    if (index > -1) {
        submissions.splice(index, 1)
    }

    return submission
}
