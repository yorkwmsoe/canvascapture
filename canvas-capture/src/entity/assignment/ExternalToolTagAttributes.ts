/**
 * Defines types matching assignment-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm'
import type { Assignment } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class ExternalToolTagAttributes extends CanvasEntity {
    @ManyToOne(
        'Assignment',
        (assignment: Assignment) => assignment.external_tool_tag_attributes
    )
    @JoinColumn()
    assignment: Assignment

    // URL to the external tool
    @Column({ type: 'text' })
    url: string

    // Whether or not there is a new tab for the external tool
    @Column({ type: 'boolean' })
    new_tab: boolean

    // the identifier for this tool_tag
    @Column({ type: 'text' })
    resource_link_id: string

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<ExternalToolTagAttributes>) {
        super(data)
        Object.assign(this, data)
    }
}
