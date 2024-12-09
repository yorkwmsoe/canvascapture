import { Course } from './types/canvas_api/course'
import { Assignment } from './types/canvas_api/assignment'
import { Submission } from './types/canvas_api/submission'
import {
    getQuizQuestionsNoParams,
    getQuizQuestionsParams,
    getQuizSubmission,
    getQuizSubmissionQuestions,
    Auth,
} from './canvas.api'
import { QuestionData } from './types/canvas_api/quiz-question'
import { convertToHeader, createTableHeader, createTableRows } from './markdown'
import { getComments } from './types/canvas_api/QuizCommentsScrape'

export async function assembleQuizQuestionsAndComments(
    auth: Auth,
    course: Course,
    assignment: Assignment,
    submission: Submission
) {
    //const user_id = submission.user_id
    const submission_id = submission.id
    const quiz_id_num = assignment.quiz_id
    const quiz_id = quiz_id_num != undefined ? quiz_id_num : -1
    const quizSubmission = await getQuizSubmission({
        canvasDomain: auth.canvasDomain,
        canvasAccessToken: auth.canvasAccessToken,
        courseId: course.id,
        quizId: quiz_id,
        submissionId: submission_id,
    })

    let comments = await getComments(
        'http://sdlstudentvm09.msoe.edu/',
        course.id,
        quiz_id,
        1,
        'canvas-student1',
        'studentofcanvas1'
    )

    const quiz_submission_num =
        quizSubmission != undefined ? quizSubmission.id : -1
    const quizSubmissionId =
        quiz_submission_num != undefined ? quiz_submission_num : -1

    const quizSubmissionQuestions = await getQuizSubmissionQuestions({
        quizSubmissionId: quizSubmissionId,
        canvasDomain: auth.canvasDomain,
        canvasAccessToken: auth.canvasAccessToken,
    })

    const quizSubAttempt =
        quizSubmission != undefined ? quizSubmission.attempt : -1
    const quizQuestionsParams = await getQuizQuestionsParams({
        courseId: course.id,
        quizId: quiz_id,
        submissionId: quizSubmissionId,
        quizSubmissionAttempt: quizSubAttempt,
        canvasDomain: auth.canvasDomain,
        canvasAccessToken: auth.canvasAccessToken,
    })

    const quizQuestionsNoParams = await getQuizQuestionsNoParams({
        courseId: course.id,
        quizId: quiz_id,
        canvasDomain: auth.canvasDomain,
        canvasAccessToken: auth.canvasAccessToken,
    })
    quizSubmissionQuestions.sort((a, b) => a.position - b.position)
    quizQuestionsParams.sort((a, b) => a.position - b.position)
    quizQuestionsNoParams.sort(
        (a, b) => a.assessment_question_id - b.assessment_question_id
    )

    //The quizSubmissionQuestions has 2 more items, depending on the quiz than quizQuestionsParams/NoParams
    //This is because there is a spacer which is not a question, and there is a question that has
    //no grade associated with it.

    const questionsData: QuestionData[] = []
    for (let i = 0; i < quizQuestionsParams.length; i++) {
        const questionData: QuestionData = {
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
            additional_comments: comments,
        } as QuestionData
        questionsData.push(questionData)
        console.log('POSITION: ' + questionData.position)
    }
    return formatQuizQuestions(questionsData)
}

export function formatQuizQuestions(quizQuestions: QuestionData[]): string[] {
    const formattedQuestions: string[] = []
    //const numQuestions = quizQuestions.length

    quizQuestions.map((question) => {
        const position = question.position.toString()
        const question_name = question.question_name
        const points_possible = question.points_possible.toString()

        const qDescription = question.question_description
            .toString()
            .replace(/(<([^>]+)>|\n|&nbsp;)/gi, '')
        const qType = question.question_type
        const neutral_comments = question.neutral_comments

        const questionHeader = convertToHeader('Question ' + position, 2) + '\n'
        const questionTableHeader1 = createTableHeader([
            'Question Name',
            'Points Possible',
            'Question Description',
            'Question Type',
        ])
        const questionTableBody1 =
            createTableRows([
                [question_name, points_possible, qDescription, qType],
            ]) + '\n'

        let commentType = ''
        let conditionalComments = ''
        let score = ''
        if (question.correct === true) {
            commentType = 'Correct'
            score = 'Full'
            conditionalComments = question.correct_comments
        } else {
            commentType = 'Incorrect'
            conditionalComments = question.incorrect_comments
            score = question.correct === 'partial' ? 'partial' : 'No Points'
        }

        const questionTableHeader2 = createTableHeader([
            'Student Score',
            commentType + ' Comments',
            'Neutral Comments',
            'Additional Comments',
        ])
        const questionTableBody2 = createTableRows([
            [
                score,
                conditionalComments,
                neutral_comments,
                question.additional_comments[question.position - 1],
            ],
        ])
        const questionString =
            questionHeader +
            questionTableHeader1 +
            questionTableBody1 +
            questionTableHeader2 +
            questionTableBody2
        formattedQuestions.push(questionString)
    })

    return formattedQuestions
}
