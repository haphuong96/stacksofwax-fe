<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterView, useRoute } from "vue-router";
import emitter, { emitterEvents } from "./utils/emitter.helper";
import router from "./router";
import { routeNames } from "./router/route-names";
const $route = useRoute();
const showRequireLoginPopup = ref(false);
const layout = computed(() => $route.meta.layout || undefined);
onMounted(() => {
  emitter.on(
    emitterEvents.EXECUTE_REQUIRE_LOGIN_ACTION,
    onExecuteRequireLoginAction
  );
});

onBeforeUnmount(() => {
  emitter.off(
    emitterEvents.EXECUTE_REQUIRE_LOGIN_ACTION,
    onExecuteRequireLoginAction
  );
});

function onExecuteRequireLoginAction() {
  showRequireLoginPopup.value = true;
}

function handleOk() {
  showRequireLoginPopup.value = false;
  router.push({ name: routeNames.LOGIN });
}
</script>

<template>
  <div>
    <Suspense>
      <component :is="layout" v0>
        <router-view :key="$route.path" />
      </component>
    </Suspense>
    <a-modal
      v-model:visible="showRequireLoginPopup"
      title="Unauthorize"
      @ok="handleOk"
      :width="320"
    >
      <template #footer>
        <a-button key="back" @click="showRequireLoginPopup = false">
          Cancel
        </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
        >
          Go to Login
        </a-button>
      </template>
      <p>Please login and try again later!</p>
    </a-modal>
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
