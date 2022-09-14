const { join } = require('path')
require('dotenv').config({ path: join(__dirname, '.env') })
const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_HOST } = process.env

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      host: POSTGRES_HOST,
      port: POSTGRES_PORT
    },
    migrations: {
      directory: `${__dirname}/db/migrations` // eslint-disable-line
    }
  },
  production: {
    client: 'pg',
    connection: {
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      host: POSTGRES_HOST,
      port: POSTGRES_PORT
    },
    migrations: {
      directory: `${__dirname}/db/migrations` // eslint-disable-line
    }
  }
}