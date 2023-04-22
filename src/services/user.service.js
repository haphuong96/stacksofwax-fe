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
  router.push({ name: routeNames.HOME });
  window.location.reload();
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

export const userService = {
  fetchUserInfo,
  getMyProfile,
  signout,
  updateUserProfilePicture
};
