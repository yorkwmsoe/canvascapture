/**
 * Defines types matching assignment-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, UpdateDateColumn } from 'typeorm'
import CanvasEntity from '../canvas-entity'

@Entity()
export class AssignmentDate extends CanvasEntity {
    // (Optional, missing if 'base' is present) id of the assignment override this
    // date represents
    @Column({ nullable: true, type: 'numeric', unique: true })
    id?: number

    // (Optional, present if 'id' is missing) whether this date represents the
    // assignment's or quiz's default due date
    @Column({ nullable: true, type: 'boolean' })
    base?: boolean

    @Column({ type: 'text' })
    title: string

    // The due date for the assignment. Must be between the unlock date and the lock
    // date if there are lock dates
    @Column({ type: 'date' })
    due_at: Date

    // The unlock date for the assignment. Must be before the due date if there is a
    // due date.
    @Column({ type: 'date' })
    unlock_at: Date

    // The lock date for the assignment. Must be after the due date if there is a
    // due date.
    @Column({ type: 'date' })
    lock_at: Date

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<AssignmentDate>) {
        super(data)
        Object.assign(this, data)
    }
}
