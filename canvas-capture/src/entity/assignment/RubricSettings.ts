import { Column } from 'typeorm'

export class RubricSettings {
    @Column({ type: 'text' })
    points_possible: string
}
