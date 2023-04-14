import { axiosIntance } from "./base.service";

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

export const albumService = {
  getAlbumFilter
};
