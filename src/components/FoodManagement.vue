<template>
  <div class="container">
    <ul class="post-list">
      <li
        :class="id == post.id && id != null ? 'post-select' : ''"
        v-for="(post, index) in posts"
        :key="index"
        @click="id = post.id"
      >
        {{ post.name }}
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
    <label class="selected-id">انتخاب شده: {{ id }}</label>
    <button class="delete-button" @click="deleteFood">حذف</button>
    <br />
    <button
      class="update-button"
      v-if="!enableUpdate"
      @click="enableUpdate = true"
    >
      تغییر نام
    </button>
    <div v-if="enableUpdate" class="food-form" dir="rtl">
      <input v-model="changedName" placeholder="نام غذا" />
      <button @click="updateFood">تعویض نام غذا</button>
    </div>
    <br />
    <button class="post-button" v-if="!enablePost" @click="enablePost = true">
      افزودن غذای جدید
    </button>
    <div v-if="enablePost" class="food-form" dir="rtl">
      <input v-model="name" placeholder="نام غذا" />
      <button @click="postFood">اضافه کردن غذا</button>
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
const page = ref(1);
const id = ref(null);
const pageSize = ref(0);
const enableUpdate = ref(false);
const enablePost = ref(false);
const getPosts = async () => {
  axios
    .get(`/api/add-food/?page=${page.value}`)
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
    await axios.post("/api/add-food/", {
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

const deleteFood = async () => {
  try {
    await axios.delete(`/api/add-food/${id.value}/`);
  } catch (error) {
    console.error("Error deleting food:", error);
  }
  getPosts();
};

const updateFood = async () => {
  enableUpdate.value = false;
  try {
    await axios.patch(`/api/add-food/${id.value}/`, {
      name: changedName.value,
    });
    getPosts();
  } catch (error) {
    console.error("Error updating food:", error);
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
  direction: rtl;
}

.post-select {
  background-color: #007bff;
  color: white;
}
.post-list {
  list-style: none;
  padding: 0;
  margin: 2px;
}

.post-list li {
  min-height: 40px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.post-list li:hover {
  background-color: #f5f5f5;
  color: black;
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
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  text-align: center;
}

.pagination > div:hover {
  background-color: #e0e0e0;
}

.pagination > div.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
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
.update-button {
  text-align: center;
  margin-top: 20px;
  width: 120px;
  height: 40px;
  background-color: #ddd;
  color: black;
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
.delete-button {
  width: 120px;
  height: 40px;
  background-color: red;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.food-form button:hover {
  background-color: #218838;
}
</style>
