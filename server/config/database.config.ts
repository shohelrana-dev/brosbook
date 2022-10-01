import path                  from 'path'
import { ConnectionOptions } from 'typeorm'

const dbConnection: any = process.env.DB_CONNECTION || 'mysql'
const host: string      = process.env.DB_HOST || 'localhost'
const port: number      = Number( process.env.DB_PORT ) || 3306
const username: string  = process.env.DB_USERNAME!
const password: string = process.env.DB_PASSWORD!
const database: string = process.env.DB_DATABASE!

const databaseConfig: ConnectionOptions = {
    type: dbConnection,
    host: host,
    port: port,
    username: username,
    password: password,
    database: database,
    synchronize: true,
    logging: false,
    migrationsRun: false,
    entities: [
        path.join( __dirname, '/../api/database/entities/**/*.{ts,js}' )
    ],
    migrations: [
        path.join( __dirname, '/../api/database/migrations/**/*.{ts,js}' )
    ],
    subscribers: [
        path.join( __dirname, '/../api/database/subscribers/**/*.{ts,js}' )
    ],
    cli: {
        entitiesDir: 'server/api/database/entities',
        migrationsDir: 'server/api/database/migrations',
        subscribersDir: 'server/api/database/subscribers'
    }
}

export default databaseConfig