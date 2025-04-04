/**
 * Defines types matching assignment-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { Assignment, File } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class LockInfo extends CanvasEntity {
    // Asset string for the object causing the lock
    @PrimaryColumn({ type: 'text' })
    asset_string: string

    // (Optional) Time at which this was/will be unlocked. Must be before the due
    // date.
    @Column({ nullable: true, type: 'date' })
    unlock_at?: Date

    // (Optional) Time at which this was/will be locked. Must be after the due date.
    @Column({ nullable: true, type: 'date' })
    lock_at?: Date

    // (Optional) Context module causing the lock.
    @Column({ type: 'text' })
    context_module: string

    @Column({ type: 'boolean' })
    manually_locked: boolean

    @OneToOne('Assignment', (assignment: Assignment) => assignment.lock_info)
    @JoinColumn()
    assignment: Assignment

    @Column({ nullable: true, type: 'numeric' })
    file_id: number

    @OneToOne('File', (file: File) => file.lock_info)
    @JoinColumn({ name: 'file_id' })
    file?: File

    constructor(data?: Partial<LockInfo>) {
        super(data)
        Object.assign(this, data)
    }
}
