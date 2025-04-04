/**
 * Defines types matching assignment-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import type { RubricCriteria } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class RubricRating extends CanvasEntity {
    @Column({ type: 'numeric' })
    points: number

    @PrimaryColumn({ type: 'text' })
    id: string

    @Column({ type: 'text' })
    description: string

    @Column({ type: 'text' })
    long_description: string

    @ManyToOne(
        'RubricCriteria',
        (rubricCriteria: RubricCriteria) => rubricCriteria.ratings
    )
    @JoinColumn()
    rubric_criteria: RubricCriteria

    constructor(data?: Partial<RubricRating>) {
        super(data)
        Object.assign(this, data)
    }
}
