export const config = {
  ENV: process.env.ENV || "dev",

  //   app
  PORT: parseInt(process.env.PORT as any, 10) || 3000,

  //   db
  DATABASE_DB: process.env.DATABASE_DB || "",
  DATABASE_HOST: process.env.DATABASE_HOST || "localhost",
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT as any, 10) || 3306,
  DATABASE_USER: process.env.DATABASE_USER || "root",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "",

  // client
  CLIENT_URL: process.env.CLIENT_URL || "*",
};
