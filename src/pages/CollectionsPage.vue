<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import { axiosIntance } from "../services/base.service";

const collections = ref();
const favCollections = ref([]);
const total = ref(0);
const current = ref(1);
// limit offset
const defaultPage = 1;
const defaultPageSize = 10;

onMounted(async () => {
  fetchCollections(defaultPage, defaultPageSize);
});

async function fetchFavoriteCollections() {
  try {

    const sortParams = new URLSearchParams();

    sortParams.append("sort", "like");
    sortParams.append("limit", 3);
    sortParams.append("offset", 0);

    const res = await axiosIntance.get('collections', {
      params: sortParams
    });

    favCollections.value = res.data;

  } catch (error) {
    message.error("Cannot load favorite collections")
  }
}

async function fetchCollections(page, pageSize) {
  try {
    const limit = pageSize || defaultPageSize;
    const offset = (page - 1) * pageSize || 0;
    
    const res = await axiosIntance.get('collections', {
      params: {
        limit,
        offset
      }
    });

    collections.value = res.data.collections;
    total.value = res.data.total;
  } catch (error) {
    console.log(error)
    message.error("Cannot load collections")
  }
}
</script>

<template>
  <a-row>
    <a-col :span="24" class="m-16 p-16">
      <a-divider orientation="left">Top Favorite Collections</a-divider>
      <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3, xxxl: 2 }" :data-source="favCollections">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :title="item.title">Card content</a-card>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="24" class="m-16 p-16">
      <a-divider orientation="left">Collections</a-divider>
      <a-input-search v-model:value="value" placeholder="input search text" style="width: 200px" @search="onSearch" />
      <a-list item-layout="horizontal" :data-source="collections">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                {{ item.collection_desc }}
              </template>
              <template #title>
                <a href="https://www.antdv.com/">{{ item.collection_name }}</a>
              </template>
              <template #avatar>
                <a-avatar src="https://joeschmoe.io/api/v1/random" />
              </template>
            </a-list-item-meta>
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
</template>

<style scoped></style>
