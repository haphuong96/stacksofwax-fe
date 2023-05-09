<script setup>
import { onMounted, ref } from "vue";
import router from "../router";
import { axiosIntance } from "../services/base.service";
import CircleImage from "../components/CircleImage.vue";
import { navigationService } from "../services/navigation.service";
import { routeNames } from "../router/route-names";

const artistId = router.currentRoute.value.params.id.split("-")[0];

const artistData = ref();
const albumsData = ref();

onMounted(async () => {
  await fetchArtistDetails();
  router.replace({
    name: routeNames.ARTIST_DETAILS,
    params: {
      id: `${artistId}-${artistData.value.artistName?.replaceAll(" ", "-")}`
    }
  });
});

async function fetchArtistDetails() {
  const res = await axiosIntance.get(`artists/${artistId}`);

  const { albums, ...details } = res.data;
  artistData.value = details;
  albumsData.value = albums;
}
</script>

<template>
  <a-row class="m-16 p-16">
    <a-col :span="24">
      <a-row v-if="artistData">
        <a-col :span="4" class="d-flex align-center pr-16">
          <CircleImage
            :size="200"
            :failed-image="fallbackImage"
            :src="artistData.imgPath"
          ></CircleImage>
        </a-col>
        <a-col :span="20" class="mt-16">
          <div>Artist</div>
          <h1>{{ artistData.artistName }}</h1>
          <div>{{ artistData.artistDescription }}</div>
        </a-col>
      </a-row>
      <a-row v-if="albumsData">
        <a-col :span="24">
          <h1 class="my-16">Album List</h1>
          <a-list bordered :data-source="albumsData">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #avatar>
                    <a
                      @click="
                        navigationService.goToAlbumDetailPage(item.albumId)
                      "
                    >
                      <img :src="item.imgPath" class="w-50"
                    /></a>
                  </template>
                  <template #title>
                    <a
                      @click="
                        navigationService.goToAlbumDetailPage(item.albumId)
                      "
                      >{{ item.albumTitle }}
                    </a>
                  </template>
                  <template #description>
                    {{ item.releaseYear }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped>
.w-50 {
  width: 50px;
}
</style>
