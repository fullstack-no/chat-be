import { redisClient } from "../connections/redis.connection";

export const getAllFriends = async (username: string) => {
  const friendsName = await redisClient.sMembers(`friends:${username}`);

  let query = redisClient.multi();
  friendsName.forEach((fname) => {
    query = query.hGetAll(`user:${fname}`);
  });

  const friends = (await query.exec()).filter((f) => f);
  return friends;
};

export const getUser = async (username: string) => {
  const user = await redisClient.hGetAll(`user:${username}`);
  return user;
};
