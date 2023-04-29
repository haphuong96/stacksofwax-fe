import axios from "axios";
import { localStorageKeys } from "../common/local-storage-keys";
import { userService } from "./user.service";
import { message } from "ant-design-vue";
import emitter, { emitterEvents } from "../utils/emitter.helper";

export const axiosIntance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 15000
});

axiosIntance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosIntance.interceptors.response.use(
  (respone) => handleRequestResponse(respone.data),
  (error) => handleRequestError(error)
);

const handleRequestResponse = (data) => {
  return { data };
};

const handleRequestError = async (error) => {
  if (error.response?.status == 401) {
    const isExpiredToken = !!localStorage.getItem(
      localStorageKeys.ACCESS_TOKEN
    );
    userService.signout();
    if (isExpiredToken) {
      emitter.emit(emitterEvents.EXPIRED_TOKEN);
      // setTimeout(() => {
      //   window.location.reload();
      //   message.error('Expired token! Please login and try again.')
      // }, 500);
    } else {
      emitter.emit(emitterEvents.EXECUTE_REQUIRE_LOGIN_ACTION);
    }
  }
  return Promise.reject(error);
};
