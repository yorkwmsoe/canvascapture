import { describe, test, expect } from 'vitest'
import { formatQuizQuestions } from '../quiz-organization'
import { QuestionData } from '../types/canvas_api/quiz-question'

const expectedOutput = [
    '## Summary Table\n' +
        '| Question Number | Question Type | Answer(s) | Score |\n' +
        '| --- | --- | --- | --- |\n' +
        '| 1 | true false question |  | 0/1 |\n' +
        '| 2 | multiple choice question |  | 0/1 |\n' +
        '| 3 | multiple answers question |  | 0/1 |\n' +
        '|  |  | **TOTAL SCORE:** | **0/3** |\n',
    '## Comments\n' +
        '| Question Number | Response Comments | Neutral Comments | Additional Comments |\n' +
        '| --- | --- | --- | --- |\n' +
        '| 1 | <p>Wow you are so amazing you guessed this correct, these are the corrents</p> | <p>To Drake or not to drake, these are neutral comment</p> |  |\n' +
        '| 3 | <p>You guessed incorrectly DRAKE, these are the incorrect comments</p> | <p>These are the Neutral comments Drake celly</p> |  |\n',
]
//TODO: write an "assembleQuizQuestionsAndComments test" with a working vm after new implementation that requires new values/data

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
            answers: [],
            correct: true,
            question_type: 'true_false_question',
            submission_data: { more_comments: '', text: '', points: 0 },
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
            answers: [],
            correct: true,
            question_type: 'multiple_choice_question',
            submission_data: { more_comments: '', text: '', points: 0 },
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
            answers: [],
            correct: false,
            question_type: 'multiple_answers_question',
            submission_data: { more_comments: '', text: '', points: 0 },
        },
    ])
    const questionsData: QuestionData[] = JSON.parse(questionsDataString)
    test('formatQuizQuestions', () => {
        const output = formatQuizQuestions(questionsData)
        expect(output).toEqual(expectedOutput)
    })
})
