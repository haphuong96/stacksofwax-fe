<script setup>
import axios from "axios";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";

const data = [{
  title: 'Collection 1',
}, {
  title: 'Collection 2',
}, {
  title: 'Collection 3',
}];
</script>

<template>
  <a-row>
    <a-col :span="24" class="m-16 p-16">
      <a-divider orientation="left">Top Favorite Collections</a-divider>
      <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3, xxxl: 2 }" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :title="item.title">Card content</a-card>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="24" class="m-16 p-16">
      <a-divider orientation="left">Collections</a-divider>
      <a-input-search v-model:value="value" placeholder="input search text" style="width: 200px" @search="onSearch" />
      <a-list item-layout="horizontal" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
              description="Ant Design, a design language for background applications, is refined by Ant UED Team">
              <template #title>
                <a href="https://www.antdv.com/">{{ item.title }}</a>
              </template>
              <template #avatar>
                <a-avatar src="https://joeschmoe.io/api/v1/random" />
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
  </a-row>
</template>

<style scoped></style>
