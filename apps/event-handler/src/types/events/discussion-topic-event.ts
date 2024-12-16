export type DiscussionEntryCreatedEvent = {
    // The time at which this entry was created.
    created_at: Date
    // The Canvas id of the newly added entry.
    discussion_entry_id: number
    // The Canvas id of the topic the entry was added to.
    discussion_topic_id: number
    // If this was a reply, the Canvas id of the parent entry.
    parent_discussion_entry_id: number
    // The text of the post. NOTE: This field will be truncated to only include the first 8192 characters.
    text: string
    // The Canvas id of the user being that created the entry.
    user_id: number
}

export type DiscussionEntrySubmittedEvent = {
    // The Canvas id of the assignment if the discussion topic is graded.
    assignment_id: number
    // The time at which this entry was created.
    created_at: Date
    // The Canvas id of the newly added entry.
    discussion_entry_id: number
    // The Canvas id of the topic the entry was added to.
    discussion_topic_id: number
    // If this was a reply, the Canvas id of the parent entry.
    parent_discussion_entry_id: number
    // The Canvas id of the submission if the discussion topic is graded.
    submission_id: number
    // The text of the post. NOTE: This field will be truncated to only include the first 8192 characters.
    text: string
    // The Canvas id of the user being that created the entry.
    user_id: number
}

export type DiscussionTopicEvent = {
    // The Canvas id of the topic's associated assignment
    assignment_id: number
    // Body of the topic. NOTE: This field will be truncated to only include the first 8192 characters.
    body: string
    // The Canvas id of the topic's context.
    context_id: number
    // The type of the topic's context (usually Course or Group)
    context_type: string
    // The Canvas id of the new discussion topic.
    discussion_topic_id: number
    // true if this topic was posted as an announcement, false otherwise.
    is_announcement: boolean
    // The lock date (discussion is locked after this date), or null.
    lock_at: Date
    // Title of the topic. NOTE: This field will be truncated to only include the first 8192 characters.
    title: string
    // The time at which this topic was last modified in any way
    updated_at: Date
    // The state of the discussion topic (active, deleted, post_delayed, unpublished).
    workflow_state: string
}
