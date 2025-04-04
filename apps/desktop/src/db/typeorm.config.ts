import 'reflect-metadata'
import path from 'node:path'
import { DataSource, DataSourceOptions } from 'typeorm'

import { FrontEnd1743733383506 } from '@canvas-capture/lib'
import {
    Answer,
    Assignment,
    AssignmentDate,
    AssignmentGroup,
    BlueprintRestrictions,
    Course,
    CourseCalendar,
    CourseProgress,
    DiscussionTopic,
    Enrollment,
    ExternalToolTagAttributes,
    File,
    Formula,
    Grade,
    GradingPeriod,
    GroupTopic,
    LockInfo,
    Match,
    MediaComment,
    NeedsGradingCountBySection,
    QuestionData,
    Quiz,
    QuizQuestion,
    QuizSubmission,
    QuizSubmissionAnswer,
    QuizSubmissionQuestion,
    RubricAssessmentCriterion,
    RubricCriteria,
    RubricRating,
    RubricSettings,
    ScoreStatistic,
    Submission,
    SubmissionAttachment,
    SubmissionComment,
    Term,
    TurnitinSettings,
    User,
    UserDisplay,
    Variable,
} from '@canvas-capture/lib'

const entities = [
    Answer,
    Assignment,
    AssignmentDate,
    AssignmentGroup,
    BlueprintRestrictions,
    Course,
    CourseCalendar,
    CourseProgress,
    DiscussionTopic,
    Enrollment,
    ExternalToolTagAttributes,
    File,
    Formula,
    Grade,
    GradingPeriod,
    GroupTopic,
    LockInfo,
    Match,
    MediaComment,
    NeedsGradingCountBySection,
    QuestionData,
    Quiz,
    QuizQuestion,
    QuizSubmission,
    QuizSubmissionAnswer,
    QuizSubmissionQuestion,
    RubricAssessmentCriterion,
    RubricCriteria,
    RubricRating,
    RubricSettings,
    ScoreStatistic,
    Submission,
    SubmissionAttachment,
    SubmissionComment,
    Term,
    TurnitinSettings,
    User,
    UserDisplay,
    Variable,
]

const frontEndMigrations = [FrontEnd1743733383506]

const dbName = 'canvas.db'

const isElectron = !!process.versions.electron
let databasePath: string

if (isElectron) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { app } = require('electron')

    databasePath = path.join(app.getPath('userData'), dbName)
} else {
    databasePath = path.join('~/.tmp/', dbName)
}

const sqliteOptions: DataSourceOptions = {
    type: 'better-sqlite3',
    database: databasePath,
    driver: require('better-sqlite3'),
    entities: entities,
    migrations: frontEndMigrations,
    subscribers: [],
    logging: ['error', 'schema'],
    synchronize: false,
    migrationsRun: true,
    verbose: console.log,
}

export const FrontEndDataSource = new DataSource(sqliteOptions)
