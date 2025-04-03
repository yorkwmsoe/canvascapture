/**
 * Defines type matching user-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import type { SubmissionComment } from '../submission/SubmissionComment'
import CanvasEntity from '../canvas-entity'

@Entity()
export class UserDisplay extends CanvasEntity {
    // The ID of the user.
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // A short name the user has selected, for use in conversations or other less
    // formal places through the site.
    @Column({ type: 'text' })
    short_name: string
    // If avatars are enabled, this field will be included and contain a url to
    // retrieve the user's avatar.
    @Column({ nullable: true, type: 'text' })
    avatar_image_url?: string

    // URL to access user, either nested to a context or directly.
    @Column({ type: 'text' })
    html_url: string

    @OneToMany(
        'SubmissionComment',
        (submissionComment: SubmissionComment) => submissionComment.author
    )
    @JoinColumn()
    submission_comments: SubmissionComment[]

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<UserDisplay>) {
        super(data)
        Object.assign(this, data)
    }
}
