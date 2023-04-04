<script setup lang="ts">
//#region import
//#endregion

import NavHeader from '../components/NavHeader.vue';

//#region props
//#endregion

//#region variables
//#endregion

//#region computed

//#endregion
</script>
<template>
  <div class="default-layout">
    <nav-header></nav-header>
    <router-view />
  </div>
</template>

<style scoped>
.default-layout {
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
