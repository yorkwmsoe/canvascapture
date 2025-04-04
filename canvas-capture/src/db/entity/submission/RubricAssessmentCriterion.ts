/**
 * Defines types matching submission-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import type { RubricCriteria, Submission } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class RubricAssessmentCriterion extends CanvasEntity {
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @ManyToOne(
        'RubricCriteria',
        (rubricCriteria: RubricCriteria) => rubricCriteria.assessments
    )
    @JoinColumn()
    rubricCriteria: RubricCriteria

    @Column({ type: 'numeric' })
    points: number

    @Column({ type: 'text' })
    comments: string

    @Column({ type: 'text' })
    rating_id: string

    @ManyToOne(
        'Submission',
        (submission: Submission) => submission.rubric_assessment
    )
    @JoinColumn()
    submission: Submission

    constructor(data?: Partial<RubricAssessmentCriterion>) {
        super(data)
        Object.assign(this, data)
    }
}
