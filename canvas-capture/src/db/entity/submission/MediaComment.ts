/**
 * Defines types matching submission-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { Submission, SubmissionComment } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class MediaComment extends CanvasEntity {
    @Column({ type: 'text' })
    'content-type': string

    @Column({ type: 'text' })
    display_name?: string

    @PrimaryColumn({ type: 'text' })
    media_id: string

    @Column({ type: 'text' })
    media_type: string

    @Column({ type: 'text' })
    url: string

    @OneToOne(
        'Submission',
        (submission: Submission) => submission.media_comment
    )
    @JoinColumn()
    submission: Submission

    @OneToOne(
        'SubmissionComment',
        (submissionComment: SubmissionComment) =>
            submissionComment.media_comment
    )
    @JoinColumn()
    submission_comment: SubmissionComment

    constructor(data?: Partial<MediaComment>) {
        super(data)
        Object.assign(this, data)
    }
}
