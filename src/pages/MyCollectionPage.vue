<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
import { localStorageKeys } from "../common/local-storage-keys";
import { axiosIntance } from "../services/base.service";

const username = localStorage.getItem(localStorageKeys.USERNAME);
const userId = localStorage.getItem(localStorageKeys.USER_ID);

const data = [{
    title: 'Collection 1',
}, {
    title: 'Collection 2',
}, {
    title: 'Collection 3',
}];

function goToCollections() {
    router.push({ name: routeNames.COLLECTION });
}

async function goToDraftCollection() {
    const res = await axiosIntance.post('collections', {
        user_id: userId
    });

    const collectionId = res.data[0].collection_id;

    router.push({name: routeNames.DRAFT_COLLECTION_DETAIL, params: { id: collectionId }});
}
</script>

<template>
    <a-row class="m-16 p-16">
        <h3>Want to explore other collections from the Stacks of Wax Community? Check out <a @click="goToCollections">Recent
                List</a>!</h3>
        <a-col :span="24">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="1">
                    <template #tab>
                        <span>
                            My Collections
                        </span>
                    </template>
                    <h4>Collection by {{ username }}</h4>
                    <a-button @click="goToDraftCollection">Create a new collection</a-button>
                    <a-list size="small" bordered :data-source="data">
                        <template #renderItem="{ item }">
                            <a-list-item>{{ item }}</a-list-item>
                        </template>
                    </a-list>
                </a-tab-pane>
                <a-tab-pane key="2">
                    <template #tab>
                        <span>
                            <android-outlined />
                            Liked Collections
                        </span>
                    </template>
                    Tab 2
                </a-tab-pane>
            </a-tabs>
        </a-col>
    </a-row>
</template>
  
<style scoped></style>