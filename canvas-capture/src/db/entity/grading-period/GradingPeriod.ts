/**
 * Defines a type matching the grading period-related
 * portion of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import type { Course } from '../course/Course'
import CanvasEntity from '../canvas-entity'

@Entity()
export class GradingPeriod extends CanvasEntity {
    // The unique identifier for the grading period.
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // The title for the grading period.
    @Column({ type: 'text' })
    title: string

    // The start date of the grading period.
    @Column({ type: 'date' })
    start_date: Date

    // The end date of the grading period.
    @Column({ type: 'date' })
    end_date: Date

    // Grades can only be changed before the close date of the grading period.
    @Column({ type: 'date' })
    close_date: Date

    // A weight value that contributes to the overall weight of a grading period set
    // which is used to calculate how many assignments in this period contribute to
    // the total grade
    @Column({ type: 'numeric' })
    weight: number

    // If true, the grading period's close_date has passed.
    @Column({ type: 'boolean' })
    is_closed: boolean

    @ManyToOne('Course', (course: Course) => course.grading_periods)
    @JoinColumn()
    course: Course

    constructor(data?: Partial<GradingPeriod>) {
        super(data)
        Object.assign(this, data)
    }
}
