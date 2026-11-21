<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-toolbar">

        <ion-buttons slot="start">
          <ion-back-button
            default-href="/dashboard"
            text=""
          />
        </ion-buttons>

        <ion-title>Jadwal Kuliah</ion-title>

      </ion-toolbar>
    </ion-header>


    <ion-content :fullscreen="true">

      <!-- PAGE HEADER -->
      <div class="page-header">

        <div class="header-content">

          <div>
            <p class="small-text">
              {{ currentDate }}
            </p>

            <h1>Jadwal Kuliah</h1>

            <p class="subtitle">
              Jadwal sesuai kelas kamu
            </p>
          </div>

          <div class="calendar-icon">
            📅
          </div>

        </div>

      </div>


      <!-- USER CLASS INFO -->
      <div
        v-if="user"
        class="class-summary"
      >

        <div class="summary-icon">
          🎓
        </div>

        <div class="summary-content">

          <p class="summary-label">
            Jadwal untuk
          </p>

          <h3>
            {{ user.prodi || '-' }}
          </h3>

          <p>
            Angkatan {{ user.angkatan || '-' }}
            •
            Kelas {{ user.kelas || '-' }}
          </p>

        </div>

      </div>


      <!-- FILTER -->
      <div class="filter-wrapper">

        <button
          class="filter-button"
          :class="{
            active: selectedFilter === 'today'
          }"
          @click="selectedFilter = 'today'"
        >
          Hari Ini
        </button>

        <button
          class="filter-button"
          :class="{
            active: selectedFilter === 'week'
          }"
          @click="selectedFilter = 'week'"
        >
          Minggu Ini
        </button>

      </div>


      <!-- TODAY INFO -->
      <div
        v-if="
          selectedFilter === 'today' &&
          !loading &&
          !errorMessage
        "
        class="today-info"
      >

        <span class="today-dot"></span>

        <span>
          Jadwal hari
          <strong>
            {{ getTodayName() }}
          </strong>
        </span>

      </div>


      <!-- LOADING -->
      <div
        v-if="loading"
        class="state-container"
      >

        <ion-spinner
          name="crescent"
        ></ion-spinner>

        <p>
          Memuat jadwal...
        </p>

      </div>


      <!-- ERROR -->
      <div
        v-else-if="errorMessage"
        class="state-container error-state"
      >

        <div class="state-icon">
          ⚠️
        </div>

        <h3>
          Gagal Memuat Jadwal
        </h3>

        <p>
          {{ errorMessage }}
        </p>

        <ion-button
          fill="outline"
          @click="loadSchedules"
        >
          Coba Lagi
        </ion-button>

      </div>


      <!-- EMPTY -->
      <div
        v-else-if="filteredSchedules.length === 0"
        class="state-container"
      >

        <div class="state-icon">
          📚
        </div>

        <h3>
          {{
            selectedFilter === 'today'
              ? 'Tidak Ada Jadwal Hari Ini'
              : 'Belum Ada Jadwal'
          }}
        </h3>

        <p>
          {{
            selectedFilter === 'today'
              ? `Tidak ada jadwal kuliah pada hari ${getTodayName()}.`
              : 'Belum ada jadwal kuliah untuk kelas kamu.'
          }}
        </p>

      </div>


      <!-- SCHEDULE LIST -->
      <div
        v-else
        class="schedule-container"
      >

        <div
          v-for="schedule in filteredSchedules"
          :key="schedule.id"
          class="schedule-card"
        >

          <!-- DAY -->
          <div class="day-section">

            <div class="day-number">
              {{ getDayNumber(schedule.hari) }}
            </div>

            <div class="day-info">

              <h3>
                {{ normalizeDay(schedule.hari) }}
              </h3>

              <p>
                {{ formatDateForSchedule(schedule.hari) }}
              </p>

            </div>

          </div>


          <!-- CARD CONTENT -->
          <div class="schedule-content">

            <!-- TIME -->
            <div class="time-row">

              <div class="time-icon">
                🕐
              </div>

              <div>

                <span class="label">
                  Waktu
                </span>

                <strong>
                  {{ formatTime(schedule.jam_mulai) }}
                  -
                  {{ formatTime(schedule.jam_selesai) }}
                </strong>

              </div>

            </div>


            <!-- COURSE -->
            <div class="course-info">

              <div class="course-code">
                MK{{ String(schedule.id || 0).padStart(3, '0') }}
              </div>

              <div class="course-details">

                <h2>
                  {{
                    schedule.course?.nama_matakuliah ||
                    'Mata Kuliah'
                  }}
                </h2>

                <p>
                  👨‍🏫
                  {{
                    schedule.dosen?.nama ||
                    '-'
                  }}
                </p>

                <div class="course-meta">

                  <span>
                    {{
                      schedule.course?.sks || 0
                    }}
                    SKS
                  </span>

                  <span>
                    📍
                    {{ schedule.ruang || '-' }}
                  </span>

                </div>

              </div>

            </div>


            <!-- CLASS INFO -->
            <div class="class-info">

              <span>
                Kelas {{ schedule.kelas || '-' }}
              </span>

              <span
                v-if="schedule.angkatan"
              >
                Angkatan {{ schedule.angkatan }}
              </span>

            </div>

          </div>

        </div>

      </div>


      <!-- BOTTOM NAV -->
      <BottomNav />

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonSpinner
} from '@ionic/vue'

import {
  ref,
  computed,
  onMounted
} from 'vue'

import axios from 'axios'

import BottomNav from '@/components/BottomNav.vue'


/* =========================================================
   API
========================================================= */

const API_URL = 'https://kampusku-api-production.up.railway.app/api'


/* =========================================================
   INTERFACE
========================================================= */

interface Course {
  id?: number
  nama_matakuliah?: string
  sks?: number
  prodi?: string
}

interface Dosen {
  id?: number
  nama?: string
  nip?: string
  email?: string
}

interface Schedule {
  id: number
  course_id: number
  dosen_id?: number
  angkatan: string
  kelas: string
  hari: string
  jam_mulai: string
  jam_selesai: string
  ruang: string
  course?: Course
  dosen?: Dosen
}

interface User {
  id?: number
  name?: string
  email?: string
  nim?: string
  fakultas?: string
  prodi?: string
  angkatan?: string
  kelas?: string
}

/* =========================================================
   STATE
========================================================= */

const schedules =
  ref<Schedule[]>([])

const user =
  ref<User | null>(null)

const loading =
  ref(true)

const errorMessage =
  ref('')

const selectedFilter =
  ref<'today' | 'week'>('today')

const currentDate =
  ref('')


/* =========================================================
   TOKEN
========================================================= */

const getToken = () => {

  return localStorage.getItem(
    'kampusku_token'
  )

}


/* =========================================================
   LOAD USER
========================================================= */

const loadUser = async () => {

  try {

    const token =
      getToken()

    if (!token) {
      return
    }


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


    user.value =
      response.data?.data || null

  } catch (error) {

    console.error(
      'Gagal mengambil data user:',
      error
    )

  }

}


/* =========================================================
   LOAD SCHEDULES
========================================================= */

const loadSchedules = async () => {

  loading.value = true

  errorMessage.value = ''


  try {

    const token =
      getToken()


    if (!token) {

      errorMessage.value =
        'Sesi login tidak ditemukan.'

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


    schedules.value =
      response.data?.data || []


    console.log(
      'Jadwal dari Laravel:',
      schedules.value
    )


  } catch (error: any) {

    console.error(
      'Gagal mengambil jadwal dari Laravel:',
      error
    )


    if (
      error.response?.status === 401
    ) {

      errorMessage.value =
        'Sesi login sudah tidak berlaku. Silakan login kembali.'

    } else {

      errorMessage.value =
        'Tidak dapat memuat jadwal dari server.'

    }


    schedules.value = []

  } finally {

    loading.value = false

  }

}


/* =========================================================
   DATE
========================================================= */

const updateCurrentDate = () => {

  const today =
    new Date()


  currentDate.value =
    today.toLocaleDateString(
      'id-ID',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    )

}


/* =========================================================
   NORMALIZE DAY
========================================================= */

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


/* =========================================================
   DAY NUMBER
========================================================= */

const getDayNumber = (
  day: string
) => {

  const days:
    Record<string, number> = {

    Senin: 1,
    Selasa: 2,
    Rabu: 3,
    Kamis: 4,
    Jumat: 5,
    Sabtu: 6,
    Minggu: 7

  }


  const normalized =
    normalizeDay(day)


  return (
    days[normalized] || '-'
  )

}


/* =========================================================
   TODAY
========================================================= */

const getTodayName = () => {

  const days = [

    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu'

  ]


  return days[
    new Date().getDay()
  ]

}


/* =========================================================
   FILTER SCHEDULE
========================================================= */

const filteredSchedules =
  computed(() => {

    const today =
      getTodayName()


    /* -----------------------------------------
       HARI INI
    ----------------------------------------- */

    if (
      selectedFilter.value === 'today'
    ) {

      return schedules.value

        .filter(
          schedule => {

            return (
              normalizeDay(
                schedule.hari
              ) === today
            )

          }
        )

        .slice()

        .sort(
          (a, b) => {

            return (
              a.jam_mulai || ''
            ).localeCompare(
              b.jam_mulai || ''
            )

          }
        )

    }


    /* -----------------------------------------
       MINGGU INI
    ----------------------------------------- */

    const dayOrder:
      Record<string, number> = {

      Senin: 1,
      Selasa: 2,
      Rabu: 3,
      Kamis: 4,
      Jumat: 5,
      Sabtu: 6,
      Minggu: 7

    }


    return schedules.value

      .slice()

      .sort(
        (a, b) => {

          const dayA =
            dayOrder[
              normalizeDay(a.hari)
            ] || 99


          const dayB =
            dayOrder[
              normalizeDay(b.hari)
            ] || 99


          if (
            dayA !== dayB
          ) {

            return dayA - dayB

          }


          return (
            a.jam_mulai || ''
          ).localeCompare(
            b.jam_mulai || ''
          )

        }
      )

  })


/* =========================================================
   FORMAT TIME
========================================================= */

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


/* =========================================================
   FORMAT DATE
========================================================= */

const formatDateForSchedule = (
  hari: string
) => {

  const today =
    new Date()


  const days = [

    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu'

  ]


  const todayIndex =
    today.getDay()


  const targetIndex =
    days.indexOf(
      normalizeDay(hari)
    )


  if (
    targetIndex === -1
  ) {

    return hari

  }


  let difference =
    targetIndex -
    todayIndex


  if (
    difference < 0
  ) {

    difference += 7

  }


  const targetDate =
    new Date(today)


  targetDate.setDate(
    today.getDate() +
    difference
  )


  return targetDate.toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'short'
    }
  )

}


/* =========================================================
   ON MOUNTED
========================================================= */

onMounted(
  async () => {

    updateCurrentDate()

    await loadUser()

    await loadSchedules()

  }
)

</script>


<style scoped>

ion-content {
  --background: #f5f8fc;
}


/* =========================================================
   HEADER
========================================================= */

.header-toolbar {
  --background: #1769c2;
  --color: #ffffff;
  --border-width: 0;
}

ion-title {
  font-weight: 700;
}


/* =========================================================
   PAGE HEADER
========================================================= */

.page-header {
  background: #1769c2;

  color: #ffffff;

  padding:
    10px 20px 30px;

  border-radius:
    0 0 28px 28px;
}

.header-content {
  display: flex;

  align-items: center;

  justify-content:
    space-between;
}

.small-text {
  margin:
    0 0 5px;

  font-size: 13px;

  opacity: 0.85;
}

.page-header h1 {
  margin: 0;

  font-size: 26px;

  font-weight: 800;
}

.subtitle {
  margin:
    5px 0 0;

  font-size: 14px;

  opacity: 0.85;
}

.calendar-icon {
  width: 52px;
  height: 52px;

  border-radius: 16px;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    rgba(255,255,255,0.16);

  font-size: 26px;

  box-shadow:
    0 6px 18px
    rgba(0,0,0,0.08);
}


/* =========================================================
   CLASS SUMMARY
========================================================= */

.class-summary {
  display: flex;

  align-items: center;

  gap: 12px;

  margin:
    15px 20px 5px;

  padding: 13px;

  background: #ffffff;

  border:
    1px solid #e5edf6;

  border-radius: 15px;

  box-shadow:
    0 5px 16px
    rgba(31,41,55,0.05);
}

.summary-icon {
  width: 42px;
  height: 42px;

  border-radius: 12px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #eef6ff;

  font-size: 20px;
}

.summary-content {
  min-width: 0;
}

.summary-label {
  margin: 0 0 2px;

  color: #94a3b8;

  font-size: 11px;
}

.summary-content h3 {
  margin: 0;

  color: #1769c2;

  font-size: 14px;

  font-weight: 800;
}

.summary-content p:last-child {
  margin:
    3px 0 0;

  color: #64748b;

  font-size: 12px;
}


/* =========================================================
   FILTER
========================================================= */

.filter-wrapper {
  display: flex;

  gap: 10px;

  padding:
    14px 20px 5px;
}

.filter-button {
  border: none;

  background: #e9eef5;

  color: #64748b;

  padding:
    10px 20px;

  border-radius: 20px;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition:
    all 0.2s ease;
}

.filter-button.active {
  background: #1769c2;

  color: #ffffff;

  box-shadow:
    0 5px 12px
    rgba(23,105,194,0.22);
}


/* =========================================================
   TODAY
========================================================= */

.today-info {
  display: flex;

  align-items: center;

  gap: 8px;

  margin:
    10px 20px 0;

  padding:
    11px 13px;

  border-radius: 12px;

  background: #fff7e8;

  color: #b45309;

  font-size: 12px;

  font-weight: 600;

  border:
    1px solid #fde7bd;
}

.today-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #f59e0b;
}


/* =========================================================
   STATE
========================================================= */

.state-container {
  min-height: 300px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  padding: 30px;
}

.state-container ion-spinner {
  --color: #1769c2;

  width: 40px;
  height: 40px;
}

.state-container p {
  color: #6b7280;

  font-size: 14px;
}

.state-container h3 {
  margin:
    10px 0 5px;

  color: #1f2937;
}

.state-icon {
  font-size: 45px;
}

.error-state ion-button {
  --color: #1769c2;
  --border-color: #1769c2;
}


/* =========================================================
   SCHEDULE
========================================================= */

.schedule-container {
  padding:
    15px 20px 130px;
}

.schedule-card {
  background: #ffffff;

  border-radius: 20px;

  margin-bottom: 18px;

  overflow: hidden;

  box-shadow:
    0 6px 22px
    rgba(31,41,55,0.07);

  border:
    1px solid #edf1f6;
}


/* =========================================================
   DAY
========================================================= */

.day-section {
  display: flex;

  align-items: center;

  gap: 12px;

  padding:
    16px 18px;

  background: #eef6ff;
}

.day-number {
  width: 42px;
  height: 42px;

  border-radius: 13px;

  background: #1769c2;

  color: #ffffff;

  display: flex;

  align-items: center;
  justify-content: center;

  font-size: 18px;

  font-weight: 800;

  box-shadow:
    0 5px 12px
    rgba(23,105,194,0.18);
}

.day-info h3 {
  margin: 0;

  color: #1769c2;

  font-size: 17px;

  font-weight: 800;
}

.day-info p {
  margin:
    3px 0 0;

  color: #8a94a3;

  font-size: 12px;
}


/* =========================================================
   CONTENT
========================================================= */

.schedule-content {
  padding: 18px;
}


/* =========================================================
   TIME
========================================================= */

.time-row {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 18px;
}

.time-icon {
  width: 36px;
  height: 36px;

  border-radius: 10px;

  background: #fff4df;

  display: flex;

  align-items: center;
  justify-content: center;

  font-size: 17px;
}

.time-row .label {
  display: block;

  color: #9aa3af;

  font-size: 11px;
}

.time-row strong {
  display: block;

  margin-top: 2px;

  color: #1f2937;

  font-size: 14px;
}


/* =========================================================
   COURSE
========================================================= */

.course-info {
  display: flex;

  gap: 12px;
}

.course-code {
  min-width: 52px;
  height: 52px;

  border-radius: 14px;

  background: #1769c2;

  color: #ffffff;

  display: flex;

  align-items: center;
  justify-content: center;

  font-size: 11px;

  font-weight: 700;

  text-align: center;

  box-shadow:
    0 5px 12px
    rgba(23,105,194,0.18);
}

.course-details {
  flex: 1;

  min-width: 0;
}

.course-details h2 {
  margin: 0;

  color: #1f2937;

  font-size: 16px;

  font-weight: 800;
}

.course-details p {
  margin:
    6px 0;

  color: #6b7280;

  font-size: 13px;
}

.course-meta {
  display: flex;

  flex-wrap: wrap;

  gap: 8px;
}

.course-meta span {
  background: #f1f5f9;

  color: #64748b;

  padding:
    5px 8px;

  border-radius: 8px;

  font-size: 11px;
}


/* =========================================================
   CLASS
========================================================= */

.class-info {
  display: flex;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 16px;

  padding-top: 13px;

  border-top:
    1px solid #edf0f3;
}

.class-info span {
  padding:
    6px 10px;

  background: #eef6ff;

  color: #1769c2;

  border-radius: 8px;

  font-size: 11px;

  font-weight: 600;
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {

  .page-header {
    padding-left: 16px;
    padding-right: 16px;
  }

  .page-header h1 {
    font-size: 23px;
  }

  .class-summary {
    margin-left: 15px;
    margin-right: 15px;
  }

  .schedule-container {
    padding-left: 15px;
    padding-right: 15px;
  }

  .schedule-content {
    padding: 15px;
  }

  .course-details h2 {
    font-size: 15px;
  }

}

</style>
