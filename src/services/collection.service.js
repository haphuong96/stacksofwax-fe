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

const getCollectionAlbums = async (
  page,
  pageSize,
  collectionId,
  searchKeyword
) => {
  try {
    const { limit, offset } = pagination(page, pageSize);

    const res = await axiosIntance.get(`collections/${collectionId}/albums`, {
      params: {
        limit,
        offset,
        search: searchKeyword
      }
    });

    const { total, albums } = res.data;

    return {
      total,
      albums
    };
  } catch (error) {
    message.error("Error loading collection albums");
  }
};

const deleteCollection = async (collectionId) => {
  try {
    await axiosIntance.delete(`collections/${collectionId}`);
  } catch (error) {
    message.error("Error delete collection service");
  }
};

const createCollection = async () => {
  try {
    const res = await axiosIntance.post("collections");

    const collectionDetails = res.data;
    return collectionDetails;
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

const addCollectionComment = async (collectionId, comment) => {
  try {
    await axiosIntance.post(`collections/${collectionId}/comments`, {
      comment: comment
    });
  } catch (error) {
    message.error("Error posting comment");
  }
};

const getCollectionComment = async (collectionId, page, pageSize) => {
  const { limit, offset } = pagination(page, pageSize);

  try {
    const res = await axiosIntance.get(`collections/${collectionId}/comments`, {
      params: { limit, offset }
    });

    const { total, comments } = res.data;

    return {
      total,
      comments
    };
  } catch (error) {
    message.error("Error loading comments");
  }
};

const checkUserLikedCollection = async (collectionId) => {
  try {
    const res = await axiosIntance.get(
      `collections/${collectionId}/like/check`
    );

    const isLiked = res.data;

    return isLiked;
  } catch (error) {
    
  }
};

const likeCollection = async (collectionId) => {
  try {
    await axiosIntance.post(`collections/${collectionId}/like/post`);
  } catch (error) {
    message.error("Error post like collection");
  }
};

const unlikeCollection = async (collectionId) => {
  try {
    await axiosIntance.delete(`collections/${collectionId}/like/delete`);
  } catch (error) {
    message.error("Error delete like collection");
  }
};

export const collectionService = {
  getCollections,
  getCollectionDetail,
  getCollectionAlbums,
  deleteCollection,
  createCollection,
  updateCollection,
  addCollectionAlbum,
  deleteCollectionAlbum,
  addCollectionComment,
  getCollectionComment,
  checkUserLikedCollection,
  likeCollection,
  unlikeCollection
};
