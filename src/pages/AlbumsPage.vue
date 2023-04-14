<script setup>
import { message } from "ant-design-vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
import { service } from "../services";

/**
 * Album data fetch from fetchAlbums function
 */
const data = ref();
//total number of returned data
const total = ref(0);
// current page
const current = ref(1);
// limit offset
const defaultPage = 1;
const defaultPageSize = 10;
// list of genre filter
const genres = ref([]);
// list of decades filter
const decades = ref([]);
// selected decade filter
const decadeFilterVal = ref();
// selected genre filter
const genreFilterVals = ref([]);

onMounted(async () => {
  const filter = await service.albumService.getAlbumFilter();
  const { genres: genresFilter, decades: decadesFilter } = filter;
  genres.value = genresFilter;
  decades.value = decadesFilter;

  // fetch data
  await fetchAlbums(defaultPage, defaultPageSize);
});

async function fetchAlbums(page, pageSize) {
  try {
    const limit = pageSize || defaultPageSize;
    const offset = (page - 1) * pageSize || 0;
    if (decadeFilterVal.value) {
    }
    const res = await axios.get("http://localhost:4000/api/albums", {
      params: {
        limit,
        offset
      }
    });
    data.value = res.data.albums;
    total.value = res.data.total;
  } catch (Error) {
    message.error("Error retrieving list of albums");
  }
}

async function filterByGenre(_filterVals, filterObjs) {
  try {
    const filterParams = new URLSearchParams();

    filterObjs.forEach((genre) => {
      filterParams.append("genreId", genre.id);
    });

    // pass limit offset
    filterParams.append("limit", defaultPageSize);
    filterParams.append("offset", 0);

    const res = await axios.get("http://localhost:4000/api/albums", {
      params: filterParams
    });
    console.log(res);
    data.value = res.data.albums;
  } catch (Error) {
    console.log(Error);
    message.error("Error retrieving list of albums");
  }
}

async function filterByDecade(filterVal) {
  const res = await axios.get("http://localhost:4000/api/albums", {
    params: filterParams
  });
}

function goToAlbumDetailPage(albumId) {
  console.log("item: " + albumId);
  router.push({ name: routeNames.ALBUM_DETAILS, params: { id: albumId } });
}
</script>

<template>
  <a-row>
    <a-col :span="8">
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
          @focus="handleFocus"
          @blur="handleBlur"
          @change="(_filterVal, _filterObjs) => fetchAlbums()"
        ></a-select>
      </div>
    </a-col>

    <a-col :span="16">
      <h1 class="default-page-title">Explore Albums</h1>
      <div>
        <a-list item-layout="horizontal" :data-source="data">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-button
                type="link"
                @click="(event) => goToAlbumDetailPage(item.album_id)"
                >{{ item.album_title }}</a-button
              >
            </a-list-item>
          </template>
        </a-list>

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

<style scoped></style>
