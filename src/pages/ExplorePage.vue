<template>
  <div class="search-container">
        <a-input-search
          v-model:value="searchKeyword"
          class="seach-input"
          placeholder="Search Albums, Artists and More..."
          @search="onSearch"
        />
      </div>
  <a-tabs
    v-model:activeKey="activeKey"
    type="card"
    class="mt-32"
    @change="onTabChanged"
  >
    <a-tab-pane key="1" tab="Albums">
      <AlbumsPage :currentActiveTab="activeKey" :searchKeyword="searchKeyword"></AlbumsPage>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Artists">
      <ArtistsPage :currentActiveTab="activeKey" :searchKeyword="searchKeyword"></ArtistsPage>
    </a-tab-pane>
    <template #rightExtra>
    </template>
  </a-tabs>
</template>
<script setup>
import { ref } from "vue";
import AlbumsPage from "./AlbumsPage.vue";
import ArtistsPage from "./ArtistsPage.vue";
import emitter from "../utils/emitter.helper";

const activeKey = ref("1");
const searchKeyword = ref("");

const onSearch = (searchValue) => {
  emitter.emit("ON_EXPLORE_SEARCH_CHANG_KEY", searchValue);
};

const onTabChanged = () => {
  emitter.emit("ON_EXPLORE_TAB_CHANGED", activeKey.value);
};
</script>
<style scoped>
.search-container {
  width: calc(100vw - 240px);
  display: flex;
  justify-content: start;
}

.search-container > .seach-input {
  width: 320px;
}
</style>
