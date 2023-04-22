import router from "../router";
import { routeNames } from "../router/route-names";

const goToAlbumDetailPage = (albumId) => {
    router.push({ name: routeNames.ALBUM_DETAILS, params: { id: albumId } });
}

const goToArtistDetailPage = (artistId) => {
    router.push({ name: routeNames.ARTIST_DETAILS, params: { id: artistId } });
}


export const navigationService = {
    goToAlbumDetailPage,
    goToArtistDetailPage
};