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

        <ion-title>Event Kampus</ion-title>

      </ion-toolbar>
    </ion-header>


    <ion-content :fullscreen="true">

      <!-- PAGE HEADER -->
      <div class="page-header">

        <div>
          <p class="small-text">
            Kegiatan kampus
          </p>

          <h1>
            Event Kampus 🎫
          </h1>

          <p class="subtitle">
            Temukan kegiatan menarik di kampus
          </p>
        </div>

      </div>


      <!-- SEARCH -->
      <div class="search-wrapper">

        <div class="search-box">

          <span>🔍</span>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari event..."
          />

        </div>

      </div>


      <!-- FILTER -->
      <div class="filter-wrapper">

        <button
          class="filter-button"
          :class="{
            active: selectedFilter === 'Semua'
          }"
          @click="selectedFilter = 'Semua'"
        >
          Semua
        </button>

        <button
          class="filter-button"
          :class="{
            active: selectedFilter === 'Seminar'
          }"
          @click="selectedFilter = 'Seminar'"
        >
          Seminar
        </button>

        <button
          class="filter-button"
          :class="{
            active: selectedFilter === 'Workshop'
          }"
          @click="selectedFilter = 'Workshop'"
        >
          Workshop
        </button>

        <button
          class="filter-button"
          :class="{
            active: selectedFilter === 'Organisasi'
          }"
          @click="selectedFilter = 'Organisasi'"
        >
          Organisasi
        </button>

      </div>


      <!-- LOADING -->
      <div
        v-if="loading"
        class="state-container"
      >

        <ion-spinner
          name="crescent"
        />

        <p>
          Memuat event...
        </p>

      </div>


      <!-- ERROR -->
      <div
        v-else-if="errorMessage"
        class="state-container"
      >

        <div class="state-icon">
          ⚠️
        </div>

        <h3>
          Gagal Memuat Event
        </h3>

        <p>
          {{ errorMessage }}
        </p>

        <ion-button
          fill="outline"
          @click="loadEvents"
        >
          Coba Lagi
        </ion-button>

      </div>


      <!-- EMPTY -->
      <div
        v-else-if="filteredEvents.length === 0"
        class="state-container"
      >

        <div class="state-icon">
          🎫
        </div>

        <h3>
          Event Tidak Ditemukan
        </h3>

        <p>
          Belum ada event yang sesuai dengan pencarian.
        </p>

      </div>


      <!-- EVENT LIST -->
      <div
        v-else
        class="event-container"
      >

        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="event-card"
        >

          <!-- DATE -->
          <div class="event-date">

            <strong>
              {{ getDay(event.tanggal) }}
            </strong>

            <span>
              {{ getMonth(event.tanggal) }}
            </span>

          </div>


          <!-- CONTENT -->
          <div class="event-content">

            <div class="event-top">

              <span
                class="category-label"
                :class="
                  getCategoryClass(
                    event.category
                  )
                "
              >
                {{ event.category }}
              </span>


              <!-- STATUS -->
              <span
                class="status-label"
                :class="
                  event.status === 'TERBUKA'
                    ? 'open'
                    : 'soon'
                "
              >
                {{ event.status }}
              </span>

            </div>


            <div class="event-title-row">

              <h2>
                {{ event.judul }}
              </h2>

              <!-- BOOKMARK -->
              <button
                class="bookmark-button"
                @click.stop="
                  toggleBookmark(event)
                "
              >
                {{
                  isBookmarked(event.id)
                    ? '🔖'
                    : '♡'
                }}
              </button>

            </div>


            <p class="event-description">
              {{ event.deskripsi }}
            </p>


            <div class="event-meta">

              <span>
                📍 {{ event.lokasi }}
              </span>

              <span>
                🏢 {{ event.penyelenggara }}
              </span>

            </div>


            <div class="event-footer">

              <span>
                🎯 {{ event.cakupan }}
              </span>

              <button
                class="detail-button"
                @click.stop="
                  openDetail(event)
                "
              >
                Detail →
              </button>

            </div>

          </div>

        </div>

      </div>


      <!-- DETAIL MODAL -->
      <ion-modal
        :is-open="showDetail"
        @didDismiss="closeDetail"
      >

        <ion-header class="ion-no-border">

          <ion-toolbar class="modal-toolbar">

            <ion-buttons slot="start">

              <ion-button
                @click="closeDetail"
              >
                ←
              </ion-button>

            </ion-buttons>

            <ion-title>
              Detail Event
            </ion-title>

          </ion-toolbar>

        </ion-header>


        <ion-content
          v-if="selectedEvent"
          class="detail-content"
        >

          <div class="detail-wrapper">

            <div class="detail-date-card">

              <strong>
                {{ getDay(selectedEvent.tanggal) }}
              </strong>

              <span>
                {{ getMonth(selectedEvent.tanggal) }}
              </span>

            </div>


            <span
              class="category-label"
              :class="
                getCategoryClass(
                  selectedEvent.category
                )
              "
            >
              {{ selectedEvent.category }}
            </span>


            <h1>
              {{ selectedEvent.judul }}
            </h1>


            <p class="detail-description">
              {{ selectedEvent.deskripsi }}
            </p>


            <div class="detail-info">

              <div class="detail-row">

                <span>
                  📅 Tanggal
                </span>

                <strong>
                  {{
                    formatDate(
                      selectedEvent.tanggal
                    )
                  }}
                </strong>

              </div>


              <div class="detail-row">

                <span>
                  📍 Lokasi
                </span>

                <strong>
                  {{ selectedEvent.lokasi }}
                </strong>

              </div>


              <div class="detail-row">

                <span>
                  🏢 Penyelenggara
                </span>

                <strong>
                  {{ selectedEvent.penyelenggara }}
                </strong>

              </div>


              <div class="detail-row">

                <span>
                  🎯 Cakupan
                </span>

                <strong>
                  {{ selectedEvent.cakupan }}
                </strong>

              </div>

            </div>


            <button
              class="detail-bookmark"
              @click="
                toggleBookmark(
                  selectedEvent
                )
              "
            >

              {{
                isBookmarked(
                  selectedEvent.id
                )
                  ? '🔖 Hapus dari Bookmark'
                  : '♡ Tambahkan ke Bookmark'
              }}

            </button>

          </div>

        </ion-content>

      </ion-modal>


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
  IonSpinner,
  IonModal
} from '@ionic/vue'

import {
  ref,
  computed,
  onMounted
} from 'vue'

import axios from 'axios'

import BottomNav
  from '@/components/BottomNav.vue'


/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

const API_URL = 'https://kampusku-api-production.up.railway.app/api'


/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const events =
  ref<any[]>([])

const bookmarks =
  ref<any[]>([])

const loading =
  ref(true)

const bookmarkLoading =
  ref(false)

const errorMessage =
  ref('')

const searchQuery =
  ref('')

const selectedFilter =
  ref('Semua')

const showDetail =
  ref(false)

const selectedEvent =
  ref<any>(null)


/*
|--------------------------------------------------------------------------
| LOAD EVENTS
|--------------------------------------------------------------------------
*/

const loadEvents =
  async () => {

    loading.value = true

    errorMessage.value = ''

    try {

      const response =
        await axios.get(
          `${API_URL}/events`
        )

      events.value =
        (response.data?.data || [])
          .map((item: any) => {

            return {
              ...item,

              category:
                getCategory(item.judul),

              status:
                getStatus(item.tanggal)

            }

          })

    } catch (error) {

      console.error(
        'Gagal mengambil event:',
        error
      )

      errorMessage.value =
        'Tidak dapat mengambil event dari server.'

    } finally {

      loading.value = false

    }

  }


/*
|--------------------------------------------------------------------------
| LOAD BOOKMARKS
|--------------------------------------------------------------------------
*/

const loadBookmarks =
  async () => {

    try {

      const token =
        localStorage.getItem(
          'kampusku_token'
        )

      if (!token) {
        return
      }

      const response =
        await axios.get(
          `${API_URL}/bookmarks`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

      bookmarks.value =
        response.data?.data || []

    } catch (error) {

      console.error(
        'Gagal mengambil bookmark:',
        error
      )

    }

  }


/*
|--------------------------------------------------------------------------
| CHECK BOOKMARK
|--------------------------------------------------------------------------
*/

const isBookmarked =
  (contentId: number) => {

    return bookmarks.value.some(
      bookmark =>

        Number(
          bookmark.content_id
        ) === Number(contentId)

        &&

        bookmark.content_type ===
          'event'
    )

  }


/*
|--------------------------------------------------------------------------
| TOGGLE BOOKMARK
|--------------------------------------------------------------------------
*/

const toggleBookmark =
  async (event: any) => {

    if (bookmarkLoading.value) {
      return
    }

    const token =
      localStorage.getItem(
        'kampusku_token'
      )

    if (!token) {

      alert(
        'Silakan login terlebih dahulu.'
      )

      return

    }

    bookmarkLoading.value = true

    try {

      if (
        isBookmarked(
          event.id
        )
      ) {

        await axios.delete(
          `${API_URL}/bookmarks`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            },

            data: {
              content_id:
                event.id,

              content_type:
                'event'
            }
          }
        )

        bookmarks.value =
          bookmarks.value.filter(
            bookmark =>

              !(
                Number(
                  bookmark.content_id
                ) ===
                  Number(event.id)

                &&

                bookmark.content_type ===
                  'event'
              )
          )

      } else {

        const response =
          await axios.post(
            `${API_URL}/bookmarks`,
            {
              content_id:
                event.id,

              content_type:
                'event'
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        if (
          response.data?.data
        ) {

          bookmarks.value.unshift(
            response.data.data
          )

        }

      }

    } catch (error: any) {

      console.error(
        'Gagal mengubah bookmark event:',
        error
      )

      if (
        error.response?.status === 401
      ) {

        alert(
          'Sesi login sudah berakhir. Silakan login kembali.'
        )

      } else {

        alert(
          'Gagal mengubah bookmark event.'
        )

      }

    } finally {

      bookmarkLoading.value = false

    }

  }


/*
|--------------------------------------------------------------------------
| CATEGORY
|--------------------------------------------------------------------------
*/

const getCategory =
  (title: string) => {

    const text =
      String(title || '')
        .toLowerCase()

    if (
      text.includes('seminar')
    ) {

      return 'Seminar'

    }

    if (
      text.includes('workshop')
    ) {

      return 'Workshop'

    }

    if (
      text.includes('organisasi') ||
      text.includes('rapat')
    ) {

      return 'Organisasi'

    }

    return 'Lainnya'

  }


const getCategoryClass =
  (category: string) => {

    switch (category) {

      case 'Seminar':
        return 'seminar'

      case 'Workshop':
        return 'workshop'

      case 'Organisasi':
        return 'organization'

      default:
        return 'other'

    }

  }


/*
|--------------------------------------------------------------------------
| STATUS EVENT
|--------------------------------------------------------------------------
*/

const getStatus =
  (date: string) => {

    if (!date) {
      return 'SEGERA'
    }

    const today =
      new Date()

    const eventDate =
      new Date(date)

    today.setHours(
      0, 0, 0, 0
    )

    eventDate.setHours(
      0, 0, 0, 0
    )

    const difference =
      Math.ceil(
        (
          eventDate.getTime() -
          today.getTime()
        )
        /
        (
          1000 *
          60 *
          60 *
          24
        )
      )

    if (
      difference >= 0 &&
      difference <= 7
    ) {

      return 'TERBUKA'

    }

    return 'SEGERA'

  }


/*
|--------------------------------------------------------------------------
| FILTER
|--------------------------------------------------------------------------
*/

const filteredEvents =
  computed(() => {

    let result =
      events.value

    if (
      selectedFilter.value !==
      'Semua'
    ) {

      result =
        result.filter(
          event =>
            event.category ===
            selectedFilter.value
        )

    }

    const query =
      searchQuery.value
        .toLowerCase()
        .trim()

    if (query) {

      result =
        result.filter(
          event =>

            String(
              event.judul || ''
            )
              .toLowerCase()
              .includes(query)

            ||

            String(
              event.deskripsi || ''
            )
              .toLowerCase()
              .includes(query)

            ||

            String(
              event.lokasi || ''
            )
              .toLowerCase()
              .includes(query)

            ||

            String(
              event.penyelenggara || ''
            )
              .toLowerCase()
              .includes(query)
        )

    }

    return result

  })


/*
|--------------------------------------------------------------------------
| DETAIL
|--------------------------------------------------------------------------
*/

const openDetail =
  (event: any) => {

    selectedEvent.value =
      event

    showDetail.value =
      true

  }


const closeDetail = () => {

  showDetail.value =
    false

  selectedEvent.value =
    null

}


/*
|--------------------------------------------------------------------------
| DATE
|--------------------------------------------------------------------------
*/

const getDay =
  (date: string) => {

    if (!date) {
      return '-'
    }

    return new Date(date)
      .getDate()
      .toString()

  }


const getMonth =
  (date: string) => {

    if (!date) {
      return '-'
    }

    return new Date(date)
      .toLocaleDateString(
        'id-ID',
        {
          month: 'short'
        }
      )

  }


const formatDate =
  (date: string) => {

    if (!date) {
      return '-'
    }

    return new Date(date)
      .toLocaleDateString(
        'id-ID',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
      )

  }


/*
|--------------------------------------------------------------------------
| INITIALIZE
|--------------------------------------------------------------------------
*/

onMounted(async () => {

  await loadEvents()

  await loadBookmarks()

})

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
  --color: white;
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

  color: white;

  padding:
    10px
    20px
    28px;

  border-radius:
    0
    0
    28px
    28px;
}

.small-text {
  margin: 0 0 4px;

  font-size: 12px;

  opacity: 0.8;
}

.page-header h1 {
  margin: 0;

  font-size: 25px;

  font-weight: 800;
}

.subtitle {
  margin: 5px 0 0;

  font-size: 13px;

  opacity: 0.85;
}


/* =========================================================
   SEARCH
========================================================= */

.search-wrapper {
  padding:
    18px
    20px
    8px;
}

.search-box {
  display: flex;

  align-items: center;

  gap: 10px;

  background: white;

  padding:
    12px
    15px;

  border-radius: 15px;

  box-shadow:
    0 4px 15px
    rgba(0,0,0,0.05);
}

.search-box span {
  font-size: 17px;
}

.search-box input {
  flex: 1;

  border: none;

  outline: none;

  background: transparent;

  font-size: 13px;

  color: #1f2937;
}


/* =========================================================
   FILTER
========================================================= */

.filter-wrapper {
  display: flex;

  gap: 8px;

  padding:
    5px
    20px
    12px;

  overflow-x: auto;
}

.filter-button {
  border: none;

  white-space: nowrap;

  background: #eaf2fb;

  color: #64748b;

  padding:
    9px
    16px;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 600;
}

.filter-button.active {
  background: #1769c2;

  color: white;
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
  color: #777;

  font-size: 13px;
}

.state-container h3 {
  margin:
    10px 0 5px;

  color: #333;
}

.state-icon {
  font-size: 45px;
}


/* =========================================================
   EVENT LIST
========================================================= */

.event-container {
  padding:
    5px
    20px
    130px;
}

.event-card {
  display: flex;

  gap: 12px;

  background: white;

  padding: 15px;

  margin-bottom: 12px;

  border-radius: 18px;

  box-shadow:
    0 4px 15px
    rgba(0,0,0,0.05);
}


/* =========================================================
   EVENT DATE
========================================================= */

.event-date {
  width: 48px;
  height: 52px;

  flex-shrink: 0;

  border-radius: 13px;

  background: #1769c2;

  color: white;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}

.event-date strong {
  font-size: 18px;

  line-height: 1;
}

.event-date span {
  margin-top: 4px;

  font-size: 9px;
}


/* =========================================================
   CONTENT
========================================================= */

.event-content {
  flex: 1;

  min-width: 0;
}

.event-top {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 8px;
}


/* =========================================================
   CATEGORY
========================================================= */

.category-label {
  display: inline-block;

  padding:
    4px
    8px;

  border-radius: 7px;

  font-size: 9px;

  font-weight: 700;
}

.category-label.seminar {
  background: #eaf2fb;

  color: #1769c2;
}

.category-label.workshop {
  background: #fff3df;

  color: #c47a00;
}

.category-label.organization {
  background: #fff3df;

  color: #a36212;
}

.category-label.other {
  background: #eeeeee;

  color: #666666;
}


/* =========================================================
   STATUS
========================================================= */

.status-label {
  padding:
    4px
    7px;

  border-radius: 7px;

  font-size: 8px;

  font-weight: 800;
}

.status-label.open {
  background: #e7f5eb;

  color: #278044;
}

.status-label.soon {
  background: #fff0df;

  color: #a36212;
}


/* =========================================================
   TITLE
========================================================= */

.event-title-row {
  display: flex;

  align-items: flex-start;

  gap: 5px;

  margin-top: 8px;
}

.event-title-row h2 {
  flex: 1;

  margin: 0;

  color: #222;

  font-size: 15px;

  font-weight: 800;
}

.bookmark-button {
  border: none;

  background: transparent;

  padding: 0;

  font-size: 22px;

  cursor: pointer;
}


/* =========================================================
   DESCRIPTION
========================================================= */

.event-description {
  margin:
    6px
    0;

  color: #777;

  font-size: 11px;

  line-height: 1.5;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;
}


/* =========================================================
   META
========================================================= */

.event-meta {
  display: flex;

  flex-direction: column;

  gap: 4px;

  color: #777;

  font-size: 9px;
}


/* =========================================================
   FOOTER
========================================================= */

.event-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-top: 10px;

  padding-top: 9px;

  border-top:
    1px solid #eeeeee;
}

.event-footer > span {
  color: #1769c2;

  font-size: 9px;

  font-weight: 700;
}

.detail-button {
  border: none;

  background: transparent;

  color: #1769c2;

  font-size: 10px;

  font-weight: 700;
}


/* =========================================================
   DETAIL MODAL
========================================================= */

.modal-toolbar {
  --background: #1769c2;

  --color: white;

  --border-width: 0;
}

.detail-content {
  --background: #f5f8fc;
}

.detail-wrapper {
  padding:
    25px
    20px
    50px;
}

.detail-date-card {
  width: 65px;
  height: 65px;

  margin-bottom: 18px;

  border-radius: 16px;

  background: #1769c2;

  color: white;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}

.detail-date-card strong {
  font-size: 24px;

  line-height: 1;
}

.detail-date-card span {
  margin-top: 3px;

  font-size: 10px;
}

.detail-wrapper h1 {
  margin:
    15px
    0
    10px;

  color: #222;

  font-size: 24px;

  line-height: 1.3;

  font-weight: 800;
}

.detail-description {
  color: #555;

  font-size: 14px;

  line-height: 1.8;

  white-space: pre-line;
}


/* =========================================================
   DETAIL INFO
========================================================= */

.detail-info {
  margin-top: 20px;

  background: white;

  border-radius: 17px;

  padding:
    10px
    15px;
}

.detail-row {
  display: flex;

  flex-direction: column;

  gap: 4px;

  padding:
    12px
    0;

  border-bottom:
    1px solid #eeeeee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row span {
  color: #888;

  font-size: 11px;
}

.detail-row strong {
  color: #333;

  font-size: 13px;
}


/* =========================================================
   DETAIL BOOKMARK
========================================================= */

.detail-bookmark {
  width: 100%;

  border: none;

  background: #1769c2;

  color: white;

  padding: 13px;

  border-radius: 13px;

  margin-top: 20px;

  font-size: 13px;

  font-weight: 700;
}


/* =========================================================
   BUTTON
========================================================= */

ion-button {
  --color: #1769c2;
  --border-color: #1769c2;
}

</style>
