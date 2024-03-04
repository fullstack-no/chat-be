import { Socket } from "socket.io";
import { redisClient } from "../connections/redis.connection";
import {
  socketErrorResponse,
  socketOkResponse,
} from "./generateSocketResponse";

export const handleAddFriend = async (
  socket: Socket,
  friendname: string,
  cb: any
) => {
  try {
    const user = (socket as any).user;

    if (friendname === user.username) {
      cb(socketErrorResponse("Cannot add yourself"));
      return;
    }

    const friend = await redisClient.hGetAll(`user:${friendname}`);

    console.log(friend);

    if (!Object.keys(friend).length) {
      cb(socketErrorResponse("Friend is not exist"));
      return;
    }

    const friendCheck = await redisClient.sIsMember(
      `friends:${user.username}`,
      friendname
    );
    if (friendCheck) {
      cb(socketErrorResponse("Friend already added"));
      return;
    }

    //  add to friend list
    await redisClient.sAdd(`friends:${user.username}`, friendname);

    cb(
      socketOkResponse({
        id: friend.id,
        username: friend.username,
        hash: friend.hash,
        connected: friend.connected,
      })
    );
  } catch {
    cb(socketErrorResponse("Server errors"));
  }
};
