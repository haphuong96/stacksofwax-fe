<script setup>
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
const $route = useRoute();

const layout = computed(() => $route.meta.layout || undefined);
</script>

<template>
  <div class="page-container">
    <Suspense>
      <component :is="layout" v0>
        <router-view :key="$route.path" />
      </component>
    </Suspense>
  </div>
</template>

<style scoped>
.page-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
