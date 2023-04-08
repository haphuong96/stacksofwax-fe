<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";

// const handleChange = value => {
//       console.log(`selected ${value}`);
//     };
//     return {
//       handleChange,
//       value: ref(['a1', 'b2']),
//     };

// album list
const data = ref();
const total = ref(0);

async function fetchAlbums() {
  try {
    const res = await axios.get('http://localhost:4000/api/albums', {
      params: {
        limit: 10,
        offset: 0
      }
    });
    data.value = res.data;
    // console.log(data.value)
  } catch (Error) {
    message.error("Error retrieving list of albums")
  }
}


async function getGenreList() {
  try {
    const res = await axios.get('http://localhost:4000/api/genres')
    const genres = res.data.map((genre) => ({ value: genre.genre_name }));
    // const genreList = genres;
    // console.log(genres);
    return genres;
    // return genres.value.map((genre) => ({ value: genre.genre_name}))
  } catch (Error) {
    message.error("Error retrieving list of genres.")
  }
}

// fetch data
fetchAlbums();
const genres = await getGenreList();

// console.log(genres);
// const genreFilterList = genres.map((genre) => ({ value: genre.genre_name}));

[...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))

</script>

<template>
  <a-row>
    <a-col :span="8">
      <div>
        <h2>Genre</h2>
        <a-select v-model:value="value" mode="multiple" style="width: 100%" placeholder="Please select" :options="genres"
          @change="handleChange"></a-select>
      </div>
      <div>
        <h2>Decade</h2>
        <div>List of decades to select</div>
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
          @change="(limit, offset) => fetchData(limit, offset)" />
      </div>

    </a-col>
  </a-row>
</template>

<style scoped></style>
