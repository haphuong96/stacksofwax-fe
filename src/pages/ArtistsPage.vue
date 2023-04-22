<script setup>
import { message } from "ant-design-vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { axiosIntance } from "../services/base.service";
import router from "../router";
import { routeNames } from "../router/route-names";
import emitter from "../utils/emitter.helper";
import { artistService } from "../services/artist.service";

/**
 * Album data fetch from fetchAlbums function
 */
const artists = ref();
//total number of returned data
const total = ref(0);
// current page
const current = ref(1);

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
    const res = await artistService.getArtists(page, pageSize, props.searchKeyword);

    artists.value = res.artists;
    total.value = res.total;

  } catch (error) {
    message.error("Cannot load artists");
  }
}

function goToArtistDetailPage(artistId) {
  router.push({
    name: routeNames.ARTIST_DETAILS,
    params: {
      id: artistId
    }
  });
}

async function onSearchChange(_searchKeyword) {
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
      <div v-if="artists">
        <a-list item-layout="horizontal" :data-source="artists">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta >
                <template #title>
                  <a 
                    type="link"
                    @click="(event) => goToArtistDetailPage(item.artist_id)"
                    >{{ item.artist_name }}</a
                  >
                </template>
                <template #avatar>
                  <a-avatar :src="item.img_path" :style="{'width': '50px', 'height': '50px'}"></a-avatar>
                </template>
              </a-list-item-meta>
              <!-- <a-button
                type="link"
                @click="(event) => goToArtistDetailPage(item.artist_id)"
                >{{ item.artist_name }}</a-button
              > -->
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
</style>
