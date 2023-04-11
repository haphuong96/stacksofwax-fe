<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";


</script>

<template>
  <div>This is {{ this.$route.params.id }} Page</div>
</template>

<style scoped></style>
