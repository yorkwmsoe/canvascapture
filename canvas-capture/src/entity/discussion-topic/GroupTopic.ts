/**
 * Defines types matching discussion topic-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import type { DiscussionTopic } from './DiscussionTopic'
import CanvasEntity from '../canvas-entity'

@Entity()
export class GroupTopic extends CanvasEntity {
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @ManyToOne(
        'DiscussionTopic',
        (discussionTopic: DiscussionTopic) =>
            discussionTopic.group_topic_children
    )
    @JoinColumn()
    discussion_topic: DiscussionTopic

    @Column({ type: 'numeric' })
    group_id: number

    constructor(data?: Partial<GroupTopic>) {
        super(data)
        Object.assign(this, data)
    }
}
