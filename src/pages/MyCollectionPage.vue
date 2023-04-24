<script setup>
import { onMounted, ref } from "vue";
import { localStorageKeys } from "../common/local-storage-keys";
import router from "../router";
import { routeNames } from "../router/route-names";
import { axiosIntance } from "../services/base.service";
import { service } from "../services";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const { navigationService, collectionService, meService } = service;

const username = localStorage.getItem(localStorageKeys.USERNAME);
const userId = localStorage.getItem(localStorageKeys.USER_ID);

const activeKey = ref("1");

const defaultPageSize = 10;

const myCollection = ref();
const total = ref();

const favoriteCollection = ref();
const favoriteTotal = ref();

function tabChange(activeKey) {
  switch (activeKey) {
    case "1":
      fetchMyCollections();
      break;
    case "2":
      fetchMyFavoriteCollections();
      break;
    default:
  }
}
onMounted(async () => {
  fetchMyCollections();
});

async function createCollection() {
  const res = await axiosIntance.post("collections", {
    user_id: userId
  });

  const collectionId = res.data[0].collection_id;

  goToDraftCollections(collectionId);
}

async function fetchMyCollections(page, pageSize) {
  try {
    const data = await meService.getMyCollections(page, pageSize);

    myCollection.value = data.collections;
    total.value = data.total;
  } catch (error) {
    message.error("Error loading my collections");
  }
}

async function fetchMyFavoriteCollections(page, pageSize) {
  try {
    const data = await meService.getMyFavoriteCollections(page, pageSize);

    favoriteCollection.value = data.collections;
    favoriteTotal.value = data.total;
  } catch (error) {
    message.error("Error loading my collections");
  }
}
</script>

<template>
  <a-row class="m-16 p-16">
    <a-col :span="24">
      <h3>
        Want to explore other collections from the Stacks of Wax Community?
        Check out <a @click="navigationService.goToCollections">Recent List</a>!
      </h3>
      <a-tabs v-model:activeKey="activeKey" @change="tabChange">
        <a-tab-pane key="1">
          <template #tab>
            <span> My Collections </span>
          </template>
          <a-row>
            <a-col :span="24">
              <h4>Collection by {{ username }}</h4>
              <div>
                <a-button @click="createCollection"
                  >Create a new collection</a-button
                >
              </div>
              <a-list bordered v-if="myCollection" :data-source="myCollection">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <a
                          type="link"
                          @click="
                            (event) =>
                              navigationService.goToDraftCollections(
                                item.collection_id
                              )
                          "
                          >{{ item.collection_name }}
                        </a></template
                      >
                      <template #description>
                          Last updated: {{ dayjs(item.last_updated_datetime).fromNow() }}
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>

              <a-pagination
                v-model:current="current"
                :total="total"
                show-less-items
                @change="(page, pageSize) => fetchMyCollections(page, pageSize)"
              />
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span> Liked Collections </span>
          </template>
          <a-row>
            <a-col :span="24">
              <h4>Liked collections</h4>
              <a-list
                size="default"
                bordered
                v-if="favoriteCollection"
                :data-source="favoriteCollection"
              >
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-button
                      type="link"
                      @click="
                        (event) =>
                          navigationService.goToPublicCollections(
                            item.collection_id
                          )
                      "
                      >{{ item.collection_name }}
                    </a-button>
                  </a-list-item>
                </template>
              </a-list>

              <a-pagination
                v-model:current="current"
                :total="total"
                show-less-items
                @change="
                  (page, pageSize) => fetchMyFavoriteCollections(page, pageSize)
                "
              />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>

<style scoped></style>
