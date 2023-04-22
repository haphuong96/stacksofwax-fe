import pagination from "../utils/pagination.helper";
import { axiosIntance } from "./base.service";

async function fetchUserInfo(userId, page = 1, pageSize = 10) {
  try {
    const { limit, offset } = pagination(page, pageSize);
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
