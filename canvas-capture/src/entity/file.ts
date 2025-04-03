/**
 * Defines types matching file-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import type { LockInfo } from './assignment'
import type { DiscussionTopic } from './discussion-topic'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import CanvasEntity from './canvas-entity'

@Entity()
export class File extends CanvasEntity {
    @PrimaryColumn()
    id: number

    @Column()
    uuid: string

    @Column()
    folder_id: number

    @Column()
    display_name: string

    @Column()
    filename: string

    @Column()
    'content-type': string

    @Column()
    url: string

    // file size in bytes
    @Column()
    size: number

    @Column()
    created_at: Date

    @Column()
    updated_at: Date

    @Column()
    unlock_at: Date

    @Column()
    locked: boolean

    @Column()
    hidden: boolean

    @Column()
    lock_at: Date

    @Column()
    hidden_for_user: boolean

    // Changes who can access the file. Valid options are 'inherit' (the default),
    // 'course', 'institution', and 'public'. Only valid in course endpoints.
    @Column()
    visibility_level: VisibilityLevel

    @Column()
    thumbnail_url: string

    @Column()
    modified_at: Date

    // simplified content-type mapping
    @Column()
    mime_class: string

    // identifier for file in third-party transcoding service
    @Column()
    media_entry_id: string

    @Column()
    locked_for_user: boolean

    @Column()
    lock_info: LockInfo

    @Column()
    lock_explanation: string

    // optional: url to the document preview. This url is specific to the user
    // making the api call. Only included in submission endpoints.
    @Column()
    preview_url?: string

    @ManyToOne(
        'DiscussionTopic',
        (discussionTopic: DiscussionTopic) => discussionTopic.attachments
    )
    @JoinColumn()
    discussion_topic?: DiscussionTopic

    @UpdateDateColumn()
    date_last_received_from_canvas: Date
}

export type VisibilityLevel = 'course' | 'institution' | 'public' | 'inherit'
