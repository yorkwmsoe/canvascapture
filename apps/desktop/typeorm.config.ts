import { DataSource } from 'typeorm'
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions'

const connectionOptions: DataSourceOptions = {
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: true,
    entities: ['@canvas-capture/lib/src/entity/*.ts'],
    migrations: ['src/migration/*.ts'],
}

export default new DataSource({
    ...connectionOptions,
})
