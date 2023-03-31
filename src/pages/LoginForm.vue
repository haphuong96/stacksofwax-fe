<script setup>
import { ref } from 'vue'
import axios from 'axios';

// reactive state
const username = ref()
const password = ref()


async function submitLogin() {
  const res = await axios.post('http://localhost:4000/api/login', {
    username: username.value,
    password: password.value
  });

  const accessToken = res.data.access_token;

  localStorage.setItem("access_token", accessToken);
}
</script>

<template>
<h2>
    Login
</h2>
  <div>
    Username: <input placeholder="username or email" v-model="username">
  <br>
    Password: <input placeholder="password" v-model="password">
  </div>
  <div>
    <button @click="submitLogin">Login</button>
  </div>
  
    
</template>

<style scoped>

</style>
