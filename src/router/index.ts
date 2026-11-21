import { createRouter, createWebHistory } from '@ionic/vue-router'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Jadwal from '../views/Jadwal.vue'
import Pengumuman from '../views/Pengumuman.vue'
import Event from '../views/Event.vue'
import Bookmark from '../views/Bookmark.vue'
import DetailPengumuman from '../views/DetailPengumuman.vue'
import Chatbot from '../views/Chatbot.vue'
import Profile from '../views/profile.vue'
import Register from '../views/Register.vue'

const routes = [

  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/views/Welcome.vue')
  },

  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    component: Login,
    meta: { guest: true }
  },

  {
    path: '/register',
    component: Register,
  },

  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },

  {
    path: '/jadwal',
    component: Jadwal,
    meta: { requiresAuth: true }
  },

  {
    path: '/pengumuman',
    component: Pengumuman,
    meta: { requiresAuth: true }
  },

  {
    path: '/pengumuman/:id',
    component: DetailPengumuman,
    meta: { requiresAuth: true }
  },

  {
    path: '/event',
    component: Event,
    meta: { requiresAuth: true }
  },

  {
    path: '/chatbot',
    component: Chatbot,
    meta: { requiresAuth: true }
  },

  {
    path: '/bookmark',
    component: Bookmark,
    meta: { requiresAuth: true }
  },

  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('kampusku_token')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  if (to.meta.guest && token) {
    return '/dashboard'
  }

  return true
})

export default router
