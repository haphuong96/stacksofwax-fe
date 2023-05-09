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
import fallbackCollectionImg from "../assets/ic_fallback_collection.png";
dayjs.extend(relativeTime);

const { navigationService, collectionService, meService } = service;

const username = localStorage.getItem(localStorageKeys.USERNAME);
const userId = localStorage.getItem(localStorageKeys.USER_ID);

const activeKey = ref("my-collection");

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
  const { collectionId: collectionId, ...details } =
    await collectionService.createCollection();
  navigationService.goToDraftCollections(collectionId);
}

/*My collection */
const searchMyCollectionKeyword = ref();
const total = ref();
const myCollection = ref();
async function fetchMyCollections(page, pageSize) {
  try {
    const data = await meService.getMyCollections(searchMyCollectionKeyword.value, page, pageSize);

    myCollection.value = data.collections;
    total.value = data.total;
  } catch (error) {
    message.error("Error loading my collections");
  }
}

/*My favorite collection */
const favoriteCollection = ref();
const favoriteTotal = ref();
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
  <a-row class="p-32">
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
              <h4 class="mb-16">Collection by {{ username }}</h4>
              <!-- <div class="d-flex justify-between my-16">
                    <a-input-search
                      v-model:value="searchMyCollectionKeyword"
                      placeholder="Search your collection"
                      style="width: 250px"
                      @search="() => fetchMyCollections()"
                    />
                    <a-button @click="postCollection">
                      <PlusOutlined />Add a new collection
                    </a-button>
                  </div> -->
              <a-list bordered v-if="myCollection" :data-source="myCollection">
                <template #header>
                    <div class="d-flex">
                    <a-input-search
                      v-model:value="searchMyCollectionKeyword"
                      placeholder="Search your collection"
                      style="width: 250px"
                      @search="() => fetchMyCollections()"
                    />
                    <a-button @click="postCollection" class="ml-16">
                      <PlusOutlined />Add a new collection
                    </a-button>
                  </div>
                </template>
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #avatar>
                        <a @click="navigationService.goToDraftCollections(
                                item.collectionId
                              )"><img :src="item.imgPath || fallbackCollectionImg" class="w-50"></a>
                      </template>
                      <template #title>
                        <a
                          type="link"
                          @click="
                            (event) =>
                              navigationService.goToDraftCollections(
                                item.collectionId
                              )
                          "
                          >{{ item.collectionName }}
                        </a></template
                      >
                      <template #description>
                        Last updated:
                        {{ dayjs(item.lastUpdatedDatetime).fromNow() }}
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <a
                        key="list-loadmore-more"
                        @click="
                          navigationService.goToPublicCollectionDetail(
                            item.collectionId
                          )
                        "
                        >public site</a
                      >
                      <a
                        key="list-loadmore-edit"
                        @click="
                          showDeleteCollectionConfirm(
                            item.collectionId,
                            item.collectionName
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
                    show-size-changer
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
              <h4 class="mb-16">Liked collections</h4>
              <a-list
                size="default"
                bordered
                v-if="favoriteCollection"
                :data-source="favoriteCollection"
              >
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #avatar>
                        <a @click="navigationService.goToPublicCollectionDetail(
                                item.collectionId
                              )">
                        <img :src="item.imgPath || fallbackCollectionImg" class="w-50"></a>
                      </template>
                      <template #title>
                        <a
                          type="link"
                          @click="
                            (event) =>
                              navigationService.goToPublicCollectionDetail(
                                item.collectionId
                              )
                          "
                          >{{ item.collectionName }}
                        </a></template
                      >
                      <template #description>
                        By
                        <a
                          @click="
                            navigationService.goToUserDetail(item.createdBy)
                          "
                          >{{ item.createdByUsername }}</a
                        >
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
                <template #footer>
                  <a-pagination
                v-model:current="current"
                :total="favoriteTotal"
                show-less-items
                show-size-changer
                @change="
                  (page, pageSize) => fetchMyFavoriteCollections(page, pageSize)
                "
              />
                </template>
              </a-list>
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
.btn-add {
  text-align: right;
}

.w-50 {
  width: 50px;
}
</style>
