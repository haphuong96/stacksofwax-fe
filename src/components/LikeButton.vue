<template>
  <HeartFilled
    :class="like ? 'like-button-liked' : 'like-button'"
  ></HeartFilled>
</template>
<script setup>
import { HeartFilled } from "@ant-design/icons-vue";
const props = defineProps({
  like: {
    type: Boolean,
    default: false
  }
});
</script>
<style scoped>
.like-button {
  cursor: pointer;
  color: gray;
  font-size: 24px;
}

.like-button-liked {
  cursor: pointer;
  color: #be3930;
  font-size: 24px;
}
</style>
