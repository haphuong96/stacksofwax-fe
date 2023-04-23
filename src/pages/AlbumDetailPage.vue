<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import router from "../router";
import { service } from "../services";

const { albumService, navigationService } = service;

const albumId = router.currentRoute.value.params.id.split("-")[0];

const albumDetails = ref();

const comments = ref([]);
const totalAlbumComments = ref(0);

const albumStats = ref(new Map());

const albumCollections = ref([]);
const totalAlbumCollections = ref();

const isLoading = ref(false);

// Interact vars
const userRating = ref(0);

const AddToCollectionVisible = ref(false);

const submitting = ref(false);
const draftCommentAlbum = ref();

async function submitCommentAlbum() {
  if (!draftCommentAlbum.value) {
    return;
  }

  submitting.value = true;
  try {
    await albumService.postCommentAlbum(albumId, draftCommentAlbum.value);

    // const postCmt = await axiosIntance.post(
    //   `collections/${collectionId}/comments`,
    //   {
    //     comment: draftCommentAlbum.value
    //   }
    // );

    fetchAlbumComments();

    draftCommentAlbum.value = "";
  } catch (error) {
    message.error("error posting comment")
  } finally {
    submitting.value = false;
  }
}

async function fetchAlbumComments() {
  try {
    const data = await albumService.getCommentAlbum(albumId);
    console.log(data);
    comments.value = data.comments;
    totalAlbumComments.value = data.total;

  } catch (error) {
    console.log(error)
    message.error("error loading comments")
  }
}

function showAddToCollectionModal() {
  AddToCollectionVisible.value = true;
}

onMounted(async () => {
  fetchAlbumDetail();
  fetchCollectionsByAlbum();
});

async function fetchCollectionsByAlbum(page, pageSize) {
  try {
    const { total, collections} = await albumService.getCollectionsByAlbum(
      page,
      pageSize,
      albumId
    );

    totalAlbumCollections.value = total;
    albumCollections.value = collections;

    albumStats.value.set("Collections", totalAlbumCollections.value || 0);
  } catch (error) {
    message.error("Erorr retrieving collections");
  }
}

async function fetchAlbumDetail() {
  isLoading.value = true;
  try {
    const data = await albumService.getAlbumDetail(albumId);

    albumDetails.value = data;
    console.log(albumDetails.value);

    // albumTracks.value = res.data.tracks;
    comments.value = data.comments;

    albumStats.value.set("AVG Rating", data.average_rating || 0 + " / 5");
    albumStats.value.set("Total ratings", data.total_ratings || 0);

  } catch (error) {
    console.log(error);
    message.error("Cannot load album detail");
  } finally {
    isLoading.value = false;
  }
}

const listGenres = computed(() => {
  if (!albumDetails.value?.genres?.length) return "";
  return albumDetails.value?.genres
    .map((genre) => {
      return `${genre.genre_name}`;
    })
    .join(", ");
});

const listArtists = computed(() => {
  if (!albumDetails.value?.artists?.length) return "";
  return albumDetails.value?.artists
    .map((artist) => {
      const artistDetailUrl = `${import.meta.env.VITE_BASE_URL}/artists/${
        artist.artist_id
      }`;
      return `<a href="${artistDetailUrl}">${artist.artist_name}</a>`;
    })
    .join(", ");
});

const listRecordLabels = computed(() => {
  if (!albumDetails.value?.record_labels?.length) return "";
  return albumDetails.value?.record_labels
    .map((recordLabel) => {
      return `${recordLabel.company_name}`;
    })
    .join(", ");
});
</script>

<template>
  <a-spin tip="Loading..." :spinning="isLoading" class="m-16 p-16">
    <a-row class="m-16" v-if="albumDetails">
      <a-col :span="16">
        <a-row>
          <a-col :span="6">
            <a-image
              :src="albumDetails.img_path"
              :width="200"
              :height="200"
              class="album-img"
            />
          </a-col>
          <a-col :span="18" class="mt-16 album-details">
            <div>Album</div>
            <h1>
              {{ albumDetails.album_title }}
            </h1>

            <a-descriptions :column="1">
              <a-descriptions-item label="Artist">
                <div v-html="listArtists"></div>
              </a-descriptions-item>
              <a-descriptions-item label="Record Label">
                <div v-html="listRecordLabels"></div>
              </a-descriptions-item>
              <a-descriptions-item label="Genre">
                <div v-html="listGenres"></div>
              </a-descriptions-item>
              <a-descriptions-item label="Release Year">
                {{ albumDetails.release_year }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-row>
        <a-row class="d-flex v-flex">
          <h1 class="my-16">Tracklist</h1>
          <a-list size="small" bordered :data-source="albumDetails.tracks">
            <template #renderItem="{ item }">
              <a-list-item>{{ item.track_title }}</a-list-item>
            </template>
          </a-list>
        </a-row>
        <a-row class="d-flex v-flex">
          <h1 class="my-16">Reviews</h1>
          <a-list
            v-if="comments?.length"
            :data-source="comments"
            :header="`${comments.length} ${
              comments.length > 1 ? 'replies' : 'reply'
            }`"
            item-layout="horizontal"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-comment
                  :author="item.username"
                  :avatar="item.avatar"
                  :content="item.comment"
                  :datetime="item.created_datetime"
                />
              </a-list-item>
            </template>
          </a-list>
          <a-comment>
            <template #avatar>
              <a-avatar
                src="https://joeschmoe.io/api/v1/random"
                alt="Han Solo"
              />
            </template>
            <template #content>
              <a-form-item>
                <a-textarea v-model:value="draftCommentAlbum" :rows="4" />
              </a-form-item>
              <a-form-item>
                <a-button
                  html-type="submit"
                  :loading="submitting"
                  type="primary"
                  @click="submitCommentAlbum"
                >
                  Add Comment
                </a-button>
              </a-form-item>
            </template>
          </a-comment>
        </a-row>
      </a-col>
      <a-col :span="8" class="pl-16">
        <a-divider orientation="left" orientation-margin="0px">
          Rate This Album
        </a-divider>
        <a-rate v-model:value="userRating" />
        <a-divider orientation="left" orientation-margin="0px">
          Statistics
        </a-divider>
        <a-descriptions :column="2">
          <!-- "{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }" -->
          <a-descriptions-item
            v-for="(item, index) in albumStats.keys()"
            :key="index"
            :label="item"
          >
            {{ albumStats.get(item) }}
          </a-descriptions-item>
        </a-descriptions>
        <a-divider orientation="left" orientation-margin="0px">
          Collections
          <a-button type="link" @click="showAddToCollectionModal"
            >Add to collection</a-button
          >
          <a-modal
            v-model:visible="AddToCollectionVisible"
            title="Add To Collection"
            :maskClosable="false"
            :footer="null"
          >
          </a-modal>
        </a-divider>
        <a-list
          size="small"
          :data-source="albumCollections"
          item-layout="horizontal"
          class="collection-list"
          v-if="albumCollections"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <span class="collection-name"
                ><a
                  @click="
                    navigationService.goToCollectionDetail(item.collection_id)
                  "

                  >{{ item.collection_name }}</a
                ></span
              >
              |
              <span class="collection-created-by">
                By
                <a @click="navigationService.goToUserDetail(item.created_by)">{{
                  item.username
                }}</a></span
              ></a-list-item
            >
          </template>
        </a-list>
        <!-- <a-pagination
          v-model:current="current"
          :total="total"
          show-less-items
          @change="
            (page, pageSize) =>
              albumService.getCollectionsByAlbum(page, pageSize)
          "
        /> -->
      </a-col>
    </a-row>
  </a-spin>
</template>

<style scoped>
/* .collection-name {
  font-weight: 500;
} */
.collection-created-by {
  color: #00000073
}
.collection-list a {
  color: inherit;
}

.collection-list a:hover {
  color: #1890ff;
}

.collection-list .ant-list-item {
  padding: 5px 0px;
  padding-top: 0px;
  border-bottom: none;
}

.album-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.album-details :deep(.ant-descriptions-item-label) {
  width: 20%;
}

.album-details :deep(.ant-descriptions-item) {
  padding-bottom: 0px;
}
</style>
