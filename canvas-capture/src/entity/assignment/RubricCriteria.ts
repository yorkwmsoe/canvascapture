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
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import type {
    Assignment,
    RubricAssessmentCriterion,
    RubricRating,
} from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class RubricCriteria extends CanvasEntity {
    @Column({ type: 'numeric' })
    points: number

    // The id of rubric criteria.
    @PrimaryColumn({ type: 'text' })
    id: string

    // (Optional) The id of the learning outcome this criteria uses, if any.
    @Column({ nullable: true, type: 'text' })
    learning_outcome_id?: string

    // (Optional) The 3rd party vendor's GUID for the outcome this criteria
    // references, if any.
    @Column({ nullable: true, type: 'text' })
    vendor_guid?: string

    @Column({ type: 'text' })
    description: string

    @Column({ type: 'text' })
    long_description: string

    @Column({ type: 'boolean' })
    criterion_use_range: boolean

    @OneToMany(
        'RubricRating',
        (rubricRating: RubricRating) => rubricRating.rubric_criteria
    )
    @JoinColumn()
    ratings: RubricRating[]

    @Column({ type: 'boolean' })
    ignore_for_scoring: boolean

    @ManyToOne('Assignment', (assignment: Assignment) => assignment.rubric)
    @JoinColumn()
    assignment: Assignment

    @OneToMany(
        'RubricAssessmentCriterion',
        (rubricAssessmentCriterion: RubricAssessmentCriterion) =>
            rubricAssessmentCriterion.rubricCriteria
    )
    @JoinColumn()
    assessments: RubricAssessmentCriterion[]

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<RubricCriteria>) {
        super(data)
        Object.assign(this, data)
    }
}
