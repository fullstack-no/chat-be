import { encryption } from "../helpers/encryption";

import { Request, Response } from "express";
import { conn } from "../connections/db.connection";
import {
  sendBadRequestReponse,
  sendServerErrorReponse,
} from "../helpers/error-response";
import { v4 } from "uuid";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const authController = {
  register: async (req: Request, res: Response, data: any) => {
    try {
      const { username, password } = data;
      const [[existingUser]] = await conn.query<RowDataPacket[]>(
        "SELECT * FROM users  WHERE username = ?",
        [username]
      );

      if (existingUser) {
        sendBadRequestReponse(res, "username existed");
        return;
      }

      const hashPassword = await encryption.hashPassword(password);
      const [result] = await conn.query<ResultSetHeader>(
        "INSERT INTO users(username,password,hash) values(?,?,?)",
        [username, hashPassword, v4()]
      );

      if (!result.affectedRows) {
        throw Error();
      }

      const [[user]] = await conn.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );

      (req.session as any).user = {
        id: user.id,
        username: user.username,
        hash: user.hash,
      };

      res.json({ login: true, username, id: user.id });
    } catch (error: any) {
      console.log(error);
      sendServerErrorReponse(res);
    }
  },
  login: async (req: Request, res: Response, data: any) => {
    try {
      const { username, password } = data;

      const [[user]] = await conn.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE username = ? ",
        [username]
      );

      if (!user) {
        res.json({ login: false, error: "username or password wrong" });
        return;
      }

      const passCheck = await encryption.compare(password, user.password);
      if (!passCheck) {
        res.json({ login: false, error: "username or password wrong" });
        return;
      }

      (req.session as any).user = {
        id: user.id,
        username: user.username,
        hash: user.hash,
      };

      res.json({ login: true, username, id: user.id });
    } catch (error) {
      console.log(error);
      sendServerErrorReponse(res);
    }
  },
  getLogin: (req: Request, res: Response) => {
    const user = (req.session as any)?.user;
    if (user) {
      res.json({ login: true, id: user?.id, username: user?.username });
      return;
    } else {
      res.json({ login: false });
      return;
    }
  },
};
