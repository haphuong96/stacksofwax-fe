<script setup>
import { message } from "ant-design-vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { axiosIntance } from "../services/base.service";
import router from "../router";
import { routeNames } from "../router/route-names";
import emitter from "../utils/emitter.helper";

/**
 * Album data fetch from fetchAlbums function
 */
const artists = ref();
//total number of returned data
const total = ref(0);
// current page
const current = ref(1);
// limit offset
const defaultPage = 1;
const defaultPageSize = 10;

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
  fetchArtists(defaultPage, defaultPageSize);
});

onBeforeUnmount(() => {
  emitter.off("ON_EXPLORE_SEARCH_CHANG_KEY", onSearchChange);
  emitter.off("ON_EXPLORE_TAB_CHANGED", onTabChanged);
});

async function fetchArtists(page, pageSize) {
  try {
    const limit = pageSize || defaultPageSize;
    const offset = (page - 1) * pageSize || 0;

    let params = {
      limit,
      offset
    };
    if (props.searchKeyword) {
      params = { ...params, search: props.searchKeyword };
    }

    const res = await axiosIntance.get("artists", {
      params
    });

    artists.value = res.data.artists;
    total.value = res.data.total;
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
    <a-col :span="4" class="px-32">
      <div>Explore the hottest artists</div>
      <!-- <div>
        <h2>Genre</h2>
        <a-select
          v-model:value="genreFilterVals"
          mode="multiple"
          style="width: 100%"
          placeholder="Please select"
          :options="genres"
          @change="(_filterVal, _filterObjs) => fetchAlbums()"
        ></a-select>
      </div>
      <div>
        <h2>Decade</h2>
        <a-select
          v-model:value="decadeFilterVal"
          show-search
          placeholder="Select a decade"
          style="width: 100%"
          :options="decades"
          :filter-option="filterOption"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="(_filterVal, _filterObjs) => fetchAlbums()"
        ></a-select>
      </div> -->
    </a-col>

    <a-col :span="20">
      <h1 class="default-page-title">Explore Artists</h1>
      <div v-if="artists">
        <a-list item-layout="horizontal" :data-source="artists">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-button
                type="link"
                @click="(event) => goToArtistDetailPage(item.artist_id)"
                >{{ item.artist_name }}</a-button
              >
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

<style scoped></style>
