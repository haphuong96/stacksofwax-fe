import pagination from "../utils/pagination.helper";
import { axiosIntance } from "./base.service";
import router from "../router";
import { routeNames } from "../router/route-names";
import { message } from "ant-design-vue";
import emitter, { emitterEvents } from "../utils/emitter.helper";

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

async function getMyProfile() {
  try {
    const rs = await axiosIntance.get(`/get-me`);
    return rs?.data;
  } catch (error) {
    return undefined;
  }
}

async function signout() {
  localStorage.clear();
  emitter.emit(emitterEvents.SIGNOUT)
}

async function updateUserProfilePicture(profilePictureUrl) {
  try {
    const rs = await axiosIntance.post("/me/profile-picture", {
      img_path: profilePictureUrl
    });
    return rs.data;
  } catch (error) {
    return false;
  }
}

async function getUserCollection(userId, page, pageSize) {
  try {
    const { limit, offset } = pagination(page, pageSize);
    const res = await axiosIntance.get(`/users/${userId}/collections`, {
      params: { limit, offset }
    });
    
    const {total, collections } = res.data;
    return {
      total,
      collections
    }
  } catch (error) {
    message.error("Error loading user collections")
  }
}

export const userService = {
  fetchUserInfo,
  getMyProfile,
  signout,
  updateUserProfilePicture,
  getUserCollection
};
