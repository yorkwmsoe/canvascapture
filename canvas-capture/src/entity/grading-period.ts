/**
 * Defines a type matching the grading period-related
 * portion of the Canvas API
 */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Course } from './course'

@Entity()
export class GradingPeriod {
    // The unique identifier for the grading period.
    @PrimaryColumn()
    id: number

    // The title for the grading period.
    @Column()
    title: string

    // The start date of the grading period.
    @Column()
    start_date: Date

    // The end date of the grading period.
    @Column()
    end_date: Date

    // Grades can only be changed before the close date of the grading period.
    @Column()
    close_date: Date

    // A weight value that contributes to the overall weight of a grading period set
    // which is used to calculate how many assignments in this period contribute to
    // the total grade
    @Column()
    weight: number

    // If true, the grading period's close_date has passed.
    @Column()
    is_closed: boolean

    @ManyToOne(() => Course, (course) => course.grading_periods)
    @JoinColumn()
    course: Course
}
