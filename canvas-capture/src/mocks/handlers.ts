import { http, HttpResponse } from 'msw'
import {
    assignmentsRawJSON,
    submissionsRawJSON,
    courseRawJSON,
    quizRawJSON,
    quizSubmissionJSON,
} from './canvas.api.mocks'

const sampleOptions = { status: 200, statusText: 'OK' }

const courseResponse = new Response(courseRawJSON, sampleOptions)
const assignmentsResponse = new Response(assignmentsRawJSON, sampleOptions)
const submissionsResponse = new Response(submissionsRawJSON, sampleOptions)
const quizResponse = new Response(quizRawJSON, sampleOptions)
const quizSubmissionResponse = new Response(quizSubmissionJSON, sampleOptions)

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
            return courseResponse.clone()
        }
    ),

    //Assignments Handler
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/assignments?per_page=1000',
        () => {
            return assignmentsResponse.clone()
        }
    ),

    //Submissions Handler
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/assignments/4/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=1000',
        () => {
            return submissionsResponse.clone()
        }
    ),

    // Quiz Header
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/quizzes/4',
        () => {
            return quizResponse.clone()
        }
    ),

    // getQuizSubmission Header
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/quizzes/1/submissions',
        () => {
            return quizSubmissionResponse.clone()
        }
    ),
]
