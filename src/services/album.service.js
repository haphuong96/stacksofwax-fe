import { axiosIntance } from "./base.service";
import pagination from "../utils/pagination.helper";
import { message } from "ant-design-vue";

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
 * @param {{genres: string[], decade: string, searchKeyword: string}} filters
 */
const getAlbums = async (page, pageSize, filters) => {
  try {
    const { limit, offset } = pagination(page, pageSize);

    const filterParams = new URLSearchParams();
    if (filters?.genres?.length) {
      filters.genres.forEach((genre) => {
        filterParams.append("genreId", genre);
      });
    }

    if (filters?.decade) {
      filterParams.append("decade", filters.decade);
    }

    if (filters?.searchKeyword) {
      filterParams.append("search", filters.searchKeyword);
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

    const res = await axiosIntance.get(
      `albums/${albumId}/comments`,
      {
        params: {
          limit,
          offset
        }
      }
    );

    const { total, comments } = res.data;

    return {
      total,
      comments
    };
  } catch (error) {
    console.log(error)
    message.error("error loading comments");
  }
};

export const albumService = {
  getAlbumFilter,
  getAlbums,
  getCollectionsByAlbum,
  getAlbumDetail,
  postCommentAlbum,
  getCommentAlbum
};
