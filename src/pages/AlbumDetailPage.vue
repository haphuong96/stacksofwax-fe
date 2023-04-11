<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";
import router from "../router";

const albumId = router.currentRoute.value.params.id.split("-")[0];
const albumDetails = ref();
const isLoading = ref(false);

async function fetchAlbumDetail() {
  isLoading.value = true;
  try {
    const res = await axios.get(`http://localhost:4000/api/albums/${albumId}`);
    albumDetails.value = res.data[0];
  } catch (error) {
    message.error("Cannot load album detail");
  } finally {
    isLoading.value = false;
  }
}

fetchAlbumDetail();
</script>

<template>
  <a-spin tip="Loading..." :spinning="isLoading" class="m-16 p-16">
    <a-row v-if="albumDetails">
      <a-col :span="4">
        <a-image
          src="https://static-cse.canva.com/blob/1035320/1600w-fxYFTKLArdY.jpg"
          :width="200"
          :height="200"
          class="album-img m-16"
        />
      </a-col>
      <a-col :span="16" v-if="albumDetails">
        <a-descriptions title="Album Info">
          <a-descriptions-item label="UserName"
            >Zhou Maomao</a-descriptions-item
          >
          <a-descriptions-item label="Telephone"
            >1810000000</a-descriptions-item
          >
          <a-descriptions-item label="Live"
            >Hangzhou, Zhejiang</a-descriptions-item
          >
          <a-descriptions-item label="Remark">empty</a-descriptions-item>
          <a-descriptions-item label="Address">
            No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
          </a-descriptions-item>
        </a-descriptions>
      </a-col>
      <a-col :span="4"> Rating layout </a-col>
    </a-row>
    <a-row v-if="albumDetails">
      <a-col :span="4"></a-col>
      <a-col :span="20">Col 24</a-col>
    </a-row>
  </a-spin>
</template>

<style scoped>
.album-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  background-color: red;
}
</style>
