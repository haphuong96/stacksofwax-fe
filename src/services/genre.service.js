import { axiosIntance } from "./base.service";

const getGenreList = async () => {
  try {
    const res = await axiosIntance.get("genres");
    const genres = res.data.map((genre) => ({
      label: genre.genre_name,
      value: genre.id
    }));
    return genres;
  } catch (error) {
    return [];
  }
};

export const genreService = {
  getGenreList
};
