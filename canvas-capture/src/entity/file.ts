/**
 * Defines types matching file-related
 * portions of the Canvas API
 */
import { LockInfo } from './assignment'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { DiscussionTopic } from './discussion-topic'

@Entity()
export class File {
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
        () => DiscussionTopic,
        (discussionTopic) => discussionTopic.attachments
    )
    @JoinColumn()
    discussion_topic?: DiscussionTopic
}

export type VisibilityLevel = 'course' | 'institution' | 'public' | 'inherit'
