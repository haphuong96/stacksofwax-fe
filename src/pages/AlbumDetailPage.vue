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

async function fetchAlbumDetail() {
  isLoading.value = true;
  try {
    const res = await axios.get(`http://localhost:4000/api/albums/${albumId}`);
    albumDetailTitle.value.albumTitle = res.data.album_title;
    albumDetailTitle.value.albumArtist = [{
      "artist_id": 1,
      "artist_name": "Pink Floyd"
    },
    {
      "artist_id": 2,
      "artist_name": "BlackPink"
    }
    ];
    // res.data.artists;
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

    albumStats.value.set("Average Rating", res.data.average_rating);
    albumStats.value.set("Number of Ratings", res.data.total_ratings);
    albumStats.value.set("Total in Collections", res.data.total_collected);

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

            <!-- <a-row v-for="(item, index) in albumGeneralInfo.keys()" :key="index">
                    <a-col> {{ item }}: </a-col>
                    <a-col> {{ albumGeneralInfo.get(item) }} </a-col>
                  </a-row> -->

            <div class="album-description-container">
              <span class="album-description-label">Record Labels:</span>
              <span class="album-description-value" v-for="(item, index) in albumGeneralInfo.recordLabels" :key="index">
                {{ (index > 0) ? ", " : "" }}
                {{ item.company_name }}
              </span>
            </div>

            <div class="album-description-container">
              <span class="album-description-label">Genre:</span>
              <span class="album-description-value" v-for="(item, index) in albumGeneralInfo.genres" :key="index">
                {{ (index > 0) ? ", " : "" }}
                {{ item.genre_name }}
              </span>
            </div>
            <div class="album-description-container">
              <span class="album-description-label">Release Year:</span>
              <span class="album-description-value">{{ albumGeneralInfo.release_year }}</span>
            </div>
            <div class="album-description-container">
              <span class="album-description-label">Country:</span>
              <span class="album-description-value"> {{ albumGeneralInfo.country }}</span>
            </div>
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
      <a-col :span="8"> Rating layout </a-col>
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
  width: 120px;
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
</style>
