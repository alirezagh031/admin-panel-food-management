// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/login.vue'
import FoodManagement from '../components/FoodManagement.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/foods',
    name: 'FoodManagement',
    component: FoodManagement,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
