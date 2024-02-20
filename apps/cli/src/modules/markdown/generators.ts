import { Assignment } from '@modules/canvas_api/types/assignment'
import { Course } from '@modules/canvas_api/types/course'
import { Submission } from '@modules/canvas_api/types/submission'
import { addNewLine, convertToHeader, createList, createTableHeader, createTableRows, writeToFile } from './markdown'
import { mkdirSync } from 'fs'
import {getMostCommonQuizVersion, getQuiz, getQuizQuestionsNoParams, getQuizQuestionsParams, getQuizSubmission, getQuizSubmissionQuestions} from "@modules/canvas_api/api";
import {Quiz} from "@modules/canvas_api/types/quiz";
import {QuizSubmission} from "@modules/canvas_api/types/quiz-submissions";
import {QuizSubmissionQuestion} from "@modules/canvas_api/types/quiz_submission_question";
import {QuestionData, QuizQuestion, QuizSubmissionAnswer} from "@modules/canvas_api/types/quiz_question";
import {Question} from "inquirer";

const basePath = 'output'
const rmHtml = "/(<([^>]+)>)/ig"

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
    ... await quizUserOverview(assignment, submission),
    ... await assembleQuizQuestionsAndComments(course, assignment, submission)]

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
  return [descriptionHeader, description.replace(rmHtml, '')]
}

function assembleSubmissionInfo(submission: Submission){
  const submissionHeader = convertToHeader('Submission', 2)
  let submissionBody = submission.body
  return [submissionHeader, submissionBody.replace(rmHtml, '')]
}

function assembleFeedbackInfo(submission: Submission){
  const feedbackHeader = convertToHeader('Feedback', 2)
  const feedbackBody = !!submission?.submission_comments?.length ? createList(submission?.submission_comments.map((comment) => comment.comment), '-') : 'No feedback'
  return [feedbackHeader, feedbackBody.replace(rmHtml, '')]
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

async function assembleQuizQuestionsAndComments(course: Course, assignment: Assignment, submission: Submission) {
  const user_id = submission.user_id
  const submission_id = submission.id
  const quiz_id = assignment.quiz_id as number;
  const quizSubmission = await getQuizSubmission(course.id, quiz_id, submission_id)
  const quizSubmissionId = quizSubmission.id as number
  const quizSubmissionQuestions = await getQuizSubmissionQuestions(quizSubmission.id)
  const quizQuestionsParams = await getQuizQuestionsParams(course.id, quiz_id, quizSubmissionId, quizSubmission.attempt)
  const quizQuestionsNoParams = await getQuizQuestionsNoParams(course.id, quiz_id)

  quizSubmissionQuestions.sort((a, b) => a.position - b.position)
  quizQuestionsParams.sort((a, b) => a.position - b.position)
  quizQuestionsNoParams.sort((a, b) => a.assessment_question_id - b.assessment_question_id)

  //The quizSubmissionQuestions has 2 more items than quizQuestionsParams/NoParams
  //This is because there is a spacer which is not a question, and there is a question that has
  //no grade associated with it.

  let questionsData: QuestionData[] = []
  for(let i = 0; i < quizQuestionsParams.length; i++){
    let questionData: QuestionData = {
      quiz_id: quizSubmissionQuestions[i].quiz_id,
      question_name: quizQuestionsNoParams[i].question_name,
      question_description: quizQuestionsNoParams[i].question_text,
      position: quizSubmissionQuestions[i].position,
      points_possible: quizQuestionsNoParams[i].points_possible,
      correct_comments: quizQuestionsParams[i].correct_comments_html,
      neutral_comments: quizQuestionsParams[i].neutral_comments_html,
      incorrect_comments: quizQuestionsParams[i].incorrect_comments_html,
      correct_answers: [], //need further implementation
      correct: quizSubmissionQuestions[i].correct,
      question_type: quizSubmissionQuestions[i].question_type,
    } as QuestionData
    questionsData.push(questionData)
  }

  return formatQuizQuestions(questionsData)

}

function formatQuizQuestions(quizQuestions: QuestionData[]): string[]{
  let formattedQuestions: string[] = []
  const numQuestions = quizQuestions.length
  quizQuestions.forEach((question) => {
    const position = question.position.toString().replace(rmHtml, '')
    const question_name = question.question_name.replace(rmHtml, '')
    const points_possible = question.points_possible.toString().replace(rmHtml, '')
    const qDescription = question.question_description.replace(/(<([^>]+)>|\n|&nbsp;)/ig, '');
    const qType = question.question_type.replace(rmHtml, '')
    const neutral_comments = question.neutral_comments.replace(rmHtml, '')

    const questionHeader = convertToHeader("Question " + position, 2) + '\n'
    const questionTableHeader1 = createTableHeader(["Question Name", "Points Possible", "Question Description", "Question Type"])
    const questionTableBody1 = createTableRows([[question_name, points_possible, qDescription, qType]]) + '\n'

    let commentType = ""
    let conditionalComments = ""
    let score = ""
    if(question.correct === true){
      commentType = "Correct"
      score = "Full"
      conditionalComments = question.correct_comments.replace(rmHtml, '')
    } else {
      commentType = "Incorrect"
      conditionalComments = question.incorrect_comments.replace(rmHtml, '')
      score = (question.correct === "partial") ? "partial" : "No Points";
    }

    const questionTableHeader2 = createTableHeader(["Student Score", commentType + " Comments", "Neutral Comments", "Additional Comments"])
    const questionTableBody2 = createTableRows([[score, conditionalComments, neutral_comments, "ADD FROM SCRAPING"]])
    const questionString = questionHeader + questionTableHeader1 +  questionTableBody1 + questionTableHeader2 + questionTableBody2
    formattedQuestions.push(questionString)
  })


  return formattedQuestions
}












