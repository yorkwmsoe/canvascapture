import markdownit from 'markdown-it'
import _ from 'lodash'
import { mkdirSync, rmSync, writeFileSync } from 'fs'
import { Assignment, Submission, Quiz, generateQuiz, generateAssignment, Course, Auth, assembleQuizQuestionsAndComments } from '@canvas-capture/lib'
import { canvasApi } from '@/lib/canvas.api'

// https://stackoverflow.com/a/70806192
export const median = (arr: number[]): number => {
    const s = [...arr].sort((a, b) => a - b)
    const mid = Math.floor(s.length / 2)
    const res = s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]
    return Math.ceil(res)
}

type FilePathContentPair = {
    filePath: string
    content: string
}

const generateAssignmentOrQuiz = async (course: Course, assignment: Assignment, submission: Submission, quiz: Quiz | undefined, canvasAccessToken: string, canvasDomain: string) => {
    if (assignment.is_quiz_assignment && quiz !== undefined) {
        const quizSubmission = await canvasApi.getQuizSubmission({
            courseId: assignment.course_id,
            quizId: quiz.id,
            submissionId: submission.id,
            canvasAccessToken,
            canvasDomain,
        })
        const auth: Auth = {
            canvasAccessToken: canvasAccessToken,
            canvasDomain: canvasDomain,
        }
        const quizQuestions = await assembleQuizQuestionsAndComments(auth, course, assignment, submission)
        return generateQuiz(assignment, submission, quiz, quizSubmission, quizQuestions)
    } else {
        return generateAssignment(assignment, submission)
    }
}

export const generatePairs = async (course: Course, assignment: Assignment, submissions: Submission[], quiz: Quiz | undefined, assignmentsPath: string, canvasAccessToken: string, canvasDomain: string): Promise<FilePathContentPair[]> => {
    //TECH DEBT!!!! Since a user can have multiple attempts AND!!!! that the quiz version can be
    //incremented, a user can have multiple submissions and mess with the median, the high, and the
    //low. Therefore, we need to find the latest attempt from every user and take into account the
    //quiz versions, and then find the high, med, and low that way
    const highSubmission = _.maxBy(submissions, (s) => s.score) ?? submissions[0]
    const highPair = {
        filePath: `${assignmentsPath}/high`,
        content: (await generateAssignmentOrQuiz(course, assignment, highSubmission, quiz, canvasAccessToken, canvasDomain)).join('\n'),
    }

    const medianSubmission = submissions.filter((s) => s.score === median(submissions.map((x) => x.score)))[0] ?? submissions[0]
    const medianPair = {
        filePath: `${assignmentsPath}/median`,
        content: (await generateAssignmentOrQuiz(course, assignment, medianSubmission, quiz, canvasAccessToken, canvasDomain)).join('\n'),
    }

    const lowSubmission = _.minBy(submissions, (s) => s.score) ?? submissions[0]
    const lowPair = {
        filePath: `${assignmentsPath}/low`,
        content: (await generateAssignmentOrQuiz(course, assignment, lowSubmission, quiz, canvasAccessToken, canvasDomain)).join('\n'),
    }

    switch (submissions.length) {
        case 1:
            return [highPair]
        case 2:
            return [highPair, lowPair]
        default:
            return [highPair, medianPair, lowPair]
    }
}

export async function generate(courses: Course[], assignments: Assignment[], canvasAccessToken: string, canvasDomain: string, generationName: string, documentsPath: string) {
    if (courses.length === 0) {
        console.log('No courses selected')
        return []
    }
    rmSync(`${documentsPath}/${generationName}`, { recursive: true, force: true })

    const pairs: FilePathContentPair[] = []
    for (const course of courses) {
        const filteredAssignments = assignments.filter((a) => a.course_id === course.id)
        if (filteredAssignments.length === 0) console.log(`No assignments selected for course ${course.name}`)

        for (const assignment of filteredAssignments) {
            const submissions = await canvasApi.getSubmissions({
                courseId: course.id,
                assignmentId: assignment.id,
                isStudent: false, // TODO: Add student option to CLI as well
                canvasAccessToken,
                canvasDomain,
            })
            const uniqueSubmissions = _.uniqBy(
                submissions.filter((s) => !_.isNil(s.score)),
                (s) => s.score
            )
            if (uniqueSubmissions.length > 0) {
                const assignmentsPath = `${generationName}/${course.name}/${assignment.name}`
                mkdirSync(`${documentsPath}/${assignmentsPath}`, { recursive: true })
                const quiz = assignment.is_quiz_assignment ? await canvasApi.getQuiz({ courseId: assignment.course_id, quizId: assignment.quiz_id, canvasAccessToken, canvasDomain }) : undefined
                pairs.push(...(await generatePairs(course, assignment, uniqueSubmissions, quiz, assignmentsPath, canvasAccessToken, canvasDomain)))
            }
        }
    }

    pairs.forEach((x) => writeFileSync(`${documentsPath}/${x.filePath}.md`, x.content))

    const md = markdownit({ linkify: true })

    const htmlData: FilePathContentPair[] = pairs.map((x) => {
        return {
            filePath: x.filePath,
            content: md.render(x.content),
        }
    })
    return htmlData
}
