import { Course, CourseProgress, User } from '@canvas-capture/lib'

export type CourseEvent = {
    // The Account id of the updated course.
    account_id: number
    // The Canvas id of the updated course.
    course_id: number
    // The time at which this course was created.
    created_at: Date
    // The name the updated course.
    name: string
    // The time at which this course was last modified in any way.
    updated_at: Date
    // The unique id of the course.
    uuid: string
    // The state of the course (available, claimed, completed, created, deleted).
    workflow_state: string
}

export type CourseProgressEvent = {
    course: Course
    progress: CourseProgress
    user: User
}

export type CourseSectionEvent = {
    // True if this section is open for enrollment. False or null otherwise.
    accepting_enrollments: boolean
    // Deprecated, will always be null.
    can_manually_enroll: null
    // The Canvas id of the course that this section belongs to.
    course_id: number
    // The local Canvas id of the created course section.
    course_section_id: number
    // True if this is the default section for the course. False or null otherwise.
    default_section: boolean
    // Section end date in ISO8601 format.
    end_at: Date
    // The Canvas id of the enrollment term.
    enrollment_term_id: number
    // The integration id of the section.
    integration_id: number
    // The name of this section.
    name: string
    // The unique identifier of the original course of a cross-listed section.
    nonxlist_course_id: number
    // True when 'Users can only participate in the course between these dates' is checked.
    restrict_enrollments_to_section_dates: boolean
    // Canvas id of the root account that this section is in.
    root_account_id: number
    // The SIS Batch id of the section.
    sis_batch_id: number
    // Correlated id for the record for this course in the SIS system (assuming SIS integration is configured).
    sis_source_id: string
    // Section start date in ISO8601 format.
    start_at: Date
    // Array of strings of field names with the SIS stickiness field set, indicating they will not be replaced by SIS imports.
    stuck_sis_fields: string[]
    // The workflow state of the section.
    workflow_state: string
}
