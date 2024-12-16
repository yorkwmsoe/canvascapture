export type SubmissionEvent = {
    // The Canvas id of the assignment being submitted.
    assignment_id: number
    // This is the submission attempt number.
    attempt: number
    // The content of the submission, if it was submitted directly in a text field. NOTE: This field will be truncated to only include the first 8192 characters.
    body: string
    // The grade for the submission, translated into the assignment grading scheme (so a letter grade, for example)
    grade: string
    // The timestamp when the assignment was graded, if it was graded.
    graded_at: Date
    // The submissions’s group ID if the assignment is a group assignment.
    group_id: number
    // Whether the submission was made after the applicable due date.
    late: boolean
    // The LTI assignment guid of the submission's assignment
    lti_assignment_id: string
    // The Lti id of the user associated with the submission.
    lti_user_id: string
    // Whether the submission is missing, which generally means past-due and not yet submitted.
    missing: boolean
    // The raw score
    score: number
    // The Canvas id of the new submission.
    submission_id: number
    // The types of submission (basic_lti_launch, discussion_topic, media_recording, online_quiz, online_text_entry, online_upload, online_url)
    submission_type: string
    // The timestamp when the assignment was submitted.
    submitted_at: Date
    // The time at which this assignment was last modified in any way
    updated_at: Date
    // The URL of the submission (for 'online_url' submissions)
    url: string
    // The Canvas id of the user associated with the submission.
    user_id: number
    // The state of the submission: normally 'submitted' or 'pending_review'.
    workflow_state: string
}

export type SubmissionCommentCreatedEvent = {
    // Array of Canvas ids (as strings) of attachments for this comment.
    attachment_ids: number[]
    // The text of the comment. NOTE: This field will be truncated to only include the first 8192 characters.
    body: string
    // The timestamp when the comment was created.
    created_at: Date
    // The Canvas id of the new comment.
    submission_comment_id: number
    // The Canvas id of the new submission.
    submission_id: number
    // The Canvas id of the user who authored the comment.
    user_id: number
}
