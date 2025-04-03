/**
 * Defines types matching course-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import type { Course } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class BlueprintRestrictions extends CanvasEntity {
    @Column({ type: 'boolean' })
    content: boolean

    @Column({ type: 'boolean' })
    points: boolean

    @Column({ type: 'boolean' })
    due_dates: boolean

    @Column({ type: 'boolean' })
    availability_dates: boolean

    @PrimaryColumn({ type: 'numeric' })
    courseId: number

    @OneToOne('Course', (course: Course) => course.blueprint_restrictions)
    @JoinColumn()
    course: Course

    constructor(data?: Partial<BlueprintRestrictions>) {
        super(data)
        Object.assign(this, data)
    }
}
