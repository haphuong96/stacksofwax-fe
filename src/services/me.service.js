import { axiosIntance } from "./base.service";
import pagination from "../utils/pagination.helper";
import { message } from "ant-design-vue";

const getMyCollections = async (searchKeyword, page, pageSize) => {
  const { limit, offset } = pagination(page, pageSize);

  const res = await axiosIntance.get(`me/collections`, {
    params: {
      limit,
      offset,
      search: searchKeyword
    }
  });

  const { total, collections } = res.data;

  return {
    total,
    collections
  };
};

const getMyFavoriteCollections = async (page, pageSize) => {
  const { limit, offset } = pagination(page, pageSize);

  try {
    const res = await axiosIntance.get(`me/favorite-collections`, {
      params: {
        limit,
        offset
      }
    });

    const { total, collections } = res.data;

    return {
      total,
      collections
    };
  } catch (error) {
    message.error("Error loading my favorite collections");
  }
};

export const meService = {
  getMyCollections,
  getMyFavoriteCollections
};
