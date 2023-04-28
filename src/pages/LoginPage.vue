<script setup>
import axios from "axios";
import { computed, ref } from "vue";
import { localStorageKeys } from "../common/local-storage-keys";
import router from "../router";
import { routeNames } from "../router/route-names";
import { message } from "ant-design-vue";
import { axiosIntance } from "../services/base.service";

// reactive state
const username = ref();
const password = ref();
const isLoading = ref(false);

const isValid = computed(() => {
  return !!username.value && !!password.value;
});

async function submitLogin() {
  try {
    isLoading.value = true;
    const res = await axios.post("http://localhost:4000/api/login", {
      username: username.value,
      password: password.value
    });
    const accessToken = res.data.access_token;

    if (accessToken) {
      localStorage.setItem(localStorageKeys.ACCESS_TOKEN, accessToken);

      // get user info and store in local storage
      const me = await axiosIntance.get("get-me");
      localStorage.setItem(localStorageKeys.USER_ID, me.data.user_id);
      localStorage.setItem(localStorageKeys.USERNAME, me.data.username);
      localStorage.setItem(localStorageKeys.USER_AVATAR, me.data.img_path);

      router.push({ name: routeNames.HOME });
      message.success("Login successfully!");
    } else {
      message.error("Something went wrong! please check and try again later!");
    }
  } catch (error) {
    console.log(error);
    message.error("Something went wrong! please check and try again later!");
  } finally {
    isLoading.value = false;
  }
}

function goToSignUp() {
  router.push({ name: routeNames.SIGNUP });
}
</script>

<template>
  <div>
    <div class="page-title mt-80 mb-32 login-page-title">Login</div>
    <a-form
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      autocomplete="off"
    >
      <a-form-item label="Username or email *" name="username">
        <a-input v-model:value="username" />
      </a-form-item>

      <a-form-item label="Password *" name="password">
        <a-input-password v-model:value="password" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 8 }">
        <a-button
          type="primary"
          shape="round"
          size="large"
          block
          @click="submitLogin"
          :loading="isLoading"
          :disabled="!isValid"
          >Login</a-button
        >
        <a-button type="link" block @click="goToSignUp"
          >You don't have account? Go to singup.</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.login-page-title {
  text-align: center;
}
</style>
