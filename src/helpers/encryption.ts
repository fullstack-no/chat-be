import bcrypt from "bcrypt";

const salt = 10;

export const encryption = {
  hashPassword: async (password: string) => {
    return await bcrypt.hash(password, salt);
  },
  compare: async (raw: string, hash: string) => {
    return await bcrypt.compare(raw, hash);
  },
};
