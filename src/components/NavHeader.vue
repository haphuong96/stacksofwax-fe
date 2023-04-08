<template>
  <div class="nav-header-container d-flex justify-between">
    <img
      class="nav-logo ml-32"
      src="@/assets/img_music.png"
      @click="goTo(routeNames.HOME)"
    />
    <a-tabs
      v-model:activeKey="activeKey"
      size="large"
      :tabBarGutter="48"
      @change="onTabChanged"
    >
      <a-tab-pane :key="routeNames.HOME" tab="Home"></a-tab-pane>
      <a-tab-pane :key="routeNames.ALBUM" tab="Albums"></a-tab-pane>
      <a-tab-pane :key="routeNames.ARTIST" tab="Artists"></a-tab-pane>
      <a-tab-pane :key="routeNames.COLLECTION" tab="Collections"></a-tab-pane>
    </a-tabs>
    <div>
      <a-button
        type="link"
        shape="round"
        size="large"
        @click="goTo(routeNames.SIGNUP)"
      >
        SignUp
      </a-button>
      <a-button
        type="link"
        shape="round"
        size="large"
        @click="goTo(routeNames.LOGIN)"
      >
        Login
      </a-button>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
const activeKey = ref(routeNames.HOME);

computed(() => {
  activeKey.value = router.currentRoute.value.name;
});

function onTabChanged() {
  router.push({ name: activeKey.value });
}
function goTo(routeName) {
  router.push({ name: routeName });
}

watch: {
  router.currentRoute.value.name,
    () => {
      activeKey.value = router.currentRoute.value.name;
    };
}
</script>
<style scoped>
.nav-header-container {
  height: 72px;
  width: 100%;
  background-color: white;
  box-shadow: 0px 4px 8px lightgray;
  z-index: 2px;
  align-items: center;
}

.nav-header-container > .nav-logo {
  width: 64px;
  height: 64px;
  object-fit: cover;
  cursor: pointer;
}

:deep(
    .ant-tabs-top > .ant-tabs-nav::before,
    .ant-tabs-bottom > .ant-tabs-nav::before,
    .ant-tabs-top > div > .ant-tabs-nav::before,
    .ant-tabs-bottom > div > .ant-tabs-nav::before
  ) {
  border-bottom: none !important;
}
</style>
