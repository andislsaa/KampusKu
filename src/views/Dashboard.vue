<template>
  <ion-page>

    <!-- =========================
         HEADER
    ========================== -->
    <ion-header :translucent="true">
      <ion-toolbar class="header-toolbar">

        <div class="header-wrapper">

          <div class="header-left">
            <div class="app-logo">
              <img
                src="/assets/logo-kampusku.png"
                alt="Logo KampusKu"
              />
            </div>

            <div>
              <h2>KampusKu</h2>
              <p>Informasi kampusmu</p>
            </div>
          </div>

          <button
            class="notification-button"
            @click="showNotification"
          >
            🔔
          </button>

        </div>

      </ion-toolbar>
    </ion-header>


    <!-- =========================
         CONTENT
    ========================== -->
    <ion-content
      :fullscreen="true"
      class="dashboard-page"
    >

      <!-- =========================
           GREETING
      ========================== -->
      <section
        class="greeting-section"
        @click="goToProfile"
      >

        <div>
          <p class="greeting-small">
            Selamat datang 👋
          </p>

          <h1>
            {{ user?.name || 'Mahasiswa' }}
          </h1>

          <p class="student-info">
            {{ user?.prodi || 'Ilmu Komputer' }}
          </p>

          <p class="student-nim">
            NIM: {{ user?.nim || '-' }}
          </p>
        </div>

        <div class="profile-avatar">
          {{ getInitial(user?.name) }}
        </div>

      </section>


      <!-- =========================
           SEARCH
      ========================== -->
      <div class="search-wrapper">

        <div class="search-box">

          <span class="search-icon">
            🔍
          </span>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari informasi kampus..."
            @keyup.enter="handleSearch"
          />

        </div>

      </div>


      <!-- =========================
           PROFILE CARD
      ========================== -->
      <section class="profile-card">

        <div class="profile-card-header">

          <div>
            <span class="section-label">
              PROFIL AKADEMIK
            </span>

            <h3>
              {{ user?.prodi || 'Ilmu Komputer' }}
            </h3>
          </div>

          <div class="profile-card-icon">
            🎓
          </div>

        </div>

        <div class="profile-grid">

          <div class="profile-item">
            <span>Fakultas</span>
            <strong>
              {{ user?.fakultas || '-' }}
            </strong>
          </div>

          <div class="profile-item">
            <span>Angkatan</span>
            <strong>
              {{ user?.angkatan || '-' }}
            </strong>
          </div>

          <div class="profile-item">
            <span>Kelas</span>
            <strong>
              {{ user?.kelas || '-' }}
            </strong>
          </div>

        </div>

      </section>


      <!-- =========================
           JADWAL HARI INI
      ========================== -->
      <section class="section-container">

        <div class="section-header">

          <div>
            <span class="section-label">
              JADWAL
            </span>

            <h2>
              Hari Ini
            </h2>
          </div>

          <button
            class="see-all-button"
            @click="goTo('/jadwal')"
          >
            Lihat semua
          </button>

        </div>


        <!-- LOADING -->
        <div
          v-if="loadingSchedules"
          class="loading-box"
        >
          <ion-spinner name="crescent"></ion-spinner>
          <span>Memuat jadwal...</span>
        </div>


        <!-- EMPTY -->
        <div
          v-else-if="todaySchedules.length === 0"
          class="empty-card"
        >
          <div class="empty-icon">
            📚
          </div>

          <div>
            <h3>Tidak ada jadwal hari ini</h3>

            <p>
              Nikmati waktumu atau cek jadwal minggu ini.
            </p>
          </div>
        </div>


        <!-- SCHEDULE -->
        <div
          v-else
          class="schedule-list"
        >

          <div
            v-for="schedule in todaySchedules.slice(0, 3)"
            :key="schedule.id"
            class="schedule-card"
          >

            <div class="schedule-time">

              <strong>
                {{ formatTime(schedule.jam_mulai) }}
              </strong>

              <span>
                {{ formatTime(schedule.jam_selesai) }}
              </span>

            </div>

            <div class="schedule-line"></div>

            <div class="schedule-content">

              <h3>
                {{ schedule.mata_kuliah || 'Mata Kuliah' }}
              </h3>

              <p>
                👨‍🏫
                {{ schedule.dosen || '-' }}
              </p>

              <p>
                📍
                {{ schedule.ruang || '-' }}
              </p>

            </div>

          </div>

        </div>

      </section>


      <!-- =========================
           PENGUMUMAN
      ========================== -->
      <section class="section-container">

        <div class="section-header">

          <div>
            <span class="section-label">
              INFORMASI
            </span>

            <h2>
              Pengumuman Terbaru
            </h2>
          </div>

          <button
            class="see-all-button"
            @click="goTo('/pengumuman')"
          >
            Lihat semua
          </button>

        </div>


        <div
          v-if="loadingAnnouncements"
          class="loading-box"
        >
          <ion-spinner name="crescent"></ion-spinner>
          <span>Memuat pengumuman...</span>
        </div>


        <div
          v-else-if="announcements.length === 0"
          class="empty-card"
        >
          <div class="empty-icon">
            📢
          </div>

          <div>
            <h3>Belum ada pengumuman</h3>

            <p>
              Pengumuman terbaru akan muncul di sini.
            </p>
          </div>
        </div>


        <div
          v-else
          class="announcement-list"
        >

          <div
            v-for="announcement in announcements.slice(0, 3)"
            :key="announcement.id"
            class="announcement-card"
            @click="goTo('/pengumuman')"
          >

            <div class="announcement-date">

              <strong>
                {{ getDay(announcement.tanggal) }}
              </strong>

              <span>
                {{ getMonth(announcement.tanggal) }}
              </span>

            </div>

            <div class="announcement-content">

              <h3>
                {{ announcement.judul }}
              </h3>

              <p>
                {{ truncateText(announcement.isi, 90) }}
              </p>

            </div>

          </div>

        </div>

      </section>


      <!-- =========================
           EVENT
      ========================== -->
      <section class="section-container">

        <div class="section-header">

          <div>
            <span class="section-label">
              AGENDA
            </span>

            <h2>
              Event Terdekat
            </h2>
          </div>

          <button
            class="see-all-button"
            @click="goTo('/event')"
          >
            Lihat semua
          </button>

        </div>


        <div
          v-if="loadingEvents"
          class="loading-box"
        >
          <ion-spinner name="crescent"></ion-spinner>
          <span>Memuat event...</span>
        </div>


        <div
          v-else-if="events.length === 0"
          class="empty-card"
        >
          <div class="empty-icon">
            🎫
          </div>

          <div>
            <h3>Belum ada event</h3>

            <p>
              Event kampus akan muncul di sini.
            </p>
          </div>
        </div>


        <div
          v-else
          class="event-list"
        >

          <div
            v-for="event in events.slice(0, 3)"
            :key="event.id"
            class="event-card"
            @click="goTo('/event')"
          >

            <div class="event-date">

              <strong>
                {{ getDay(event.tanggal) }}
              </strong>

              <span>
                {{ getMonth(event.tanggal) }}
              </span>

            </div>

            <div class="event-content">

              <h3>
                {{ event.judul }}
              </h3>

              <p>
                📍 {{ event.lokasi }}
              </p>

              <small>
                {{ event.cakupan }}
              </small>

            </div>

          </div>

        </div>

      </section>


      <!-- =========================
           CHATBOT
      ========================== -->
      <section class="chatbot-section">

        <div class="chatbot-icon">
          🤖
        </div>

        <div class="chatbot-content">

          <h2>
            Butuh Bantuan?
          </h2>

          <p>
            Tanya apa saja tentang KampusKu.
          </p>

        </div>

        <button
          class="chatbot-arrow"
          @click="openChatbot"
        >
          →
        </button>

      </section>


      <!-- =========================
           LOGOUT
      ========================== -->
      <button
        class="logout-button"
        @click="logout"
      >
        <span>↪</span>
        Logout
      </button>


      <!-- RUANG UNTUK BOTTOM NAV -->
      <div class="bottom-space"></div>

    </ion-content>


    <!-- =========================
         BOTTOM NAVIGATION
    ========================== -->
    <BottomNav />

  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonSpinner,
} from '@ionic/vue'

import {
  ref,
  computed,
  onMounted,
} from 'vue'

import axios from 'axios'
import { useRouter } from 'vue-router'

import BottomNav from '../components/BottomNav.vue'


/* =========================
   ROUTER
========================= */

const router = useRouter()


/* =========================
   API
========================= */

const API_URL = 'https://kampusku-api-production.up.railway.app/api'


/* =========================
   USER
========================= */

const user =
  ref<any>(null)


/* =========================
   SEARCH
========================= */

const searchQuery =
  ref('')


/* =========================
   DATA
========================= */

interface Schedule {
  id: number
  course_id?: number
  angkatan?: string
  kelas?: string
  hari: string
  jam_mulai: string
  jam_selesai: string
  ruang: string
  mata_kuliah: string
  dosen: string
  sks: number
  fakultas?: string
  prodi?: string
}

const schedules =
  ref<Schedule[]>([])

const announcements =
  ref<any[]>([])

const events =
  ref<any[]>([])


/* =========================
   LOADING
========================= */

const loadingSchedules =
  ref(true)

const loadingAnnouncements =
  ref(true)

const loadingEvents =
  ref(true)


/* =========================
   TOKEN
========================= */

const getToken = () => {

  return localStorage.getItem(
    'kampusku_token'
  )

}


/* =========================
   LOAD USER
========================= */

const loadUser = async () => {

  const token =
    getToken()

  if (!token) {

    router.replace('/login')

    return

  }


  try {

    const response =
      await axios.get(
        `${API_URL}/me`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            Accept:
              'application/json'
          }
        }
      )


    const userData =
      response.data?.data


    user.value =
      userData


    localStorage.setItem(
      'kampusku_user',
      JSON.stringify(userData)
    )


  } catch (error: any) {

    console.error(
      'Gagal mengambil data user:',
      error
    )


    if (
      error.response?.status === 401
    ) {

      localStorage.removeItem(
        'kampusku_token'
      )

      localStorage.removeItem(
        'kampusku_user'
      )

      router.replace('/login')

    }

  }

}


/* =========================
   LOAD SCHEDULES
   SUMBER: LARAVEL API
========================= */

const loadSchedules = async () => {

  loadingSchedules.value = true


  try {

    const token =
      getToken()


    if (!token) {

      schedules.value = []

      router.replace('/login')

      return

    }


    const response =
      await axios.get(
        `${API_URL}/schedules`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            Accept:
              'application/json'
          }
        }
      )


    const data =
      response.data?.data || []


    /*
      Laravel mengembalikan:

      schedule
        ├── id
        ├── angkatan
        ├── kelas
        ├── hari
        ├── jam_mulai
        ├── jam_selesai
        ├── ruang
        └── course
              ├── nama_matakuliah
              ├── dosen
              ├── sks
              ├── fakultas
              └── prodi
    */

    schedules.value =
      data.map((item: any) => ({

        id:
          item.id,

        course_id:
          item.course_id,

        angkatan:
          item.angkatan,

        kelas:
          item.kelas,

        hari:
          item.hari,

        jam_mulai:
          item.jam_mulai,

        jam_selesai:
          item.jam_selesai,

        ruang:
          item.ruang || '',

        mata_kuliah:
          item.course?.nama_matakuliah ||
          'Mata Kuliah',

        dosen:
          item.dosen?.nama ||
          '-',

        sks:
          Number(
            item.course?.sks || 0
          ),

        fakultas:
          item.course?.fakultas,

        prodi:
          item.course?.prodi

      }))


    console.log(
      'Jadwal dari Laravel:',
      schedules.value
    )


  } catch (error: any) {

    console.error(
      'Gagal memuat jadwal dari Laravel:',
      error
    )


    schedules.value = []


    if (
      error.response?.status === 401
    ) {

      localStorage.removeItem(
        'kampusku_token'
      )

      localStorage.removeItem(
        'kampusku_user'
      )

      router.replace('/login')

    }

  } finally {

    loadingSchedules.value =
      false

  }

}


/* =========================
   LOAD ANNOUNCEMENTS
   SUMBER: LARAVEL API
========================= */

const loadAnnouncements = async () => {

  loadingAnnouncements.value = true


  try {

    const response =
      await axios.get(
        `${API_URL}/announcements`
      )


    announcements.value =
      response.data?.data || []


  } catch (error) {

    console.error(
      'Gagal memuat pengumuman:',
      error
    )


    announcements.value = []


  } finally {

    loadingAnnouncements.value =
      false

  }

}


/* =========================
   LOAD EVENTS
   SUMBER: LARAVEL API
========================= */

const loadEvents = async () => {

  loadingEvents.value = true


  try {

    const response =
      await axios.get(
        `${API_URL}/events`
      )


    events.value =
      response.data?.data || []


  } catch (error) {

    console.error(
      'Gagal memuat event:',
      error
    )


    events.value = []


  } finally {

    loadingEvents.value =
      false

  }

}


/* =========================
   JADWAL HARI INI
========================= */

const todaySchedules =
  computed(() => {

    const today =
      new Date()


    const dayNames = [

      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',

    ]


    const todayName =
      dayNames[
        today.getDay()
      ]


    return schedules.value

      .filter(
        schedule =>
          normalizeDay(
            schedule.hari
          ) === todayName
      )

      .sort(
        (a, b) =>
          (
            a.jam_mulai || ''
          ).localeCompare(
            b.jam_mulai || ''
          )
      )

  })


/* =========================
   NORMALIZE DAY
========================= */

const normalizeDay = (
  day: string
) => {

  if (!day) {

    return ''

  }


  const cleanDay =
    day.trim()


  return (
    cleanDay.charAt(0).toUpperCase()
    +
    cleanDay.slice(1).toLowerCase()
  )

}


/* =========================
   INITIAL
========================= */

onMounted(() => {

  loadUser()

  loadSchedules()

  loadAnnouncements()

  loadEvents()

})


/* =========================
   NAVIGATION
========================= */

const goTo = (
  path: string
) => {

  router.push(path)

}


const goToProfile = () => {

  router.push('/profile')

}


/* =========================
   CHATBOT
========================= */

const openChatbot = () => {

  const activeElement =
    document.activeElement


  if (
    activeElement instanceof HTMLElement
  ) {

    activeElement.blur()

  }


  router.push('/chatbot')

}


/* =========================
   LOGOUT
========================= */

const logout = async () => {

  const token =
    getToken()


  try {

    if (token) {

      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )

    }

  } catch (error) {

    console.error(
      'Logout API gagal:',
      error
    )

  } finally {

    localStorage.removeItem(
      'kampusku_token'
    )

    localStorage.removeItem(
      'kampusku_user'
    )

    router.replace('/login')

  }

}


/* =========================
   NOTIFICATION
========================= */

const showNotification = () => {

  alert(
    'Notifikasi KampusKu akan segera tersedia.'
  )

}


/* =========================
   SEARCH
========================= */

const handleSearch = () => {

  const query =
    searchQuery.value
      .trim()
      .toLowerCase()


  if (!query) {

    return

  }


  if (
    query.includes('jadwal') ||
    query.includes('kuliah')
  ) {

    goTo('/jadwal')

    return

  }


  if (
    query.includes('pengumuman')
  ) {

    goTo('/pengumuman')

    return

  }


  if (
    query.includes('event') ||
    query.includes('acara')
  ) {

    goTo('/event')

    return

  }


  alert(
    'Informasi yang kamu cari belum ditemukan.'
  )

}


/* =========================
   INITIAL NAME
========================= */

const getInitial = (
  name?: string
) => {

  if (!name) {

    return 'M'

  }


  return name
    .charAt(0)
    .toUpperCase()

}


/* =========================
   FORMAT TIME
========================= */

const formatTime = (
  time: string
) => {

  if (!time) {

    return '-'

  }


  return time.substring(
    0,
    5
  )

}


/* =========================
   FORMAT DAY
========================= */

const getDay = (
  date: string
) => {

  if (!date) {

    return '-'

  }


  const parsedDate =
    new Date(date)


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

    return '-'

  }


  return parsedDate
    .getDate()
    .toString()

}


/* =========================
   FORMAT MONTH
========================= */

const getMonth = (
  date: string
) => {

  if (!date) {

    return '-'

  }


  const parsedDate =
    new Date(date)


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

    return '-'

  }


  return parsedDate
    .toLocaleDateString(
      'id-ID',
      {
        month: 'short'
      }
    )
    .toUpperCase()

}


/* =========================
   TRUNCATE
========================= */

const truncateText = (
  text: string,
  length = 90
) => {

  if (!text) {

    return ''

  }


  if (
    text.length <= length
  ) {

    return text

  }


  return (
    text.substring(
      0,
      length
    ) + '...'
  )

}

</script>


<style scoped>

/* =========================
   PAGE
========================= */

.dashboard-page {

  --background: #f4f8fc;

  background: #f4f8fc;

}


/* =========================
   HEADER
========================= */

.header-toolbar {

  --background: #1565c0;

  --color: white;

}


.header-wrapper {

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 8px 18px;

}


.header-left {

  display: flex;

  align-items: center;

  gap: 10px;

}


.app-logo {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, .15);
}

.app-logo img {
  width: 37px;
  height: 37px;
  object-fit: contain;
}


.header-left h2 {

  margin: 0;

  color: white;

  font-size: 17px;

  font-weight: 800;

}


.header-left p {

  margin: 2px 0 0;

  color: #dcecff;

  font-size: 10px;

}


.notification-button {

  border: none;

  background: rgba(255,255,255,0.14);

  width: 38px;

  height: 38px;

  border-radius: 12px;

  font-size: 18px;

}


/* =========================
   GREETING
========================= */

.greeting-section {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 22px 20px 12px;

  cursor: pointer;

}


.greeting-section:active {

  transform: scale(0.99);

  opacity: 0.9;

}


.greeting-small {

  margin: 0;

  color: #7b8794;

  font-size: 13px;

}


.greeting-section h1 {

  margin: 4px 0;

  color: #1565c0;

  font-size: 25px;

  font-weight: 800;

}


.student-info {

  margin: 0;

  color: #777;

  font-size: 12px;

}


.student-nim {

  margin: 2px 0 0;

  color: #f57c00;

  font-size: 11px;

  font-weight: 700;

}


.profile-avatar {

  width: 48px;

  height: 48px;

  border-radius: 16px;

  background: #1565c0;

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 20px;

  font-weight: 800;

  box-shadow:
    0 6px 14px rgba(21,101,192,0.20);

}


/* =========================
   SEARCH
========================= */

.search-wrapper {

  padding: 6px 20px 15px;

}


.search-box {

  display: flex;

  align-items: center;

  gap: 9px;

  background: white;

  border: 1px solid #e1eaf4;

  border-radius: 14px;

  padding: 12px 14px;

  box-shadow:
    0 3px 12px rgba(21,101,192,0.05);

}


.search-icon {

  font-size: 17px;

}


.search-box input {

  flex: 1;

  border: none;

  outline: none;

  background: transparent;

  color: #333;

  font-size: 13px;

}


.search-box input::placeholder {

  color: #aaa;

}


/* =========================
   PROFILE CARD
========================= */

.profile-card {

  margin: 0 20px 20px;

  padding: 18px;

  border-radius: 20px;

  background: linear-gradient(
    135deg,
    #1565c0,
    #1976d2
  );

  color: white;

  box-shadow:
    0 8px 20px rgba(21,101,192,0.20);

}


.profile-card-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

}


.section-label {

  color: #8b98a8;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 0.7px;

}


.profile-card .section-label {

  color: #dbeafe;

}


.profile-card h3 {

  margin: 5px 0 0;

  color: white;

  font-size: 17px;

}


.profile-card-icon {

  width: 42px;

  height: 42px;

  border-radius: 13px;

  background: rgba(255,255,255,0.13);

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 21px;

}


.profile-grid {

  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 10px;

  margin-top: 18px;

}


.profile-item {

  display: flex;

  flex-direction: column;

  gap: 4px;

}


.profile-item span {

  color: #dbeafe;

  font-size: 10px;

}


.profile-item strong {

  color: white;

  font-size: 12px;

}


/* =========================
   SECTION
========================= */

.section-container {

  padding: 0 20px;

  margin-bottom: 24px;

}


.section-header {

  display: flex;

  justify-content: space-between;

  align-items: flex-end;

  margin-bottom: 12px;

}


.section-header h2 {

  margin: 4px 0 0;

  color: #263238;

  font-size: 18px;

  font-weight: 800;

}


.see-all-button {

  border: none;

  background: transparent;

  color: #1565c0;

  font-size: 11px;

  font-weight: 700;

}


/* =========================
   LOADING
========================= */

.loading-box {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  min-height: 100px;

  color: #777;

  font-size: 12px;

}


.loading-box ion-spinner {

  --color: #ff8a00;

}


/* =========================
   EMPTY
========================= */

.empty-card {

  display: flex;

  align-items: center;

  gap: 13px;

  background: white;

  border-radius: 17px;

  padding: 16px;

  box-shadow:
    0 3px 12px rgba(21,101,192,0.06);

}


.empty-icon {

  width: 42px;

  height: 42px;

  border-radius: 13px;

  background: #fff1df;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 20px;

}


.empty-card h3 {

  margin: 0 0 3px;

  color: #444;

  font-size: 13px;

}


.empty-card p {

  margin: 0;

  color: #888;

  font-size: 10px;

}


/* =========================
   SCHEDULE
========================= */

.schedule-list {

  display: flex;

  flex-direction: column;

  gap: 10px;

}


.schedule-card {

  display: flex;

  align-items: stretch;

  background: white;

  border-radius: 17px;

  padding: 14px;

  box-shadow:
    0 3px 12px rgba(21,101,192,0.06);

}


.schedule-time {

  width: 62px;

  display: flex;

  flex-direction: column;

  gap: 4px;

}


.schedule-time strong {

  color: #1565c0;

  font-size: 13px;

}


.schedule-time span {

  color: #999;

  font-size: 10px;

}


.schedule-line {

  width: 3px;

  border-radius: 5px;

  background: #ff8a00;

  margin: 2px 13px 2px 4px;

}


.schedule-content {

  flex: 1;

}


.schedule-content h3 {

  margin: 0 0 5px;

  color: #333;

  font-size: 14px;

}


.schedule-content p {

  margin: 3px 0;

  color: #777;

  font-size: 10px;

}


/* =========================
   ANNOUNCEMENT
========================= */

.announcement-list {

  display: flex;

  flex-direction: column;

  gap: 10px;

}


.announcement-card {

  display: flex;

  align-items: center;

  gap: 13px;

  padding: 13px;

  background: white;

  border-radius: 17px;

  box-shadow:
    0 3px 12px rgba(21,101,192,0.06);

}


.announcement-date,
.event-date {

  width: 48px;

  min-width: 48px;

  height: 48px;

  border-radius: 14px;

  background: #ff8a00;

  color: white;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

}


.announcement-date strong,
.event-date strong {

  font-size: 18px;

}


.announcement-date span,
.event-date span {

  font-size: 9px;

}


.announcement-content,
.event-content {

  flex: 1;

  min-width: 0;

}


.announcement-content h3,
.event-content h3 {

  margin: 0 0 4px;

  color: #333;

  font-size: 13px;

  font-weight: 700;

}


.announcement-content p {

  margin: 0;

  color: #888;

  font-size: 10px;

  line-height: 1.4;

}


/* =========================
   EVENT
========================= */

.event-list {

  display: flex;

  flex-direction: column;

  gap: 10px;

}


.event-card {

  display: flex;

  align-items: center;

  gap: 13px;

  padding: 13px;

  background: white;

  border-radius: 17px;

  box-shadow:
    0 3px 12px rgba(21,101,192,0.06);

}


.event-content p {

  margin: 4px 0;

  color: #777;

  font-size: 10px;

}


.event-content small {

  color: #1565c0;

  font-size: 9px;

  font-weight: 700;

}


/* =========================
   CHATBOT
========================= */

.chatbot-section {

  display: flex;

  align-items: center;

  gap: 14px;

  margin: 8px 20px 20px;

  padding: 17px;

  background: linear-gradient(
    135deg,
    #1565c0,
    #1976d2
  );

  border-radius: 22px;

  box-shadow:
    0 8px 20px rgba(21,101,192,0.20);

}


.chatbot-icon {

  width: 55px;

  height: 55px;

  min-width: 55px;

  border-radius: 17px;

  background: rgba(255,255,255,0.13);

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 28px;

}


.chatbot-content {

  flex: 1;

}


.chatbot-content h2 {

  margin: 0 0 4px;

  color: white;

  font-size: 17px;

  font-weight: 800;

}


.chatbot-content p {

  margin: 0;

  color: #dbeafe;

  font-size: 11px;

}


.chatbot-arrow {

  border: none;

  background: transparent;

  color: #ffb15c;

  font-size: 28px;

  padding: 8px;

}


/* =========================
   LOGOUT
========================= */

.logout-button {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  width: calc(100% - 40px);

  margin: 0 20px 18px;

  padding: 13px;

  border: 1px solid #1565c0;

  border-radius: 14px;

  background: white;

  color: #1565c0;

  font-size: 12px;

  font-weight: 700;

}


.logout-button span {

  font-size: 18px;

}


.logout-button:active {

  transform: scale(0.98);

  opacity: 0.8;

}


/* =========================
   BOTTOM SPACE
========================= */

.bottom-space {

  height: 130px;

}

</style>
