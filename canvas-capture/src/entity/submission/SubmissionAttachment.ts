/**
 * Defines types matching submission-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import type { Submission } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class SubmissionAttachment extends CanvasEntity {
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @Column({ type: 'numeric' })
    uuid: string

    @Column({ type: 'numeric' })
    folder_id: number

    @Column({ type: 'text' })
    display_name: string

    @Column({ type: 'text' })
    filename: string

    @Column({ type: 'text' })
    upload_status: string

    @Column({ type: 'text' })
    'content-type': string

    @Column({ type: 'text' })
    url: string

    @Column({ type: 'numeric' })
    size: number

    @Column({ type: 'date' })
    created_at: Date

    @Column({ type: 'date' })
    updated_at: Date

    unlock_at: null

    @Column({ type: 'boolean' })
    locked: boolean

    @Column({ type: 'boolean' })
    hidden: boolean

    lock_at: null

    @Column({ type: 'boolean' })
    hidden_for_user: boolean

    @Column({ type: 'text' })
    thumbnail_url: string

    @Column({ type: 'date' })
    modified_at: Date

    @Column({ type: 'string' })
    mime_class: string

    media_entry_id: null

    @Column({ type: 'text' })
    category: string

    @Column({ type: 'boolean' })
    locked_for_user: boolean

    preview_url: null

    @ManyToOne('Submission', (submission: Submission) => submission.attachments)
    @JoinColumn()
    submission: Submission

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<SubmissionAttachment>) {
        super(data)
        Object.assign(this, data)
    }
}
