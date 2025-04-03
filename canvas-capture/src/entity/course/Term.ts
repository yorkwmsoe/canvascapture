/**
 * Defines types matching course-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import type { Course } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class Term extends CanvasEntity {
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @Column({ type: 'date' })
    name: string

    @Column({ type: 'date' })
    start_at: Date

    @Column({ nullable: true, type: 'date' })
    end_at: Date | null

    @OneToMany('Course', (course: Course) => course.term)
    @JoinColumn()
    courses: Course[]

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<Term>) {
        super(data)
        Object.assign(this, data)
    }
}
