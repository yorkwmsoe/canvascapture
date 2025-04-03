/**
 * Defines types matching enrollment-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import type { Enrollment } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class Grade extends CanvasEntity {
    // The URL to the Canvas web UI page for the user's grades, if this is a student
    // enrollment.
    @Column({ type: 'text' })
    html_url: string

    // The user's current grade in the class. Only included if user has permissions
    // to view this grade.
    @Column({ type: 'text' })
    current_grade: string

    // The user's final grade for the class. Only included if user has permissions
    // to view this grade.
    @Column({ type: 'text' })
    final_grade: string

    // The user's current score in the class. Only included if user has permissions
    // to view this score.
    @Column({ type: 'text' })
    current_score: string

    // The user's final score for the class. Only included if user has permissions
    // to view this score.
    @Column({ type: 'text' })
    final_score: string

    // The total points the user has earned in the class. Only included if user has
    // permissions to view this score and 'current_points' is passed in the
    // request's 'include' parameter.
    @Column({ type: 'numeric' })
    current_points: number

    // The user's current grade in the class including muted/unposted assignments.
    // Only included if user has permissions to view this grade, typically teachers,
    // TAs, and admins.
    @Column({ nullable: true, type: 'text' })
    unposted_current_grade?: string

    // The user's final grade for the class including muted/unposted assignments.
    // Only included if user has permissions to view this grade, typically teachers,
    // TAs, and admins..
    @Column({ nullable: true, type: 'text' })
    unposted_final_grade?: string

    // The user's current score in the class including muted/unposted assignments.
    // Only included if user has permissions to view this score, typically teachers,
    // TAs, and admins..
    @Column({ nullable: true, type: 'text' })
    unposted_current_score?: string

    // The user's final score for the class including muted/unposted assignments.
    // Only included if user has permissions to view this score, typically teachers,
    // TAs, and admins..
    @Column({ nullable: true, type: 'text' })
    unposted_final_score?: string

    // The total points the user has earned in the class, including muted/unposted
    // assignments. Only included if user has permissions to view this score
    // (typically teachers, TAs, and admins) and 'current_points' is passed in the
    // request's 'include' parameter.
    @Column({ type: 'numeric' })
    unposted_current_points: number

    @PrimaryColumn({ type: 'numeric' })
    enrollment_id: number

    @OneToOne('Enrollment', (enrollment: Enrollment) => enrollment.grades)
    @JoinColumn({ name: 'enrollment_id' })
    enrollment: Enrollment

    constructor(data?: Partial<Grade>) {
        super(data)
        Object.assign(this, data)
    }
}
