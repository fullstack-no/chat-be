import { Socket } from "socket.io";
import { redisClient } from "../connections/redis.connection";

export const socketAuthMiddleware = async (socket: Socket, next: any) => {
  try {
    const session = (socket.request as any).session;
    if (!session?.user) {
      next(new Error("unauthorized"));
      return;
    }

    (socket as any).user = session.user;
    await redisClient
      .multi()
      .hSet(`user:${session.user.username}`, "hash", session.user.hash)
      .hSet(`user:${session.user.username}`, "id", session.user.id)
      .hSet(`user:${session.user.username}`, "username", session.user.username)
      .hSet(`user:${session.user.username}`, "connected", 1)
      .exec();

    socket.join(session.user.hash);
    next();
  } catch {
    next(new Error("Server errors"));
  }
};
