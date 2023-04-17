<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
import { localStorageKeys } from "../common/local-storage-keys";
import { axiosIntance } from "../services/base.service";

const collectionId = router.currentRoute.value.params.id.split("-")[0];

const username = localStorage.getItem(localStorageKeys.USERNAME);
const userId = localStorage.getItem(localStorageKeys.USER_ID);

const albumsData = ref();
const collectionData = ref();
const createdByData = ref();

onMounted(async() => {
    fetchCollectionById();
});

async function fetchCollectionById() {
    const res = await axiosIntance.get(`collections/${collectionId}`);
    const { albums, created_by, ...collection } = res.data;
    albumsData.value = albums;
    collectionData.value = collection;
    createdByData.value = created_by;
    console.log(createdByData.value)
}


</script>

<template>
    <a-row class="m-16 p-16">
        <a-col :span="24">
            <a-row v-if="collectionData && createdByData">
                <a-col :span="4">
                    <a-image :width="200" src="https://static-cse.canva.com/blob/1035320/1600w-fxYFTKLArdY.jpg" />
                </a-col>
                <a-col>
                    <div>Collection</div>
                    <h1>{{ collectionData.collection_name }}</h1>
                    <div>By {{ createdByData.username }}</div>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24">
                    <h1>Description</h1>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>
  
<style scoped></style>