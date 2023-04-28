<script setup>
import { message } from "ant-design-vue";
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { service } from "../services";
import fallbackCollectionIcon from "../assets/ic_fallback_collection.png";
import { HeartFilled } from "@ant-design/icons-vue";
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
    const data = await collectionService.getCollections(1, 5, {
      sortBy: "-likes"
    });
    favCollections.value = data.collections;
  } catch (error) {
    message.error("Cannot load favorite collections");
  }
}

async function fetchCollections(page, pageSize) {
  try {
    const data = await collectionService.getCollections(page, pageSize, {
      searchKeyword: searchKeyword.value,
      sortBy: sortValue.value
    });

    collections.value = data.collections;
    total.value = data.total;
    console.log(total.value)
  } catch (error) {
    message.error("Cannot load collections");
  }
}
</script>

<template>
  <div class="scroll-page-container">
    <a-row class="m-16 p-16">
      <a-col :span="24">
        <a-row>
          <a-col :span="24">
            <a-divider orientation="left">Top Favorite Collections</a-divider>
            <div class="fav-collection-container">
              <div
                v-for="item of favCollections"
                class="fav-collection-item-container"
                @click="
                  navigationService.goToPublicCollectionDetail(
                    item.collection_id
                  )
                "
              >
                <div class="fav-collection-item-content">
                  <div class="mb-16">
                    <a-image
                      :src="item.img_path || ''"
                      :fallback="fallbackCollectionIcon"
                      :preview="false"
                    />
                  </div>
                  <div class="fav-collection-item-name">
                    {{ item.collection_name }}
                  </div>
                  <div class="fav-collection-item-created">
                    By <b>{{ item.username }}</b>
                  </div>
                  <div class="fav-collection-item-like-container">
                    <HeartFilled class="fav-collection-item-heart" />{{
                      item.likes_count +
                      (item.likes_count > 1 ? " likes" : " like")
                    }}
                  </div>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row class="mt-16">
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
            <a-list item-layout="horizontal" :data-source="collections" class="mt-16">
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
                      <a-image
                        :src="item.img_path || ''"
                        :width="50"
                        :height="50"
                        class="w-50"
                        :fallback="fallbackCollectionIcon"
                        :preview="fasle"
                      />
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
              show-size-changer
              @change="(page, pageSize) => fetchCollections(page, pageSize)"
            class="my-16"/>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
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

.fav-collection-container {
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.fav-collection-item-container {
  margin: 16px;
  cursor: pointer;
  max-width: 200px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.fav-collection-item-content {
  margin: 16px;
}

.fav-collection-item-container:hover {
  box-shadow: 0px 0px 4px #88888850;
}

.fav-collection-item-name {
  font-size: 16px;
  font-weight: 700;
  color: black;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fav-collection-item-created {
  font-size: 14px;
  font-weight: 300;
  margin: 2px 0px;
  color: gray;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fav-collection-item-like-container {
  display: flex;
  align-items: center;
  text-align: center;
}

.fav-collection-item-heart {
  color: #be3930;
  margin-right: 8px;
}
</style>
