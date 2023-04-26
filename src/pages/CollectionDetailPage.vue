<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import router from "../router";
import { localStorageKeys } from "../common/local-storage-keys";
import { HeartOutlined, HeartFilled } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LikeButton from "../components/LikeButton.vue";
import { collectionService } from "../services/collection.service";

dayjs.extend(relativeTime);

const userAvatar = localStorage.getItem(localStorageKeys.USER_AVATAR);

const comments = ref([]);
const totalComments = ref();

const submitting = ref(false);
const draftComment = ref("");

const collectionId = router.currentRoute.value.params.id.split("-")[0];

const albumsData = ref();
const totalAlbums = ref();

const collectionData = ref();
const isLiked = ref(false);

onMounted(async () => {
  fetchCollectionDetailById();
  fetchCollectionAlbumById();
  checkUserLikedCollection();
  fetchCollectionComments();
});

async function postComment() {
  if (!draftComment.value) {
    return;
  }

  submitting.value = true;
  try {
    await collectionService.addCollectionComment(
      collectionId,
      draftComment.value
    );

    fetchCollectionComments();

    draftComment.value = "";
  } catch (error) {
  } finally {
    submitting.value = false;
  }
}

async function fetchCollectionComments() {
  try {
    const data = await collectionService.getCollectionComment(collectionId);
    comments.value = data.comments;
    totalComments.value = data.total;
  } catch (error) {
    message.error("Error fetching collection comments");
  }
}

async function checkUserLikedCollection() {
  try {
    const { is_liked } = await collectionService.checkUserLikedCollection(
      collectionId
    );

    isLiked.value = is_liked;
    console.log(isLiked.value);
  } catch (error) {
    isLiked.value = false;
  }
}

async function fetchCollectionDetailById() {
  const data = await collectionService.getCollectionDetail(collectionId);

  collectionData.value = data;
}

async function fetchCollectionAlbumById() {
  const { total, albums } = await collectionService.getCollectionAlbums(
    collectionId
  );

  albumsData.value = albums;
  totalAlbums.value = total;
}

async function toggleLikeCollection() {
  if (isLiked.value) {
    await collectionService.unlikeCollection(collectionId);
  } else {
    await collectionService.likeCollection(collectionId);
  }

  checkUserLikedCollection();
}
</script>

<template>
  <a-row class="m-16 p-16 collection-detail-page-container">
    <a-col :span="24">
      <a-row v-if="collectionData">
        <a-col :span="4">
          <a-image
            :width="200"
            src="https://static-cse.canva.com/blob/1035320/1600w-fxYFTKLArdY.jpg"
          />
        </a-col>
        <a-col class="mt-16">
          <div>Collection</div>
          <h1>{{ collectionData.collection_name }}</h1>
          <div>By {{ collectionData.username }}</div>
        </a-col>
        <a-col>
          <a-button @click="toggleLikeCollection">
            <LikeButton
              @click="toggleLikeCollection"
              :like="isLiked"
            ></LikeButton>
            Like</a-button
          >
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <h1>Description</h1>
        </a-col>
      </a-row>
      <a-row
        ><a-col :span="24">
          <h1 class="my-16">Album List</h1>
          <a-pagination
            v-model:current="current"
            :total="totalAlbums"
            show-less-items
          />
          <a-list bordered :data-source="albumsData">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    {{ item.album_title }}
                  </template>
                  <template #avatar>
                    <img :src="item.img_path" class="w-50" />
                  </template>
                  <template #description>
                    {{
                      item.artists
                        .map((artist) => artist.artist_name)
                        .join(", ")
                    }}
                    • {{ item.release_year }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <h1 class="my-16">Reviews</h1>
          <a-list
            v-if="comments.length"
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
                  :avatar="item.user_avatar"
                  :content="item.comment"
                  :datetime="dayjs(item.created_datetime).fromNow()"
                />
              </a-list-item>
            </template>
          </a-list>
          <a-comment>
            <template #avatar>
              <a-avatar :src="userAvatar" alt="Han Solo" />
            </template>
            <template #content>
              <a-form-item>
                <a-textarea
                  v-model:value="draftComment"
                  :rows="4"
                  placeholder="Enter your comment"
                />
              </a-form-item>
              <a-form-item>
                <a-button
                  html-type="submit"
                  :loading="submitting"
                  type="primary"
                  @click="postComment"
                >
                  Add Comment
                </a-button>
              </a-form-item>
            </template>
          </a-comment>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped>
.w-50 {
  width: 50px;
}

.collection-detail-page-container {
  height: calc(100vh - 72px);
  overflow: scroll;
}
</style>
