/**
 * Defines types matching assignment-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import CanvasEntity from '../canvas-entity'
import type { Assignment } from '../entity.types'

@Entity()
export class TurnitinSettings extends CanvasEntity {
    @PrimaryGeneratedColumn({ type: 'numeric' })
    id: number

    @Column({ type: 'text' })
    originality_report_visibility: OriginallyReportVisibility

    @Column({ type: 'boolean' })
    s_paper_check: boolean

    @Column({ type: 'boolean' })
    internet_check: boolean

    @Column({ type: 'boolean' })
    journal_check: boolean

    @Column({ type: 'boolean' })
    exclude_biblio: boolean

    @Column({ type: 'boolean' })
    exclude_quoted: boolean

    @Column({ type: 'text' })
    exclude_small_matches_type: ExcludeSmallMatchesType

    @Column({ nullable: true, type: 'numeric' })
    exclude_small_matches_value: number | null

    @OneToOne(
        'Assignment',
        (assignment: Assignment) => assignment.turnitin_settings
    )
    @JoinColumn()
    assignment: Assignment

    constructor(data?: Partial<TurnitinSettings>) {
        super(data)
        Object.assign(this, data)
    }
}

export type OriginallyReportVisibility =
    | 'immediate'
    | 'after_grading'
    | 'after_due_date'
    | 'never'

export type ExcludeSmallMatchesType = 'percent' | 'words' | null
