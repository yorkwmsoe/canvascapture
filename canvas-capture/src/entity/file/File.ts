/**
 * Defines types matching file-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from 'typeorm'
import type { DiscussionTopic, LockInfo } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class File extends CanvasEntity {
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @Column({ type: 'uuid' })
    uuid: string

    @Column({ type: 'numeric' })
    folder_id: number

    @Column({ type: 'text' })
    display_name: string

    @Column({ type: 'text' })
    filename: string

    @Column({ type: 'text' })
    'content-type': string

    @Column({ type: 'text' })
    url: string

    // file size in bytes
    @Column({ type: 'numeric' })
    size: number

    @Column({ type: 'date' })
    created_at: Date

    @Column({ type: 'date' })
    updated_at: Date

    @Column({ type: 'date' })
    unlock_at: Date

    @Column({ type: 'boolean' })
    locked: boolean

    @Column({ type: 'boolean' })
    hidden: boolean

    @Column({ type: 'date' })
    lock_at: Date

    @Column({ type: 'boolean' })
    hidden_for_user: boolean

    // Changes who can access the file. Valid options are 'inherit' (the default),
    // 'course', 'institution', and 'public'. Only valid in course endpoints.
    @Column({ type: 'text' })
    visibility_level: VisibilityLevel

    @Column({ type: 'text' })
    thumbnail_url: string

    @Column({ type: 'date' })
    modified_at: Date

    // simplified content-type mapping
    @Column({ type: 'text' })
    mime_class: string

    // identifier for file in third-party transcoding service
    @Column({ type: 'text' })
    media_entry_id: string

    @Column({ type: 'boolean' })
    locked_for_user: boolean

    @OneToOne('LockInfo', (lockInfo: LockInfo) => lockInfo.file)
    @JoinColumn()
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

    constructor(data?: Partial<File>) {
        super(data)
        Object.assign(this, data)
    }
}

export type VisibilityLevel = 'course' | 'institution' | 'public' | 'inherit'
