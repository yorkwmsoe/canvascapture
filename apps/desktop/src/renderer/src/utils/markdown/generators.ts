import { Assignment } from '@renderer/types/canvas_api/assignment'
import { Course } from '@renderer/types/canvas_api/course'
import { Submission } from '@renderer/types/canvas_api/submission'
import { convertToHeader, createList, createTableHeader, createTableRows } from './markdown'
import { mkdirSync } from 'fs'

export async function generateAssignment(
  course: Course,
  assignment: Assignment,
  submission: Submission | undefined,
  score: 'high' | 'median' | 'low',
  outpath: string
) {
  if (submission !== undefined) {
    const folderPath = `${outpath}/${course.name}/${assignment.name}`
    mkdirSync(folderPath, { recursive: true })

    const items: string[] = [
      ...assembleTitleAndGrade(assignment, submission),
      ...assembleFeedbackInfo(submission),
      ...assembleDescriptionInfo(assignment),
      ...assembleRubricInfo(assignment, submission),
      ...assembleSubmissionInfo(submission)
    ]

    const cleanedItems = items.filter((item) => !!item)

    return writeAggregationToFileNameAndString(cleanedItems, folderPath, score)
  }
  return null
}

function assembleTitleAndGrade(assignment: Assignment, submission: Submission) {
  const title = convertToHeader(assignment.name, 1)
  const grade = `${submission.score}/${assignment.points_possible}`
  return [title, grade]
}

function assembleDescriptionInfo(assignment: Assignment) {
  const descriptionHeader = convertToHeader('Description', 2)
  const description = assignment.description ? assignment.description : 'No description'
  return [descriptionHeader, description]
}

function assembleSubmissionInfo(submission: Submission) {
  const submissionHeader = convertToHeader('Submission', 2)
  let submissionBody = submission.body
  if (submission.submission_type === 'online_quiz') {
    submissionBody = 'No submission'
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
  return [feedbackHeader, feedbackBody]
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

function writeAggregationToFileNameAndString(
  cleanedItems: string[],
  folderPath: string,
  score: string
) {
  let pseudoFile: string = ''
  cleanedItems.forEach((item) => {
    pseudoFile = pseudoFile + item + '\n'
  })
  const filePath = `${folderPath}/${score}`
  return { filePath, pseudoFile }
}