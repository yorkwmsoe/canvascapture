export type EnrollmentEvent = {
    // The id of the user observed by an observer's enrollment. Omitted from non-observer enrollments.
    associated_user_id: number
    // The Canvas id of the course for this enrollment.
    course_id: number
    // The id of the section of the course for the new enrollment.
    course_section_id: number
    // The time at which this enrollment was created.
    created_at: Date
    // The Canvas id of the new enrollment.
    enrollment_id: number
    // Whether students can only talk to students within their course section.
    limit_privileges_to_course_section: false
    // The type of enrollment; e.g. StudentEnrollment, TeacherEnrollment, ObserverEnrollment, etc.
    type: string
    // The time at which this enrollment was last modified in any way.
    updated_at: Date
    // The Canvas id of the user for this enrollment.
    user_id: number
    // The user's name.
    user_name: string
    // The state of the enrollment (active, completed, creation_pending, deleted, inactive, invited)
    workflow_state: string
}

export type EnrollmentStateEvent = {
    // If this enrollment_state access is upto date.
    access_is_current: boolean
    // The Canvas id of the new enrollment.
    enrollment_id: number
    // True if this enrollment_state is restricted.
    restricted_access: boolean
    // The state of the enrollment.
    state: string
    // If this enrollment_state is uptodate
    state_is_current: boolean
    // The time when this enrollment state starts.
    state_started_at: Date
    // The time at which this enrollment is no longer valid.
    state_valid_until: Date
}
