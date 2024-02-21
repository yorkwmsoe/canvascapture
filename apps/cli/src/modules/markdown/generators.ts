import { Assignment } from '@modules/canvas_api/types/assignment'
import { Course } from '@modules/canvas_api/types/course'
import { Submission } from '@modules/canvas_api/types/submission'
import { addNewLine, convertToHeader, createList, createTableHeader, createTableRows, writeToFile } from './markdown'
import { mkdirSync } from 'fs'

const basePath = 'output'

export async function generateAssignment(course: Course, assignment: Assignment, submission: Submission, score: "high" | "median" | "low", commit: boolean = true) {
  const folderPath = `${basePath}/${course.name}/${assignment.name}`;
  mkdirSync(folderPath, { recursive: true });

  let items: string[] = [...assembleTitleAndGrade(assignment, submission),
    ...assembleFeedbackInfo(submission),
    ...assembleDescriptionInfo(assignment),
    ...assembleRubricInfo(assignment, submission),
    ...await assembleSubmissionInfo(assignment, submission)]

  const cleanedItems = items.filter((item) => !!item)

  if (commit) {
    writeAggregationToFile(cleanedItems, folderPath, score)
  }

    return {
        items,
    }
}

function assembleTitleAndGrade(assignment: Assignment, submission: Submission){
  const title = convertToHeader(assignment.name, 1)
  const grade = `${submission.score}/${assignment.points_possible}`
  return [title, grade]
}

function assembleDescriptionInfo(assignment: Assignment){
  const descriptionHeader = convertToHeader('Description', 2)
  const description = !!assignment.description ? assignment.description : 'No description'
  return [descriptionHeader, description]
}

async function assembleSubmissionInfo(assignment: Assignment, submission: Submission){
  const submissionHeader = convertToHeader('Submission', 2)
  let submissionBody = submission.body;
  if (assignment.submission_types[0] === "TYPE") {
    submissionBody = '[download Submissions]' + '(' + assignment.submissions_download_url + ')'
  }
  return [submissionHeader, submissionBody]
}

function assembleFeedbackInfo(submission: Submission){
  const feedbackHeader = convertToHeader('Feedback', 2)
  const feedbackBody = !!submission?.submission_comments?.length ? createList(submission?.submission_comments.map((comment) => comment.comment), '-') : 'No feedback'
  return [feedbackHeader, feedbackBody]
}

function assembleRubricInfo(assignment: Assignment, submission: Submission){
  const rubricHeader = convertToHeader('Rubric', 2)
  const rubric = assignment.rubric
  const rubricTableHeader = !!rubric ? createTableHeader(['Criteria', 'Score', 'Comments']) : null
  const assessment = submission.rubric_assessment
  const rows = rubric?.map((criterion) => {
    const description = criterion.description
    const points = criterion.points
    const comments = assessment ? assessment[criterion.id]?.comments : ''
    const score = assessment ? assessment[criterion.id]?.points : ''
    return [description, `${score}/${points}`, comments]
  })
  const rubricTableBody = !!rows ? createTableRows(rows) : ''
  const rubricTable = !rubricTableHeader ? 'No rubric' : rubricTableHeader + rubricTableBody

  return [rubricHeader, rubricTable]
}

function writeAggregationToFile(cleanedItems: string[], folderPath: string, score: string){
  let pseudoFile: string = ""
  cleanedItems.forEach((item) => {
    pseudoFile = pseudoFile + item + "\n"
  });
  const filePath = `${folderPath}/${score}`;
  writeToFile(filePath, pseudoFile)
}













