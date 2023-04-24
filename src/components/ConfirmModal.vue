<template>
  <a-modal v-model:visible="visible" :title="title" @ok="handleOk">
    <template #footer>
      <a-button key="back" @click="$emit('cancel')" :disabled="isLoading"
        >Cancel</a-button
      >
      <a-button
        key="submit"
        type="primary"
        :loading="isLoading"
        @click="$emit('confirm')"
      >
        OK
      </a-button>
    </template>
    <div v-html="message"></div>
  </a-modal>
</template>
<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  message: {
    type: String,
    default: ""
  },
  okText: {
    type: String,
    default: ""
  },
  cancelText: {
    type: String,
    default: ""
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});
</script>
<style scoped></style>
