<script setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { service } from "../services";
import emitter from "../utils/emitter.helper";

const { albumService, navigationService } = service;
/**
 * Album data fetch from fetchAlbums function
 */
const albums = ref();
//total number of returned data
const total = ref(0);
// current page
const current = ref(1);

const searchQuery = ref();

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
  const filter = await albumService.getAlbumFilter();
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
    const res = await albumService.getAlbums({
      searchKeyword: props.searchKeyword,
      genres: genreFilterVals.value,
      decade: decadeFilterVal.value
    }, page, pageSize);

    total.value = res.total;
    albums.value = res.albums;
  } catch (Error) {
    message.error("Error retrieving list of albums");
  }
}

async function onSearchChange(searchKeyword) {
  searchQuery.value = searchKeyword;
  fetchAlbums();
}

async function onTabChanged(tabIndex) {
  // if (tabIndex === "1" || !searchKeyword) return;
  // searchKeyword = "";
  // fetchAlbums();
}

const listArtists = computed(() => {
  if (!albumDetails.value?.artists?.length) return "";
  return albumDetails.value?.artists
    .map((artist) => {
      const artistDetailUrl = `${import.meta.env.VITE_BASE_URL}/artists/${
        artist.artistId
      }`;
      return `<a href="${artistDetailUrl}">${artist.artistName}</a>`;
    })
    .join(", ");
});

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
      <div v-if="searchQuery" class="mb-16">
        <search-outlined /> Search Keyword: {{ searchQuery }}
      </div>
      <div>
        <a-list
          item-layout="horizontal"
          :data-source="albums"
          :class="
            searchQuery
              ? 'album-page__list-album__search'
              : 'album-page__list-album'
          "
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #description>
                  <span class="a-description">
                    <a
                      @click="
                        navigationService.goToArtistDetailPage(
                          item.artists[0].artistId
                        )
                      "
                      >{{ item.artists[0].artistName }}</a
                    >
                  </span>
                  <span
                    v-for="n in item.artists.length - 1"
                    class="a-description"
                  >
                    {{ ", " }}
                    <a
                      @click="
                        navigationService.goToArtistDetailPage(
                          item.artists[n].artistId
                        )
                      "
                      >{{ item.artists[n].artistName }}</a
                    >
                  </span>
                  •
                  <span>
                    {{ item.releaseYear }}
                  </span>
                </template>
                <template #title>
                  <a
                    type="link"
                    @click="
                      (event) =>
                        navigationService.goToAlbumDetailPage(item.albumId)
                    "
                    >{{ item.albumTitle }}</a
                  >
                </template>
                <template #avatar>
                  <a
                    type="link"
                    @click="
                      (event) =>
                        navigationService.goToAlbumDetailPage(item.albumId)
                    "
                    ><img :src="item.imgPath" class="w-50"
                  /></a>
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
          show-size-changer
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

.a-description a {
  color: inherit;
}

.a-description > a:hover {
  color: #1890ff;
}

.album-page__list-album {
  height: calc(100vh - 320px);
  overflow: scroll;
}

.album-page__list-album__search {
  height: calc(100vh - 358px);
  overflow: scroll;
}
</style>
