/**
 * Defines methods for organizing quiz data
 *
 * See individual definitions for more details
 */
import { Course } from './types/canvas_api/course'
import { Assignment } from './types/canvas_api/assignment'
import { Submission } from './types/canvas_api/submission'
import {
    Auth,
    getQuizQuestionsNoParams,
    getQuizQuestionsParams,
    getQuizSubmission,
    getQuizSubmissionQuestions,
    getSubmissionData,
} from './canvas.api'
import { QuestionData } from './types/canvas_api/quiz-question'
import { convertToHeader, createTableHeader, createTableRows } from './markdown'

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
    let quizSubmissionData = await getSubmissionData(
        course.id,
        assignment.id,
        auth.canvasDomain,
        auth.canvasAccessToken
    )

    quizSubmissionQuestions.sort((a, b) => a.position - b.position)
    quizQuestionsParams.sort((a, b) => a.position - b.position)
    quizQuestionsNoParams.sort(
        (a, b) => a.assessment_question_id - b.assessment_question_id
    )

    quizSubmissionData = quizSubmissionData.filter(
        (a) => a.id === submission_id
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
            answers: quizQuestionsNoParams[i].answers,
            correct: quizSubmissionQuestions[i].correct,
            question_type: quizSubmissionQuestions[i].question_type,
            submission_data: quizSubmissionData[0].submissionData[i],
        } as QuestionData
        questionsData.push(questionData)
    }
    return formatQuizQuestions(questionsData)
}

export async function assembleQuizQuestionsAndAnswers(
    auth: Auth,
    course: Course,
    assignment: Assignment
) {
    // obtain quiz questions
    const quiz_id_num = assignment.quiz_id
    const quiz_id = quiz_id_num != undefined ? quiz_id_num : -1
    const quizQuestions = await getQuizQuestionsNoParams({
        courseId: course.id,
        quizId: quiz_id,
        canvasDomain: auth.canvasDomain,
        canvasAccessToken: auth.canvasAccessToken,
    })

    // format quiz questions
    const formattedQuestionsAndAnswers = quizQuestions.map(
        (question, index) => {
            const position = (index + 1).toString()
            const question_name = question.question_name
            const points_possible = question.points_possible.toString()
            const qDescription = question.question_text
                .toString()
                .replace(/(<([^>]+)>|\n|&nbsp;)/gi, '')
            const qType = question.question_type

            // generate question table
            const questionHeader =
                convertToHeader('Question #' + position, 2) + '\n'
            const questionTableHeader = createTableHeader([
                'Question Name',
                'Points Possible',
                'Question Description',
                'Question Type',
            ])
            const questionTableBody =
                createTableRows([
                    [question_name, points_possible, qDescription, qType],
                ]) + '\n'

            // generate answers table
            const answerTableHeader = createTableHeader(['Answer', 'Weight'])
            const answerTableBody = createTableRows([
                ...question.answers.map((answer) => {
                    return [answer.text, answer.weight.toString()]
                }),
            ])

            // put it all together
            const formattedString =
                questionHeader +
                questionTableHeader +
                questionTableBody +
                answerTableHeader +
                answerTableBody

            return formattedString
        }
    )

    return formattedQuestionsAndAnswers
}

/**
 * Format student quiz submissions
 * @param quizQuestions An array of quiz questions
 */
export function formatQuizQuestions(quizQuestions: QuestionData[]): string[] {
    // Initialize output array
    const formattedOutput: string[] = []
    // Initialize section arrays
    const quizSummarySection: string[] = []
    const quizCommentsSection: string[] = []
    const longQuizResponsesSection: string[] = []
    // Initialize total score variables
    let pointsEarned = 0
    let totalPoints = 0

    if (quizQuestions.length > 0) {
        // Create summary section header and table header
        const summarySectionHeader = convertToHeader('Summary Table', 2) + '\n'
        const summaryTableHeader = createTableHeader([
            'Question Number',
            'Question Type',
            'Answer(s)',
            'Score',
        ])
        quizSummarySection.push(summarySectionHeader + summaryTableHeader)

        // Create comments section header and table header
        const commentsSectionHeader = convertToHeader('Comments', 2) + '\n'
        const commentsTableHeader = createTableHeader([
            'Question Number',
            'Response Comments',
            'Neutral Comments',
            'Additional Comments',
        ])
        quizCommentsSection.push(commentsSectionHeader + commentsTableHeader)

        // Create long responses section header
        const longQuizResponsesSectionHeader =
            convertToHeader('Additional Responses', 2) + '\n'
        longQuizResponsesSection.push(longQuizResponsesSectionHeader)
    }

    // For each quiz question
    quizQuestions.map((question) => {
        // Get relevant fields
        const position = question.position.toString()
        const points_possible = question.points_possible.toString()
        const qType = question.question_type
        const neutral_comments = question.neutral_comments

        // Get student's answer(s), with variation based on question type
        let answer = ''
        if (
            qType == 'multiple_choice_question' ||
            qType == 'true_false_question'
        ) {
            // Get text field from submission_data
            const text = question.submission_data.text
            // Match the value to an answer id and set answer to the selected answer
            const answers = question.answers
            for (let i = 0; i < answers.length; i++) {
                const currentAnswer = answers[i]
                if (currentAnswer.id == text) {
                    answer = currentAnswer.text
                    break
                }
            }
        } else if (
            qType == 'short_answer_question' ||
            qType == 'numerical_question' ||
            qType == 'essay_question'
        ) {
            answer = question.submission_data.text
        } else if (qType == 'fill_in_multiple_blanks_question') {
            // Get all fields from submission_data that begin with 'answer_for_'
            const answerValues: string[] = []
            const answerKeys = Object.keys(question.submission_data).filter(
                function (k) {
                    return k.indexOf('answer_for_') == 0
                }
            )
            for (let i = 0; i < answerKeys.length; i++) {
                answerValues.push(
                    <string>question.submission_data[answerKeys[i]]
                )
            }
            // Concatenate (and format) their values and store in 'answer'
            answer = answerValues.join(' &#124; ')
        } else if (qType == 'multiple_answers_question') {
            // Get all fields from submission_data that begin with 'answer_'
            const answer_ids: string[] = []
            const answerKeys = Object.keys(question.submission_data).filter(
                function (k) {
                    return k.indexOf('answer_') == 0
                }
            )
            // For each remaining field, if its value is '1' then the remaining
            // part of the field (not 'answer_') is the id
            for (let i = 0; i < answerKeys.length; i++) {
                if (<string>question.submission_data[answerKeys[i]] == '1') {
                    answer_ids.push(answerKeys[i].substring(7))
                }
            }
            // Match each id to an entry in question.answers and get the .text value
            const answerValues: string[] = []
            const answers = question.answers
            for (let i = 0; i < answers.length; i++) {
                const currentAnswer = answers[i]
                for (let j = 0; j < answer_ids.length; j++) {
                    const currentId = answer_ids[j]
                    if (currentAnswer.id == currentId) {
                        answerValues.push(currentAnswer.text)
                        break
                    }
                }
            }
            // Concatenate (and format) those values and store in 'answer'
            answer = answerValues.join(' &#124; ')
        } else if (qType == 'multiple_dropdowns_question') {
            // Get all fields from submission_data that begin with 'answer_for_'
            const answerValues: string[] = []
            const answerKeys = Object.keys(question.submission_data).filter(
                function (k) {
                    return k.indexOf('answer_for_') == 0
                }
            )
            for (let i = 0; i < answerKeys.length; i++) {
                answerValues.push(
                    <string>question.submission_data[answerKeys[i]]
                )
            }
            // Match their values to entries in question.answers and get the .text value
            const answerValues2: string[] = []
            const answers = question.answers
            for (let i = 0; i < answers.length; i++) {
                const currentAnswer = answers[i]
                for (let j = 0; j < answerValues.length; j++) {
                    const currentId = answerValues[j]
                    if (currentAnswer.id == currentId) {
                        answerValues2.push(currentAnswer.text)
                        break
                    }
                }
            }
            // Concatenate (and format) those values and store in 'answer'
            answer = answerValues2.join(' &#124; ')
        } else if (qType == 'file_upload_question') {
            answer = 'Uploaded a file'
        } else if (qType == 'text_only_question') {
            answer = 'n/a'
        }

        // If the answer is too long move it to a subsection below the table
        if (answer.length > 20) {
            longQuizResponsesSection.push(
                convertToHeader('Question ' + position, 3) + '\n'
            )
            longQuizResponsesSection.push(answer + '\n\n')
            answer = 'See Below'
        }

        // Get score field
        const score = question.submission_data.points

        // Update total score variables
        pointsEarned += score
        totalPoints += parseFloat(points_possible)

        // Create summary table entry
        const summaryTableEntry = createTableRows([
            [
                position,
                qType.replace(/_/g, ' '),
                answer,
                score + '/' + points_possible,
            ],
        ])

        // Push the entry to the respective arrays
        quizSummarySection.push(summaryTableEntry)

        let additional_comment = ''
        if (question.submission_data.more_comments != undefined) {
            additional_comment = question.submission_data.more_comments
        }
        // Create comments table entry if it has data
        if (
            (question.correct === true
                ? question.correct_comments.length > 0
                : question.incorrect_comments.length > 0) ||
            neutral_comments.length > 0 ||
            additional_comment.length > 0
        ) {
            const commentsTableEntry = createTableRows([
                [
                    position,
                    question.correct === true
                        ? question.correct_comments
                        : question.incorrect_comments,
                    neutral_comments,
                    additional_comment,
                ],
            ])
            // Push the entry to the respective arrays
            quizCommentsSection.push(commentsTableEntry)
        }
    })

    // Add total score row to summary table
    // Create summary table entry
    quizSummarySection.push(
        createTableRows([
            [
                '',
                '',
                '**TOTAL SCORE:**',
                '**' + pointsEarned + '/' + totalPoints + '**',
            ],
        ])
    )

    // Fill the output array with the contents of the section arrays
    formattedOutput.push(quizSummarySection.join(''))
    if (longQuizResponsesSection.length > 1) {
        formattedOutput.push(longQuizResponsesSection.join(''))
    }
    if (quizCommentsSection.length > 1) {
        formattedOutput.push(quizCommentsSection.join(''))
    }

    // Return the output array
    return formattedOutput
}
