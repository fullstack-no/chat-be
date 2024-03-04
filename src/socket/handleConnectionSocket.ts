import { Socket } from "socket.io";
import { handleAddFriend } from "./addFriend.event";
import { handleGetFriends } from "./getFriends.event";
import { redisClient } from "../connections/redis.connection";
import { getAllFriends } from "./common";
import { handleSendMessage } from "./handleSendMessage.event";
import { handleGetMessages } from "./getMessages.event";

export const handleConnectionSocket = async (socket: Socket) => {
  const user = (socket as any).user;

  // noti online to all friends
  const friends = await getAllFriends(user.username);

  socket
    .to(friends.map((f: any) => f.hash))
    .emit("friend:status", user.username, true);

  socket.on("disconnect", async () => {
    try {
      const user = (socket as any).user;
      await redisClient.hSet(`user:${user.username}`, "connected", 0);

      // noti to friends
      const friends = await getAllFriends(user.username);

      socket
        .to(friends.map((f: any) => f.hash))
        .emit("friend:status", user.username, false);
    } catch {}
  });

  socket.on("add-friend", async (friendname: any, cb) => {
    await handleAddFriend(socket, friendname, cb);
  });
  socket.on("friends", async (cb) => {
    await handleGetFriends(socket, cb);
  });
  socket.on("message:send", async (friendname: string, msg: string) => {
    await handleSendMessage(socket, friendname, msg);
  });

  socket.on("messages", async (cb) => {
    await handleGetMessages(socket, cb);
  });
};
