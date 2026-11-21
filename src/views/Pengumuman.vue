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

        <ion-title>Pengumuman</ion-title>

      </ion-toolbar>
    </ion-header>


    <ion-content :fullscreen="true">

      <!-- HEADER CONTENT -->
      <div class="page-header">

        <div>
          <p class="small-text">
            Informasi terbaru
          </p>

          <h1>
            Pengumuman 📢
          </h1>

          <p class="subtitle">
            Informasi penting untuk mahasiswa
          </p>
        </div>

      </div>


      <!-- SEARCH -->
      <div class="search-wrapper">

        <div class="search-box">

          <span>
            🔍
          </span>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pengumuman..."
          />

        </div>

      </div>


      <!-- CATEGORY -->
      <div class="category-wrapper">

        <button
          class="category-button"
          :class="{
            active: selectedCategory === 'Semua'
          }"
          @click="selectedCategory = 'Semua'"
        >
          Semua
        </button>

        <button
          class="category-button"
          :class="{
            active: selectedCategory === 'Akademik'
          }"
          @click="selectedCategory = 'Akademik'"
        >
          Akademik
        </button>

        <button
          class="category-button"
          :class="{
            active: selectedCategory === 'Keuangan'
          }"
          @click="selectedCategory = 'Keuangan'"
        >
          Keuangan
        </button>

      </div>


      <!-- LOADING -->
      <div
        v-if="loading"
        class="state-container"
      >

        <ion-spinner name="crescent"></ion-spinner>

        <p>
          Memuat pengumuman...
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
          Gagal Memuat Data
        </h3>

        <p>
          {{ errorMessage }}
        </p>

        <ion-button
          fill="outline"
          @click="loadAnnouncements"
        >
          Coba Lagi
        </ion-button>

      </div>


      <!-- EMPTY -->
      <div
        v-else-if="filteredAnnouncements.length === 0"
        class="state-container"
      >

        <div class="state-icon">
          📢
        </div>

        <h3>
          Tidak Ada Pengumuman
        </h3>

        <p>
          Pengumuman yang kamu cari tidak ditemukan.
        </p>

      </div>


      <!-- ANNOUNCEMENT LIST -->
      <div
        v-else
        class="announcement-container"
      >

        <div
          v-for="announcement in filteredAnnouncements"
          :key="announcement.id"
          class="announcement-card"
          @click="openDetail(announcement)"
        >

          <!-- ICON -->
          <div
            class="announcement-icon"
            :class="getCategoryClass(announcement.category)"
          >
            {{ getCategoryIcon(announcement.category) }}
          </div>


          <!-- CONTENT -->
          <div class="announcement-content">

            <div class="announcement-top">

              <span
                class="category-label"
                :class="
                  getCategoryClass(
                    announcement.category
                  )
                "
              >
                {{ announcement.category }}
              </span>


              <!-- BOOKMARK -->
              <button
                class="bookmark-button"
                @click.stop="
                  toggleBookmark(announcement)
                "
              >
                {{
                  isBookmarked(announcement.id)
                    ? '🔖'
                    : '♡'
                }}
              </button>

            </div>


            <h2>
              {{ announcement.judul }}
            </h2>

            <p class="announcement-preview">
              {{ announcement.isi }}
            </p>

            <div class="announcement-footer">

              <span>
                📅
                {{ formatDate(announcement.tanggal) }}
              </span>

              <span>
                Baca selengkapnya →
              </span>

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
              Detail Pengumuman
            </ion-title>

          </ion-toolbar>

        </ion-header>


        <ion-content
          v-if="selectedAnnouncement"
          class="detail-content"
        >

          <div class="detail-wrapper">

            <span
              class="category-label"
              :class="
                getCategoryClass(
                  selectedAnnouncement.category
                )
              "
            >
              {{ selectedAnnouncement.category }}
            </span>


            <h1>
              {{ selectedAnnouncement.judul }}
            </h1>


            <div class="detail-date">
              📅
              {{
                formatDate(
                  selectedAnnouncement.tanggal
                )
              }}
            </div>


            <div class="detail-divider"></div>


            <p>
              {{ selectedAnnouncement.isi }}
            </p>


            <button
              class="detail-bookmark"
              @click="
                toggleBookmark(
                  selectedAnnouncement
                )
              "
            >

              {{
                isBookmarked(
                  selectedAnnouncement.id
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


/* =========================================================
   API
========================================================= */

const API_URL = 'https://kampusku-api-production.up.railway.app/api'


/* =========================================================
   STATE
========================================================= */

const announcements =
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

const selectedCategory =
  ref('Semua')

const showDetail =
  ref(false)

const selectedAnnouncement =
  ref<any>(null)


/* =========================================================
   LOAD ANNOUNCEMENTS
========================================================= */

const loadAnnouncements =
  async () => {

    loading.value = true

    errorMessage.value = ''

    try {

      const response =
        await axios.get(
          `${API_URL}/announcements`
        )

      announcements.value =
        (response.data?.data || [])
          .map((item: any) => {

            return {
              ...item,
              category:
                getCategory(item.judul)
            }

          })

    } catch (error) {

      console.error(
        'Gagal mengambil pengumuman:',
        error
      )

      errorMessage.value =
        'Tidak dapat mengambil pengumuman dari server.'

    } finally {

      loading.value = false

    }

  }


/* =========================================================
   LOAD BOOKMARKS
========================================================= */

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


/* =========================================================
   CHECK BOOKMARK
========================================================= */

const isBookmarked =
  (contentId: number) => {

    return bookmarks.value.some(
      bookmark =>

        Number(
          bookmark.content_id
        ) === Number(contentId)

        &&

        bookmark.content_type ===
          'announcement'
    )

  }


/* =========================================================
   TOGGLE BOOKMARK
========================================================= */

const toggleBookmark =
  async (announcement: any) => {

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
          announcement.id
        )
      ) {

        /* DELETE BOOKMARK */

        await axios.delete(
          `${API_URL}/bookmarks`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            },

            data: {
              content_id:
                announcement.id,

              content_type:
                'announcement'
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
                  Number(
                    announcement.id
                  )

                &&

                bookmark.content_type ===
                  'announcement'
              )
          )

      } else {

        /* ADD BOOKMARK */

        const response =
          await axios.post(
            `${API_URL}/bookmarks`,
            {
              content_id:
                announcement.id,

              content_type:
                'announcement'
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
        'Gagal mengubah bookmark:',
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
          'Gagal mengubah bookmark.'
        )

      }

    } finally {

      bookmarkLoading.value = false

    }

  }


/* =========================================================
   CATEGORY
========================================================= */

const getCategory =
  (title: string) => {

    const text =
      String(title || '')
        .toLowerCase()

    if (
      text.includes('ukt') ||
      text.includes('pembayaran') ||
      text.includes('keuangan')
    ) {

      return 'Keuangan'

    }

    return 'Akademik'

  }


const getCategoryIcon =
  (category: string) => {

    if (category === 'Keuangan') {
      return '💰'
    }

    return '📚'

  }


const getCategoryClass =
  (category: string) => {

    if (category === 'Keuangan') {
      return 'finance'
    }

    return 'academic'

  }


/* =========================================================
   FILTER
========================================================= */

const filteredAnnouncements =
  computed(() => {

    let result =
      announcements.value

    if (
      selectedCategory.value !==
      'Semua'
    ) {

      result =
        result.filter(
          item =>
            item.category ===
            selectedCategory.value
        )

    }

    const query =
      searchQuery.value
        .toLowerCase()
        .trim()

    if (query) {

      result =
        result.filter(
          item =>

            String(
              item.judul || ''
            )
              .toLowerCase()
              .includes(query)

            ||

            String(
              item.isi || ''
            )
              .toLowerCase()
              .includes(query)
        )

    }

    return result

  })


/* =========================================================
   DETAIL
========================================================= */

const openDetail =
  (announcement: any) => {

    selectedAnnouncement.value =
      announcement

    showDetail.value = true

  }


const closeDetail = () => {

  showDetail.value = false

  selectedAnnouncement.value =
    null

}


/* =========================================================
   DATE
========================================================= */

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


/* =========================================================
   INITIALIZE
========================================================= */

onMounted(async () => {

  await loadAnnouncements()

  await loadBookmarks()

})

</script>


<style scoped>

/* =========================================================
   GENERAL
========================================================= */

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

  background: #ffffff;

  padding:
    12px
    15px;

  border-radius: 15px;

  box-shadow:
    0 4px 15px
    rgba(31,41,55,0.06);

  border:
    1px solid #edf1f6;
}

.search-box span {
  font-size: 17px;
}

.search-box input {
  flex: 1;

  border: none;

  outline: none;

  background: transparent;

  color: #1f2937;

  font-size: 13px;
}

.search-box input::placeholder {
  color: #9aa3af;
}


/* =========================================================
   CATEGORY
========================================================= */

.category-wrapper {
  display: flex;

  gap: 8px;

  padding:
    5px
    20px
    12px;

  overflow-x: auto;
}

.category-button {
  border: none;

  white-space: nowrap;

  background: #e9eef5;

  color: #64748b;

  padding:
    9px
    16px;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 600;

  transition:
    all 0.2s ease;
}

.category-button.active {
  background: #1769c2;

  color: #ffffff;

  box-shadow:
    0 5px 12px
    rgba(23,105,194,0.20);
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

  font-size: 13px;
}

.state-icon {
  font-size: 45px;
}

.state-container h3 {
  margin:
    10px 0 5px;

  color: #1f2937;
}

.state-container ion-button {
  --color: #1769c2;
  --border-color: #1769c2;
}


/* =========================================================
   ANNOUNCEMENT
========================================================= */

.announcement-container {
  padding:
    5px
    20px
    130px;
}

.announcement-card {
  display: flex;

  gap: 12px;

  background: #ffffff;

  padding: 15px;

  margin-bottom: 12px;

  border-radius: 18px;

  box-shadow:
    0 5px 18px
    rgba(31,41,55,0.06);

  border:
    1px solid #edf1f6;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.announcement-card:active {
  transform: scale(0.985);
}

.announcement-icon {
  width: 45px;
  height: 45px;

  flex-shrink: 0;

  border-radius: 13px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 21px;
}

.announcement-icon.academic {
  background: #eaf4ff;
}

.announcement-icon.finance {
  background: #fff4df;
}

.announcement-content {
  flex: 1;

  min-width: 0;
}

.announcement-top {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 8px;
}

.category-label {
  display: inline-block;

  padding:
    4px
    8px;

  border-radius: 7px;

  font-size: 9px;

  font-weight: 700;
}

.category-label.academic {
  background: #eaf4ff;

  color: #1769c2;
}

.category-label.finance {
  background: #fff4df;

  color: #b45309;
}

.bookmark-button {
  border: none;

  background: transparent;

  font-size: 22px;

  cursor: pointer;

  padding: 0;

  color: #1769c2;
}

.announcement-content h2 {
  margin:
    8px
    0
    5px;

  color: #1f2937;

  font-size: 15px;

  font-weight: 800;
}

.announcement-preview {
  margin: 0;

  color: #6b7280;

  font-size: 11px;

  line-height: 1.5;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;
}

.announcement-footer {
  display: flex;

  justify-content: space-between;

  gap: 5px;

  margin-top: 10px;

  color: #8a94a3;

  font-size: 9px;
}

.announcement-footer span:last-child {
  color: #1769c2;

  font-weight: 700;
}


/* =========================================================
   DETAIL MODAL
========================================================= */

.modal-toolbar {
  --background: #1769c2;
  --color: #ffffff;
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

.detail-wrapper h1 {
  margin:
    15px
    0
    10px;

  color: #1f2937;

  font-size: 23px;

  line-height: 1.3;

  font-weight: 800;
}

.detail-date {
  color: #8a94a3;

  font-size: 12px;
}

.detail-divider {
  height: 1px;

  background: #e5eaf0;

  margin:
    20px
    0;
}

.detail-wrapper > p {
  color: #4b5563;

  font-size: 14px;

  line-height: 1.8;

  white-space: pre-line;
}

.detail-bookmark {
  width: 100%;

  border: none;

  background: #1769c2;

  color: #ffffff;

  padding: 13px;

  border-radius: 13px;

  margin-top: 25px;

  font-size: 13px;

  font-weight: 700;

  box-shadow:
    0 6px 15px
    rgba(23,105,194,0.20);
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

  .announcement-container {
    padding-left: 15px;
    padding-right: 15px;
  }

}

</style>
