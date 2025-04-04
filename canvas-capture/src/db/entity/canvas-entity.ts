import 'reflect-metadata'
import { BaseEntity, Entity, UpdateDateColumn } from 'typeorm'

@Entity()
export default class CanvasEntity extends BaseEntity {
    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<CanvasEntity>) {
        super()
        if (data) {
            Object.assign(data)
        }
    }
}
