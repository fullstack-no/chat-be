import { Socket } from "socket.io";
import { redisClient } from "../connections/redis.connection";
import { getUser } from "./common";

export const handleSendMessage = async (
  socket: Socket,
  friendname: string,
  msg: string
) => {
  try {
    const user = (socket as any).user;

    const message = {
      from: user.username,
      to: friendname,
      content: msg,
    };

    const friend = await getUser(friendname);
    if (!friend?.username) {
      return;
    }

    await redisClient.lPush(
      `messages:${user.username}`,
      JSON.stringify(message)
    );
    await redisClient.lPush(`messages:${friendname}`, JSON.stringify(message));

    socket.to(friend.hash).emit("message:noti", message);
  } catch {}
};
