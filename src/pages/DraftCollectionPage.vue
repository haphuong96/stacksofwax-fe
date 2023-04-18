<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
import { localStorageKeys } from "../common/local-storage-keys";
import { axiosIntance } from "../services/base.service";
import { EditOutlined, EditFilled, CloseOutlined } from "@ant-design/icons-vue";
import cloneDeep from "lodash/cloneDeep";

const collectionId = router.currentRoute.value.params.id.split("-")[0];

const username = localStorage.getItem(localStorageKeys.USERNAME);
const userId = localStorage.getItem(localStorageKeys.USER_ID);

const isSavingCollection = ref(false);

const albumsData = ref();
const collectionData = ref();
const createdByData = ref();

const searchAlbumData = ref([]);
const searchAlbumKeyword = ref();

const isEditMode = ref(false);
const isSearchAlbumMode = ref(false);

// const collectionName = ref();
const editCollectionName = ref();
// const collectionDesc = ref();

const editCollectionDesc = ref();

const showHideAlbumSearchSection = () => {
  if (searchAlbumKeyword.value) {
    searchAlbumKeyword.value = null;
    searchAlbumData.value = [];
  }
  isSearchAlbumMode.value = !isSearchAlbumMode.value;
};

const showEditModal = () => {
  isEditMode.value = true;
};
const cancelEdit = () => {
  isEditMode.value = false;
};

onMounted(async () => {
  fetchCollectionDetailById();
  fetchCollectionAlbumById();
  // fetchCollectionById();
});

async function updateCollection() {
  isSavingCollection.value = true;
  try {
    const res = await axiosIntance.put(`collections/${collectionId}`, {
      collection_name: editCollectionName.value,
      collection_desc: editCollectionDesc.value || undefined
    });
    const { collection_name, collection_desc } = res.data;
    // collectionName.value = collection_name;
    // collectionDesc.value = collection_desc;

    editCollectionName.value = cloneDeep(collection_name);
    editCollectionDesc.value = cloneDeep(collection_desc);
  } catch (error) {
    message.error("Error updating collection");
  } finally {
    isSavingCollection.value = false;
    isEditMode.value = false;
  }
}

async function fetchCollectionDetailById() {
  const res = await axiosIntance.get(`collections/${collectionId}`, {
    params: {
      operationName: "fetchCollectionDetails"
    }
  });
  const { user_id, username, ...collection } = res.data;

  collectionData.value = collection;
  createdByData.value = {
    user_id,
    username
  };

  editCollectionName.value = cloneDeep(collection.collection_name);
  editCollectionDesc.value = cloneDeep(collection.collection_desc);
}

async function fetchCollectionAlbumById() {
  const res = await axiosIntance.get(`collections/${collectionId}`, {
    params: {
      operationName: "fetchCollectionAlbums"
    }
  });
  albumsData.value = res.data;
}

// async function fetchCollectionById() {
//     const res = await axiosIntance.get(`collections/${collectionId}`);
//     const { albums, created_by, ...collection } = res.data;
//     collectionName.value = collection.collection_name;
//     collectionDesc.value = collection.collection_desc;

//     editCollectionName.value = cloneDeep(collection.collection_name);
//     editCollectionDesc.value = cloneDeep(collection.collection_desc);

//     albumsData.value = albums;
//     collectionData.value = collection;
//     createdByData.value = created_by;
// }

async function searchAlbum() {
  const res = await axiosIntance.get(`albums`, {
    params: {
      limit: 10,
      offset: 0,
      search: searchAlbumKeyword.value
    }
  });
  searchAlbumData.value = res.data.albums;
  console.log(searchAlbumData.value);
}

const showAllDescription = ref(false);
const displayDescription = computed(() => {
  if (!collectionData.value?.collection_desc) return "";
  if (showAllDescription.value || collectionData.value?.collection_desc.length <= 250)
    return collectionData.value?.collection_desc;
  return `${collectionData.value?.collection_desc.slice(0, 250)} ${
    showAllDescription.value ? "" : "..."
  }`;
});

async function addAlbumToCollection(albumId) {
  const res = await axiosIntance.post(
    `my-collections/${collectionId}/manage-album/add`,
    {
      album_id: albumId
    }
  );

  fetchCollectionAlbumById();
}

async function deleteAlbumFromCollection(albumId) {
  const res = await axiosIntance.delete(
    `my-collections/${collectionId}/manage-album/delete`,
    {
      data: {
        album_id: albumId
      }
    }
  );

  fetchCollectionAlbumById();
}
</script>

<template>
  <a-row class="m-16 p-16">
    <a-col :span="24">
      <a-row v-if="collectionData && createdByData">
        <a-col :span="4">
          <a-image
            :width="200"
            src="https://static-cse.canva.com/blob/1035320/1600w-fxYFTKLArdY.jpg"
          />
        </a-col>
        <a-col :span="20">
          <div>
            Collection <a @click="showEditModal"><edit-filled /></a>
          </div>
          <div>
            <a-modal
              v-model:visible="isEditMode"
              title="Edit Collection"
              :maskClosable="false"
            >
              <h3>Title:</h3>
              <a-input
                v-model:value="editCollectionName"
                placeholder="Enter collection name"
              />
              <h3>Description:</h3>
              <a-textarea
                v-model:value="editCollectionDesc"
                placeholder="[Optional] Write some description for this collection..."
                :rows="4"
                show-count
                :maxlength="500"
              />
              <template #footer>
                <a-button
                  key="back"
                  @click="cancelEdit"
                  :disabled="isSavingCollection"
                  >Cancel</a-button
                >
                <a-button
                  key="submit"
                  type="primary"
                  :loading="isSavingCollection"
                  @click="updateCollection"
                  >Save</a-button
                >
              </template>
            </a-modal>
          </div>
          <h1>{{ collectionData.collection_name }}</h1>
          <div>By {{ createdByData.username }}</div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div class="fs-16 mt-16">
            {{ displayDescription }}
            <a
              @click="showAllDescription = !showAllDescription"
              v-if="(collectionData?.collection_desc || '').lenght > 250"
              >{{ showAllDescription ? "Show less" : "Show more" }}</a
            >
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <h1>Album List</h1>
          <a-list bordered :data-source="albumsData">
            <template #renderItem="{ item }">
              <a-list-item
                >{{ item.album_title }}
                <a-button
                  type="link"
                  @click="deleteAlbumFromCollection(item.album_id)"
                  v-if="isSearchAlbumMode"
                  ><close-outlined /></a-button
              ></a-list-item>
            </template>
          </a-list>
          <a-button
            type="link"
            v-if="!isSearchAlbumMode"
            @click="showHideAlbumSearchSection"
            >Edit album list</a-button
          >
          <div v-if="isSearchAlbumMode">
            <a-input-search
              v-model:value="searchAlbumKeyword"
              placeholder="Search album"
              style="width: 200px"
              @search="searchAlbum"
            />
            <a @click="showHideAlbumSearchSection"><close-outlined /></a>
            <a-list
              bordered
              :data-source="searchAlbumData"
              v-if="searchAlbumData.length > 0"
            >
              <template #renderItem="{ item }">
                <a-list-item
                  >{{ item.album_title }}
                  <a-button @click="() => addAlbumToCollection(item.album_id)"
                    >Add</a-button
                  ></a-list-item
                >
              </template>
            </a-list>
          </div>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped>
.fs-16 {
  font-size: 16px;
}
</style>
