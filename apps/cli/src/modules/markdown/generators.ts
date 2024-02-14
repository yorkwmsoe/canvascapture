import { Assignment } from '@modules/canvas_api/types/assignment'
import { Course } from '@modules/canvas_api/types/course'
import { Submission } from '@modules/canvas_api/types/submission'
import { addNewLine, convertToHeader, createList, createTableHeader, createTableRows, writeToFile } from './markdown'
import { mkdirSync } from 'fs'
import {getMostCommonQuizVersion, getQuiz, getQuizSubmission} from "@modules/canvas_api/api";
import {Quiz} from "@modules/canvas_api/types/quiz";
import {QuizSubmission} from "@modules/canvas_api/types/quiz-submissions";

const basePath = 'output'

export async function generateAssignment(course: Course, assignment: Assignment, submission: Submission, score: "high" | "median" | "low", commit: boolean = true) {
  const folderPath = `${basePath}/${course.name}/${assignment.name}`;
  mkdirSync(folderPath, { recursive: true });

  let items: string[] = [...assembleTitleAndGrade(assignment, submission, ""),
    ...assembleFeedbackInfo(submission),
    ...assembleDescriptionInfo(assignment),
    ...assembleRubricInfo(assignment, submission),
    ...assembleSubmissionInfo(submission)]

  const cleanedItems = items.filter((item) => !!item)

  if (commit) {
    writeAggregationToFile(cleanedItems, folderPath, score)
  }

    return {
        items,
    }
}

export async function generateQuiz(course: Course, assignment: Assignment, submission: Submission, score: "high" | "median" | "low", commit: boolean = true){
  const folderPath = `${basePath}/${course.name}/${assignment.name}`;
  mkdirSync(folderPath, { recursive: true });

  let items: string[] = [...assembleTitleAndGrade(assignment, submission, "QUIZ: "),
    ...assembleDescriptionInfo(assignment),
    ...assembleFeedbackInfo(submission),
    ... await quizOverview(assignment),
    ... await quizUserOverview(assignment, submission)]

  const cleanedItems = items.filter((item) => !!item)

  if (commit) {
    writeAggregationToFile(cleanedItems, folderPath, score)
  }

  return {
    items,
  }
}

async function quizOverview(assignment: Assignment){
  const quiz_id = assignment.quiz_id as number;
  const infoHeader = convertToHeader("Quiz Info", 2)
  const quiz: Quiz = await getQuiz(assignment.course_id, quiz_id)
  const quizHeader = createTableHeader(["Quiz Id", "Assignment Id", "# of Questions",
    "Total Points", "Version #",  ])
  const quizBody = createTableRows([[quiz_id.toString(), assignment.id.toString(),
    quiz.question_count.toString(), quiz.points_possible.toString(), quiz.version_number.toString() ]])
  return [infoHeader, quizHeader + quizBody]
}
async function quizUserOverview(assignment: Assignment, submission: Submission){
  const userOverviewHeader = convertToHeader("User Overview", 2)
  const quiz: Quiz = await getQuiz(assignment.course_id, assignment.quiz_id)
  const quizSubmission: QuizSubmission = await getQuizSubmission(assignment.course_id, quiz.id, submission.id)
  const userHeader = createTableHeader(["User Id", "Score", "Kept Score", "Attempt"])
  const userBody = createTableRows([[submission.user_id.toString(), quizSubmission.score!.toString(),
    quizSubmission.kept_score!.toString(), quizSubmission.attempt.toString()]])
  return [userOverviewHeader, userHeader + userBody]

}

function assembleTitleAndGrade(assignment: Assignment, submission: Submission, type: string){
  const title = convertToHeader(type + assignment.name, 1)
  const grade = `${submission.score}/${assignment.points_possible}`
  return [title, grade]
}

function assembleDescriptionInfo(assignment: Assignment){
  const descriptionHeader = convertToHeader('Description', 2)
  const description = !!assignment.description ? assignment.description : 'No description'
  return [descriptionHeader, description.replace(/(<([^>]+)>)/ig, '')]
}

function assembleSubmissionInfo(submission: Submission){
  const submissionHeader = convertToHeader('Submission', 2)
  let submissionBody = submission.body
  return [submissionHeader, submissionBody.replace(/(<([^>]+)>)/ig, '')]
}

function assembleFeedbackInfo(submission: Submission){
  const feedbackHeader = convertToHeader('Feedback', 2)
  const feedbackBody = !!submission?.submission_comments?.length ? createList(submission?.submission_comments.map((comment) => comment.comment), '-') : 'No feedback'
  return [feedbackHeader, feedbackBody.replace(/(<([^>]+)>)/ig, '')]
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












