import { http, HttpResponse } from 'msw'
import {
    assignmentsRawJSON,
    submissionsRawJSON,
    courseRawJSON,
    quizRawJSON,
    quizSubmissionJSON,
    quizFromQuizzesRawJSON,
    quizSubmissionQuestionsRawJSON,
    quizQuestionsNoParamsRawJSON,
    quizQuestionsParamsRawJSON,
} from './canvas.api.mocks'

const sampleOptions = { status: 200, statusText: 'OK' }

export const handlers = [
    // Demo Handler
    http.get('https://example.com/user', () => {
        return HttpResponse.json({
            id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
            firstName: 'John',
            lastName: 'Maverick',
        })
    }),

    // Courses Handler
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses?exclude_blueprint_courses&per_page=1000',
        () => {
            return new Response(courseRawJSON, sampleOptions)
        }
    ),

    //Assignments Handler
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/assignments?per_page=1000',
        () => {
            return new Response(assignmentsRawJSON, sampleOptions)
        }
    ),

    //Submissions Handler
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/assignments/4/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=1000',
        () => {
            return new Response(submissionsRawJSON, sampleOptions)
        }
    ),

    // Quiz Header
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/quizzes/4',
        () => {
            return new Response(quizRawJSON, sampleOptions)
        }
    ),

    // getQuizSubmission Header
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/quizzes/1/submissions',
        () => {
            return new Response(quizSubmissionJSON, sampleOptions)
        }
    ),

    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/quizzes/1',
        () => {
            return new Response(quizFromQuizzesRawJSON, sampleOptions)
        }
    ),

    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/quizzes/1/submissions',
        () => {
            return new Response(quizSubmissionJSON, sampleOptions)
        }
    ),

    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/quiz_submissions/14/questions?include[]=quiz_question',
        () => {
            return new Response(quizSubmissionQuestionsRawJSON, sampleOptions)
        }
    ),

    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/2/quizzes/3/questions',
        ({ request }) => {
            const url = new URL(request.url)
            const quizSubmissionId = url.searchParams.get('quiz_submission_id')
            const quizSubmissionAttempt = url.searchParams.get(
                'quiz_submission_attempt'
            )
            if (!quizSubmissionId || !quizSubmissionAttempt) {
                return new Response(quizQuestionsNoParamsRawJSON, sampleOptions)
            }
            return new Response(quizQuestionsParamsRawJSON, sampleOptions)
        }
    ),
]
