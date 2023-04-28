<script setup>
import { localStorageKeys } from "../common/local-storage-keys";
import { navigationService } from "../services/navigation.service";

const isLoggedIn = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);

</script>

<template>
  <a-row class="m-16 d-flex scroll-page-container">
    <a-col :span="16">
      <img
        class="homepage-cover"
        src="https://cdn.dribbble.com/userupload/4102239/file/original-4e946c2cbb727dc31b9b72a8f04c9175.jpg?compress=1&resize=1600x1200"
      />
    </a-col>
    <a-col :span="8" class="d-flex v-flex justify-center">
      <h1>Stacks of Wax is a place to share and explore music.</h1>
      <a class="py-8" @click="navigationService.goToExploreAlbum()"
        >Explore music >>></a
      >
      <a @click="navigationService.goToCollections()"
        >Explore music collections from the Stack of Wax community >>></a
      >
      <div class="py-16 my-16" v-if="!isLoggedIn">
        Not a member? <a @click="navigationService.goToSignUp()">Register</a> now
        to compile and share your music collections with other music lovers!
      </div>
    </a-col>
  </a-row>
</template>

<style scoped>
.homepage-cover {
  width: 100%;
}
</style>
