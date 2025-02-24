<template>
  <div class="body">
    <div class="container">
      <ul class="post-list">
        <li v-for="(post, index) in posts" :key="index">
          <span v-if="editingId !== post.id">{{ post.name }}</span>
          <input
            v-else
            v-if="post.id"
            v-model="changedName"
            placeholder="نام جدید"
            class="edit-input"
          />

          <div v-if="post.id" class="button-group">
            <button
              v-if="post.id && editingId !== post.id"
              class="delete-button"
              @click.stop="deleteFood(post.id)"
            >
              حذف
            </button>

            <button
              v-if="editingId !== post.id"
              class="update-button"
              @click.stop="startEditing(post.id, post.name)"
            >
              تغییر نام
            </button>

            <button
              v-if="editingId === post.id"
              class="save-button"
              @click.stop="updateFood(post.id)"
            >
              ثبت تغییرات
            </button>

            <button
              v-if="editingId === post.id"
              class="cancel-button"
              @click.stop="cancelEditing"
            >
              لغو
            </button>
          </div>
        </li>
      </ul>

      <div class="pagination">
        <div
          v-for="p in pageSize"
          :key="p"
          @click="setPage(p)"
          :class="{ active: p === page }"
        >
          {{ p }}
        </div>
      </div>
      <button class="post-button" v-if="!enablePost" @click="enablePost = true">
        افزودن غذای جدید
      </button>
      <div v-if="enablePost" class="food-form" dir="rtl">
        <input v-model="name" placeholder="نام غذا" />
        <button @click="postFood">اضافه کردن غذا</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import axios from "axios";

defineProps<{
  msg: string;
}>();

const posts = ref([]);
const name = ref("");
const changedName = ref("");
const editingId = ref(null);
const page = ref(1);
const id = ref(null);
const pageSize = ref(0);
const enableUpdate = ref(false);
const enablePost = ref(false);
const getPosts = async () => {
  axios
    .get(`http://192.168.17.52:8585/api/add-food/?page=${page.value}`)
    .then((response) => {
      posts.value = response.data.results;
      while (posts.value.length < 10) {
        posts.value.push({ id: null, name: " " });
      }
      pageSize.value = Math.ceil(response.data.count / 10);
    });
};

getPosts();

const postFood = async () => {
  enablePost.value = false;
  try {
    await axios.post("http://192.168.17.52:8585/api/add-food/", {
      name: name.value,
    });
    name.value = "";
    getPosts();
  } catch (error) {
    console.error("Error posting food:", error);
  }
};

const setPage = (p: number) => {
  page.value = p;
  getPosts();
};

const deleteFood = async (id1: number) => {
  try {
    await axios.delete(`http://192.168.17.52:8585/api/add-food/${id1}/`);
  } catch (error) {
    console.error("Error deleting food:", error);
  }
  getPosts();
};

const startEditing = (postId: number, currentName: string) => {
  editingId.value = postId;
  changedName.value = currentName;
};

const updateFood = async (postId: number) => {
  if (!changedName.value.trim()) return;
  try {
    await axios.patch(`http://192.168.17.52:8585/api/add-food/${postId}/`, {
      name: changedName.value,
    });
    getPosts();
    editingId.value = null;
  } catch (error) {
    console.error("Error updating food:", error);
  }
};
const cancelEditing = () => {
  editingId.value = null;
  changedName.value = "";
};
</script>

<style scoped>
@font-face {
  font-family: "IranSansFaNum";
  src: url("@/assets/IRAN(FaNum).ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.body {
  background-image: url("/images/panel.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  font-family: "IranSansFaNum", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  background-color: black;
  opacity: 0.95;
  width: 600px;
  height: 800px;
  max-width: 600px;
  max-height: 800px;
  padding: 50px;
  font-family: sans-serif;
  direction: rtl;
  margin-top: 50px;
  margin-bottom: 50px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 2px;
}

.post-list li {
  min-height: 35px;
  padding: 10px;
  margin-top: 10px;
  border-bottom: 1px solid #ddd;
  border-radius: 6px;
  color: white;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-id {
  display: block;
  margin: 10px 0;
  font-weight: bold;
  color: #333;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.pagination > div {
  padding: 8px 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 25px;
  text-align: center;
}

.pagination > div:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.pagination > div.active {
  box-shadow: 0 0 10px 0 rgb(178, 178, 255);
  color: rgb(178, 178, 255) !important;
}
.edit-input {
  width: 100%;
  max-width: 200px;
  padding: 6px;
  font-size: 16px;
  border: 2px solid #000000;
  border-radius: 6px;
  outline: none;
  transition: all 0.3s ease;
  background-color: #ffffff;
  color: #000000;
}

.edit-input:focus {
  border-color: #000000;
  background-color: white;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
}

.edit-input::placeholder {
  color: #aaa;
}

.update-button,
.save-button,
.cancel-button,
.delete-button {
  margin-right: 6px;
  width: 90px;
  height: 35px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.update-button {
  background-color: #ddd;
  color: black;
}
.update-button:hover {
  background-color: #b4b4b4;
}
.save-button {
  background-color: green;
  color: white;
}

.save-button:hover {
  background-color: darkgreen;
}

.cancel-button {
  background-color: gray;
  color: white;
}

.cancel-button:hover {
  background-color: darkgray;
}

.delete-button {
  background-color: red;
  color: white;
}

.delete-button:hover {
  background-color: darkred;
}

.food-form {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.food-form input {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.food-form button {
  padding: 6px 12px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.post-button {
  text-align: center;
  margin: 20px 0;
  width: 120px;
  height: 40px;
  background-color: #ddd;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.food-form button:hover {
  background-color: #218838;
}
</style>
