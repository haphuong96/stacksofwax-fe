<script setup>
import { ref } from "vue";
import axios from "axios";
import router from "../router";
import { routeNames } from "../router/route-names";
import { localStorageKeys } from "../common/local-storage-keys";

// reactive state
const username = ref();
const password = ref();

async function submitLogin() {
  try {
    const res = await axios.post("http://localhost:4000/api/login", {
      username: username.value,
      password: password.value
    });
    const accessToken = res.data.access_token;
    if (accessToken) {
      localStorage.setItem(localStorageKeys.ACCESS_TOKEN, "accessToken");
      router.push({ name: routeNames.HOME });
      //router.push({name: ...}) to nagivate to a page
    } else {
      alert("fail");
    }
  } catch (error) {
    alert("fail");
  }
}
</script>

<template>
  <div>Login</div>
  <div>
    Username: <input placeholder="username or email" v-model="username" />
    <br />
    Password: <input placeholder="password" v-model="password" />
  </div>
  <div>
    <button @click="submitLogin">Login</button>
  </div>
</template>

<style scoped></style>
