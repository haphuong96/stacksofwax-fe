import { axiosIntance } from "./base.service";

async function fetchUserInfo(userId, limit = 10, offset = 0) {
  try {
    const rs = await axiosIntance.get(`/users/${userId}`, {
      params: { limit, offset }
    });
    return rs?.data;
  } catch (error) {
    return undefined;
  }
}

export const userService = {
  fetchUserInfo
};
