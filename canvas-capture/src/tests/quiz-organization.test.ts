import { describe, test, expect } from 'vitest'
import {
    assembleQuizQuestionsAndComments,
    formatQuizQuestions,
} from '../quiz-organization'
import { Auth } from '../canvas.api'

import {
    courseWithQuiz,
    assignmentWhichIsQuiz,
    submissionForQuiz,
} from '../mocks/canvas.api.mocks'
import { Course } from '../types/canvas_api/course'
import { Assignment } from '../types/canvas_api/assignment'
import { Submission } from '../types/canvas_api/submission'
import { QuestionData } from '../types/canvas_api/quiz-question'

const expectedOutput = [
    '## Question 1\n' +
        '| Question Name | Points Possible | Question Description | Question Type |\n' +
        '| --- | --- | --- | --- |\n' +
        '| Question | 1 | Drake???? | true_false_question |\n' +
        '\n' +
        '| Student Score | Correct Comments | Neutral Comments | Additional Comments |\n' +
        '| --- | --- | --- | --- |\n' +
        '| Full | <p>Wow you are so amazing you guessed this correct, these are the corrents</p> | <p>To Drake or not to drake, these are neutral comment</p> | ADD FROM SCRAPING |\n',
    '## Question 2\n' +
        '| Question Name | Points Possible | Question Description | Question Type |\n' +
        '| --- | --- | --- | --- |\n' +
        '| Question | 1 | Nice Spice??? | multiple_choice_question |\n' +
        '\n' +
        '| Student Score | Correct Comments | Neutral Comments | Additional Comments |\n' +
        '| --- | --- | --- | --- |\n' +
        '| Full |  |  | ADD FROM SCRAPING |\n',
    '## Question 3\n' +
        '| Question Name | Points Possible | Question Description | Question Type |\n' +
        '| --- | --- | --- | --- |\n' +
        '| Question | 1 | This is a multiple answers question and is being used to test the presence, of correct, incorrent, neutral, and additional comments | multiple_answers_question |\n' +
        '\n' +
        '| Student Score | Incorrect Comments | Neutral Comments | Additional Comments |\n' +
        '| --- | --- | --- | --- |\n' +
        '| No Points | <p>You guessed incorrectly DRAKE, these are the incorrect comments</p> | <p>These are the Neutral comments Drake celly</p> | ADD FROM SCRAPING |\n',
]

describe('Testing assembleQuizQuestionsAndComments', async () => {
    const sampleCourse: Course = JSON.parse(courseWithQuiz)
    const sampleAssignment: Assignment = JSON.parse(assignmentWhichIsQuiz)
    const sampleSubmission: Submission = JSON.parse(submissionForQuiz)
    const auth: Auth = {
        canvasAccessToken: 'Fake Token',
        canvasDomain: 'http://sdlstudentvm06.msoe.edu',
    }

    test('assembleQuizQuestionsAndComments', async () => {
        const output = await assembleQuizQuestionsAndComments(
            auth,
            sampleCourse,
            sampleAssignment,
            sampleSubmission
        )
        expect(output).toEqual(expectedOutput)
    })
})

describe('Testing formatQuizQuestions', async () => {
    const questionsDataString = JSON.stringify([
        {
            quiz_id: 2,
            question_name: 'Question',
            question_description: '<p>Drake????</p>',
            position: 1,
            points_possible: 1,
            correct_comments:
                '<p>Wow you are so amazing you guessed this correct, these are the corrents</p>',
            neutral_comments:
                '<p>To Drake or not to drake, these are neutral comment</p>',
            incorrect_comments:
                '<p>You are a failure, these are the incorrect comments</p>',
            correct_answers: [],
            correct: true,
            question_type: 'true_false_question',
        },
        {
            quiz_id: 2,
            question_name: 'Question',
            question_description: '<p>Nice Spice???</p>',
            position: 2,
            points_possible: 1,
            correct_comments: '',
            neutral_comments: '',
            incorrect_comments: '',
            correct_answers: [],
            correct: true,
            question_type: 'multiple_choice_question',
        },
        {
            quiz_id: 2,
            question_name: 'Question',
            question_description:
                '<p>This is a multiple answers question and is being used to test the presence, of correct, incorrent, neutral, and additional comments</p>',
            position: 3,
            points_possible: 1,
            correct_comments:
                '<p>You guessed correctly DRAKE, these are the correct comments</p>',
            neutral_comments:
                '<p>These are the Neutral comments Drake celly</p>',
            incorrect_comments:
                '<p>You guessed incorrectly DRAKE, these are the incorrect comments</p>',
            correct_answers: [],
            correct: false,
            question_type: 'multiple_answers_question',
        },
    ])
    const questionsData: QuestionData[] = JSON.parse(questionsDataString)
    test('formatQuizQuestions', () => {
        const output = formatQuizQuestions(questionsData)
        expect(output).toEqual(expectedOutput)
    })
})
