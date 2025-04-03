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
export class ScoreStatistic extends CanvasEntity {
    @ManyToOne(
        'Assignment',
        (assignment: Assignment) => assignment.score_statistics
    )
    @JoinColumn()
    assignment: Assignment

    // Min score
    @Column({ type: 'numeric' })
    min: number

    // Max score
    @Column({ type: 'numeric' })
    max: number

    // Mean score
    @Column({ type: 'numeric' })
    mean: number

    // Upper quartile score
    @Column({ type: 'numeric' })
    upper_q: number

    // Median score
    @Column({ type: 'numeric' })
    median: number

    // Lower quartile score
    @Column({ type: 'numeric' })
    lower_q: number

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<ScoreStatistic>) {
        super(data)
        Object.assign(this, data)
    }
}
