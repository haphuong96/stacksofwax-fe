<script setup>
import { message } from "ant-design-vue";
import axios from "axios";
import {
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref
} from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
import { service } from "../services";
import emitter from "../utils/emitter.helper";
import pagination from "../utils/pagination.helper";

/**
 * Album data fetch from fetchAlbums function
 */
const albums = ref();
//total number of returned data
const total = ref(0);
// current page
const current = ref(1);

// list of genre filter
const genres = ref([]);
// list of decades filter
const decades = ref([]);
// selected decade filter
const decadeFilterVal = ref();
// selected genre filter
const genreFilterVals = ref([]);

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
  const filter = await service.albumService.getAlbumFilter();
  const { genres: genresFilter, decades: decadesFilter } = filter;
  genres.value = genresFilter;
  decades.value = decadesFilter;

  // fetch data
  await fetchAlbums();
});

onBeforeUnmount(() => {
  emitter.off("ON_EXPLORE_SEARCH_CHANG_KEY", onSearchChange);
  emitter.off("ON_EXPLORE_TAB_CHANGED", onTabChanged);
});

async function fetchAlbums(page, pageSize) {
  try {
    const res = await service.albumService.getAlbums(page, pageSize, {
      searchKeyword: props.searchKeyword,
      genres: genreFilterVals.value,
      decade: decadeFilterVal.value
    });

    total.value = res.total;
    albums.value = res.albums;
  } catch (Error) {
    console.log(Error);
    message.error("Error retrieving list of albums");
  }
}

function goToAlbumDetailPage(albumId) {
  console.log("item: " + albumId);
  router.push({ name: routeNames.ALBUM_DETAILS, params: { id: albumId } });
}

async function onSearchChange(_searchKeyword) {
  fetchAlbums();
}

async function onTabChanged(tabIndex) {
  // if (tabIndex === "1" || !searchKeyword) return;
  // searchKeyword = "";
  // fetchAlbums();
}
</script>

<template>
  <a-row>
    <a-col :span="5" class="px-32">
      <div>
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
          :allowClear="true"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="(_filterVal, _filterObjs) => fetchAlbums()"
        ></a-select>
      </div>
    </a-col>

    <a-col :span="19">
      <h1 class="default-page-title">Explore Albums</h1>
      <div>
        <a-list item-layout="horizontal" :data-source="albums">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #description>
                  <span>
                  {{ item.artists[0].artist_name }}
                  
                </span>
                <span v-if="item.artists.length > 1" v-for="n in item.artists.length - 1">
                 {{ ", " }}{{ item.artists[n].artist_name }}
                </span>
                </template>
                <template #title>
                  <a 
                    type="link"
                    @click="(event) => goToAlbumDetailPage(item.album_id)"
                    >{{ item.album_title }}</a
                  >
                </template>
                <template #avatar>
                  <img :src="item.img_path" class="w-50" />
                </template>
              </a-list-item-meta>
              
              
            </a-list-item>
          </template>
        </a-list>
      </div>
      <div>
        <a-pagination
          v-model:current="current"
          :total="total"
          show-less-items
          @change="(page, pageSize) => fetchAlbums(page, pageSize)"
        />
      </div>
    </a-col>
  </a-row>
</template>

<style scoped>
.w-50 {
  width: 50px;
}

.left-align {
  /* margin-left: 0; */
}
</style>
