<script setup>
import { message } from "ant-design-vue";
import axios from "axios";
import { computed, ref } from "vue";
import router from "../router";
import { routeNames } from "../router/route-names";
import { axiosIntance } from "../services/base.service";

// reactive state
const username = ref();
const email = ref();
const password = ref();
const confirmPassword = ref();
const isLoading = ref(false);

const isInvalidConfirmPassword = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    password.value !== confirmPassword.value
  );
});

const isValid = computed(() => {
  return (
    !isInvalidConfirmPassword.value &&
    password.value &&
    confirmPassword.value &&
    email.value &&
    username.value
  );
});

async function submitSignup() {
  try {
    const res = await axiosIntance.post("http://localhost:4000/api/signup", {
      username: username.value,
      email_address: email.value,
      password: password.value
    });
    if (res) {
      message.success("Signup successfully! You can login now.");
      router.push({ name: routeNames.LOGIN });
    } else {
      message.error("Something went wrong! please check and try again later!");
    }
  } catch (error) {
    message.error(error.response.data.message);
  } finally {
    isLoading.value = false;
  }
}

function goToLogin() {
  router.push({ name: routeNames.LOGIN });
}
</script>

<template>
  <div class="page-title mt-80 mb-32 signup-page-title">Sign Up</div>
  <a-form
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 8 }"
    autocomplete="off"
  >
    <a-form-item label="Username *" name="username">
      <a-input v-model:value="username" />
    </a-form-item>

    <a-form-item label="Email *" name="email">
      <a-input v-model:value="email" />
    </a-form-item>

    <a-form-item label="Password *" name="password">
      <a-input-password v-model:value="password" />
    </a-form-item>

    <a-form-item label="Confirm Password *" name="password">
      <a-input-password v-model:value="confirmPassword" />
      <div v-if="isInvalidConfirmPassword" class="error-label mt-8">
        Mismatch password and confirmation password. Please try again.
      </div>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 8 }">
      <a-button
        type="primary"
        shape="round"
        size="large"
        block
        @click="submitSignup"
        :loading="isLoading"
        :disabled="!isValid"
        >Signup</a-button
      >
      <a-button type="link" block @click="goToLogin"
        >Already have an account? Go to login.</a-button
      >
    </a-form-item>
  </a-form>
</template>

<style scoped>
.signup-page-title {
  text-align: center;
}
</style>
