/**
 * Defines types matching assignment-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
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

    @PrimaryColumn({ type: 'text' })
    section_id: string

    @Column({ type: 'numeric' })
    needs_grading_count: number

    constructor(data?: Partial<NeedsGradingCountBySection>) {
        super(data)
        Object.assign(this, data)
    }
}
