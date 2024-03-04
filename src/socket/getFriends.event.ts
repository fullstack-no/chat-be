import { Socket } from "socket.io";
import { redisClient } from "../connections/redis.connection";
import {
  socketErrorResponse,
  socketOkResponse,
} from "./generateSocketResponse";

export const handleGetFriends = async (socket: Socket, cb: any) => {
  try {
    const user = (socket as any).user;

    const friendNames = await redisClient.sMembers(`friends:${user.username}`);

    if (!friendNames.length) {
      cb(socketOkResponse([]));
      return;
    }

    let query = redisClient.multi();

    friendNames.forEach((fname) => {
      query = query.hGetAll(`user:${fname}`);
    });

    const friends = (await query.exec())
      .filter((f: any) => Object.keys(f).length)
      .map((f: any) => ({ ...f, connected: Boolean(Number(f.connected)) }));

    cb(socketOkResponse(friends));
  } catch {
    cb(socketErrorResponse());
  }
};
