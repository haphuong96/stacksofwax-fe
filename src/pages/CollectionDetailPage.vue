<script setup>
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { computed, onMounted, ref } from "vue";
import fallbackCollectionImg from "../assets/ic_fallback_collection.png";
import userFallbackAvatar from "../assets/user-fallback.png";
import { localStorageKeys } from "../common/local-storage-keys";
import LikeButton from "../components/LikeButton.vue";
import router from "../router";
import { collectionService } from "../services/collection.service";
import { navigationService } from "../services/navigation.service";
import { routeNames } from "../router/route-names";

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

const showAllDescription = ref(false);
const displayDescription = computed(() => {
  if (!collectionData.value?.collection_desc) return "";
  if (
    showAllDescription.value ||
    collectionData.value?.collection_desc.length <= 250
  )
    return collectionData.value?.collection_desc;
  return `${collectionData.value?.collection_desc.slice(0, 250)} ${
    showAllDescription.value ? "" : "..."
  }`;
});

onMounted(async () => {
  fetchCollectionAlbumById();
  if (localStorage.getItem(localStorageKeys.ACCESS_TOKEN)) {
    checkUserLikedCollection();
  }
  fetchCollectionComments();
  await fetchCollectionDetailById();

  router.replace({
    name: routeNames.COLLECTION_DETAILS,
    params: {
      id: `${collectionId}-${collectionData.value.collection_name?.replaceAll(" ", "-")}`
    }
  });
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

async function fetchCollectionComments(page, pageSize) {
  try {
    const data = await collectionService.getCollectionComment(
      collectionId,
      page,
      pageSize
    );
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

async function fetchCollectionAlbumById(page, pageSize) {
  const { total, albums } = await collectionService.getCollectionAlbums(
    page,
    pageSize,
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
  <a-row class="p-32">
    <a-col :span="24">
      <a-row v-if="collectionData">
        <a-col :span="4">
          <a-image
            :width="200"
            :src="collectionData.img_path || fallbackCollectionImg"
          />
        </a-col>
        <a-col :span="16" class="mt-16">
          <div>Collection</div>
          <h1>{{ collectionData.collection_name }}</h1>
          <div>
            By
            <a @click="navigationService.goToUserDetail(collectionData.user_id)"
              >{{ collectionData.username }}
            </a>
          </div>
          <h2 class="mt-32">
            <div v-if="collectionData.total_like">
              {{ collectionData.total_like.toLocaleString("en-US") }} like<span
                v-if="collectionData.total_like > 1"
                >s</span
              >
            </div>
          </h2>
        </a-col>
        <a-col :span="4" class="d-flex justify-right">
          <a-button
            :danger="isLiked ? true : false"
            @click="toggleLikeCollection"
            class="mt-16 mr-32 d-flex justify-center"
          >
            <LikeButton
              @click="toggleLikeCollection"
              :like="isLiked"
            ></LikeButton>
            <span>Like</span><span v-if="isLiked">d</span>
          </a-button>
        </a-col>
      </a-row>
      <a-row v-if="collectionData">
        <a-col :span="24">
          <div class="fs-16 mt-16">
            {{ displayDescription }}
            <a
              @click="showAllDescription = !showAllDescription"
              v-if="(collectionData?.collection_desc || '').length > 250"
              >{{ showAllDescription ? "Show less" : "Show more" }}</a
            >
          </div>
        </a-col>
      </a-row>
      <a-row
        ><a-col :span="24">
          <h1 class="mt-16">Album List</h1>
          <a-list bordered :data-source="albumsData">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <a
                      @click="
                        navigationService.goToAlbumDetailPage(item.album_id)
                      "
                      >{{ item.album_title }}</a
                    >
                  </template>
                  <template #avatar>
                    <a
                      @click="
                        navigationService.goToAlbumDetailPage(item.album_id)
                      "
                      ><img :src="item.img_path" class="w-50"
                    /></a>
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
            <template #footer>
              <div class="d-flex justify-right">
                <a-pagination
                  size="small"
                  v-model:current="current"
                  :total="totalAlbums"
                  show-less-items
                  :show-total="
                    (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`
                  "
                  @change="fetchCollectionAlbumById"
                />
              </div>
            </template>
          </a-list>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <h1 class="my-16">Reviews</h1>
          <a-comment>
            <template #avatar>
              <a-avatar :src="userAvatar || userFallbackAvatar" />
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
          <a-list
            v-if="comments.length"
            :data-source="comments"
            :header="`${totalComments} ${
              totalComments > 1 ? 'comments' : 'comment'
            }`"
            item-layout="horizontal"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-comment
                  :author="item.username"
                  :avatar="item.user_avatar || userFallbackAvatar"
                  :content="item.comment"
                  :datetime="dayjs(item.created_datetime).fromNow()"
                />
              </a-list-item>
            </template>
            <template #footer>
              <a-pagination
                size="small"
                :total="totalComments"
                show-size-changer
                @change="fetchCollectionComments"
              />
            </template>
          </a-list>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped>
.w-50 {
  width: 50px;
}
</style>
