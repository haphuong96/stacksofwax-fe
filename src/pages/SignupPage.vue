<script setup>
import { ref } from 'vue'
import axios from 'axios';

// reactive state
const username = ref()
const email = ref()
const password = ref()
const confirmPassword = ref()
let errMismatchPw = ref();

async function submitSignup() {
    if (password !== confirmPassword) {
        errMismatchPw = "Mismatch password and confirmation password. Please try again."
    }
    const res = await axios.post('http://localhost:4000/api/signup', {
        username: username.value,
        email_address: email.value,
        password: password.value
    });

    console.log(res);

    // const newUser
}
</script>

<template>
    <h2>Sign Up</h2>
    <div>
        *Username: <input placeholder="username" v-model="username">
        <br>
        *Email: <input placeholder="email address" v-model="email">
        <br>
        *Password: <input placeholder="password" v-model="password">
        <br>
        *Re-type password: <input placeholder="confirm password" v-model="confirmPassword">
        <br>
        {{ errMismatchPw }}
    </div>
    <div>
        <button @click="submitSignup">Sign up</button>
    </div>
</template>

<style scoped></style>
