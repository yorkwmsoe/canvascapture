export type AssignmentEvent = {
    // The Canvas id of the assignment group.
    assignment_group_id: number
    // The Canvas id of the new assignment.
    assignment_id: number
    // The type of context the assignment is used in.
    context_id: number
    // The type of context the assignment is used in.
    context_type: string
    // The uuid of the context associated with the assignment.
    context_uuid: string
    // Whether or not the assignment was created in the context of a blueprint sync.
    created_on_blueprint_sync: boolean
    // The description of the assignment. NOTE: This field will be truncated to only include the first 8192 characters.
    description: string
    // The due date for the assignment.
    due_at: Date
    // The lock date (assignment is locked after this date).
    lock_at: Date
    // The LTI assignment guid for the assignment.
    lti_assignment_id: string
    // The unique identifier of the assignment resource in the LTI specification. Unique per Canvas shard.
    lti_resource_link_id: string
    // The LTI resource link ID of the original assignment. Present if new assigment is a copy.
    lti_resource_link_id_duplicated_from: string
    // The Canvas id of the original assignment. Present if new assigment is a copy.
    assignment_id_duplicated_from: number
    // The Canvas domain of the root account of the original assignment. Present if new assigment is a copy.
    domain_duplicated_from: string
    // The Canvas domain of the root account of the assignment.
    domain: string
    // The maximum points possible for the assignment.
    points_possible: number
    // Valid methods for submitting the assignment may include multiple comma separated options of: discussion_topic, external_tool, media_recording, none, not_graded, online_quiz, online_text_entry, online_upload, online_url, on_paper.
    submission_types: string
    // The title of the assignment. NOTE: This field will be truncated to only include the first 8192 characters.
    title: string
    // The unlock date (assignment is unlocked after this date).
    unlock_at: Date
    // The time at which this assignment was last modified in any way.
    updated_at: Date
    // Workflow state of the assignment. E.g duplicating, fail_to_import, failed_to_duplicate, published, unpublished. See API documentation for more details.
    workflow_state: string
}

export type AssignmentGroupEvent = {
    // The Canvas id of the new assignment group.
    assignment_group_id: number
    // The Canvas context id of the new assignment group.
    context_id: number
    // The context type of the new assignment group.
    context_type: string
    // The group weight of the new assignment group.
    group_weight: number
    // Integration data for the new assignment group.
    integration_data: any
    // The name of the new assignment group.
    name: string
    // The position of the new assignment group on the assignments page.
    position: number
    // Rules for the new assignment group.
    rules: string
    // The SIS source id of the new assignment group.
    sis_source_id: string
    // Workflow state of the assignment group.
    workflow_state: string
}

export type AssignmentOverrideEvent = {
    // The Canvas id of the assignment override.
    assignment_override_id: number
    // The Canvas id of the assignment linked to the override.
    assignment_id: number
    // The override due_at timestamp, or nil if not overridden.
    due_at: Date
    // The overridden all_day flag, or nil if not overridden.
    all_day: boolean
    // The overridden all_day_date, or nil if not overridden.
    all_day_date: Date
    // The overridden unlock_at timestamp, or nil if not overridden.
    unlock_at: Date
    // The overridden lock_at timestamp, or nil if not overridden.
    lock_at: Date
    // Override type - ADHOC (list of Students), CourseSection, or Group.
    type: string
    // (if type='CourseSection') Canvas section id that this override applies to.
    course_section_id: number
    // (if type='Group') Canvas group id that this override applies to.
    group_id: number
    // Workflow state of the override. (active, deleted)
    workflow_state: string
}
