<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
// import {collectionFallbackImage} from "../assets/collections.png";
import { service } from "../services";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const { navigationService, collectionService } = service;

const collections = ref();
const favCollections = ref([]);
const total = ref(0);
const current = ref(1);

const searchQuery = ref();
const searchKeyword = ref();

const sortValue = ref("-created_datetime");
const sortOptions = ref([
  {
    label: "Newest",
    value: "-created_datetime"
  },
  {
    label: "Oldest",
    value: "created_datetime"
  },
  {
    label: "Most Popular",
    value: "-likes"
  }
]);

onMounted(async () => {
  fetchCollections();
  fetchFavoriteCollections();
});

async function fetchFavoriteCollections(page, pageSize) {
  try {
    const data = await collectionService.getCollections(1, 4, {
      sortBy: "-likes"
    });
    favCollections.value = data.collections;
  } catch (error) {
    message.error("Cannot load favorite collections");
  }
}

async function fetchCollections(page, pageSize) {
  try {
    console.log("sortBy " + sortValue.value);
    const data = await collectionService.getCollections(page, pageSize, {
      searchKeyword: searchKeyword.value,
      sortBy: sortValue.value
    });

    collections.value = data.collections;
    total.value = data.total;
  } catch (error) {
    message.error("Cannot load collections");
  }
}
</script>

<template>
  <a-row class="m-16 p-16">
    <a-col :span="24">
      <a-row>
        <a-col :span="24">
          <a-divider orientation="left">Top Favorite Collections</a-divider>
          <a-list
            :grid="{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 3,
              xxxl: 2
            }"
            :data-source="favCollections"
            v-if="favCollections" class="top-fav-collection"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-card hoverable style="width: 250px" @click="navigationService.goToPublicCollectionDetail(item.collection_id)">
                  <template #cover>
                    <img
                      :src="(item.img_path) ? item.img_path : `@/assets/img_music.png`"
                    />
                  </template>
                  <a-card-meta>
                    <template #title>
                      {{ item.collection_name }}
                    </template>
                    <template #description>
                      By {{ item.username }}
                    </template>
                  </a-card-meta>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-divider orientation="left">Collections</a-divider>

          <span
            ><a-input-search
              placeholder="Search collection"
              v-model:value="searchKeyword"
              style="width: 250px"
              @search="(searchValue) => fetchCollections()"
          /></span>
          <span class="sort-options"
            ><a-select
              v-model:value="sortValue"
              :options="sortOptions"
              style="width: 130px"
              @change="(sortValue) => fetchCollections()"
            >
            </a-select>
          </span>
          <a-list item-layout="horizontal" :data-source="collections">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #description>
                    <span class="created-by"
                      >By
                      <a
                        @click="
                          navigationService.goToUserDetail(item.created_by)
                        "
                      >
                        {{ item.username }}</a
                      ></span
                    >
                    <span v-if="item.collection_desc">
                      • {{ item.collection_desc }}</span
                    >
                  </template>
                  <template #title>
                    <a
                      @click="
                        () =>
                          navigationService.goToPublicCollectionDetail(
                            item.collection_id
                          )
                      "
                      >{{ item.collection_name }}</a
                    >
                  </template>
                  <template #avatar>
                    <img :src="item.img_path" class="w-50" />
                  </template>
                </a-list-item-meta>
                <div class="ml-80">
                  {{ dayjs(item.created_datetime).fromNow() }}
                </div>
              </a-list-item>
            </template>
          </a-list>

          <a-pagination
            v-model:current="current"
            :total="total"
            show-less-items
            @change="(page, pageSize) => fetchCollections(page, pageSize)"
          />
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped>
.w-50 {
  width: 50px;
}

.created-by {
  color: black;
}
.created-by a {
  color: inherit;
  text-decoration: underline;
}

.created-by a:hover {
  color: #1890ff;
}

.sort-options {
  margin-left: 10px;
}

.top-fav-collection :deep(.ant-row) > div {
  margin: 0 4%;
}

.top-fav-collection img {
  width: 250px;
}

</style>
