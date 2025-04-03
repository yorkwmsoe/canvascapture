import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import type { MediaComment, Submission, UserDisplay } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class SubmissionComment extends CanvasEntity {
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @Column({ type: 'numeric' })
    author_id: number

    @Column({ type: 'text' })
    author_name: string

    // Abbreviated user object UserDisplay (see users API).
    @ManyToOne(
        'UserDisplay',
        (userDisplay: UserDisplay) => userDisplay.submission_comments
    )
    @JoinColumn()
    author: UserDisplay

    @Column({ type: 'text' })
    comment: string

    @Column({ type: 'date' })
    created_at: Date

    @Column({ type: 'date' })
    edited_at: Date

    @OneToOne(
        'MediaComment',
        (mediaComment: MediaComment) => mediaComment.submission_comment
    )
    @JoinColumn()
    media_comment: MediaComment

    @ManyToOne(
        'Submission',
        (submission: Submission) => submission.submission_comments
    )
    @JoinColumn()
    submission: Submission

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<SubmissionComment>) {
        super(data)
        Object.assign(this, data)
    }
}
