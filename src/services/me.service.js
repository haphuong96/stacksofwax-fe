import { axiosIntance } from "./base.service";
import pagination from "../utils/pagination.helper";
import { message } from "ant-design-vue";

const getMyCollections = async (page, pageSize) => {
  const { limit, offset } = pagination(page, pageSize);
  // const {sortBy : sort, searchKeyword : search} = filters;
  try {
    const res = await axiosIntance.get(`me/collections`, {
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
    message.error("Error loading my collections");
  }
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
    }
  } catch (error) {
    message.error("Error loading my favorite collections");
  }
};

export const meService = {
  getMyCollections,
  getMyFavoriteCollections
};
