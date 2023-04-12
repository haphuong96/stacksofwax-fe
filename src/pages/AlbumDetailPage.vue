<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";
import router from "../router";

const albumId = router.currentRoute.value.params.id.split("-")[0];
const albumDetailTitle = ref({});
const albumGeneralInfo = ref({});
const albumTracks = ref();
const comments = ref();
const albumStats = ref(new Map());
const artistsName = ref();

const isLoading = ref(false);
const dataFetchComplete = ref(false);

// Interact vars
const userRating = ref(0);

async function fetchAlbumDetail() {
  isLoading.value = true;
  try {
    const res = await axios.get(`http://localhost:4000/api/albums/${albumId}`);
    albumDetailTitle.value.albumTitle = res.data.album_title;
    albumDetailTitle.value.albumArtist = res.data.artists;

    if (res.data.genres) {
      albumGeneralInfo.value.genres = res.data.genres;
    }

    if (res.data.release_year) {
      albumGeneralInfo.value.release_year = res.data.release_year;
    }

    if (res.data.country) {
      albumGeneralInfo.value.country = res.data.country;
    }

    if (res.data.record_labels) {
      albumGeneralInfo.value.recordLabels = res.data.record_labels;
    }

    albumTracks.value = res.data.tracks;
    comments.value = res.data.comments;

    albumStats.value.set("AVG Rating:", res.data.average_rating || 0 + " / 5");
    albumStats.value.set("Total ratings:", res.data.total_ratings || 0);
    albumStats.value.set("Collections:", res.data.total_collected || 0);

    dataFetchComplete.value = true;

  } catch (error) {
    console.log(error);
    message.error("Cannot load album detail");
  } finally {
    isLoading.value = false;
  }
}

fetchAlbumDetail();
// {{ artistsName.join(", ") }} - {{ albumDetails.album_title }}
</script>

<template>
  <a-spin tip="Loading..." :spinning="isLoading" class="m-16 p-16">
    <a-row v-if="dataFetchComplete" class="m-16">
      <a-col :span="16">
        <a-row>
          <a-col :span="8">
            <a-image src="https://static-cse.canva.com/blob/1035320/1600w-fxYFTKLArdY.jpg" :width="200" :height="200"
              class="album-img" />
          </a-col>
          <a-col :span="16">
            <h1>
              <span v-for="(item, index) in albumDetailTitle.albumArtist" :key="index">
                {{ (index > 0) ? ", " : "" }}
                <a href="#">{{ item.artist_name }}</a>
              </span>
              -
              <span>{{ albumDetailTitle.albumTitle }}</span>
            </h1>

            
            <a-descriptions :column="1"
              :labelStyle="{'background-color': 'white', 'padding': '0px 0px', 'width': '20%' }"
              :contentStyle="{ 'padding': '0px 0px' }">
              <a-descriptions-item label="Record Label" :style="{ 'padding-bottom': '0px'}"> 
                <span v-for="(item, index) in albumGeneralInfo.recordLabels" :key="index">
                  {{ (index > 0) ? ", " : "" }}
                  {{ item.company_name }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="Genre" :style="{ 'padding-bottom': '0px'}">
                <span v-for="(item, index) in albumGeneralInfo.genres" :key="index">
                  {{ (index > 0) ? ", " : "" }}
                  {{ item.genre_name }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="Release Year" :style="{ 'padding-bottom': '0px'}">
                <span>
                  {{ albumGeneralInfo.release_year }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="Country" :style="{ 'padding-bottom': '0px'}">
                <span>
                  {{ albumGeneralInfo.country }}
                </span>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-row>
        <a-row class="d-flex v-flex">
          <h1 :style="{ margin: '16px 0' }">Tracklist</h1>
          <a-list size="small" bordered :data-source="albumTracks">
            <template #renderItem="{ item }">
              <a-list-item>{{ item.track_title }}</a-list-item>
            </template>
          </a-list>
        </a-row>
        <a-row class="d-flex v-flex">
          <h1 :style="{ margin: '16px 0' }">Reviews</h1>
          <a-list v-if="comments.length" :data-source="comments"
            :header="`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`" item-layout="horizontal">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-comment :author="item.author" :avatar="item.avatar" :content="item.content"
                  :datetime="item.datetime" />
              </a-list-item>
            </template>
          </a-list>
          <a-comment>
            <template #avatar>
              <a-avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
            </template>
            <template #content>
              <a-form-item>
                <a-textarea v-model:value="value" :rows="4" />
              </a-form-item>
              <a-form-item>
                <a-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit">
                  Add Comment
                </a-button>
              </a-form-item>
            </template>
          </a-comment>
        </a-row>
      </a-col>
      <a-col :span="8">
        <a-divider orientation="left" orientation-margin="0px">
          Rate This Album
        </a-divider>
        <a-rate v-model:value="userRating" />
        <a-divider orientation="left" orientation-margin="0px">
          Statistics
        </a-divider>
        <a-descriptions :column="2">
          <!-- "{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }" -->
          <a-descriptions-item v-for="(item, index) in albumStats.keys()" :key="index" :label="item">
            {{ albumStats.get(item) }}
          </a-descriptions-item>
        </a-descriptions>
        <a-divider orientation="left" orientation-margin="0px">
          Collections
          <a-button type="link">Add to collection</a-button>
        </a-divider>
      </a-col>
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

.desc-item {
  text-align: left;
}

.left-align {
  text-align: left;
}

.album-description-container {
  width: 100%;
}

.album-description-label {
  margin-right: 20px;
  width: 100px;
  font-size: 14px;
  font-weight: 500;
}

.album-description-value {
  /* width: 70%; */
  font-size: 14px;
  font-weight: 700;
}

.v-flex {
  flex-direction: column;
}

.desc-label {
  color: red;
}
</style>
