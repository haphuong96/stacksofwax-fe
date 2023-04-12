import axios from "axios";
import { localStorageKeys } from "../common/local-storage-keys";

export const axiosIntance = axios.create({
  baseURL: "http://localhost:4000/api",
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
    localStorage.clear();
  }
  return Promise.reject(error);
};
