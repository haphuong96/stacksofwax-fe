<script setup>
import { PlusOutlined } from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { onMounted, ref } from "vue";
import { localStorageKeys } from "../common/local-storage-keys";
import { service } from "../services";
import { axiosIntance } from "../services/base.service";
import ConfirmModal from "../components/ConfirmModal.vue";
import { routeNames } from "../router/route-names";
import router from "../router";
dayjs.extend(relativeTime);

const { navigationService, collectionService, meService } = service;

const username = localStorage.getItem(localStorageKeys.USERNAME);
const userId = localStorage.getItem(localStorageKeys.USER_ID);

const activeKey = ref("my-collection");

const myCollection = ref();
const total = ref();

const favoriteCollection = ref();
const favoriteTotal = ref();

//delete collection
const isShowConfirmDeleteCollection = ref(false);
let deleteCollectionId = 0;
const deleteCollectionMessage = ref("");
const isDeleteingCollection = ref(false);

// const visibleDeleteCollection = ref(false);

function tabChange(activeKey) {
  router.push({
    name: routeNames.MY_COLLECTION,
    query: { currentTab: activeKey }
  });

  switch (activeKey) {
    case "my-collection":
      fetchMyCollections();
      break;
    case "like-collection":
      fetchMyFavoriteCollections();
      break;
    default:
  }
}
onMounted(async () => {
  const currentTab = router.currentRoute.value.query?.currentTab;
  if (!currentTab) {
    activeKey.value = "my-collection";
    await router.push({
      name: routeNames.MY_COLLECTION,
      query: { currentTab: activeKey.value }
    });
    tabChange(activeKey.value);
  } else {
    activeKey.value = currentTab;
    await router.push({
      name: routeNames.MY_COLLECTION,
      query: { currentTab }
    });
    tabChange(currentTab);
  }
});

async function postCollection() {
  const { collection_id: collectionId, ...details } =
    await collectionService.createCollection(userId);
  navigationService.goToDraftCollections(collectionId);
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
  deleteCollectionId = collectionId;
  deleteCollectionMessage.value = `Collection <b>${collectionName}</b> will be deleted from your library.`;
  isShowConfirmDeleteCollection.value = true;
};

const onConfirmDeleteCollection = async () => {
  try {
    isDeleteingCollection.value = true;
    await service.collectionService.deleteCollection(deleteCollectionId);
    message.success("Delete collection successfully");
    fetchMyCollections();
  } catch {
    message.error("Error delete collection");
  } finally {
    isDeleteingCollection.value = false;
    isShowConfirmDeleteCollection.value = false;
  }
};
</script>

<template>
  <a-row class="px-32 p-16 my-collection-page-container">
    <a-col :span="24">
      <h3>
        Want to explore other collections from the Stacks of Wax Community?
        Check out <a @click="navigationService.goToCollections">Recent List</a>!
      </h3>
      <a-tabs v-model:activeKey="activeKey" @change="tabChange">
        <a-tab-pane key="my-collection">
          <template #tab>
            <span> My Collections </span>
          </template>
          <a-row>
            <a-col :span="24">
              <a-list v-if="myCollection" :data-source="myCollection">
                <template #header>
                  <div class="d-flex justify-between">
                    <h4>Collection by {{ username }}</h4>
                    <a-button @click="postCollection" class="mb-16">
                      <PlusOutlined />Add a new collection
                    </a-button>
                  </div>
                </template>
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
                      >
                        delete
                      </a>
                    </template>
                    <!-- <div><EllipsisOutlined></EllipsisOutlined></div> -->
                  </a-list-item>
                </template>
                <template #footer>
                  <a-pagination
                    v-model:current="current"
                    :total="total"
                    show-less-items
                    @change="
                      (page, pageSize) => fetchMyCollections(page, pageSize)
                    "
                  />
                </template>
              </a-list>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="like-collection">
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
                    <a-list-item-meta>
                      <template #title>
                        <a
                          type="link"
                          @click="
                            (event) =>
                              navigationService.goToPublicCollectionDetail(
                                item.collection_id
                              )
                          "
                          >{{ item.collection_name }}
                        </a></template
                      >
                      <template #description>
                        By
                        <a
                          @click="
                            navigationService.goToUserDetail(item.created_by)
                          "
                          >{{ item.created_by_username }}</a
                        >
                      </template>
                    </a-list-item-meta>
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
  <ConfirmModal
    v-model:visible="isShowConfirmDeleteCollection"
    title="Delete Collection?"
    :message="deleteCollectionMessage"
    :is-loading="isDeleteingCollection"
    @cancel="isShowConfirmDeleteCollection = false"
    @confirm="onConfirmDeleteCollection"
  ></ConfirmModal>
</template>

<style scoped>
.my-collection-page-container {
  height: calc(100vh - 72px);
  overflow: scroll;
}
.btn-add {
  text-align: right;
}
</style>
