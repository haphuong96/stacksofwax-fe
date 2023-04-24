<script setup>
import { onMounted, ref } from "vue";
import { localStorageKeys } from "../common/local-storage-keys";
import router from "../router";
import { routeNames } from "../router/route-names";
import { axiosIntance } from "../services/base.service";
import { service } from "../services";
import { message } from "ant-design-vue";
import { Modal } from "ant-design-vue";
import dayjs from "dayjs";
import { PlusOutlined, EllipsisOutlined } from "@ant-design/icons-vue";
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

// const visibleDeleteCollection = ref(false);

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

const showDeleteCollectionConfirm = (collectionId, collectionName) => {
  Modal.confirm({
    title: "Delete Collection?",
    content: `Collection '${collectionName}' will be deleted from your library.`,
    okText: "Delete",

    async onOk() {
      try {
        await collectionService.deleteCollection(collectionId);
        fetchMyCollections();
      } catch {
        message.error("Error delete collection");
      }
    },

    oncancel() {}
  });
};
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
              <!-- <div class="d-flex h-flex my-8"> -->
              <h4>Collection by {{ username }}</h4>
              <div class="btn-add">
                <a-button @click="createCollection" class="mb-16"
                  ><PlusOutlined />Add a new collection</a-button
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
                        Last updated:
                        {{ dayjs(item.last_updated_datetime).fromNow() }}
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <a
                        key="list-loadmore-more"
                        @click="
                          navigationService.goToPublicCollectionDetail(
                            item.collection_id
                          )
                        "
                        >public site</a
                      >
                      <a
                        key="list-loadmore-edit"
                        @click="
                          showDeleteCollectionConfirm(
                            item.collection_id,
                            item.collection_name
                          )
                        "
                        >delete</a
                      >
                      <!-- <a-modal
                        v-model:visible="visibleDeleteCollection"
                        @ok="handleOk"
                      >
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                      </a-modal> -->
                    </template>
                    <!-- <div><EllipsisOutlined></EllipsisOutlined></div> -->
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

<style scoped>
.btn-add {
  text-align: right;
}
</style>
