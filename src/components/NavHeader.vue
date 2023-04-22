<template>
  <div class="nav-header-container d-flex justify-between">
    <div class="logo-container d-flex">
      <img
        class="nav-logo ml-32"
        src="@/assets/img_music.png"
        @click="goTo(routeNames.HOME)"
      />
    </div>
    <a-tabs
      v-model:activeKey="activeKey"
      size="large"
      :tabBarGutter="48"
      @change="onTabChanged"
    >
      <a-tab-pane :key="routeNames.HOME" tab="Home"></a-tab-pane>
      <a-tab-pane :key="routeNames.EXPLORE" tab="Explore"></a-tab-pane>
      <a-tab-pane :key="routeNames.COLLECTION" tab="Collections"></a-tab-pane>
    </a-tabs>
    <div v-if="!isLoggedIn" class="d-flex h-flex justify-flex-end">
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
    <div v-else class="d-flex h-flex justify-flex-end">
      <a-button type="link" @click="() => goTo(routeNames.MY_COLLECTION)"
        ><CollectionIcon
          type="icon-music_albums_fill"
          :style="{ fontSize: '24px' }"
      /></a-button>
      <div class="demo-dropdown-wrap">
        <a-dropdown-button @click="goToMyProfile">
          {{ username }}
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <!-- <a-menu-item key="1">
                <UserOutlined />
                1st menu item
              </a-menu-item>
              <a-menu-item key="2">
                <UserOutlined />
                2nd menu item
              </a-menu-item> -->
              <a-menu-item key="3" @click="signout">
                <UserOutlined />
                SignOut
              </a-menu-item>
            </a-menu>
          </template>
          <template #icon>
            <UserOutlined />
          </template>
        </a-dropdown-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { UserOutlined, createFromIconfontCN } from "@ant-design/icons-vue";
import { ref } from "vue";
import { localStorageKeys } from "../common/local-storage-keys";
import router from "../router";
import { routeNames } from "../router/route-names";
import { service } from "../services";

const CollectionIcon = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_4014814_08ddunxy7bas.js"
});

const activeKey = ref(routeNames.HOME);
activeKey.value = router.currentRoute.value.name;

const username = ref(localStorage.getItem(localStorageKeys.USERNAME));
const isLoggedIn = ref(!!localStorage.getItem(localStorageKeys.ACCESS_TOKEN));

function onTabChanged() {
  router.push({ name: activeKey.value });
}
function goTo(routeName) {
  router.push({ name: routeName });
}

function goToMyProfile() {
  router.push({ name: routeNames.ME });
}

function signout() {
  service.userService.signout();
  isLoggedIn.value = false;
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

.nav-header-container > .logo-container {
  justify-content: center;
  align-items: center;
}

.nav-header-container > .logo-container > .nav-logo {
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

.demo-dropdown-wrap :deep(.ant-dropdown-button) {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
