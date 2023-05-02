import { axiosIntance } from "./base.service";
import pagination from "../utils/pagination.helper";
import { message } from "ant-design-vue";
import { localStorageKeys } from "../common/local-storage-keys";

const getAlbumFilter = async () => {
  try {
    const res = await axiosIntance.get("albums-filter");
    const { genres, decades } = res.data;
    return {
      genres: genres.map((genre) => {
        const { genre_name: label, id: value } = genre;
        return { label, value };
      }),
      decades: decades.map((decade) => {
        return { label: decade.decade, value: decade.decade };
      })
    };
  } catch (error) {
    return {
      genres: [],
      decades: []
    };
  }
};

/**
 *
 * @param {number} page
 * @param {number} pageSize
 * @param {{genres: string[], decade: string, searchKeyword: string, availableToAddToCollectionId: number}} filters
 */
const getAlbums = async (filters, page, pageSize) => {
  try {
    const { limit, offset } = pagination(page, pageSize);

    const filterParams = new URLSearchParams();
    
    if (filters?.searchKeyword) {
      filterParams.append("search", filters.searchKeyword);
    }

    if (filters?.genres?.length) {
      filters.genres.forEach((genre) => {
        filterParams.append("genreId", genre);
      });
    }

    if (filters?.decade) {
      filterParams.append("decade", filters.decade);
    }

    if (filters?.availableToAddToCollectionId) {
      filterParams.append("availableToAddToCollectionId", filters.availableToAddToCollectionId);
    }

    filterParams.append("limit", limit);
    filterParams.append("offset", offset);

    const res = await axiosIntance.get("/albums", {
      params: filterParams
    });

    const { total, albums } = res.data;

    return {
      total,
      albums
    };
  } catch (error) {
    message.error("Error retrieving list of albums");
  }
};

const getAlbumDetail = async (albumId) => {
  try {
    const res = await axiosIntance.get(`albums/${albumId}`);

    const details = res.data;

    return details;
  } catch (error) {
    message.error("Error loading album detail");
  }
};

const getCollectionsByAlbum = async (page, pageSize, albumId) => {
  try {
    const { limit, offset } = pagination(page, pageSize);

    const res = await axiosIntance.get(`albums/${albumId}/collections`, {
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
    message.error("Error retrieving album collections list");
  }
};

const postCommentAlbum = async (albumId, comment) => {
  try {
    await axiosIntance.post(`albums/${albumId}/comments`, {
      comment: comment
    });
  } catch (error) {
    message.error("error posting comment");
  }
};

const getCommentAlbum = async (albumId, page, pageSize) => {
  try {
    const { limit, offset } = pagination(page, pageSize);

    const res = await axiosIntance.get(`albums/${albumId}/comments`, {
      params: {
        limit,
        offset
      }
    });

    const { total, comments } = res.data;

    return {
      total,
      comments
    };
  } catch (error) {
    message.error("error loading comments");
  }
};

const rateAlbum = async (albumId, rating) => {
  try {
    await axiosIntance.post(`albums/${albumId}/rating`, { rating });
    return true;
  } catch (error) {
    return false;
  }
};

const getUserRatingAlbum = async (albumId) => {
  if (!localStorage.getItem(localStorageKeys.ACCESS_TOKEN)) return false;
  try {
    const rs = await axiosIntance.get(`albums/${albumId}/rating`);
    return rs?.data?.rating || 0;
  } catch (error) {
    return 0;
  }
};

const unrateAlbum = async (albumId) => {
  try {
    const rs = await axiosIntance.delete(`albums/${albumId}/rating`);
    return true;
  } catch (error) {
    return false;
  }
};

export const albumService = {
  getAlbumFilter,
  getAlbums,
  getCollectionsByAlbum,
  getAlbumDetail,
  postCommentAlbum,
  getCommentAlbum,
  rateAlbum,
  getUserRatingAlbum,
  unrateAlbum
};
