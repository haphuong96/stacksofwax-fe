<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";

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
const genres = await getGenreList();
// list of decades filter
const decades = ref();
// selected decade filter
const decadeFilterVal = ref();
// selected genre filter
const genreFilterVals = ref([]);

async function fetchAlbums(page, pageSize) {
  try {
    const limit = pageSize || defaultPageSize;
    const offset = (page - 1) * pageSize || defaultPage;

    console.log(decadeFilterVal.value);
    const filterParams = new URLSearchParams();

    if (decadeFilterVal.value) {

    }
    const res = await axios.get('http://localhost:4000/api/albums', {

      params: {
        limit,
        offset
      }
    });
    data.value = res.data.albums;
    total.value = res.data.total;
    decades.value = res.data.decades.map((item) => ({ value: item.decade, label: item.decade }));

    console.log(data.value);
    console.log(total.value);
    console.log(decades.value);
  } catch (Error) {
    message.error("Error retrieving list of albums")
  }
}


async function getGenreList() {
  try {
    const res = await axios.get('http://localhost:4000/api/genres')
    const genres = res.data.map((genre) => ({ label: genre.genre_name, value: genre.id }));
    return genres;
  } catch (Error) {
    message.error("Error retrieving list of genres.")
  }
}

async function filterByGenre(_filterVals, filterObjs) {
  try {
    const filterParams = new URLSearchParams();

    filterObjs.forEach((genre) => {
      filterParams.append("genreId", genre.id);
    })
    
    // pass limit offset
    filterParams.append("limit", defaultPageSize);
    filterParams.append("offset", 0);

    const res = await axios.get('http://localhost:4000/api/albums', {
      params: filterParams
    });
    console.log(res)
    data.value = res.data.albums;
  } catch (Error) {
    console.log(Error)
    message.error("Error retrieving list of albums");
  }
  
}

async function filterByDecade(filterVal) {
  const res = await axios.get('http://localhost:4000/api/albums', {
      params: filterParams
    });
}

// fetch data
fetchAlbums(defaultPage, defaultPageSize);


function goToAlbumDetailPage(item) {
  console.log('item: '+item)
  router.push( {name: routeNames.ALBUM_DETAILS, params: {album: item.album_title.join('-'), albumId: item.album_id}});
}
</script>

<template>
  <a-row>
    <a-col :span="8">
      <div>
        <h2>Genre</h2>
        <a-select v-model:value="genreFilterVals" mode="multiple" style="width: 100%" placeholder="Please select" :options="genres"
          @change="(_filterVal, _filterObjs) => fetchAlbums()"></a-select>
      </div>
      <div>
        <h2>Decade</h2>
        <a-select v-model:value="decadeFilterVal" show-search placeholder="Select a decade" style="width: 100%"
          :options="decades" :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur"
          @change="(_filterVal, _filterObjs) => fetchAlbums()"></a-select>
      </div>
    </a-col>

    <a-col :span="16">
      <h1 class="default-page-title">Explore Albums</h1>
      <div>
        <a-list item-layout="horizontal" :data-source="data">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-button type="link" @click="(event) => goToAlbumDetailPage({ item })">{{ item.album_title }}</a-button>
            </a-list-item>
          </template>
        </a-list>

        <a-pagination v-model:current="current" :total="total" show-less-items
          @change="(page, pageSize) => fetchAlbums(page, pageSize)" />
      </div>

    </a-col>
  </a-row>
</template>

<style scoped></style>
