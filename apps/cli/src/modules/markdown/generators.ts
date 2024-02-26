import { Assignment } from '@modules/canvas_api/types/assignment'
import { Course } from '@modules/canvas_api/types/course'
import { Submission } from '@modules/canvas_api/types/submission'
import { convertToHeader, createLinkNormal, createList, createTableHeader, createTableRows, writeToFile } from './markdown'
import { mkdirSync } from 'fs'
import { getQuiz, getQuizSubmission } from '@modules/canvas_api/api'

const basePath = 'output'

export async function generateAssignment(course: Course, assignment: Assignment, submission: Submission, score: 'high' | 'median' | 'low', commit: boolean = true) {
    const folderPath = `${basePath}/${course.name}/${assignment.name}`
    mkdirSync(folderPath, { recursive: true })

    const items = [...assembleTitleAndGrade(assignment, submission, ''), ...assembleFeedbackInfo(submission), ...assembleDescriptionInfo(assignment), ...assembleRubricInfo(assignment, submission), ...(await assembleSubmissionInfo(assignment, submission))]

    const cleanedItems = items.filter((item) => !!item)

    if (commit) {
        writeAggregationToFile(cleanedItems, folderPath, score)
    }

    return {
        items,
    }
}

export async function generateQuiz(course: Course, assignment: Assignment, submission: Submission, score: 'high' | 'median' | 'low', commit: boolean = true) {
    const folderPath = `${basePath}/${course.name}/${assignment.name}`
    mkdirSync(folderPath, { recursive: true })

    const items = [...assembleTitleAndGrade(assignment, submission, 'QUIZ: '), ...assembleDescriptionInfo(assignment), ...assembleFeedbackInfo(submission), ...(await quizOverview(assignment)), ...(await quizUserOverview(assignment, submission))]

    const cleanedItems = items.filter((item) => !!item)

    if (commit) {
        writeAggregationToFile(cleanedItems, folderPath, score)
    }

    return {
        items,
    }
}

async function quizOverview(assignment: Assignment) {
    const quiz_id = assignment.quiz_id as number
    const infoHeader = convertToHeader('Quiz Info', 2)
    const quiz = await getQuiz(assignment.course_id, quiz_id)
    const quizHeader = createTableHeader(['Quiz Id', 'Assignment Id', '# of Questions', 'Total Points', 'Version #'])
    const quizBody = createTableRows([[quiz_id.toString(), assignment.id.toString(), quiz.question_count.toString(), quiz.points_possible.toString(), quiz.version_number.toString()]])
    return [infoHeader, quizHeader + quizBody]
}
async function quizUserOverview(assignment: Assignment, submission: Submission) {
    const userOverviewHeader = convertToHeader('User Overview', 2)
    const quiz = await getQuiz(assignment.course_id, assignment.quiz_id)
    const quizSubmission = await getQuizSubmission(assignment.course_id, quiz.id, submission.id)
    const userHeader = createTableHeader(['User Id', 'Score', 'Kept Score', 'Attempt'])
    const rows = []
    rows.push(submission.user_id.toString())
    if (quizSubmission?.score) {
        rows.push(quizSubmission.score.toString())
    }
    if (quizSubmission?.kept_score) {
        rows.push(quizSubmission.kept_score.toString())
    }
    if (quizSubmission?.attempt) {
        rows.push(quizSubmission.attempt.toString())
    }
    const userBody = createTableRows([rows])
    return [userOverviewHeader, userHeader + userBody]
}

function assembleTitleAndGrade(assignment: Assignment, submission: Submission, type: string) {
    const title = convertToHeader(type + assignment.name, 1)
    const grade = `${submission.score}/${assignment.points_possible}`
    return [title, grade]
}

function assembleDescriptionInfo(assignment: Assignment) {
    const descriptionHeader = convertToHeader('Description', 2)
    const description = assignment.description ? assignment.description : 'No description'
    return [descriptionHeader, description.replace(/(<([^>]+)>)/gi, '')]
}

function assembleSubmissionInfo(assignment: Assignment, submission: Submission) {
    const submissionHeader = convertToHeader('Submission', 2)
    let submissionBody = submission.body
    if (submission.submission_type === 'online_upload') {
        submissionBody = createLinkNormal('Download Submissions', assignment.submissions_download_url)
    }
    return [submissionHeader, submissionBody]
}

function assembleFeedbackInfo(submission: Submission) {
    const feedbackHeader = convertToHeader('Feedback', 2)
    const feedbackBody = submission?.submission_comments?.length
        ? createList(
              submission?.submission_comments.map((comment) => comment.comment),
              '-'
          )
        : 'No feedback'
    return [feedbackHeader, feedbackBody.replace(/(<([^>]+)>)/gi, '')]
}

function assembleRubricInfo(assignment: Assignment, submission: Submission) {
    const rubricHeader = convertToHeader('Rubric', 2)
    const rubric = assignment.rubric
    const rubricTableHeader = rubric ? createTableHeader(['Criteria', 'Score', 'Comments']) : null
    const assessment = submission.rubric_assessment
    const rows = rubric?.map((criterion) => {
        const description = criterion.description
        const points = criterion.points
        const comments = assessment ? assessment[criterion.id]?.comments : ''
        const score = assessment ? assessment[criterion.id]?.points : ''
        return [description, `${score}/${points}`, comments]
    })
    const rubricTableBody = rows ? createTableRows(rows) : ''
    const rubricTable = !rubricTableHeader ? 'No rubric' : rubricTableHeader + rubricTableBody

    return [rubricHeader, rubricTable]
}

function writeAggregationToFile(cleanedItems: string[], folderPath: string, score: string) {
    let pseudoFile: string = ''
    cleanedItems.forEach((item) => {
        pseudoFile = pseudoFile + item + '\n'
    })
    const filePath = `${folderPath}/${score}`
    writeToFile(filePath, pseudoFile)
}
