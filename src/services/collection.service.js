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

const getCollectionDetail = async (collectionId) => {
  try {
    const res = await axiosIntance.get(`collections/${collectionId}/details`);

    const details = res.data;

    return details;
  } catch (error) {
    message.error("Error loading collection detail");
  }
};

const getCollectionAlbums = async (collectionId, page, pageSize) => {
  try {
    const { limit, offset } = pagination(page, pageSize);

    const res = await axiosIntance.get(`collections/${collectionId}/albums`, {
      params: {
        limit,
        offset
      }
    });

    const { total, albums } = res.data;

    return {
      total,
      albums
    };
  } catch (error) {
    messsage.error("Error loading collection albums");
  }
};

const deleteCollection = async (collectionId) => {
  try {
    await axiosIntance.delete(`collections/${collectionId}`);
  } catch (error) {
    message.error("Error delete collection service");
  }
};

const createCollection = async (userId) => {
  try {
    const data = await axiosIntance.post("collections", {
      user_id: userId
    });

    return data;
  } catch (error) {
    message.error("Error creating collection");
  }
};

const updateCollection = async (
  collectionId,
  collectionName,
  collectionDesc
) => {
  try {
    await axiosIntance.put(`collections/${collectionId}`, {
      collection_name: collectionName,
      collection_desc: collectionDesc || undefined
    });
  } catch (error) {
    message.error("Error update collection");
  }
};

const addCollectionAlbum = async (collectionId, albumId) => {
  await axiosIntance.post(`me/collections/${collectionId}/manage-album/add`, {
    album_id: albumId
  });
};

const deleteCollectionAlbum = async (collectionId, albumId) => {
  await axiosIntance.delete(
    `me/collections/${collectionId}/manage-album/delete`,
    {
      data: {
        album_id: albumId
      }
    }
  );
};
export const collectionService = {
  getCollections,
  getCollectionDetail,
  getCollectionAlbums,
  deleteCollection,
  createCollection,
  updateCollection,
  addCollectionAlbum,
  deleteCollectionAlbum
};
