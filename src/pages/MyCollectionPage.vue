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
const myCollection = ref();

onMounted(async () => {
  const filter = await axiosIntance.get('my-collections');
  myCollection.value = filter.data;
  console.log(myCollection.value);
});

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
                    <a-list size="small" bordered   v-if="myCollection" :data-source="myCollection">
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