import { Assignment } from './types/canvas_api/assignment'
// import { Submission } from './types/canvas_api/submission'
// import { Quiz } from './types/canvas_api/quiz'
// import { QuizSubmission } from './types/canvas_api/quiz-submissions'
import { HTMLElement, parse } from 'node-html-parser'
import {
    Auth,
    getQuizHTML,
    GetQuizHTMLRequest,
    GetQuizQuestionRequest,
    getQuizQuestions,
    getQuizSubmission,
    GetQuizSubmissionRequest,
} from './canvas.api'
import { Submission } from './types/canvas_api/submission'

type UserGuess = {
    guess: string
    isCorrect: boolean
}

export type QuestionInfo = {
    questionId: string
    questionNum: string
    questionDescription: string
    possiblePoints: string
    actualPoints: string
    questionType: string
    correctComments: string
    incorrectComments: string
    neutralComments: string
    additionalComments: string
    userGuesses: UserGuess[]
    answers: string[]
}

export async function parseQuizHTML(
    assignment: Assignment,
    submission: Submission,
    auth: Auth
) {
    const quizSubmissionRequest = {
        courseId: assignment.course_id,
        quizId: assignment.quiz_id as number,
        submissionId: submission.id,
    }
    const argsSubmissions: GetQuizSubmissionRequest & Auth = {
        ...quizSubmissionRequest,
        ...auth,
    }
    const qSubmissionId = (await getQuizSubmission(argsSubmissions).then(
        (q) => q?.id
    )) as number

    const quizQuestionRequest: GetQuizQuestionRequest = {
        quizSubmissionId: qSubmissionId,
    }
    const argsQuestions: GetQuizQuestionRequest & Auth = {
        ...quizQuestionRequest,
        ...auth,
    }

    const quizQuestions = await getQuizQuestions(argsQuestions)
    console.log(quizQuestions)

    const getQuizHTMLRequest: GetQuizHTMLRequest = {
        quizId: assignment.quiz_id as number,
        quizSubmissionId: qSubmissionId,
        courseId: assignment.course_id,
    }

    const argsRaw: GetQuizHTMLRequest & Auth = {
        ...getQuizHTMLRequest,
        ...auth,
    }

    const rawQuiz = await getQuizHTML(argsRaw)
    const root = parse(rawQuiz)
    const questionInfos: QuestionInfo[] = []

    for (const qid of quizQuestions) {
        //Question Node HTML element
        const question = getQuestionElement(root, qid) as HTMLElement

        const questionPosition = getQuestionPosition(question)
        const actualScore = getQuestionScore(question, qid)
        const pointsPossible = getPointsPossible(question)
        const questionType = getQuestionType(question)
        const questionDescription = getQuestionDescription(question)

        // All the correctly Answered choices for question
        const userGuesses: UserGuess[] = []
        const [
            additionalComments,
            neutralComments,
            incorrectComments,
            correctComments,
        ] = getComments(question)

        // All correct answers for question
        const correctAnswers: QuestionInfo = getCorrectAnswers(
            qid,
            questionPosition,
            pointsPossible,
            questionDescription,
            actualScore,
            questionType,
            correctComments,
            incorrectComments,
            neutralComments,
            additionalComments
        )

        const individualAnswers: string[] = []

        getUserGuesses(question, questionType, userGuesses, qid)
        getAnswers(question, questionType, individualAnswers)

        correctAnswers.answers = [...individualAnswers]
        correctAnswers.userGuesses = [...userGuesses]

        questionInfos.push(correctAnswers)
    }
    return questionInfos
}

const getQuestionElement = (root: HTMLElement, id: number) => {
    return root.querySelector('#question_' + id)
}

const getQuestionPosition = (question: HTMLElement): string => {
    return question?.querySelector('span.name.question_name')
        ?.innerText as string
}

const getQuestionScore = (question: HTMLElement, qid: number): string => {
    return question
        ?.querySelector('#question_score_' + qid + '_visible')
        ?.getAttribute('value') as string
}

const getPointsPossible = (question: HTMLElement) => {
    const questionPossiblePointsRaw = question?.querySelector(
        'span.points.question_points'
    )?.innerText

    // Numerical points that are possible for question
    return questionPossiblePointsRaw
        ?.substring(questionPossiblePointsRaw?.indexOf('/') + 1)
        .replace(/\s/g, '')
        .trim() as string
}

const getQuestionType = (question: HTMLElement) => {
    return question?.querySelector('span.question_type')?.innerText as string
}

const getQuestionDescription = (question: HTMLElement) => {
    return question
        ?.querySelector('.question_text.user_content')
        ?.querySelector('p')?.innerText as string
}

const getComments = (question: HTMLElement) => {
    const addComments = question
        ?.querySelector('.quiz_comment:not(:has(p)):not(.empty)')
        ?.querySelector('textarea')?.innerHTML as string
    const neuComments = question?.querySelector(
        '.quiz_comment p.neutral_comments'
    )?.nextElementSibling?.innerText as string
    const incComments = question?.querySelector(
        '.quiz_comment p.incorrect_comments'
    )?.nextElementSibling?.innerText as string
    const corComments = question?.querySelector(
        '.quiz_comment p.correct_comments'
    )?.nextElementSibling?.innerText as string
    return [addComments, neuComments, incComments, corComments]
}

const getCorrectAnswers = (
    qid: number,
    questionPosition: string,
    pointsPossible: string,
    questionDescription: string,
    actualScore: string,
    questionType: string,
    correctComments: string,
    incorrectComments: string,
    neutralComments: string,
    additionalComments: string
) => {
    return {
        questionId: qid.toString(),
        questionNum: questionPosition
            ? questionPosition.substring(9).trim()
            : '',
        possiblePoints: pointsPossible ? pointsPossible : '',
        questionDescription: questionDescription,
        actualPoints: actualScore ? actualScore : '',
        questionType: questionType ? questionType : '',
        correctComments: correctComments ? correctComments : '',
        incorrectComments: incorrectComments ? incorrectComments : '',
        neutralComments: neutralComments ? neutralComments : '',
        additionalComments: additionalComments ? additionalComments : '',
        userGuesses: [],
        answers: [],
    }
}

const getUserGuesses = (
    question: HTMLElement,
    questionType: string,
    userGuesses: UserGuess[],
    qid: number
) => {
    const selectedAnswers = question?.querySelectorAll('.selected_answer')
    selectedAnswers?.map((selectedAnswer) => {
        const userGuess: UserGuess = {
            guess: '',
            isCorrect: false,
        }
        if (
            selectedAnswer.classList.contains('correct_answer') &&
            !selectedAnswer.classList.contains('skipped')
        ) {
            userGuess.isCorrect = true
            if (
                questionType === 'short_answer_question' ||
                questionType === 'numerical_question' ||
                questionType == 'formula_question' ||
                questionType == 'exact_answer' ||
                questionType == 'calculated_question'
            ) {
                userGuess.guess = question
                    ?.querySelector(
                        'input.question_input[type=text][name=question_' +
                            qid +
                            ']'
                    )
                    ?.getAttribute('value') as string
            } else {
                if (questionType == 'fill_in_multiple_blanks_question') {
                    userGuess.guess = selectedAnswer.innerText.trim()
                } else {
                    userGuess.guess = selectedAnswer?.querySelector(
                        '.answer_text'
                    )?.innerText as string
                }
            }
        } else if (selectedAnswer.classList.contains('wrong_answer')) {
            userGuess.isCorrect = false
            if (
                questionType === 'short_answer_question' ||
                questionType === 'numerical_question' ||
                questionType == 'formula_question' ||
                questionType == 'exact_answer' ||
                questionType == 'calculated_question'
            ) {
                userGuess.guess = selectedAnswer
                    ?.querySelector(
                        'input.question_input[type=text][name=question_' +
                            qid +
                            ']'
                    )
                    ?.getAttribute('value') as string
            } else if (questionType == 'fill_in_multiple_blanks_question') {
                userGuess.guess = selectedAnswer.innerText.trim()
            } else {
                userGuess.guess = selectedAnswer?.querySelector('.answer_text')
                    ?.innerText as string
            }
        }
        userGuesses.push(userGuess)
    })
}

const getAnswers = (
    question: HTMLElement,
    questionType: string,
    individualAnswers: string[]
) => {
    if (
        questionType == 'fill_in_multiple_blanks_question' ||
        questionType == 'multiple_dropdowns_question'
    ) {
        const ids = question?.querySelectorAll('.blank_id')
        const idset = new Set<string>()
        ids?.map((id) => {
            idset.add(id.innerText)
        })
        Array.from(idset).map((id) => {
            const answerText = question
                ?.querySelector('.correct_answer.answer_for_' + id)
                ?.querySelector('.answer_text')?.innerText
            individualAnswers.push(answerText !== undefined ? answerText : '')
        })
    } else {
        const correctAnswers = question?.querySelectorAll(
            '.answer_for_.answer.correct_answer'
        )
        correctAnswers?.map((correctAnswer) => {
            let answerText = undefined
            if (questionType == 'numerical_question') {
                answerText =
                    correctAnswer?.querySelector('span.answer_exact')?.innerText
            } else if (questionType == 'calculated_question') {
                answerText = correctAnswer?.querySelector(
                    'span.answer_equation'
                )?.innerText
            } else {
                answerText =
                    correctAnswer.querySelector('.answer_text')?.innerText
            }
            answerText = answerText !== undefined ? (answerText as string) : ' '
            individualAnswers.push(answerText)
        })
    }
}
