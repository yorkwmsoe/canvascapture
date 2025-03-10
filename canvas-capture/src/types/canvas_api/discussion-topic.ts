/**
 * Defines types matching discussion topic-related
 * portions of the Canvas API
 */
import { File } from './file'
import { ReadState } from './read-state'

export type DiscussionTopic = {
    // The ID of this topic.
    id: number
    // The topic title.
    title: string
    // The HTML content of the message body.
    message: string
    // The URL to the discussion topic in canvas-api.
    html_url: string
    // The datetime the topic was posted. If it is null it hasn't been posted yet.
    // (see delayed_post_at)
    posted_at: Date | null
    // The datetime for when the last reply was in the topic.
    last_reply_at: Date
    // If true then a user may not respond to other replies until that user has made
    // an initial reply. Defaults to false.
    require_initial_post: boolean
    // Whether or not posts in this topic are visible to the user.
    user_can_see_posts: boolean
    // The count of entries in the topic.
    discussion_subentry_count: number
    // The read_state of the topic for the current user, 'read' or 'unread'.
    read_state: ReadState
    // The count of unread entries of this topic for the current user.
    unread_count: number
    // Whether or not the current user is subscribed to this topic.
    subscribed: boolean
    // (Optional) Why the user cannot subscribe to this topic. Only one reason will
    // be returned even if multiple apply. Can be one of: 'initial_post_required':
    // The user must post a reply first; 'not_in_group_set': The user is not in the
    // group set for this graded group discussion; 'not_in_group': The user is not
    // in this topic's group; 'topic_is_announcement': This topic is an announcement
    subscription_hold?: SubscriptionHold
    // The unique identifier of the assignment if the topic is for grading,
    // otherwise null.
    assignment_id: number | null
    // The datetime to publish the topic (if not right away).
    delayed_post_at: Date
    // Whether this discussion topic is published (true) or draft state (false)
    published: boolean
    // The datetime to lock the topic (if ever).
    lock_at: Date
    // Whether or not the discussion is 'closed for comments'.
    locked: boolean
    // Whether or not the discussion has been 'pinned' by an instructor
    pinned: boolean
    // Whether or not this is locked for the user.
    locked_for_user: boolean
    // (Optional) Information for the user about the lock. Present when
    // locked_for_user is true.
    lock_info?: boolean
    // (Optional) An explanation of why this is locked for the user. Present when
    // locked_for_user is true.
    lock_explanation?: string
    // The username of the topic creator.
    user_name: string
    // DEPRECATED An array of topic_ids for the group discussions the user is a part
    // of.
    topic_children: number[]
    // An array of group discussions the user is a part of. Fields include: id,
    // group_id
    group_topic_children: GroupTopic[]
    // If the topic is for grading and a group assignment this will point to the
    // original topic in the course.
    root_topic_id: number | null
    // If the topic is a podcast topic this is the feed url for the current user.
    podcast_url: string
    // The type of discussion. Values are 'side_comment', for discussions that only
    // allow one level of nested comments, and 'threaded' for fully threaded
    // discussions.
    discussion_type: DiscussionType
    // The unique identifier of the group category if the topic is a group
    // discussion, otherwise null.
    group_category_id: number | null
    // Array of file attachments.
    attachments: File[]
    // The current user's permissions on this topic.
    permissions: Record<string, boolean>
    // Whether or not users can rate entries in this topic.
    allow_rating: boolean
    // Whether or not grade permissions are required to rate entries.
    only_graders_can_rate: boolean
    // Whether or not entries should be sorted by rating.
    sort_by_rating: boolean
}

export type SubscriptionHold =
    | 'not_in_group_set'
    | 'not_in_group'
    | 'topic_is_announcement'
    | 'initial_post_required'

export type DiscussionType = 'side_comment' | 'threaded'

export type GroupTopic = { id: number; group_id: number }
