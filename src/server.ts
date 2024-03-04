import dotenv from "dotenv";
if (process.env.ENV !== "produvtion") dotenv.config();

// internal
import { createServer } from "node:http";

// external
import express from "express";
import { Server } from "socket.io";
import { config } from "./config";
import { authRouter } from "./routes";
import { conn } from "./connections/db.connection";
import { redisClient } from "./connections/redis.connection";
import { sessionMiddleware } from "./middlewares/session.middleware";
import cors from "cors";
import { corsConfig } from "./helpers/cors";
import { handleConnectionSocket } from "./socket/handleConnectionSocket";
import helmet from "helmet";
import { socketAuthMiddleware } from "./socket/auth.middleware";

// connects
conn.getConnection().then(() => {
  console.log("Connected to db.");
});
redisClient
  .connect()
  .then(() => {
    console.log("Connected to redis.");
  })
  .catch(() => {});

// app
const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
// app.use(cors(corsConfig));
app.use(
  cors({
    origin: "https://huychat.netlify.app/",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(sessionMiddleware);

app.set("trust proxy", 1); // trust first proxy

// routes
app.use("/auth", authRouter);

// socket
const io = new Server(server, { cors: corsConfig });

io.use((socket, next) => {
  (sessionMiddleware as any)(socket.request, {}, next);
});

io.use(socketAuthMiddleware);

io.on("connection", handleConnectionSocket);

// listen
server.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}...`);
});
