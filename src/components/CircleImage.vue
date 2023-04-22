<template>
  <div
    class="circle-image"
    :style="{
      width: size + 'px',
      height: size + 'px',
      borderRadius: size / 2 + 'px',
      border: bordered ? '4px solid lightgray' : ''
    }"
  >
    <a-image
      :style="{
        width: size + 'px',
        height: size + 'px'
      }"
      :src="src"
      :fallback="failedImage"
    />
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
  },
  bordered: {
    type: Boolean,
    default: false
  }
});
</script>
<style scoped>
.circle-image {
  background-color: white;
  overflow: hidden;
}

:deep(.ant-image-img) {
  object-fit: cover !important;
}
</style>
