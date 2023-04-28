<script setup lang="ts">
//#region import
//#endregion

import NavHeader from "../components/NavHeader.vue";

//#region props
//#endregion

//#region variables
//#endregion

//#region computed

//#endregion
</script>
<template>
  <nav-header class="default-layout__nav-bar"></nav-header>
  <div style="margin-top: 72px;">
    <router-view />
  </div>
</template>

<style scoped>
.default-layout__nav-bar {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 2;
}
</style>
