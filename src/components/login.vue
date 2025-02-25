<template>
  <div class="login-page">
    <div class="grid-container">
      <div class="login-container">
        <div class="login-box">
          <h1 class="login-title">ورود به سامانه</h1>
          <form @submit.prevent="login" class="login-form">
            <input v-model="username" type="text" placeholder="شماره کاربری" required />
            <input v-model="password" type="password" placeholder="رمز عبور" required />
            <button type="submit">ورود</button>
          </form>

          <div class="date-box">
            <div class="current-day">{{ currentDay }}</div>
            <p class="current-date">{{ currentDate }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="background-image"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import moment from "moment-jalaali";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from '../stores/authStore';

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const menuItems = ref([]);
    const router = useRouter();
    const authStore = useAuthStore();

    const today = new Date().getDay();
    const iranianWeekDay = (today + 1) % 7;

    const fallbackDays = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه"];
    const allDays = ref(fallbackDays);
    const menuItemsMap = ref({});

    const isToday = (index) => iranianWeekDay === index;

    const currentDate = computed(() => moment().format("jYYYY/jMM/jDD"));

    const currentDay = computed(() => fallbackDays[iranianWeekDay]);

    const translateDay = (dayName) => {
      const daysMapping = {
        Sunday: "یک‌شنبه",
        Monday: "دوشنبه",
        Tuesday: "سه‌شنبه",
        Wednesday: "چهارشنبه",
        Thursday: "پنج‌شنبه",
        Friday: "جمعه",
        Saturday: "شنبه",
      };
      return daysMapping[dayName] || dayName;
    };

    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://192.168.17.52:8585/api/weekly-menu/");
        menuItems.value = response.data;
        menuItems.value.forEach((item, index) => {
          const dayName = translateDay(item.day_name);
          menuItemsMap.value[dayName] = { ...item, index };
        });
      } catch (error) {
        console.error("خطا در دریافت منو:", error);
      }
    };

    onMounted(fetchMenuItems);

    const login = async () => {
      if (username.value && password.value) {
        try {
          const response = await axios.post("http://192.168.17.52:8585/auth/jwt/create", {
            personnel_code: username.value,
            password: password.value,
          });

          if (response.status === 200) {
            authStore.setTokens(response.data.access, response.data.refresh);
            router.push("/food");
          }
        } catch (error) {
          alert("خطا در ورود! لطفاً دوباره تلاش کنید.");
        }
      } else {
        alert("لطفاً اطلاعات را وارد کنید!");
      }
    };

    return { username, password, login, menuItems, isToday, currentDate, currentDay, allDays, menuItemsMap };
  },
};
</script>

<style scoped>

.today {
  background: rgba(255, 255, 255, 0.9);
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login-form input {
  padding: 12px;
  border-radius: 5px;
  border: none;
  text-align: center;
  color: black;
  font-size: 16px;
}

.login-form button {
  background-color: #28c730;
  color: white;
  padding: 12px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-form button:hover {
  background-color: #269b2b;
}

.date-box {
  margin-top: 20px;
  font-size: 14px;
  opacity: 0.7;
}

.current-day {
  font-weight: bold;
  margin-bottom: 5px;
}

.current-date {
  opacity: 0.5;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #b91c1c;
  position: relative;
}

.grid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  z-index: 10;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 40px;
  border-radius: 10px;
  position: relative;
  z-index: 10;
  width: 300px;
}

.login-box {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/images/panel.jpg");
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 0;
}
</style>
