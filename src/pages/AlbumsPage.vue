<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";


// album list
const data = ref();
//total number of returned data
const total = ref(0);
// current page
const current = ref(1);
// list of genre filter
const genres = await getGenreList();
// list of decades filter
const decades = ref();
// selected value of decade filter
const decadeValue = ref();
// selected values of genre filter
const genreValue = ref();

async function fetchAlbums(page, pageSize) {
  try {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    const res = await axios.get('http://localhost:4000/api/albums', {

      params: {
        limit,
        offset
      }
    });
    data.value = res.data.albums;
    total.value = res.data.total;
    decades.value = res.data.decades.map((item) => ({ value: item.decade, label: item.decade}));

    console.log(decades.value)
  } catch (Error) {
    message.error("Error retrieving list of albums")
  }
}


async function getGenreList() {
  try {
    const res = await axios.get('http://localhost:4000/api/genres')
    const genres = res.data.map((genre) => ({ value: genre.genre_name, id: genre.id }));
    return genres;
  } catch (Error) {
    message.error("Error retrieving list of genres.")
  }
}

async function filterByGenre(value, selectedVals) {

  const res = await axios.post('http://localhost:4000/api/albums', {
    params: selectedVals
  })
}

// fetch data
fetchAlbums(1, 10);



</script>

<template>
  <a-row>
    <a-col :span="8">
      <div>
        <h2>Genre</h2>
        <a-select v-model:value="value" mode="multiple" style="width: 100%" placeholder="Please select" :options="genres"
          @change="filterByGenre"></a-select>
      </div>
      <div>
        <h2>Decade</h2>
        <a-select
          v-model:value="decadeValue"
          show-search
          placeholder="Select a decade"
          style="width: 100%"
          :options="decades"
          :filter-option="filterOption"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="filterByDecade"
        ></a-select>
      </div>
    </a-col>

    <a-col :span="16">
      <h1 class="default-page-title">Explore Albums</h1>
      <div>
        <a-list item-layout="horizontal" :data-source="data">
          <template #renderItem="{ item }">
            <a-list-item>
              <div>{{ item.album_title }}</div>
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
