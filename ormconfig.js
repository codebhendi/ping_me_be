const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;

module.exports = {
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  entities: ['lib/entity/*.js'],
  migrations: ['lib/migration/*.js'],
  logging: true,
  synchronize: false,
  migrationsTableName: 'ping_me_migrations',
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
  },
};
