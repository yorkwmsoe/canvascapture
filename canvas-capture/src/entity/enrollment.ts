/**
 * Defines types matching enrollment-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import type { Course } from './course'
import type { User } from './user'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import CanvasEntity from './canvas-entity'

@Entity()
export class Enrollment extends CanvasEntity {
    // The ID of the enrollment.
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // The unique id of the course.
    @ManyToOne('Course', (course: Course) => course.enrollments)
    @JoinColumn()
    course: Course

    // The SIS Course ID in which the enrollment is associated. Only displayed if
    // present. This field is only included if the user has permission to view SIS
    // information.
    @Column({ type: 'text' })
    sis_course_id: string

    // The Course Integration ID in which the enrollment is associated. This field
    // is only included if the user has permission to view SIS information.
    @Column({ type: 'text' })
    course_integration_id: string

    // The unique id of the user's section.
    @Column({ type: 'numeric' })
    course_section_id: number

    // The Section Integration ID in which the enrollment is associated. This field
    // is only included if the user has permission to view SIS information.
    @Column({ nullable: true, type: 'numeric' })
    section_integration_id?: string

    // The SIS Account ID in which the enrollment is associated. Only displayed if
    // present. This field is only included if the user has permission to view SIS
    // information.
    @Column({ nullable: true, type: 'text' })
    sis_account_id?: string

    // The SIS Section ID in which the enrollment is associated. Only displayed if
    // present. This field is only included if the user has permission to view SIS
    // information.
    @Column({ nullable: true, type: 'text' })
    sis_section_id?: string

    // The SIS User ID in which the enrollment is associated. Only displayed if
    // present. This field is only included if the user has permission to view SIS
    // information.
    @Column({ nullable: true, type: 'text' })
    sis_user_id?: string

    // The state of the user's enrollment in the course.
    @Column({ type: 'text' })
    enrollment_state: string

    // User can only access his or her own course section.
    @Column({ type: 'boolean' })
    limit_privileges_to_course_section: boolean

    // The unique identifier for the SIS import. This field is only included if the
    // user has permission to manage SIS information.
    @Column({ type: 'numeric' })
    sis_import_id: number

    // The unique id of the user's account.
    @Column({ type: 'numeric' })
    root_account_id: number

    // The enrollment type. One of 'StudentEnrollment', 'TeacherEnrollment',
    // 'TaEnrollment', 'DesignerEnrollment', 'ObserverEnrollment'.
    @Column({ type: 'text' })
    type: string

    // The unique id of the user.
    @Column({ type: 'numeric' })
    user_id: number

    // The unique id of the associated user. Will be null unless type is
    // ObserverEnrollment.
    @Column({ type: 'numeric' })
    associated_user_id: number | null

    // The enrollment role, for course-level permissions. This field will match
    // `type` if the enrollment role has not been customized.
    @Column({ type: 'text' })
    role: string | EnrollmentType

    // The id of the enrollment role.
    @Column({ type: 'numeric' })
    role_id: number

    // The created time of the enrollment, in ISO8601 format.
    @Column({ type: 'date' })
    created_at: Date

    // The updated time of the enrollment, in ISO8601 format.
    @Column({ type: 'date' })
    updated_at: Date

    // The start time of the enrollment, in ISO8601 format.
    @Column({ type: 'date' })
    start_at: Date

    // The end time of the enrollment, in ISO8601 format.
    @Column({ type: 'date' })
    end_at: Date

    // The last activity time of the user for the enrollment, in ISO8601 format.
    @Column({ type: 'date' })
    last_activity_at: Date

    // The last attended date of the user for the enrollment in a course, in ISO8601
    // format.
    @Column({ type: 'date' })
    last_attended_at: Date

    // The total activity time of the user for the enrollment, in seconds.
    @Column({ type: 'numeric' })
    total_activity_time: number

    // The URL to the Canvas web UI page for this course enrollment.
    @Column({ type: 'text' })
    html_url: string

    // The URL to the Canvas web UI page containing the grades associated with this
    // enrollment.
    @OneToOne(() => Grade)
    @JoinColumn()
    grades: Grade

    // A description of the user.
    @OneToOne('User')
    @JoinColumn()
    user: User

    // The user's override grade for the course.
    @Column({ type: 'text' })
    override_grade: string

    // The user's override score for the course.
    @Column({ type: 'text' })
    override_score: number

    // The user's current grade in the class including muted/unposted assignments.
    // Only included if user has permissions to view this grade, typically teachers,
    // TAs, and admins.
    @Column({ nullable: true, type: 'text' })
    unposted_current_grade?: string

    // The user's final grade for the class including muted/unposted assignments.
    // Only included if user has permissions to view this grade, typically teachers,
    // TAs, and admins..
    @Column({ nullable: true, type: 'text' })
    unposted_final_grade?: string

    // The user's current score in the class including muted/unposted assignments.
    // Only included if user has permissions to view this score, typically teachers,
    // TAs, and admins..
    @Column({ nullable: true, type: 'text' })
    unposted_current_score?: string

    // The user's final score for the class including muted/unposted assignments.
    // Only included if user has permissions to view this score, typically teachers,
    // TAs, and admins..
    @Column({ nullable: true, type: 'text' })
    unposted_final_score?: string

    // optional: Indicates whether the course the enrollment belongs to has grading
    // periods set up. (applies only to student enrollments, and only available in
    // course endpoints)
    @Column({ nullable: true, type: 'boolean' })
    has_grading_periods?: boolean

    // optional: Indicates whether the course the enrollment belongs to has the
    // Display Totals for 'All Grading Periods' feature enabled. (applies only to
    // student enrollments, and only available in course endpoints)
    @Column({ nullable: true, type: 'boolean' })
    totals_for_all_grading_periods_option?: boolean

    // optional: The name of the currently active grading period, if one exists. If
    // the course the enrollment belongs to does not have grading periods, or if no
    // currently active grading period exists, the value will be null. (applies only
    // to student enrollments, and only available in course endpoints)
    @Column({ nullable: true, type: 'text' })
    current_grading_period_title?: string

    // optional: The id of the currently active grading period, if one exists. If
    // the course the enrollment belongs to does not have grading periods, or if no
    // currently active grading period exists, the value will be null. (applies only
    // to student enrollments, and only available in course endpoints)
    @Column({ nullable: true, type: 'numeric' })
    current_grading_period_id?: number
    // The user's override grade for the current grading period.
    @Column({ type: 'text' })
    current_period_override_grade: string

    // The user's override score for the current grading period.
    @Column({ type: 'numeric' })
    current_period_override_score: number

    // optional: The student's score in the course for the current grading period,
    // including muted/unposted assignments. Only included if user has permission to
    // view this score, typically teachers, TAs, and admins. If the course the
    // enrollment belongs to does not have grading periods, or if no currently
    // active grading period exists, the value will be null. (applies only to
    // student enrollments, and only available in course endpoints)
    @Column({ nullable: true, type: 'numeric' })
    current_period_unposted_current_score?: number

    // optional: The student's score in the course for the current grading period,
    // including muted/unposted assignments and including ungraded assignments with
    // a score of 0. Only included if user has permission to view this score,
    // typically teachers, TAs, and admins. If the course the enrollment belongs to
    // does not have grading periods, or if no currently active grading period
    // exists, the value will be null. (applies only to student enrollments, and
    // only available in course endpoints)
    @Column({ nullable: true, type: 'numeric' })
    current_period_unposted_final_score?: number

    // optional: The letter grade equivalent of
    // current_period_unposted_current_score, if available. Only included if user
    // has permission to view this grade, typically teachers, TAs, and admins. If
    // the course the enrollment belongs to does not have grading periods, or if no
    // currently active grading period exists, the value will be null. (applies only
    // to student enrollments, and only available in course endpoints)
    @Column({ nullable: true, type: 'text' })
    current_period_unposted_current_grade?: string

    // optional: The letter grade equivalent of current_period_unposted_final_score,
    // if available. Only included if user has permission to view this grade,
    // typically teachers, TAs, and admins. If the course the enrollment belongs to
    // does not have grading periods, or if no currently active grading period
    // exists, the value will be null. (applies only to student enrollments, and
    // only available in course endpoints)
    @Column({ nullable: true, type: 'text' })
    current_period_unposted_final_grade?: string

    @UpdateDateColumn()
    date_last_received_from_canvas: Date
}

export type EnrollmentType =
    | 'StudentEnrollment'
    | 'TeacherEnrollment'
    | 'TaEnrollment'
    | 'DesignerEnrollment'
    | 'ObserverEnrollment'

@Entity()
export class Grade extends CanvasEntity {
    // The URL to the Canvas web UI page for the user's grades, if this is a student
    // enrollment.
    @Column({ type: 'text' })
    html_url: string

    // The user's current grade in the class. Only included if user has permissions
    // to view this grade.
    @Column({ type: 'text' })
    current_grade: string

    // The user's final grade for the class. Only included if user has permissions
    // to view this grade.
    @Column({ type: 'text' })
    final_grade: string

    // The user's current score in the class. Only included if user has permissions
    // to view this score.
    @Column({ type: 'text' })
    current_score: string

    // The user's final score for the class. Only included if user has permissions
    // to view this score.
    @Column({ type: 'text' })
    final_score: string

    // The total points the user has earned in the class. Only included if user has
    // permissions to view this score and 'current_points' is passed in the
    // request's 'include' parameter.
    @Column({ type: 'numeric' })
    current_points: number

    // The user's current grade in the class including muted/unposted assignments.
    // Only included if user has permissions to view this grade, typically teachers,
    // TAs, and admins.
    @Column({ nullable: true, type: 'text' })
    unposted_current_grade?: string

    // The user's final grade for the class including muted/unposted assignments.
    // Only included if user has permissions to view this grade, typically teachers,
    // TAs, and admins..
    @Column({ nullable: true, type: 'text' })
    unposted_final_grade?: string

    // The user's current score in the class including muted/unposted assignments.
    // Only included if user has permissions to view this score, typically teachers,
    // TAs, and admins..
    @Column({ nullable: true, type: 'text' })
    unposted_current_score?: string

    // The user's final score for the class including muted/unposted assignments.
    // Only included if user has permissions to view this score, typically teachers,
    // TAs, and admins..
    @Column({ nullable: true, type: 'text' })
    unposted_final_score?: string

    // The total points the user has earned in the class, including muted/unposted
    // assignments. Only included if user has permissions to view this score
    // (typically teachers, TAs, and admins) and 'current_points' is passed in the
    // request's 'include' parameter.
    @Column({ type: 'numeric' })
    unposted_current_points: number

    @UpdateDateColumn()
    date_last_received_from_canvas: Date
}
