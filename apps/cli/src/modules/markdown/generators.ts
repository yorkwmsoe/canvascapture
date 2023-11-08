import { Assignment } from '@modules/canvas_api/types/assignment'
import { Course } from '@modules/canvas_api/types/course'
import { Submission } from '@modules/canvas_api/types/submission'
import { addNewLine, convertToHeader, createList, createTableHeader, createTableRows, writeToFile } from './markdown'
import { mkdirSync } from 'fs'

const basePath = 'output'

export async function generateAssignment(course: Course, assignment: Assignment, submission: Submission, score: "high" | "median" | "low", commit: boolean = true) {
  const folderPath = `${basePath}/${course.name}/${assignment.name}`;
  mkdirSync(folderPath, { recursive: true });

    const title = convertToHeader(assignment.name, 1)
    const grade = `${submission.score}/${assignment.points_possible}`
    const descriptionHeader = convertToHeader('Description', 2)
    const description = !!assignment.description ? assignment.description : 'No description'
    const submissionHeader = convertToHeader('Submission', 2)
    let submissionBody = submission.body
    if (submission.submission_type === 'online_quiz') {
        submissionBody = 'No submission'
    }
    const feedbackHeader = convertToHeader('Feedback', 2)
    const feedbackBody = !!submission?.submission_comments?.length ? createList(submission?.submission_comments.map((comment) => comment.comment), '-') : 'No feedback'
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

    const items = [title, grade, descriptionHeader, description, submissionHeader, submissionBody, feedbackHeader, feedbackBody, rubricHeader, rubricTable]
    const cleanedItems = items.filter((item) => !!item)

  if (commit) {
    cleanedItems.forEach((item) => {
      const filePath = `${folderPath}/${score}`;
      writeToFile(filePath, item);
      addNewLine(filePath);
    });
  }

    return {
        items,
    }
}
