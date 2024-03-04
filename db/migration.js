if (process.env.ENV !== "production") require("dotenv").config();

const mysql = require("mysql2");
const migration = require("mysql-migrations");
const path = require("node:path");
const fs = require("node:fs/promises");

async function run() {
  const connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
  });

  const migrationsURL = path.join(__dirname, "migrations");
  try {
    await fs.stat(migrationsURL);
  } catch {
    await fs.mkdir(migrationsURL, () => {});
  }

  migration.init(connection, migrationsURL);
}

run();
