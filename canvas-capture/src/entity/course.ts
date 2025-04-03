/**
 * Defines types matching course-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import type { AssignmentGroup } from './assignment'
import type { Enrollment } from './enrollment'
import type { GradingPeriod } from './grading-period'
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm'
import { Submission } from './submission'
import CanvasEntity from './canvas-entity'

@Entity()
export class Course extends CanvasEntity {
    // the unique identifier for the course
    @PrimaryColumn({ type: 'text' })
    id: number

    // the SIS identifier for the course, if defined. This field is only included if
    // the user has permission to view SIS information.
    @Column({ nullable: true, type: 'numeric' })
    sis_course_id?: number

    // the UUID of the course
    @Column({ type: 'text' })
    uuid: string

    // the integration identifier for the course, if defined. This field is only
    // included if the user has permission to view SIS information.
    @Column({ nullable: true, type: 'text' })
    integration_id?: string

    // the unique identifier for the SIS import. This field is only included if the
    // user has permission to manage SIS information.
    @Column({ nullable: true, type: 'text' })
    sis_import_id?: number

    // the full name of the course. If the requesting user has set a nickname for
    // the course, the nickname will be shown here.
    @Column({ type: 'text' })
    name: string

    // the course code
    @Column({ type: 'text' })
    course_code: string

    // the actual course name. This field is returned only if the requesting user
    // has set a nickname for the course.
    @Column({ nullable: true, type: 'text' })
    original_name?: string

    // the current state of the course one of 'unpublished', 'available',
    // 'completed', or 'deleted'
    @Column({ type: 'text' })
    workflow_state: WorkflowState

    // the account associated with the course
    @Column({ type: 'numeric' })
    account_id: number

    // the root account associated with the course
    @Column({ type: 'numeric' })
    root_account_id: number

    // the enrollment term associated with the course
    @Column({ type: 'numeric' })
    enrollment_term_id: number

    // A list of grading periods associated with the course
    @OneToMany('GradingPeriod', (gradingPeriod: GradingPeriod) => gradingPeriod.course)
    @JoinColumn()
    grading_periods?: GradingPeriod[]

    // the grading standard associated with the course
    @Column({ nullable: true, type: 'numeric' })
    grading_standard_id?: number

    // the grade_passback_setting set on the course
    @Column({ nullable: true, type: 'text' })
    grade_passback_setting?: string

    // the date the course was created.
    @Column({ type: 'date' })
    created_at: Date

    // the start date for the course, if applicable
    @Column({ nullable: true, type: 'date' })
    start_at?: Date | null

    // the end date for the course, if applicable
    @Column({ nullable: true, type: 'date' })
    end_at?: Date | null

    // the course-set locale, if applicable
    @Column({ nullable: true, type: 'text' })
    locale?: string

    // A list of enrollments linking the current user to the course. for student
    // enrollments, grading information may be included if include[]=total_scores
    @OneToMany('Enrollment', (enrollment: Enrollment) => enrollment.course)
    @JoinColumn()
    enrollments: Enrollment[]

    // optional: the total number of active and invited students in the course
    @Column({ nullable: true, type: 'numeric' })
    total_students?: number

    // course calendar
    @Column(() => CourseCalendar)
    calendar: CourseCalendar

    // the type of page that users will see when they first visit the course -
    // 'feed': Recent Activity Dashboard - 'wiki': Wiki Front Page - 'modules':
    // Course Modules/Sections Page - 'assignments': Course Assignments List -
    // 'syllabus': Course Syllabus Page other types may be added in the future
    @Column({ type: 'text' })
    default_view: string

    // optional: user-generated HTML for the course syllabus
    @Column({ nullable: true, type: 'text' })
    syllabus_body?: string

    // optional: the number of submissions needing grading returned only if the
    // current user has grading rights and include[]=needs_grading_count
    @Column({ nullable: true, type: 'numeric' })
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
    @Column({ type: 'boolean' })
    apply_assignment_group_weights: boolean

    // optional: the permissions the user has for the course. returned only for a
    // single course and include[]=permissions
    @Column({nullable: true, type: 'simple-json'})
    permissions?: Record<string, boolean>

    @Column({ nullable: true, type: 'boolean' })
    is_public?: boolean

    @Column({ type: 'boolean' })
    is_public_to_auth_users: boolean

    @Column({ type: 'boolean' })
    public_syllabus: boolean

    @Column({ type: 'boolean' })
    public_syllabus_to_auth: boolean

    // optional: the public description of the course
    @Column({ nullable: true, type: 'text' })
    public_description?: string

    @Column({ type: 'numeric' })
    storage_quota_mb: number

    @Column({ nullable: true, type: 'numeric' })
    storage_quota_used_mb?: number

    @Column({ type: 'boolean' })
    hide_final_grades: boolean

    @Column({ nullable: true, type: 'text' })
    license?: string

    @Column({ nullable: true, type: 'boolean' })
    allow_student_assignment_edits?: boolean

    @Column({ nullable: true, type: 'boolean' })
    allow_wiki_comments?: boolean

    @Column({ nullable: true, type: 'boolean' })
    allow_student_forum_attachments?: boolean

    @Column({ nullable: true, type: 'boolean' })
    open_enrollment?: boolean

    @Column({ nullable: true, type: 'boolean' })
    self_enrollment?: boolean

    @Column({ type: 'boolean' })
    restrict_enrollments_to_course_dates: boolean

    @Column({ nullable: true, type: 'text' })
    course_format?: string

    // optional: this will be true if this user is currently prevented from viewing
    // the course because of date restriction settings
    @Column({ nullable: true, type: 'boolean' })
    access_restricted_by_date?: boolean

    // The course's IANA time zone name.
    @Column({ nullable: true, type: 'text' })
    time_zone?: string

    // optional: whether the course is set as a Blueprint Course (blueprint fields
    // require the Blueprint Courses feature)
    @Column({ nullable: true, type: 'boolean' })
    blueprint?: boolean

    @Column({nullable: true, type: 'numeric'})
    blueprint_restrictionsId: number

    // optional: Set of restrictions applied to all locked course objects
    @OneToOne(
        'BlueprintRestrictions',
        (blueprintRestrictions: BlueprintRestrictions) => blueprintRestrictions.course
    )
    @JoinColumn()
    blueprint_restrictions?: BlueprintRestrictions

    // optional: Sets of restrictions differentiated by object type applied to
    // locked course objects
    @Column({nullable: true, type: 'json'})
    blueprint_restrictions_by_object_type?: Record<
        string,
        Record<string, boolean>
    >

    // optional: whether the course is set as a template (requires the Course
    // Templates feature)
    @Column({ nullable: true, type: 'boolean' })
    template?: boolean

    @OneToMany(() => Submission, (submission) => submission.course)
    @JoinColumn()
    submissions: Submission[]

    @Column({nullable: true, type: 'simple-array'})
    assignment_groupsIds: number[]

    @OneToMany(
        'AssignmentGroup',
        (assignmentGroup: AssignmentGroup) => assignmentGroup.course
    )
    @JoinColumn()
    assignment_groups?: AssignmentGroup[]

    constructor(data: Partial<Course>) {
        super()
        Object.assign(this, data)
    }
}

@Entity()
export class CourseProgress extends CanvasEntity {
    // total number of requirements from all modules
    @Column({ type: 'numeric' })
    requirement_count: number

    // total number of requirements the user has completed from all modules
    @Column({ type: 'numeric' })
    requirement_completed_count: number

    // url to next module item that has an unmet requirement. null if the user has
    // completed the course or the current module does not require sequential
    // progress
    @Column({ nullable: true, type: 'text' })
    next_requirement_url: string | null

    // date the course was completed. null if the course has not been completed by
    // this user
    @Column({ nullable: true, type: 'date' })
    completed_at: Date | null
}

@Entity()
export class Term extends CanvasEntity {
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @Column({ type: 'date' })
    name: string

    @Column({ type: 'date' })
    start_at: Date

    @Column({ nullable: true, type: 'date' })
    end_at: Date | null

    @OneToMany(() => Course, (course) => course.term)
    @JoinColumn()
    courses: Course[]
}

export class CourseCalendar {
    // The URL of the calendar in ICS format
    @Column({ type: 'text' })
    ics: string
}

@Entity()
export class BlueprintRestrictions {
    @Column({ type: 'boolean' })
    content: boolean

    @Column({ type: 'boolean' })
    points: boolean

    @Column({ type: 'boolean' })
    due_dates: boolean

    @Column({ type: 'boolean' })
    availability_dates: boolean

    @OneToOne(() => Course, (course) => course.blueprint_restrictions)
    @JoinColumn()
    course: Course
}

export type WorkflowState =
    | 'unpublished'
    | 'available'
    | 'completed'
    | 'deleted'
