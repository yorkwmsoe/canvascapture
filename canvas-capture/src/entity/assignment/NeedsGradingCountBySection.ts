/**
 * Defines types matching assignment-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm'
import type { Assignment } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class NeedsGradingCountBySection extends CanvasEntity {
    @ManyToOne(
        'Assignment',
        (assignment: Assignment) => assignment.needs_grading_count_by_section
    )
    @JoinColumn()
    assignment: Assignment

    @Column({ type: 'text' })
    section_id: string

    @Column({ type: 'numeric' })
    needs_grading_count: number

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<NeedsGradingCountBySection>) {
        super(data)
        Object.assign(this, data)
    }
}
