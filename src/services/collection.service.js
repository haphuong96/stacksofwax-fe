import { axiosIntance } from "./base.service";
import pagination from "../utils/pagination.helper";
import { message } from "ant-design-vue";

/**
 *
 * @param {number} page
 * @param {number} pageSize
 * @param {{searchKeyword: string, sortBy: string}} filters
 * @returns
 */
const getCollections = async (page, pageSize, filters) => {
  const { limit, offset } = pagination(page, pageSize);
  const { sortBy: sort, searchKeyword: search } = filters;
  try {
    const res = await axiosIntance.get(`collections`, {
      params: {
        limit,
        offset,
        sort,
        search
      }
    });

    const { total, collections } = res.data;

    return {
      total,
      collections
    };
  } catch (error) {
    message.error("Error loading collections");
  }
};

const deleteCollection = async (collectionId) => {
  try {
    await axiosIntance.delete(`collections/${collectionId}`);
  } catch (error) {
    debugger;
    message.error("Error delete collection service");
  }
};

const createCollection = async (userId) => {
  try {
    const data = await axiosIntance.post("collections", {
      user_id: userId
    });

    return data.data[0];
  } catch (error) {
    debugger
    message.error("Error creating collection");
  }
};
export const collectionService = {
  getCollections,
  deleteCollection,
  createCollection
};
