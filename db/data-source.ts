import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '123',
  port: +process.env.DATABASE_PORT,
  database: 'postgres',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
