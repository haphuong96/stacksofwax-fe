<script setup>
import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import userFallbackAvatar from "../assets/user-fallback.png";
import { localStorageKeys } from "../common/local-storage-keys";
import router from "../router";
import { service } from "../services";
import { collectionService } from "../services/collection.service";
import { meService } from "../services/me.service";
import { formatFromNow } from "../utils/datetime.helper";
import { routeNames } from "../router/route-names";

const { albumService, navigationService } = service;

const albumId = router.currentRoute.value.params.id.split("-")[0];
const userAvatar = localStorage.getItem(localStorageKeys.USER_AVATAR);

const albumDetails = ref();

const albumStats = ref(new Map());

const isLoading = ref(false);

// Interact vars
const userRating = ref(0);

const AddToCollectionVisible = ref(false);

const submitting = ref(false);
const draftCommentAlbum = ref();
const isRated = ref(false);

// comments
const comments = ref([]);
const totalAlbumComments = ref(0);
async function fetchAlbumComments(page, pageSize) {
  try {
    const data = await albumService.getCommentAlbum(albumId, page, pageSize);

    comments.value = data.comments.map((comment) => {
      const commentTime = comment?.created_datetime
        ? formatFromNow(comment?.created_datetime)
        : "";
      return { ...comment, created_datetime: commentTime };
    });
    totalAlbumComments.value = data.total;
  } catch (error) {
    message.error("error loading comments");
  }
}

async function submitCommentAlbum() {
  if (!draftCommentAlbum.value) {
    return;
  }

  submitting.value = true;
  try {
    await albumService.postCommentAlbum(albumId, draftCommentAlbum.value);

    await fetchAlbumComments();

    draftCommentAlbum.value = "";
  } catch (error) {
    message.error("error posting comment");
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  await Promise.all([
    fetchAlbumDetail(),
    getUserRating(),
    fetchCollectionsByAlbum(),
    fetchAlbumComments()
  ]);
  router.replace({
    name: routeNames.ALBUM_DETAILS,
    params: {
      id: `${albumId}-${albumDetails.value.album_title?.replaceAll(" ", "-")}`
    }
  });
});

const albumCollections = ref([]);
const totalAlbumCollections = ref();
const pageSizeCollection = ref(20);
async function fetchCollectionsByAlbum(page, pageSize) {
  try {
    const { total, collections } = await albumService.getCollectionsByAlbum(
      page,
      pageSizeCollection.value,
      albumId
    );

    totalAlbumCollections.value = total;
    albumCollections.value = collections;

    albumStats.value.set("Total collections", totalAlbumCollections.value || 0);
  } catch (error) {
    message.error("Erorr retrieving collections");
  }
}

async function fetchAlbumDetail() {
  isLoading.value = true;
  try {
    const data = await albumService.getAlbumDetail(albumId);

    albumDetails.value = data;

    albumStats.value.set("AVG Rating", `${data.average_rating || 0} / 5`);
    albumStats.value.set("Total ratings", data.total_ratings || 0);
  } catch (error) {
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

async function onRate() {
  try {
    const isSuccess = await service.albumService.rateAlbum(
      albumId,
      userRating.value
    );
    if (isSuccess) {
      isRated.value = true;
      await fetchAlbumDetail();
      message.success("Rate album successfully!");
    } else {
      userRating.value = 0;
      message.error("Rate album failed!");
    }
  } catch (error) {
    message.error("Rate album failed!");
  }
}

async function unrateAlbum() {
  try {
    const isSuccess = await service.albumService.unrateAlbum(albumId);
    if (isSuccess) {
      isRated.value = false;
      await fetchAlbumDetail();
      message.success("Unrate album successfully!");
      userRating.value = 0;
    } else {
      message.error("Unrate album failed!");
    }
  } catch (error) {
    message.error("Unrate album failed!");
  }
}

async function getUserRating() {
  if (!localStorage.getItem(localStorageKeys.ACCESS_TOKEN)) return;
  const rating = await service.albumService.getUserRatingAlbum(albumId);
  if (rating) {
    userRating.value = rating;
    isRated.value = true;
  }
}

// Add To Collection
const myCollections = ref();
const totalMyCollections = ref();
const searchMyCollectionKeyword = ref();

async function fetchMyCollections(page, pageSize) {
  try {
    const { total, collections } = await meService.getMyCollections(
      searchMyCollectionKeyword.value,
      page,
      pageSize
    );
    myCollections.value = collections;
    totalMyCollections.value = total;
    return true;
  } catch (error) {
    message.error = "Error loading my collections";
    return false;
  }
}

async function addToMyCollection(collectionId) {
  try {
    await collectionService.addCollectionAlbum(collectionId, albumId);
    message.success(`Added To Collection`);
    fetchCollectionsByAlbum();
  } catch (error) {
    message.error("Error adding to my collection");
  }
}

async function addToMyNewCollection() {
  try {
    const data = await collectionService.createCollection();
    await addToMyCollection(data.collection_id);
  } catch (error) {
    message.error("Error adding to my new collection");
  }
}

async function showAddToCollectionModal() {
  const fetchSuccess = await fetchMyCollections();
  if (fetchSuccess) {
    AddToCollectionVisible.value = true;
  }
}
</script>

<template>
  <a-spin tip="Loading..." :spinning="isLoading" class="m-16 p-16">
    <a-row class="p-32" v-if="albumDetails">
      <a-col :span="16">
        <a-row>
          <a-col :span="6" class="d-flex align-center pr-16">
            <a-image
              :src="albumDetails.img_path"
              :style = "{'max-width': '200px'}"
            />
          </a-col>
          <a-col :span="18" class="mt-16 album-details">
            <div class="d-flex justify-between">
              <div>Album</div>
              <div class="mr-16">
                <a-rate v-model:value="userRating" @change="onRate" :allowClear="false" />
                <CloseCircleFilled
                  class="ml-8 unrate-button"
                  @click="unrateAlbum"
                  v-if="isRated"
                ></CloseCircleFilled>
              </div>
            </div>
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
          <a-comment>
            <template #avatar>
              <a-avatar :src="userAvatar || userFallbackAvatar" />
            </template>
            <template #content>
              <a-form-item>
                <a-textarea
                  v-model:value="draftCommentAlbum"
                  :rows="4"
                  placeholder="Enter your comment"
                />
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
          <a-list
            v-if="comments?.length"
            :data-source="comments"
            :header="`${totalAlbumComments} ${
              totalAlbumComments > 1 ? 'comments' : 'comment'
            }`"
            item-layout="horizontal"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-comment
                  :content="item.comment"
                  :datetime="item.created_datetime"
                >
                  <template #author>
                    <a @click="navigationService.goToUserDetail(item.user_id)">
                      {{ item.username }}</a
                    >
                  </template>
                  <template #avatar>
                    <a @click="navigationService.goToUserDetail(item.user_id)">
                      <a-avatar :src="item.user_avatar || userFallbackAvatar" />
                    </a>
                  </template>
                </a-comment>
              </a-list-item>
            </template>
            <template #footer>
              <a-pagination
                size="small"
                :total="totalAlbumComments"
                show-size-changer
                @change="fetchAlbumComments"
              />
            </template>
          </a-list>
        </a-row>
      </a-col>
      <a-col :span="8" class="pl-16">
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
            title="Add To Your Collection"
            :maskClosable="false"
            :footer="null"
          >
            <div class="d-flex justify-between mb-16">
              <a-input-search
                v-model:value="searchMyCollectionKeyword"
                placeholder="Search your collection"
                style="width: 250px"
                @search="() => fetchMyCollections()"
              />
              <a-pagination
                size="small"
                v-model:current="current"
                :total="totalMyCollections"
                show-less-items
                @change="(page, pageSize) => fetchMyCollections(page, pageSize)"
              />
            </div>
            <a-list
              size="small"
              bordered
              :data-source="myCollections"
              item-layout="horizontal"
              v-if="myCollections"
            >
              <template #renderItem="{ item }">
                <a-list-item
                  ><a @click="addToMyCollection(item.collection_id)">
                    {{ item.collection_name }}</a
                  >
                </a-list-item>
              </template>
              <template #header>
                <div>
                  <a @click="addToMyNewCollection"
                    ><b>
                      <PlusCircleFilled></PlusCircleFilled> Create a new
                      collection</b
                    ></a
                  >
                </div>
              </template>
            </a-list>
          </a-modal>
        </a-divider>
        <a-list
          :data-source="albumCollections"
          item-layout="horizontal"
          class="collection-list"
          v-if="albumCollections.length"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <div class="my-4">
                <span class="collection-name"
                  ><a
                    @click="
                      navigationService.goToPublicCollectionDetail(
                        item.collection_id
                      )
                    "
                    >{{ item.collection_name }}</a
                  ></span
                >

                <span class="collection-created-by">
                  by
                  <a
                    @click="navigationService.goToUserDetail(item.created_by)"
                    >{{ item.username }}</a
                  ></span
                >
              </div></a-list-item
            >
          </template>
          <template #footer>
            <a-pagination
              size="small"
              v-model:current="current"
              :pageSize="pageSizeCollection"
              :total="totalAlbumCollections"
              show-less-items
              @change="
                (page, pageSize) => fetchCollectionsByAlbum(page, pageSize)
              "
            />
          </template>
        </a-list>
      </a-col>
    </a-row>
  </a-spin>
</template>

<style scoped>
.collection-created-by {
  color: #00000073;
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

.unrate-button {
  color: gray;
  cursor: pointer;
}

.album-details :deep(.ant-descriptions-item-label) {
  width: 20%;
}

.album-details :deep(.ant-descriptions-item) {
  padding-bottom: 0px;
}

.collection-name {
  text-decoration: underline;
  /* font-weight: 500; */
}
</style>
