import { config } from "../config";

export const corsConfig = {
  origin: [config.CLIENT_URL],
  credentials: true,
};
