import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'n5irk*lSYMxn8xr2ChL#$BQI9Rdya2WF2yG1ysV',
  database: 'dogster',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};