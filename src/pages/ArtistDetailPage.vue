<script setup>
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
import { localStorageKeys } from "../common/local-storage-keys";
import { axiosIntance } from "../services/base.service";

const artistId = router.currentRoute.value.params.id.split("-")[0];

const artistDetails = ref();

onMounted(async () => {
  fetchArtistDetail();
})

async function fetchArtistDetail() {
  const res = await axiosIntance.get(`artists/${artistId}`);
  console.log(res)
  artistDetails.value = res.data;
}
</script>

<template>
  <a-row class="m-16 p-16">
    <a-col :span="24">
      <a-row v-if="artistDetails">
        <a-col :span="4">
          <a-image
            :width="200"
            :src="artistDetails.img_path"
          />
        </a-col>
        <a-col>
          <div>Artist</div>
          <h1>{{ artistDetails.artist_name }}</h1>
          <div>{{ artistDetails.artist_description }}</div>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped></style>
