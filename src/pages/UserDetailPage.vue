<template>
  <a-spin :spinning="isLoading">
    <div class="page-container">
      <a-row>
        <a-col :span="4">
          <img class="profile-image" src="../assets/ic_user.png" />
        </a-col>
        <a-col :span="20">
          <div class="user-detail__lbl-name">#{{ name }}</div>
          <div class="user-detail__lbl-detail">
            {{ createdAt ? `Joined on ${createdAt}` : "" }}
          </div>
          <div class="user-detail__lbl-detail">
            {{ lastActiveTime ? `Last online ${lastActiveTime}` : "" }}
          </div>
        </a-col>
      </a-row>
      <a-row class="user-collection-container">
        <a-tabs class="user-collection-container" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="`Collection Library (${totalCollections})`">
            <div>
              <div class="public-collection-label">Public Collection</div>
              <a-list item-layout="horizontal" :data-source="collections">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #description>
                        {{ item.collection_desc }}
                      </template>
                      <template #title>
                        <a
                          @click="
                            () => goToCollectionDetail(item.collection_id)
                          "
                          >{{ item.collection_name }}</a
                        >
                      </template>
                      <template #avatar>
                        <a-avatar src="https://joeschmoe.io/api/v1/random" />
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>

              <a-pagination
                v-model:current="current"
                :total="totalCollections"
                show-less-items
                @change="(page, pageSize) => fetchUserInfo()"
              />
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Reviews" force-render>
            <div class="public-collection-label">Reviews Content</div>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </div>
  </a-spin>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { service } from "../services";
import router from "../router";
import { message } from "ant-design-vue";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import format from "date-fns/format";

const isLoading = ref(false);
const name = ref("");
const createdAt = ref("");
const lastActiveTime = ref("");
const totalCollections = ref(0);
const activeKey = ref("1");
const collections = ref([]);

// limit offset
const defaultPage = 1;
const defaultPageSize = 10;
const current = ref(defaultPage);

onMounted(async () => {
  isLoading.value = true;
  const userInfo = await service.userService.fetchUserInfo(
    15,
    current.value,
    defaultPageSize
  );
  isLoading.value = false;
  if (userInfo) {
    name.value = userInfo.username;
    createdAt.value = format(
      new Date(userInfo.created_datetime),
      "MMM dd yyyy"
    );
    lastActiveTime.value = formatFromNow(userInfo.last_active);
    totalCollections.value = userInfo.collections?.total || 0;
    collections.value = userInfo.collections?.data || [];
  } else {
    router.go(-1);
    message.error("Cannot get user info");
  }
});

function formatFromNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    includeSeconds: true
  });
}
</script>
<style scoped>
.page-container {
  height: calc(100vh - 72px);
  overflow: hidden;
  padding-left: 80px;
  padding-right: 80px;
  padding-top: 32px;
}

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

.user-collection-container {
  height: calc(100vh - 140px);
}

.public-collection-label {
  font-size: 18px;
  color: black;
}
</style>
