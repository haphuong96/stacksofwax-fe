import router from "../router";
import { routeNames } from "../router/route-names";

const goToAlbumDetailPage = (albumId) => {
    router.push({ name: routeNames.ALBUM_DETAILS, params: { id: albumId } });
}

const goToArtistDetailPage = (artistId) => {
    router.push({ name: routeNames.ARTIST_DETAILS, params: { id: artistId } });
}

function goToCollectionDetail(collectionId) {
    router.push({name: routeNames.COLLECTION_DETAILS, params: {id: collectionId}});
}

function goToUserDetail(userId) {
    router.push({name: routeNames.USER_DETAIL, params: {id: userId}});
}

export const navigationService = {
    goToAlbumDetailPage,
    goToArtistDetailPage,
    goToCollectionDetail,
    goToUserDetail
};