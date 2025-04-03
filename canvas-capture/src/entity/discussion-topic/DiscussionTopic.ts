/**
 * Defines types matching discussion topic-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Assignment, File, GroupTopic, ReadState } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class DiscussionTopic extends CanvasEntity {
    // The ID of this topic.
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // The topic title.
    @Column({ type: 'text' })
    title: string

    // The HTML content of the message body.
    @Column({ type: 'text' })
    message: string

    // The URL to the discussion topic in canvas-api.
    @Column({ type: 'text' })
    html_url: string

    // The datetime the topic was posted. If it is null it hasn't been posted yet.
    // (see delayed_post_at)
    @Column({ nullable: true, type: 'date' })
    posted_at: Date | null

    // The datetime for when the last reply was in the topic.
    @Column({ type: 'date' })
    last_reply_at: Date

    // If true then a user may not respond to other replies until that user has made
    // an initial reply. Defaults to false.
    @Column({ type: 'boolean' })
    require_initial_post: boolean

    // Whether or not posts in this topic are visible to the user.
    @Column({ type: 'boolean' })
    user_can_see_posts: boolean

    // The count of entries in the topic.
    @Column({ type: 'numeric' })
    discussion_subentry_count: number

    // The read_state of the topic for the current user, 'read' or 'unread'.
    @Column({ type: 'text' })
    read_state: ReadState

    // The count of unread entries of this topic for the current user.
    @Column({ type: 'numeric' })
    unread_count: number

    // Whether or not the current user is subscribed to this topic.
    @Column({ type: 'boolean' })
    subscribed: boolean

    // (Optional) Why the user cannot subscribe to this topic. Only one reason will
    // be returned even if multiple apply. Can be one of: 'initial_post_required':
    // The user must post a reply first; 'not_in_group_set': The user is not in the
    // group set for this graded group discussion; 'not_in_group': The user is not
    // in this topic's group; 'topic_is_announcement': This topic is an announcement
    @Column({ nullable: true, type: 'text' })
    subscription_hold?: SubscriptionHold

    // The unique identifier of the assignment if the topic is for grading,
    // otherwise null.
    @Column({ nullable: true, type: 'numeric' })
    assignment_id: number | null

    @OneToOne(
        'Assignment',
        (assignment: Assignment) => assignment.discussion_topic
    )
    @JoinColumn()
    assignment: Assignment

    // The datetime to publish the topic (if not right away).
    @Column({ type: 'date' })
    delayed_post_at: Date

    // Whether this discussion topic is published (true) or draft state (false)
    @Column({ type: 'boolean' })
    published: boolean

    // The datetime to lock the topic (if ever).
    @Column({ type: 'date' })
    lock_at: Date

    // Whether or not the discussion is 'closed for comments'.
    @Column({ type: 'boolean' })
    locked: boolean

    // Whether or not the discussion has been 'pinned' by an instructor
    @Column({ type: 'boolean' })
    pinned: boolean

    // Whether or not this is locked for the user.
    @Column({ type: 'boolean' })
    locked_for_user: boolean

    // (Optional) Information for the user about the lock. Present when
    // locked_for_user is true.
    @Column({ nullable: true, type: 'boolean' })
    lock_info?: boolean

    // (Optional) An explanation of why this is locked for the user. Present when
    // locked_for_user is true.
    @Column({ nullable: true, type: 'text' })
    lock_explanation?: string

    // The username of the topic creator.
    @Column({ type: 'text' })
    user_name: string

    // DEPRECATED An array of topic_ids for the group discussions the user is a part
    // of.
    @Column({ type: 'simple-array' })
    topic_children: number[]

    // An array of group discussions the user is a part of. Fields include: id,
    // group_id
    @OneToMany(
        'GroupTopic',
        (groupTopic: GroupTopic) => groupTopic.discussion_topic
    )
    @JoinColumn()
    group_topic_children: GroupTopic[]

    // If the topic is for grading and a group assignment this will point to the
    // original topic in the course.
    @Column({ nullable: true, type: 'numeric' })
    root_topic_id: number | null

    // If the topic is a podcast topic this is the feed url for the current user.
    @Column({ type: 'text' })
    podcast_url: string

    // The type of discussion. Values are 'side_comment', for discussions that only
    // allow one level of nested comments, and 'threaded' for fully threaded
    // discussions.
    @Column({ type: 'text' })
    discussion_type: DiscussionType

    // The unique identifier of the group category if the topic is a group
    // discussion, otherwise null.
    @Column({ nullable: true, type: 'numeric' })
    group_category_id: number | null

    // Array of file attachments.
    @OneToMany('File', (file: File) => file.discussion_topic)
    @Column()
    attachments: File[]

    // The current user's permissions on this topic.
    @Column()
    permissions: Record<string, boolean>

    // Whether or not users can rate entries in this topic.
    @Column({ type: 'boolean' })
    allow_rating: boolean

    // Whether or not grade permissions are required to rate entries.
    @Column({ type: 'boolean' })
    only_graders_can_rate: boolean

    // Whether or not entries should be sorted by rating.
    @Column({ type: 'boolean' })
    sort_by_rating: boolean

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<DiscussionTopic>) {
        super(data)
        Object.assign(this, data)
    }
}

export type SubscriptionHold =
    | 'not_in_group_set'
    | 'not_in_group'
    | 'topic_is_announcement'
    | 'initial_post_required'

export type DiscussionType = 'side_comment' | 'threaded'
