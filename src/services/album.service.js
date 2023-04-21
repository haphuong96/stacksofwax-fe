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
        filterParams.append("genreId", genre.id);
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
    console.log(res);
    const { total, albums } = res.data;
    // console.log('total ' +total)
    return {
      total,
      albums
    }

  } catch (Error) {
    message.error("Error retrieving list of albums");
  }
}

export const albumService = {
  getAlbumFilter,
  getAlbums
};
