/**
 * Defines types matching course-related portions
 * of the Canvas API
 */
import { Enrollment } from './enrollment'
import { GradingPeriod } from './grading-period'
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm'

@Entity()
export class Course {
    // the unique identifier for the course
    @PrimaryColumn()
    id: number

    // the SIS identifier for the course, if defined. This field is only included if
    // the user has permission to view SIS information.
    @Column()
    sis_course_id?: number

    // the UUID of the course
    @Column()
    uuid: string

    // the integration identifier for the course, if defined. This field is only
    // included if the user has permission to view SIS information.
    @Column()
    integration_id?: string

    // the unique identifier for the SIS import. This field is only included if the
    // user has permission to manage SIS information.
    @Column()
    sis_import_id?: number

    // the full name of the course. If the requesting user has set a nickname for
    // the course, the nickname will be shown here.
    @Column()
    name: string

    // the course code
    @Column()
    course_code: string

    // the actual course name. This field is returned only if the requesting user
    // has set a nickname for the course.
    @Column()
    original_name?: string

    // the current state of the course one of 'unpublished', 'available',
    // 'completed', or 'deleted'
    @Column()
    workflow_state: WorkflowState

    // the account associated with the course
    @Column()
    account_id: number

    // the root account associated with the course
    @Column()
    root_account_id: number

    // the enrollment term associated with the course
    @Column()
    enrollment_term_id: number

    // A list of grading periods associated with the course
    @OneToMany(() => GradingPeriod, (gradingPeriod) => gradingPeriod.course)
    @JoinColumn()
    grading_periods?: GradingPeriod[]

    // the grading standard associated with the course
    @Column()
    grading_standard_id?: number

    // the grade_passback_setting set on the course
    @Column()
    grade_passback_setting?: string

    // the date the course was created.
    @Column()
    created_at: Date

    // the start date for the course, if applicable
    @Column()
    start_at?: Date | null

    // the end date for the course, if applicable
    @Column()
    end_at?: Date | null

    // the course-set locale, if applicable
    @Column()
    locale?: string

    // A list of enrollments linking the current user to the course. for student
    // enrollments, grading information may be included if include[]=total_scores
    @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
    @JoinColumn()
    enrollments: Enrollment[]

    // optional: the total number of active and invited students in the course
    @Column()
    total_students?: number

    // course calendar
    @Column(() => CourseCalendar)
    calendar: CourseCalendar

    // the type of page that users will see when they first visit the course -
    // 'feed': Recent Activity Dashboard - 'wiki': Wiki Front Page - 'modules':
    // Course Modules/Sections Page - 'assignments': Course Assignments List -
    // 'syllabus': Course Syllabus Page other types may be added in the future
    @Column()
    default_view: string

    // optional: user-generated HTML for the course syllabus
    @Column()
    syllabus_body?: string

    // optional: the number of submissions needing grading returned only if the
    // current user has grading rights and include[]=needs_grading_count
    @Column()
    needs_grading_count?: number

    // optional: the enrollment term object for the course returned only if
    // include[]=term
    @OneToMany(() => Term, (term) => term.courses)
    @JoinColumn()
    term?: Term

    // optional: information on progress through the course returned only if
    // include[]=course_progress
    @OneToOne(() => CourseProgress)
    @JoinColumn()
    course_progress?: CourseProgress

    // weight final grade based on assignment group percentages
    @Column()
    apply_assignment_group_weights: boolean

    // optional: the permissions the user has for the course. returned only for a
    // single course and include[]=permissions
    @Column()
    permissions?: Record<string, boolean>

    @Column()
    is_public?: boolean

    @Column()
    is_public_to_auth_users: boolean

    @Column()
    public_syllabus: boolean

    @Column()
    public_syllabus_to_auth: boolean

    // optional: the public description of the course
    @Column()
    public_description?: string

    @Column()
    storage_quota_mb: number

    @Column()
    storage_quota_used_mb?: number

    @Column()
    hide_final_grades: boolean

    @Column()
    license?: string

    @Column()
    allow_student_assignment_edits?: boolean

    @Column()
    allow_wiki_comments?: boolean

    @Column()
    allow_student_forum_attachments?: boolean

    @Column()
    open_enrollment?: boolean

    @Column()
    self_enrollment?: boolean

    @Column()
    restrict_enrollments_to_course_dates: boolean

    @Column()
    course_format?: string

    // optional: this will be true if this user is currently prevented from viewing
    // the course because of date restriction settings
    @Column()
    access_restricted_by_date?: boolean

    // The course's IANA time zone name.
    @Column()
    time_zone?: string

    // optional: whether the course is set as a Blueprint Course (blueprint fields
    // require the Blueprint Courses feature)
    @Column()
    blueprint?: boolean

    // optional: Set of restrictions applied to all locked course objects
    @Column()
    blueprint_restrictions?: {
        content: boolean
        points: boolean
        due_dates: boolean
        availability_dates: boolean
    }

    // optional: Sets of restrictions differentiated by object type applied to
    // locked course objects
    @Column()
    blueprint_restrictions_by_object_type?: Record<
        string,
        Record<string, boolean>
    >

    // optional: whether the course is set as a template (requires the Course
    // Templates feature)
    @Column()
    template?: boolean
}

@Entity()
export class CourseProgress {
    // total number of requirements from all modules
    @Column()
    requirement_count: number

    // total number of requirements the user has completed from all modules
    @Column()
    requirement_completed_count: number

    // url to next module item that has an unmet requirement. null if the user has
    // completed the course or the current module does not require sequential
    // progress
    @Column()
    next_requirement_url: string | null

    // date the course was completed. null if the course has not been completed by
    // this user
    @Column()
    completed_at: Date | null
}

@Entity()
export class Term {
    @PrimaryColumn()
    id: number

    @Column()
    name: string

    @Column()
    start_at: Date

    @Column()
    end_at: Date | null

    @OneToMany(() => Course, (course) => course.term)
    @JoinColumn()
    courses: Course[]
}

export class CourseCalendar {
    // The URL of the calendar in ICS format
    @Column()
    ics: string
}

export type WorkflowState =
    | 'unpublished'
    | 'available'
    | 'completed'
    | 'deleted'
