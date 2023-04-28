<template>
  <a-spin :spinning="isLoading">
    <div class="p-32">
      <div class="d-flex justify-center">
        <div class="profile-container">
          <CircleImage
            :size="120"
            :failed-image="fallbackImage"
            :src="profileImage"
          ></CircleImage>
          <EditFilled
            class="edit-pen"
            @click="visibleChangeProfilePictureModal = true"
          />
        </div>
      </div>
      <a-row>
        <a-col :span="24" class="my-profile-center-layout">
          <div class="my-profile__lbl-name">#{{ name }}</div>
          <div class="my-profile__lbl-detail">
            {{ createdAt ? `Joined on ${createdAt}` : "" }}
          </div>
          <div class="my-profile__lbl-detail">
            {{ lastActiveTime ? `Last online ${lastActiveTime}` : "" }}
          </div>
        </a-col>
      </a-row>
    </div>
  </a-spin>
  <a-modal
    v-model:visible="visibleChangeProfilePictureModal"
    title="Change Profile Picture"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="visibleChangeProfilePictureModal = false">
        Cancel
      </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="saveNewProfilePicture"
      >
        Update
      </a-button>
    </template>
    <div>Please enter your profile image url:</div>
    <a-input v-model:value="newProfileImageUrl"></a-input>
    <div class="mt-16">or select default image</div>
    <a-list
      class="mt-8"
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 3, xxxl: 2 }"
      :data-source="defaultImage"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-image
            :src="item"
            :preview="false"
            style="cursor: pointer"
            @click="newProfileImageUrl = item"
          />
        </a-list-item>
      </template>
    </a-list>
  </a-modal>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { service } from "../services";
import router from "../router";
import { message } from "ant-design-vue";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import format from "date-fns/format";
import fallbackImage from "../assets/ic_user.png";

import { EditFilled } from "@ant-design/icons-vue";
import CircleImage from "../components/CircleImage.vue";

const isLoading = ref(false);
const name = ref("");
const createdAt = ref("");
const lastActiveTime = ref("");
const profileImage = ref("");
const newProfileImageUrl = ref("");

const visibleChangeProfilePictureModal = ref(false);
const defaultImage = ref([
  "https://randomuser.me/api/portraits/lego/1.jpg",
  "https://randomuser.me/api/portraits/lego/8.jpg",
  "https://randomuser.me/api/portraits/lego/4.jpg",
  "https://randomuser.me/api/portraits/lego/3.jpg",
  "https://randomuser.me/api/portraits/lego/5.jpg",
  "https://randomuser.me/api/portraits/lego/2.jpg",
  "https://randomuser.me/api/portraits/lego/0.jpg",
  "https://randomuser.me/api/portraits/lego/7.jpg",
  "https://randomuser.me/api/portraits/lego/6.jpg"
]);

onMounted(async () => {
  isLoading.value = true;
  const userInfo = await service.userService.getMyProfile();
  isLoading.value = false;
  if (userInfo) {
    name.value = userInfo.username;
    profileImage.value = userInfo.img_path;
    createdAt.value = format(
      new Date(userInfo.created_datetime),
      "MMM dd yyyy"
    );
    lastActiveTime.value = formatFromNow(userInfo.last_active);
  } else {
    router.go(-1);
    message.error("Cannot get user info");
  }
});

function formatFromNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    includeSeconds: true
  });
}

async function saveNewProfilePicture() {
  try {
    const isSuccess = await service.userService.updateUserProfilePicture(
      newProfileImageUrl.value
    );
    if (isSuccess) {
      message.success("Update successfully!");
      profileImage.value = newProfileImageUrl.value;
      visibleChangeProfilePictureModal.value = false;
      return;
    }
    message.error("Update failed!");
  } catch (error) {
    message.error(error);
  } finally {
    newProfileImageUrl.value = "";
  }
}
</script>
<style scoped>

.my-profile__lbl-name {
  font-size: 24px;
  color: black;
}

.my-profile__lbl-detail {
  font-size: 14px;
  color: black;
}

.my-profile-center-layout {
  text-align: center;
}

.profile-container {
  position: relative;
}

.profile-image {
  position: absolute;
}

.default-profile-image {
  cursor: pointer;
}

.edit-pen {
  position: absolute;
  right: 8px;
  top: 8px;
  cursor: pointer;
  border: 2px solid lightgray;
  padding: 2px;
  border-radius: 12px;
  background-color: white;
}
</style>
