<script setup>
import { RouterLink, RouterView } from 'vue-router';

</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login">Log In</RouterLink>
      <RouterLink to="/signup">Sign Up</RouterLink>
    </nav>
  </header>
  <div class="page-container">
    <RouterView />
  </div>
</template>

<style scoped></style>
