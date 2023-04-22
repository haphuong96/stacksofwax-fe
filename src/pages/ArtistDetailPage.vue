<script setup>
import { onMounted, ref } from "vue";
import router from "../router";
import { axiosIntance } from "../services/base.service";

const artistId = router.currentRoute.value.params.id.split("-")[0];

const artistData = ref();
const albumsData = ref();

onMounted(async () => {
  fetchArtistDetails();
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
        <a-col :span="4">
          <a-image :width="200" :src="artistData.img_path" />
        </a-col>
        <a-col>
          <div>Artist</div>
          <h1>{{ artistData.artist_name }}</h1>
          <div>{{ artistData.artist_description }}</div>
        </a-col>
      </a-row>
      <a-row v-if="albumsData">
        <a-col :span="24">
          <h1>Album List</h1>
          <a-list bordered :data-source="albumsData">
            <template #renderItem="{ item }">
              <a-list-item>{{ item.album_title }} </a-list-item>
            </template>
          </a-list>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped></style>
