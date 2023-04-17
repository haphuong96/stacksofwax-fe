<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
import { localStorageKeys } from "../common/local-storage-keys";
import { axiosIntance } from "../services/base.service";
import { EditOutlined, EditFilled } from '@ant-design/icons-vue';

const collectionId = router.currentRoute.value.params.id.split("-")[0];

const username = localStorage.getItem(localStorageKeys.USERNAME);
const userId = localStorage.getItem(localStorageKeys.USER_ID);

const albumsData = ref();
const collectionData = ref();
const createdByData = ref();

const isEditMode = ref(false);
const isDescDisplay = ref(false);

const collectionName = ref();
const collectionDesc = ref();

const showHideDescriptionModal = () => {
    isDescDisplay.value = !isDescDisplay.value
}
const showEditModal = () => {
    isEditMode.value = true;
}
const handleEditOk = () => {
    updateCollection()
    .then(isEditMode.value = false)
    .catch((error) => {
        console.log(error)
        message.error("Error updating collection")
    });
}
const cancelEdit = () => {
    console.log("cancel")
    isEditMode.value = false;
}

onMounted(async () => {
    fetchCollectionById();
})

async function updateCollection() {
    const res = await axiosIntance.put(`collections/${collectionId}`, {
        collection_name: collectionName.value,
        collection_desc: collectionDesc.value || undefined
    }
    );
    const { created_by, ...collection } = res.data;
    collectionName.value = collection.collection_name;
    collectionDesc.value = collection.collection_desc;
}

async function fetchCollectionById() {
    const res = await axiosIntance.get(`collections/${collectionId}`);
    const { albums, created_by, ...collection } = res.data;
    collectionName.value = collection.collection_name;
    collectionDesc.value = collection.collection_desc;

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
                    <a-button type="link" @click="showHideDescriptionModal">Click here to show description</a-button>
                    <div>
                        <a-modal v-model:visible="isDescDisplay" :title="`${collectionData.collection_name} - Description`" @ok="showHideDescriptionModal" :maskClosable="false">
                            {{ collectionData.collection_desc }}
                        </a-modal>
                    </div>
                </a-col>
                <a-col>
                    <div>Collection <a @click="showEditModal"><edit-filled /></a></div>
                    <div>
                        <!-- <a-button type="primary" @click="showEditModal">Open Modal</a-button> -->
                        <a-modal v-model:visible="isEditMode" title="Edit Collection" @ok="handleEditOk" @cancel="cancelEdit" :maskClosable="false">
                            <p><h3>Title:</h3>
                            <a-input v-model:value="collectionName" placeholder="Enter collection name" /></p>
                            <p><h3>Description:</h3>
                            <a-textarea v-model:value="collectionDesc" placeholder="[Optional] Write some description for this collection..." :rows="4" /></p>  
                        </a-modal>
                    </div>
                    <!-- <h1><a-input v-model:value="collectionData.collection_name" placeholder="Enter collection name" /></h1> -->
                    <h1>{{ collectionName }}</h1>
                    <div>By {{ createdByData.username }}</div>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24">
                    
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>
  
<style scoped></style>