<template>
  <a-spin :spinning="isLoading">
    <div class="p-32">
      <a-row>
        <a-col :span="3">
          <CircleImage
            :size="120"
            :failed-image="fallbackImage"
            :src="profileImage"
          ></CircleImage>
        </a-col>
        <a-col :span="21">
          <div class="user-detail__lbl-name">#{{ name }}</div>
          <div class="user-detail__lbl-detail">
            {{ createdAt ? `Joined on ${createdAt}` : "" }}
          </div>
          <div class="user-detail__lbl-detail">
            {{ lastActiveTime ? `Last online ${lastActiveTime}` : "" }}
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-tabs
            class="user-collection-container"
            v-model:activeKey="activeKey"
          >
            <a-tab-pane
              key="1"
              :tab="`Collection Library (${totalCollections})`"
            >
              <div>
                <div class="public-collection-label">Public Collection</div>
                <a-list item-layout="horizontal" :data-source="collections">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta>
                        <template #description>
                          {{ item.collectionDesc }}
                        </template>
                        <template #title>
                          <a
                            @click="
                              () =>
                                navigationService.goToCollectionDetail(
                                  item.collectionId
                                )
                            "
                            >{{ item.collectionName }}</a
                          >
                        </template>
                        <template #avatar>
                          <a
                            @click="
                              () =>
                                navigationService.goToCollectionDetail(
                                  item.collectionId
                                )
                            "
                          >
                            <img
                              :src="item.imgPath || fallbackCollectionImg"
                              class="w-50"
                          /></a>
                        </template>
                      </a-list-item-meta>
                    </a-list-item>
                  </template>
                </a-list>

                <a-pagination
                  v-model:current="current"
                  :total="totalCollections"
                  show-less-items
                  show-size-changer
                  @change="fetchUserCollection"
                  class="mt-16"
                />
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Reviews" force-render>
              <div class="public-collection-label">Reviews Content</div>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </div>
  </a-spin>
</template>
<script setup>
import { message } from "ant-design-vue";
import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { onMounted, ref } from "vue";
import fallbackCollectionImg from "../assets/ic_fallback_collection.png";
import fallbackImage from "../assets/ic_user.png";
import CircleImage from "../components/CircleImage.vue";
import router from "../router";
import { service } from "../services";
import { navigationService } from "../services/navigation.service";

const isLoading = ref(false);
const name = ref("");
const createdAt = ref("");
const lastActiveTime = ref("");
const totalCollections = ref(0);
const activeKey = ref("1");
const collections = ref([]);
const profileImage = ref("");

// limit offset
const defaultPage = 1;
const defaultPageSize = 10;
const current = ref(defaultPage);

const userId = router.currentRoute.value.params.id;

onMounted(async () => {
  isLoading.value = true;
  const userInfo = await service.userService.fetchUserInfo(
    userId,
    current.value,
    defaultPageSize
  );

  await fetchUserCollection();

  isLoading.value = false;
  if (userInfo) {
    name.value = userInfo.username;
    profileImage.value = userInfo.imgPath;
    createdAt.value = format(
      new Date(userInfo.createdDatetime),
      "MMM dd yyyy"
    );
    lastActiveTime.value = formatFromNow(userInfo.lastActive);

  } else {
    router.go(-1);
    message.error("Cannot get user info");
  }
});

async function fetchUserCollection(page, pageSize) {
  const userCollectionInfo = await service.userService.getUserCollection(
    userId,
    page,
    pageSize
  );
  totalCollections.value = userCollectionInfo.total;
  collections.value = userCollectionInfo.collections;
}

function formatFromNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    includeSeconds: true
  });
}
</script>
<style scoped>
.profile-image {
  height: 120px;
  width: 120px;
  background-color: white;
  padding: 8px;
  object-fit: cover;
  border-radius: 60px;
  border: 4px solid lightgray;
  overflow: hidden;
}

.user-detail__lbl-name {
  font-size: 24px;
  color: black;
}

.user-detail__lbl-detail {
  font-size: 14px;
  color: black;
}

.public-collection-label {
  font-size: 18px;
  color: black;
}

.w-50 {
  width: 50px;
}
</style>
