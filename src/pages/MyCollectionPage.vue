<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
import { localStorageKeys } from "../common/local-storage-keys";
import { axiosIntance } from "../services/base.service";

const username = localStorage.getItem(localStorageKeys.USERNAME);
const userId = localStorage.getItem(localStorageKeys.USER_ID);

const activeKey = ref(1);

const defaultPage = 1;
const defaultPageSize = 10;

const myCollection = ref();
const favoriteCollection = ref();

const total = ref();

function tabChange(activeKey) {
    console.log(activeKey);
    switch (activeKey) {
        case 1: fetchMyCollections();break;
        case 2: fetchMyFavoriteCollections();break;
        default:
    }
}
onMounted(async () => {
    fetchMyCollections();
});

function goToCollections() {
    router.push({ name: routeNames.COLLECTION });
}

function goToDraftCollections(collectionId) {

    router.push({ name: routeNames.DRAFT_COLLECTION_DETAIL, params: { id: collectionId } });
}

function goToPublicCollections(collectionId) {

    router.push({ name: routeNames.COLLECTION_DETAILS, params: { id: collectionId}});
}

async function createCollection() {
    const res = await axiosIntance.post('collections', {
        user_id: userId
    });

    const collectionId = res.data[0].collection_id;

    goToDraftCollections(collectionId);

}

async function fetchMyCollections(page, pageSize) {
    const limit = pageSize || defaultPageSize;
    const offset = (page - 1) * pageSize || 0;
    const res = await axiosIntance.get('my-collections', {
      params: {
        limit,
        offset
      }
    });;

    myCollection.value = res.data.collections;
    total.value = res.data.total;
}

async function fetchMyFavoriteCollections() {
    console.log('my-fav')
    const limit = pageSize || defaultPageSize;
    const offset = (page - 1) * pageSize || 0;
    const res = await axiosIntance.get(`me/favorite-collections`, {
        params: {
            limit,
            offset
        }
    });

    favoriteCollection.value = res.data;

}
</script>

<template>
    <a-row class="m-16 p-16">
        <a-col :span="24">
            <h3>Want to explore other collections from the Stacks of Wax Community? Check out <a
                    @click="goToCollections">Recent
                    List</a>!</h3>
            <a-tabs v-model:activeKey="activeKey" @change="tabChange">
                <a-tab-pane key="1">
                    <template #tab>
                        <span>
                            My Collections
                        </span>
                    </template>
                    <a-row>
                        <a-col :span="24">
                            <h4>Collection by {{ username }}</h4>
                            <a-button @click="createCollection">Create a new collection</a-button>
                            <a-list size="small" bordered v-if="myCollection" :data-source="myCollection">
                                <template #renderItem="{ item }">
                                    <a-list-item>
                                        <a-button type="link" @click="(event) => goToDraftCollections(item.collection_id)">{{
                                            item.collection_name }}
                                        </a-button></a-list-item>
                                </template>
                            </a-list>

                            <a-pagination v-model:current="current" :total="total" show-less-items
                                @change="(page, pageSize) => fetchMyCollections(page, pageSize)" />
                        </a-col>
                    </a-row>
                </a-tab-pane>
                <a-tab-pane key="2">
                    <template #tab>
                        <span>
                            Liked Collections
                        </span>
                    </template>
                    <a-row>
                        <a-col :span="24">
                            <h4>Liked collections</h4>
                            <a-list size="default" bordered v-if="favoriteCollection" :data-source="favoriteCollection">
                                <template #renderItem="{ item }">
                                    <a-list-item>
                                        <a-button type="link" @click="(event) => goToPublicCollections(item.collection_id)">{{
                                            item.collection_name }}
                                        </a-button>
                                    </a-list-item>
                                </template>
                            </a-list>

                            <a-pagination v-model:current="current" :total="total" show-less-items
                                @change="(page, pageSize) => fetchMyFavoriteCollections(page, pageSize)" />
                        </a-col>
                    </a-row>
                </a-tab-pane>
            </a-tabs>
        </a-col>
    </a-row>
</template>
  
<style scoped></style>