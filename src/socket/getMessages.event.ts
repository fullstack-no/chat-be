import { Socket } from "socket.io";
import { redisClient } from "../connections/redis.connection";
import {
  socketErrorResponse,
  socketOkResponse,
} from "./generateSocketResponse";

export const handleGetMessages = async (socket: Socket, cb: any) => {
  try {
    const user = (socket as any).user;
    const messages = (
      await redisClient.lRange(`messages:${user.username}`, 0, -1)
    ).map((m) => JSON.parse(m));

    cb(socketOkResponse(messages));
  } catch {
    cb(socketErrorResponse());
  }
};
