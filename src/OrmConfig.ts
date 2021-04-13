import {AppConfig} from "./AppConfig";
import {ConnectionOptions} from "typeorm/connection/ConnectionOptions";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";

export default {
  type: "postgres",
  host: AppConfig.getDatabaseHost(),
  port: AppConfig.getDatabasePort(),
  username: AppConfig.getDatabaseUser(),
  password: AppConfig.getDatabasePassword(),
  database: AppConfig.getDatabaseName(),
  synchronize: false,
  logging: AppConfig.isDevelopment(),
  entities: [
    "build/**/*.js",
  ],
  migrations: [
    "build/migrations/*.js",
  ],
  namingStrategy: new SnakeNamingStrategy(),
} as ConnectionOptions;
