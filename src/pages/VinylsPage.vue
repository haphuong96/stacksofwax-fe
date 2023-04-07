<script setup>
import { ref } from "vue";

const total = ref(0);
const data = ref(["item1", "item2", "item3", "item4"]);
const nextPageData = ["item5", "item6", "item7", "item8"];

function fetchData(limit, offset) {
  //fetch api
  total.value = 50;
  console.log(limit, offset);
  data.value = nextPageData;
}

fetchData(0, 10);
</script>

<template>
  <div>
    <a-list item-layout="horizontal" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <div>{{ item }}</div>
        </a-list-item>
      </template>
    </a-list>

    <a-pagination
      v-model:current="current"
      :total="total"
      show-less-items
      @change="(limit, offset) => fetchData(limit, offset)"
    />
  </div>
</template>

<style scoped></style>
