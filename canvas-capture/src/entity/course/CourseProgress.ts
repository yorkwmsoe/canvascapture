/**
 * Defines types matching course-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, OneToOne, UpdateDateColumn } from 'typeorm'
import type { Course } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class CourseProgress extends CanvasEntity {
    // total number of requirements from all modules
    @Column({ type: 'numeric' })
    requirement_count: number

    // total number of requirements the user has completed from all modules
    @Column({ type: 'numeric' })
    requirement_completed_count: number

    // url to next module item that has an unmet requirement. null if the user has
    // completed the course or the current module does not require sequential
    // progress
    @Column({ nullable: true, type: 'text' })
    next_requirement_url: string | null

    // date the course was completed. null if the course has not been completed by
    // this user
    @Column({ nullable: true, type: 'date' })
    completed_at: Date | null

    @OneToOne('Course', (course: Course) => course.course_progress)
    @JoinColumn()
    course: Course

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<CourseProgress>) {
        super(data)
        Object.assign(this, data)
    }
}
