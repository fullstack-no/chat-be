import RedisStore from "connect-redis";
import session from "express-session";
import { redisClient } from "../connections/redis.connection";
import { config } from "../config";

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "app:session:",
});

export const sessionMiddleware = session({
  store: redisStore,
  resave: false, // required: force lightweight session keep alive (touch)
  saveUninitialized: false, // recommended: only save session when data exists
  secret: "keyboard cat",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: config.ENV === "production",
    httpOnly: true,
    sameSite: config.ENV === "production" ? "none" : "lax",
  },
});
