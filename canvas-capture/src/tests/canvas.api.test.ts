import { describe, test, expect } from 'vitest'
import {
    assignmentsRawJSON,
    submissionsRawJSON,
    courseRawJSON,
    quizRawJSON,
    rawQuizSubmission,
    quizSubmissionQuestionsRawJSON,
    quizQuestionsNoParamsRawJSON,
    quizQuestionsParamsRawJSON,
} from '../mocks/canvas.api.mocks'

import {
    handleDates,
    intercept,
    getApiHeaders,
    getCourses,
    getAssignments,
    getAssignmentsWithCourseId,
    getSubmissions,
    getQuiz,
    getQuizSubmission,
    getLatestQuizVersion,
    getMostCommonQuizVersion,
    getQuizSubmissionQuestions,
    getQuizQuestionsNoParams,
    getQuizQuestionsParams,
} from '../canvas.api'

describe('testToJSON', () => {
    const sampleRawJSON = '{"color1":"Blue","numColors":1, "hasColors": true}'
    const sampleOptions = { status: 200, statusText: 'OK' }
    const sampleResponse = new Response(sampleRawJSON, sampleOptions)

    test('toJSON test', async () => {
        const correctJSON = { color1: 'Blue', numColors: 1, hasColors: true }
        const recievedJSON = await sampleResponse.json()
        expect(recievedJSON).toEqual(correctJSON)
    })
})

describe('Testing handleDates function', () => {
    const inputHandleDates = {
        date1: '2024-04-17T08:30:00Z',
        date2: '2024-04-18T12:45:00Z',
        nested: {
            date3: '2024-04-19T15:20:00Z',
            nested2: {
                date4: '2024-04-20T18:10:00Z',
                nonDate: 'This is not a date string',
            },
        },
        nonDate: 'This is also not a date string',
    }

    const expectedOutput = {
        date1: new Date('2024-04-17T08:30:00Z'),
        date2: new Date('2024-04-18T12:45:00Z'),
        nested: {
            date3: new Date('2024-04-19T15:20:00Z'),
            nested2: {
                date4: new Date('2024-04-20T18:10:00Z'),
                nonDate: 'This is not a date string',
            },
        },
        nonDate: 'This is also not a date string',
    }

    test('handleDates test', () => {
        //act
        handleDates(inputHandleDates)

        //assert for all cases
        expect(inputHandleDates).toEqual(expectedOutput)
        expect(handleDates(null)).toBe(undefined)
        expect(handleDates(undefined)).toBe(undefined)
    })
})

describe('Testing intercept', () => {
    const sampleRawJSON =
        '{"color1":"Blue","numColors":1, "hasColors": true, "date": "2024-04-17T08:30:00Z"}'
    const sampleOptions = { status: 200, statusText: 'OK' }
    const sampleResponse = new Response(sampleRawJSON, sampleOptions)
    //intercept(sampleRawJSON)

    test('intercept Test', async () => {
        const expectedResponse = await intercept(sampleResponse)
        expect(sampleResponse).toEqual(expectedResponse)
    })
})

describe('Testing getApiHeaders', () => {
    const sampleHeaders: HeadersInit = {
        head1: 'value1',
        head2: 'value2',
    }
    const sampleAccessToken = '1234567890qwertyuiopasdfghjklzxcvbnm'
    const expectedHeaders = {
        Authorization: 'Bearer ' + sampleAccessToken,
        head1: 'value1',
        head2: 'value2',
    }
    test('getApiHeaders test', () => {
        const recievedHeaders = getApiHeaders(
            { accessToken: sampleAccessToken },
            sampleHeaders
        )
        expect(recievedHeaders).toEqual(expectedHeaders)
    })
})

describe('Testing getCourses', () => {
    const courseJSONList = JSON.parse(courseRawJSON)

    test('getCourses Test', async () => {
        const response = await getCourses({
            canvasAccessToken:
                'reK0qt1RHGt1tCVrNwrNasbWnOd8T52y2vW4BV3yM1mXZ9jtLAXU6Xn2mtzcNZ3B',
            canvasDomain: 'http://sdlstudentvm06.msoe.edu',
        })
        expect(response).toEqual(courseJSONList)
    })
})

describe('Testing getAssignments', async () => {
    const assignmentsJSONList = JSON.parse(assignmentsRawJSON)

    test('getAssignments Test', async () => {
        const response = await getAssignments({
            canvasAccessToken: 'Fake Token',
            canvasDomain: 'http://sdlstudentvm06.msoe.edu',
            courseId: 1,
        })
        expect(response).toEqual(assignmentsJSONList)
    })
})

describe('Testing getAssignments with courseid', async () => {
    const assignmentsJSONList = JSON.parse(assignmentsRawJSON)

    test('Testing getAssignmentsWithCourseId', async () => {
        const response = await getAssignmentsWithCourseId({
            canvasAccessToken: 'Fake Token',
            canvasDomain: 'http://sdlstudentvm06.msoe.edu',
            courseId: 1,
        })
        expect(response.assignments).toEqual(assignmentsJSONList)
        expect(response.courseId).toEqual(1)
    })
})

describe('Testing getSubmissions', async () => {
    const submissionsJSONList = JSON.parse(submissionsRawJSON)

    test('Testing getSubmissions', async () => {
        const response = await getSubmissions({
            canvasAccessToken: 'Fake Token',
            canvasDomain: 'http://sdlstudentvm06.msoe.edu',
            courseId: 1,
            assignmentId: 4,
            isStudent: false,
        })
        expect(response).toEqual(submissionsJSONList)
        // NEED TO ADD IS STUDENT FUNCTIONALITY
    })
})

describe('Testing getQuiz', async () => {
    const quizJSONList = JSON.parse(quizRawJSON)

    test('getQuiz Test', async () => {
        const response = await getQuiz({
            canvasAccessToken: 'Fake Token',
            canvasDomain: 'http://sdlstudentvm06.msoe.edu',
            courseId: 1,
            quizId: 4,
        })
        expect(response).toEqual(quizJSONList)
    })
})

describe('Testing quizSubmissions', async () => {
    const quizSubmissionJSONList = JSON.parse(rawQuizSubmission)

    test('quizSubmissions Test', async () => {
        const response = await getQuizSubmission({
            canvasAccessToken: 'Fake Token',
            canvasDomain: 'http://sdlstudentvm06.msoe.edu',
            courseId: 1,
            quizId: 1,
            submissionId: 4,
        })
        expect(response).toEqual(quizSubmissionJSONList)
    })
})

describe('Testing getLatestQuizVersion', async () => {
    test('getQuiz Test', async () => {
        const response = await getLatestQuizVersion({
            canvasAccessToken: 'Fake Token',
            canvasDomain: 'http://sdlstudentvm06.msoe.edu',
            courseId: 1,
            quizId: 1,
        })
        //6 is the version number
        expect(response).toEqual(6)
    })
})

describe('Testing MostCommonQuizVersion', async () => {
    test('quizSubmissions Test', async () => {
        const response = await getMostCommonQuizVersion({
            canvasAccessToken: 'Fake Token',
            canvasDomain: 'http://sdlstudentvm06.msoe.edu',
            courseId: 1,
            quizId: 1,
        })
        expect(response).toEqual(6)
    })
})

describe('Testing getQuizSubmissionQuestions', async () => {
    const quizSubmissionQuestionsJSONList = JSON.parse(
        quizSubmissionQuestionsRawJSON
    )

    test('quizSubmissions Test', async () => {
        const response = await getQuizSubmissionQuestions({
            canvasAccessToken: 'Fake Token',
            canvasDomain: 'http://sdlstudentvm06.msoe.edu',
            quizSubmissionId: 14,
        })
        expect(response).toEqual(
            quizSubmissionQuestionsJSONList.quiz_submission_questions
        )
    })
})

describe('Testing getQuizQuestionsNoParams', async () => {
    const quizQuestionsNoParamsJSONList = JSON.parse(
        quizQuestionsNoParamsRawJSON
    )

    test('quizSubmissions Test', async () => {
        const response = await getQuizQuestionsNoParams({
            canvasAccessToken: 'Fake Token',
            canvasDomain: 'http://sdlstudentvm06.msoe.edu',
            courseId: 2,
            quizId: 3,
        })
        expect(response).toEqual(quizQuestionsNoParamsJSONList)
    })
})

describe('Testing getQuizQuestionsParams', async () => {
    const quizQuestionsParamsJSONList = JSON.parse(quizQuestionsParamsRawJSON)

    test('quizSubmissions Test', async () => {
        const response = await getQuizQuestionsParams({
            canvasAccessToken: 'Fake Token',
            canvasDomain: 'http://sdlstudentvm06.msoe.edu',
            courseId: 2,
            quizId: 3,
            submissionId: 10,
            quizSubmissionAttempt: 1,
        })
        expect(response).toEqual(quizQuestionsParamsJSONList)
    })
})
