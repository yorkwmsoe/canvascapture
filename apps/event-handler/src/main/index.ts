import fs from 'fs'
import http from 'http'
import https from 'https'
import express, { Request, Response } from 'express'
import {
    AssignmentEvent,
    AssignmentGroupEvent,
    AssignmentOverrideEvent,
} from '../types/events/assignment-event'
import {
    CourseEvent,
    CourseProgressEvent,
    CourseSectionEvent,
} from '@/types/events/course-event'
import {
    DiscussionEntryCreatedEvent,
    DiscussionEntrySubmittedEvent,
    DiscussionTopicEvent,
} from '@/types/events/discussion-topic-event'
import {
    EnrollmentEvent,
    EnrollmentStateEvent,
} from '@/types/events/enrollment-event'
import { QuizSubmittedEvent } from '@/types/events/quiz-event'
import {
    SubmissionCommentCreatedEvent,
    SubmissionEvent,
} from '@/types/events/submission-event'
import {
    UserAccountAssociationCreatedEvent,
    UserEvent,
} from '@/types/events/user-event'

const privateKey = fs.readFileSync('localhost.key', 'utf8')
const certificate = fs.readFileSync('localhost.crt', 'utf8')

const creds = { key: privateKey, cert: certificate }

const app = express()
app.use(express.json())

app.post(
    '/assignment_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: AssignmentEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/assignment_group_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: AssignmentGroupEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/assignment_override_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: AssignmentOverrideEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post('/course_event', async (req: Request, res: Response): Promise<any> => {
    const event: CourseEvent = req.body['body']
    console.log(event)
    return res.status(200).json()
})

app.post(
    '/course_progress_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: CourseProgressEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/course_section_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: CourseSectionEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/discussion_entry_created_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: DiscussionEntryCreatedEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/discussion_entry_submitted_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: DiscussionEntrySubmittedEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/discussion_topic_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: DiscussionTopicEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/enrollment_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: EnrollmentEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/enrollment_state_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: EnrollmentStateEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/quiz_submitted_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: QuizSubmittedEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/submission_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: SubmissionEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/submission_comment_created_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: SubmissionCommentCreatedEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post(
    '/user_account_association_created_event',
    async (req: Request, res: Response): Promise<any> => {
        const event: UserAccountAssociationCreatedEvent = req.body['body']
        console.log(event)
        return res.status(200).json()
    }
)

app.post('/user_event', async (req: Request, res: Response): Promise<any> => {
    const event: UserEvent = req.body['body']
    console.log(event)
    return res.status(200).json()
})

const httpServer = http.createServer(app)
const httpsServer = https.createServer(creds, app)

httpServer.listen(8080)
httpsServer.listen(8443)
