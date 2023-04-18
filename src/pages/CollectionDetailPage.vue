<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
import { localStorageKeys } from "../common/local-storage-keys";
import { axiosIntance } from "../services/base.service";
import {
  HeartTwoTone,
  getTwoToneColor,
  setTwoToneColor
} from "@ant-design/icons-vue";

const collectionId = router.currentRoute.value.params.id.split("-")[0];

const username = localStorage.getItem(localStorageKeys.USERNAME);
const userId = localStorage.getItem(localStorageKeys.USER_ID);

const albumsData = ref();
const collectionData = ref();
const createdByData = ref();

onMounted(async () => {
  fetchCollectionDetailById();
  fetchCollectionAlbumById();
});

async function fetchCollectionDetailById() {
  const res = await axiosIntance.get(`collections/${collectionId}`, {
    params: {
      operationName: "fetchCollectionDetails"
    }
  });
  const { user_id, username, ...collection } = res.data;

  collectionData.value = collection;
  console.log(collectionData.value);
  createdByData.value = {
    user_id,
    username
  };

  editCollectionName.value = cloneDeep(collection.collection_name);
  editCollectionDesc.value = cloneDeep(collection.collection_desc);
}

async function fetchCollectionAlbumById() {
  const res = await axiosIntance.get(`collections/${collectionId}`, {
    params: {
      operationName: "fetchCollectionAlbums"
    }
  });
  albumsData.value = res.data;
}

async function fetchCollectionById() {
  const res = await axiosIntance.get(`collections/${collectionId}`);
  const { albums, created_by, ...collection } = res.data;
  albumsData.value = albums;
  collectionData.value = collection;
  createdByData.value = created_by;
  console.log(createdByData.value);
}
</script>

<template>
  <a-row class="m-16 p-16">
    <a-col :span="24">
      <a-row v-if="collectionData && createdByData">
        <a-col :span="4">
          <a-image
            :width="200"
            src="https://static-cse.canva.com/blob/1035320/1600w-fxYFTKLArdY.jpg"
          />
        </a-col>
        <a-col>
          <div>Collection</div>
          <h1>{{ collectionData.collection_name }}</h1>
          <div>By {{ createdByData.username }}</div>
        </a-col>
        <a-col>
          <a-button><heart-two-tone /> Favorite</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <h1>Description</h1>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped></style>
