<script setup>
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
const $route = useRoute();

const layout = computed(() => $route.meta.layout || undefined);
</script>

<template>
  <div>
    <Suspense>
      <component :is="layout" v0>
        <router-view :key="$route.path" />
      </component>
    </Suspense>
  </div>
</template>

<style scoped>
.alert-modal {
  width: 400px;
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
