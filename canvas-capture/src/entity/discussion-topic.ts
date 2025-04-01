/**
 * Defines types matching discussion topic-related
 * portions of the Canvas API
 */
import { File } from './file'
import { ReadState } from './read-state'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm'

@Entity()
export class DiscussionTopic {
    // The ID of this topic.
    @PrimaryColumn()
    id: number

    // The topic title.
    @Column()
    title: string

    // The HTML content of the message body.
    @Column()
    message: string

    // The URL to the discussion topic in canvas-api.
    @Column()
    html_url: string

    // The datetime the topic was posted. If it is null it hasn't been posted yet.
    // (see delayed_post_at)
    @Column()
    posted_at: Date | null

    // The datetime for when the last reply was in the topic.
    @Column()
    last_reply_at: Date

    // If true then a user may not respond to other replies until that user has made
    // an initial reply. Defaults to false.
    @Column()
    require_initial_post: boolean

    // Whether or not posts in this topic are visible to the user.
    @Column()
    user_can_see_posts: boolean

    // The count of entries in the topic.
    @Column()
    discussion_subentry_count: number

    // The read_state of the topic for the current user, 'read' or 'unread'.
    @Column()
    read_state: ReadState

    // The count of unread entries of this topic for the current user.
    @Column()
    unread_count: number

    // Whether or not the current user is subscribed to this topic.
    @Column()
    subscribed: boolean

    // (Optional) Why the user cannot subscribe to this topic. Only one reason will
    // be returned even if multiple apply. Can be one of: 'initial_post_required':
    // The user must post a reply first; 'not_in_group_set': The user is not in the
    // group set for this graded group discussion; 'not_in_group': The user is not
    // in this topic's group; 'topic_is_announcement': This topic is an announcement
    @Column()
    subscription_hold?: SubscriptionHold

    // The unique identifier of the assignment if the topic is for grading,
    // otherwise null.
    @Column()
    assignment_id: number | null

    // The datetime to publish the topic (if not right away).
    @Column()
    delayed_post_at: Date

    // Whether this discussion topic is published (true) or draft state (false)
    @Column()
    published: boolean

    // The datetime to lock the topic (if ever).
    @Column()
    lock_at: Date

    // Whether or not the discussion is 'closed for comments'.
    @Column()
    locked: boolean

    // Whether or not the discussion has been 'pinned' by an instructor
    @Column()
    pinned: boolean

    // Whether or not this is locked for the user.
    @Column()
    locked_for_user: boolean

    // (Optional) Information for the user about the lock. Present when
    // locked_for_user is true.
    @Column()
    lock_info?: boolean

    // (Optional) An explanation of why this is locked for the user. Present when
    // locked_for_user is true.
    @Column()
    lock_explanation?: string

    // The username of the topic creator.
    @Column()
    user_name: string

    // DEPRECATED An array of topic_ids for the group discussions the user is a part
    // of.
    @Column()
    topic_children: number[]

    // An array of group discussions the user is a part of. Fields include: id,
    // group_id
    @OneToMany(() => GroupTopic, (groupTopic) => groupTopic.discussion_topic)
    @JoinColumn()
    group_topic_children: GroupTopic[]

    // If the topic is for grading and a group assignment this will point to the
    // original topic in the course.
    @Column()
    root_topic_id: number | null

    // If the topic is a podcast topic this is the feed url for the current user.
    @Column()
    podcast_url: string

    // The type of discussion. Values are 'side_comment', for discussions that only
    // allow one level of nested comments, and 'threaded' for fully threaded
    // discussions.
    @Column()
    discussion_type: DiscussionType

    // The unique identifier of the group category if the topic is a group
    // discussion, otherwise null.
    @Column()
    group_category_id: number | null

    // Array of file attachments.
    @OneToMany(() => File, (file) => file.discussion_topic)
    @Column()
    attachments: File[]

    // The current user's permissions on this topic.
    @Column()
    permissions: Record<string, boolean>

    // Whether or not users can rate entries in this topic.
    @Column()
    allow_rating: boolean

    // Whether or not grade permissions are required to rate entries.
    @Column()
    only_graders_can_rate: boolean

    // Whether or not entries should be sorted by rating.
    @Column()
    sort_by_rating: boolean
}

export type SubscriptionHold =
    | 'not_in_group_set'
    | 'not_in_group'
    | 'topic_is_announcement'
    | 'initial_post_required'

export type DiscussionType = 'side_comment' | 'threaded'

@Entity()
export class GroupTopic {
    @PrimaryColumn()
    id: number

    @ManyToOne(
        () => DiscussionTopic,
        (discussionTopic) => discussionTopic.group_topic_children
    )
    @JoinColumn()
    discussion_topic: DiscussionTopic

    @Column()
    group_id: number
}
