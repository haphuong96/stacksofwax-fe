<script setup>
import { navigationService } from '../services/navigation.service';


</script>

<template>
  <a-row class="m-16 d-flex">
    <a-col :span="16">
      <img class="homepage-cover" src="https://cdn.dribbble.com/userupload/4102239/file/original-4e946c2cbb727dc31b9b72a8f04c9175.jpg?compress=1&resize=1600x1200"/>
    </a-col>
    <a-col :span="8" class="d-flex v-flex justify-center">
      <h1>Stacks of Wax is a place to share and explore music.</h1>
      <a class="py-8" @click="navigationService.goToExploreAlbum()">Explore music >>></a>
      <a @click="navigationService.goToCollections()">Explore music collections from Stack of Wax community >>></a>
    </a-col>
  </a-row>
</template>

<style scoped>
.homepage-cover {
  width: 100%;
}
</style>
