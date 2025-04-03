import 'reflect-metadata'
import { DataSource } from 'typeorm'

export const FrontEndDataSource = new DataSource({
    type: 'sqlite',
    database: 'canvas.db',
    entities: ['./src/entity/*/*.ts'],
    migrations: ['./src/migration/front-end/*.ts'],
    subscribers: [],
})
