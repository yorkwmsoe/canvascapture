/**
 * Defines types matching discussion topic-related
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

    @Column({ type: 'number' })
    group_id: number

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<GroupTopic>) {
        super(data)
        Object.assign(this, data)
    }
}
