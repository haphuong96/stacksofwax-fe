<template>
  <a-tabs v-model:activeKey="activeKey" type="card" class="mt-32">
    <a-tab-pane key="1" tab="Albums">
      <AlbumsPage :currentActiveTab="activeKey"></AlbumsPage>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Artists">
      <ArtistsPage :currentActiveTab="activeKey"></ArtistsPage>
    </a-tab-pane>
  </a-tabs>
</template>
<script setup>
import { ref } from "vue";
import AlbumsPage from "./AlbumsPage.vue";
import ArtistsPage from "./ArtistsPage.vue";

const activeKey = ref("1");
</script>
<style scoped></style>
