<template>
  <div
    class="circle-image"
    :style="{
      width: size + 'px',
      height: size + 'px',
      borderRadius: size / 2 + 'px'
    }"
  >
    <a-image :height="size" :width="size" :src="src" :fallback="failedImage" />
  </div>
</template>
<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 40
  },
  src: {
    type: String,
    default: ""
  },
  failedImage: {
    type: String,
    default: ""
  }
});
</script>
<style scoped>
.circle-image {
  border: 4px solid lightgray;
  background-color: white;
  overflow: hidden;
  object-fit: cover;
}
</style>
