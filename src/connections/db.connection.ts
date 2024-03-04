import { createPool } from "mysql2/promise";
import { config } from "../config";

export const conn = createPool({
  database: config.DATABASE_DB,
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  user: config.DATABASE_USER,
  password: config.DATABASE_PASSWORD,

  // waitForConnections: true,
  // connectionLimit: 10,
  // maxIdle: 10,
});
