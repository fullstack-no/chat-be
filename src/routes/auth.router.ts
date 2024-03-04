import { Router } from "express";
import * as Yup from "yup";
import { sendBadRequestReponse } from "../helpers/error-response";
import { authController } from "../controllers/auth.controller";

const router = Router();

router.get("/login", (req, res) => {
  authController.getLogin(req, res);
});

router.post("/login", async (req, res) => {
  try {
    const data = await Yup.object({
      username: Yup.string().min(3).max(20).required(),
      password: Yup.string().min(3).max(20).required(),
    }).validate(req.body);

    return await authController.login(req, res, data);
  } catch (error: any) {
    sendBadRequestReponse(res, error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const data = await Yup.object({
      username: Yup.string().min(3).max(20).required(),
      password: Yup.string().min(3).max(20).required(),
    }).validate(req.body);

    return await authController.register(req, res, data);
  } catch (error: any) {
    sendBadRequestReponse(res, error);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {});
  res.json(null);
});

export const authRouter = router;
