import { User } from "../models/User";

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });

  return user;
};

export const getUserId = async (id: string) => {
  const user = await User.findOne({ _id: Object(id) });

  return user;
};
