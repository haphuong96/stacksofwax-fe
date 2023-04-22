<script setup>
import { message } from "ant-design-vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import emitter from "../utils/emitter.helper";
import { service } from "../services";
import { SearchOutlined } from "@ant-design/icons-vue";

const { artistService, navigationService } = service;

/**
 * Album data fetch from fetchAlbums function
 */
const artists = ref();
//total number of returned data
const total = ref(0);
// current page
const current = ref(1);

const searchQuery = ref();

const props = defineProps({
  currentActiveTab: {
    type: String,
    default: ""
  },
  searchKeyword: {
    type: String,
    default: ""
  }
});

onMounted(async () => {
  emitter.on("ON_EXPLORE_SEARCH_CHANG_KEY", onSearchChange);
  emitter.on("ON_EXPLORE_TAB_CHANGED", onTabChanged);
  fetchArtists();
});

onBeforeUnmount(() => {
  emitter.off("ON_EXPLORE_SEARCH_CHANG_KEY", onSearchChange);
  emitter.off("ON_EXPLORE_TAB_CHANGED", onTabChanged);
});

async function fetchArtists(page, pageSize) {
  try {
    const res = await artistService.getArtists(
      page,
      pageSize,
      props.searchKeyword
    );

    artists.value = res.artists;
    total.value = res.total;
  } catch (error) {
    message.error("Cannot load artists");
  }
}

async function onSearchChange(searchKeyword) {
  searchQuery.value = searchKeyword;
  fetchArtists();
}

async function onTabChanged(tabIndex) {
  // if (tabIndex === "2" || !searchKeyword) return;
  // searchKeyword = "";
  // fetchArtists();
}
</script>

<template>
  <a-row>
    <!-- class="m-16 p-16" -->
    <a-col :span="5" class="px-32">
      <!-- <div>Explore the hottest artists</div> -->
    </a-col>

    <a-col :span="19">
      <h1 class="default-page-title">Explore Artists</h1>
      <div v-if="searchQuery" class="mb-16">
        <search-outlined /> Search Keyword: {{ searchQuery }}
      </div>
      <div v-else class="mb-16" style="height: 32px"></div>

      <div v-if="artists">
        <a-list
          item-layout="horizontal"
          :data-source="artists"
          class="artist-page-list-artist"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta description="Artist">
                <template #title>
                  <a
                    type="link"
                    @click="
                      (event) =>
                        navigationService.goToArtistDetailPage(item.artist_id)
                    "
                    >{{ item.artist_name }}</a
                  >
                </template>
                <template #avatar>
                  <a
                    type="link"
                    @click="
                      (event) =>
                        navigationService.goToArtistDetailPage(item.artist_id)
                    "
                    ><a-avatar
                      :src="item.img_path"
                      :style="{ width: '50px', height: '50px' }"
                    ></a-avatar
                  ></a>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>

        <a-pagination
          v-model:current="current"
          :total="total"
          show-less-items
          @change="(page, pageSize) => fetchArtists(page, pageSize)"
        />
      </div>
    </a-col>
  </a-row>
</template>

<style scoped>
.artist-page-list-artist {
  height: calc(100vh - 350px);
  overflow: scroll;
}
</style>
