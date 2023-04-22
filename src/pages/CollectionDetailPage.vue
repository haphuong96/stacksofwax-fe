<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
import { localStorageKeys } from "../common/local-storage-keys";
import { axiosIntance } from "../services/base.service";
import { HeartOutlined, HeartFilled } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// var relativeTime = require('dayjs/plugin/relativeTime')
// const dayjs = require('dayjs')
dayjs.extend(relativeTime);

const comments = ref([]);
const submitting = ref(false);
const draftComment = ref("");

const collectionId = router.currentRoute.value.params.id.split("-")[0];

const username = localStorage.getItem(localStorageKeys.USERNAME);
const userId = localStorage.getItem(localStorageKeys.USER_ID);

const albumsData = ref();
const collectionData = ref();
const createdByData = ref();
const isLiked = ref();

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
    const postCmt = await axiosIntance.post(
      `collections/${collectionId}/comment`,
      {
        comment: draftComment.value
      }
    );

    fetchCollectionComments();

    draftComment.value = "";
  } catch (error) {
  } finally {
    submitting.value = false;
  }

  // setTimeout(() => {
  //   submitting.value = false;
  //   comments.value = [
  //     {
  //       author: "Han Solo",
  //       avatar: "https://joeschmoe.io/api/v1/random",
  //       content: value.value,
  //       datetime: dayjs().fromNow()
  //     },
  //     ...comments.value
  //   ];
  //   value.value = "";
  // }, 1000);
}

async function fetchCollectionComments() {
  const res = await axiosIntance.get(`collections/${collectionId}`, {
    params: {
      operationName: `fetchCollectionComments`
    }
  });

  comments.value = res.data;
}

async function checkUserLikedCollection() {
  try {
    const res = await axiosIntance.get(
      `collections/${collectionId}/like/check`
    );

    isLiked.value = res.data.is_liked;
    console.log(isLiked.value);
  } catch (error) {
    isLiked.value = false;
  }
}

async function fetchCollectionDetailById() {
  const res = await axiosIntance.get(`collections/${collectionId}`, {
    params: {
      operationName: "fetchCollectionDetails"
    }
  });
  const { user_id, username, ...collection } = res.data;

  collectionData.value = collection;

  createdByData.value = {
    user_id,
    username
  };
}

async function fetchCollectionAlbumById() {
  const res = await axiosIntance.get(`collections/${collectionId}`, {
    params: {
      operationName: "fetchCollectionAlbums"
    }
  });
  albumsData.value = res.data;
}

async function toggleLikeCollection() {
  if (isLiked.value) {
    await axiosIntance.delete(`collections/${collectionId}/like/delete`);
  } else {
    await axiosIntance.post(`collections/${collectionId}/like/post`);
  }

  checkUserLikedCollection();
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
        <a-col class="mt-16">
          <div>Collection</div>
          <h1>{{ collectionData.collection_name }}</h1>
          <div>By {{ createdByData.username }}</div>
        </a-col>
        <a-col>
          <a-button @click="toggleLikeCollection"
            ><heart-outlined v-if="!isLiked" /><heart-filled v-else />
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
        ><a-col :span = "24">
          <h1>Album List</h1>
          <a-list bordered :data-source="albumsData">
            <template #renderItem="{ item }">
              <a-list-item>{{ item.album_title }} </a-list-item>
            </template>
          </a-list>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <h1>Reviews</h1>
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
                  :avatar="item.avatar"
                  :content="item.comment"
                  :datetime="dayjs(item.created_datetime).fromNow()"
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
                <a-textarea v-model:value="draftComment" :rows="4" />
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

<style scoped></style>
