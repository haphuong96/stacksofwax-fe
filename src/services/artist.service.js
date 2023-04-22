import { axiosIntance } from "./base.service";
import pagination from "../utils/pagination.helper";

const getArtists = async (page, pageSize, searchKeyword) => {
  try {

    const { limit, offset } = pagination(page, pageSize);

    const filterParams = new URLSearchParams();

    if (searchKeyword) {
      filterParams.append("search", searchKeyword);
    }

    filterParams.append("limit", limit);
    filterParams.append("offset", offset);

    const res = await axiosIntance.get("artists", {
      params: filterParams
    });

    const { total, artists } = res.data;

    return {
        total,
        artists
    }

  } catch (error) {
    message.error("Cannot load artists");
  }
}

export const artistService = {
    getArtists
}