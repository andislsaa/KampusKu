<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-toolbar">
        <ion-title>Bookmark</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="bookmark-page">

      <!-- PAGE HEADER -->
      <div class="page-header">
        <div>
          <p class="small-text">Informasi tersimpan</p>
          <h1>Bookmark 🔖</h1>
          <p>Simpan informasi penting untuk kamu lihat lagi.</p>
        </div>
      </div>

      <!-- FILTER -->
      <div class="filter-wrapper">
        <button
          :class="['filter-btn', { active: activeFilter === 'all' }]"
          @click="activeFilter = 'all'"
        >
          Semua
        </button>

        <button
          :class="['filter-btn', { active: activeFilter === 'announcement' }]"
          @click="activeFilter = 'announcement'"
        >
          Pengumuman
        </button>

        <button
          :class="['filter-btn', { active: activeFilter === 'event' }]"
          @click="activeFilter = 'event'"
        >
          Event
        </button>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="state-container">
        <ion-spinner name="crescent" />
        <p>Memuat bookmark...</p>
      </div>

      <!-- ERROR -->
      <div v-else-if="errorMessage" class="state-container">
        <div class="state-icon">⚠️</div>
        <h3>Gagal memuat bookmark</h3>
        <p>{{ errorMessage }}</p>

        <button class="retry-btn" @click="loadBookmarks">
          Coba Lagi
        </button>
      </div>

      <!-- EMPTY -->
      <div
        v-else-if="filteredBookmarks.length === 0"
        class="state-container"
      >
        <div class="empty-icon">🔖</div>

        <h3>
          {{
            activeFilter === 'all'
              ? 'Belum ada bookmark'
              : activeFilter === 'announcement'
                ? 'Belum ada pengumuman'
                : 'Belum ada event'
          }}
        </h3>

        <p>
          {{
            activeFilter === 'all'
              ? 'Bookmark informasi yang ingin kamu simpan.'
              : 'Informasi yang kamu bookmark akan muncul di sini.'
          }}
        </p>
      </div>

      <!-- BOOKMARK LIST -->
      <div v-else class="bookmark-list">
        <div
          v-for="item in filteredBookmarks"
          :key="`${item.content_type}-${item.content_id}`"
          class="bookmark-card"
          @click="openDetail(item)"
        >
          <!-- ICON -->
          <div
            :class="[
              'bookmark-icon',
              item.content_type === 'announcement'
                ? 'announcement-icon'
                : 'event-icon'
            ]"
          >
            {{ item.content_type === 'announcement' ? '📢' : '🎫' }}
          </div>

          <!-- CONTENT -->
          <div class="bookmark-content">
            <div class="bookmark-top">
              <span
                :class="[
                  'type-badge',
                  item.content_type === 'announcement'
                    ? 'announcement-badge'
                    : 'event-badge'
                ]"
              >
                {{
                  item.content_type === 'announcement'
                    ? 'Pengumuman'
                    : 'Event'
                }}
              </span>

              <span class="bookmark-date">
                {{ formatDate(item.created_at) }}
              </span>
            </div>

            <h3>{{ item.content?.judul || 'Informasi' }}</h3>

            <p v-if="item.content_type === 'announcement'">
              {{ truncateText(item.content?.isi || '') }}
            </p>

            <p v-else>
              {{ truncateText(item.content?.deskripsi || '') }}
            </p>

            <!-- EVENT INFO -->
            <div
              v-if="item.content_type === 'event' && item.content"
              class="event-info"
            >
              <span>📅 {{ formatDate(item.content.tanggal) }}</span>
              <span>📍 {{ item.content.lokasi }}</span>
            </div>

            <!-- ANNOUNCEMENT INFO -->
            <div
              v-if="item.content_type === 'announcement' && item.content"
              class="event-info"
            >
              <span>📅 {{ formatDate(item.content.tanggal) }}</span>
            </div>
          </div>

          <!-- DELETE -->
          <button
            class="delete-btn"
            aria-label="Hapus bookmark"
            @click.stop="removeBookmark(item)"
          >
            🗑️
          </button>
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
              <ion-button @click="closeDetail">
                Tutup
              </ion-button>
            </ion-buttons>

            <ion-title>
              {{
                selectedBookmark?.content_type === 'announcement'
                  ? 'Pengumuman'
                  : 'Event'
              }}
            </ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content class="modal-content">
          <div
            v-if="selectedBookmark?.content"
            class="modal-wrapper"
          >
            <div
              :class="[
                'detail-icon',
                selectedBookmark.content_type === 'announcement'
                  ? 'announcement-icon'
                  : 'event-icon'
              ]"
            >
              {{
                selectedBookmark.content_type === 'announcement'
                  ? '📢'
                  : '🎫'
              }}
            </div>

            <span
              :class="[
                'type-badge large-badge',
                selectedBookmark.content_type === 'announcement'
                  ? 'announcement-badge'
                  : 'event-badge'
              ]"
            >
              {{
                selectedBookmark.content_type === 'announcement'
                  ? 'Pengumuman'
                  : 'Event'
              }}
            </span>

            <h1>
              {{ selectedBookmark.content.judul }}
            </h1>

            <div class="detail-date">
              📅
              {{ formatDate(selectedBookmark.content.tanggal) }}
            </div>

            <!-- DETAIL ANNOUNCEMENT -->
            <div
              v-if="selectedBookmark.content_type === 'announcement'"
              class="detail-body"
            >
              <p>
                {{ selectedBookmark.content.isi }}
              </p>
            </div>

            <!-- DETAIL EVENT -->
            <div
              v-if="selectedBookmark.content_type === 'event'"
              class="detail-body"
            >
              <p>
                {{ selectedBookmark.content.deskripsi }}
              </p>

              <div class="detail-info">
                <div>
                  <strong>📍 Lokasi</strong>
                  <span>
                    {{ selectedBookmark.content.lokasi }}
                  </span>
                </div>

                <div>
                  <strong>👤 Penyelenggara</strong>
                  <span>
                    {{ selectedBookmark.content.penyelenggara }}
                  </span>
                </div>

                <div>
                  <strong>🎯 Cakupan</strong>
                  <span>
                    {{ selectedBookmark.content.cakupan }}
                  </span>
                </div>
              </div>
            </div>

            <!-- REMOVE FROM DETAIL -->
            <button
              class="remove-detail-btn"
              @click="removeBookmark(selectedBookmark)"
            >
              🗑️ Hapus dari Bookmark
            </button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- SHARED BOTTOM NAV -->
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
  IonSpinner,
  IonModal,
  IonButtons,
  IonButton
} from '@ionic/vue'

import {
  ref,
  computed,
  onMounted
} from 'vue'

import axios from 'axios'

import BottomNav from '@/components/BottomNav.vue'


/* =========================
   API
========================= */

const API_URL = 'https://kampusku-api-production.up.railway.app/api'


/* =========================
   STATE
========================= */

const loading = ref(true)
const errorMessage = ref('')

const bookmarks = ref<any[]>([])
const announcements = ref<any[]>([])
const events = ref<any[]>([])

const activeFilter =
  ref<'all' | 'announcement' | 'event'>('all')

const showDetail = ref(false)
const selectedBookmark = ref<any>(null)


/* =========================
   TOKEN
========================= */

const getToken = () => {
  return localStorage.getItem('kampusku_token')
}


/* =========================
   LOAD BOOKMARKS
========================= */

const loadBookmarks = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const token = getToken()

    if (!token) {
      throw new Error('Token login tidak ditemukan.')
    }

    const headers = {
      Authorization: `Bearer ${token}`
    }

    /* AMBIL BOOKMARK */
    const bookmarkResponse = await axios.get(
      `${API_URL}/bookmarks`,
      { headers }
    )

    const bookmarkData =
      bookmarkResponse.data?.data || []

    /* AMBIL PENGUMUMAN */
    const announcementResponse = await axios.get(
      `${API_URL}/announcements`
    )

    announcements.value =
      announcementResponse.data?.data || []

    /* AMBIL EVENT */
    const eventResponse = await axios.get(
      `${API_URL}/events`
    )

    events.value =
      eventResponse.data?.data || []

    /* GABUNGKAN DATA */
    bookmarks.value = bookmarkData.map(
      (bookmark: any) => {
        let content = null

        if (bookmark.content_type === 'announcement') {
          content = announcements.value.find(
            (announcement: any) =>
              Number(announcement.id) ===
              Number(bookmark.content_id)
          )
        }

        if (bookmark.content_type === 'event') {
          content = events.value.find(
            (event: any) =>
              Number(event.id) ===
              Number(bookmark.content_id)
          )
        }

        return {
          ...bookmark,
          content
        }
      }
    )

  } catch (error: any) {
    console.error(
      'Gagal memuat bookmark:',
      error
    )

    if (error.response?.status === 401) {
      errorMessage.value =
        'Sesi login berakhir. Silakan login kembali.'
    } else if (error.response?.data?.message) {
      errorMessage.value =
        error.response.data.message
    } else if (error.message) {
      errorMessage.value =
        error.message
    } else {
      errorMessage.value =
        'Terjadi kesalahan saat mengambil data bookmark.'
    }

  } finally {
    loading.value = false
  }
}


/* =========================
   FILTER
========================= */

const filteredBookmarks = computed(() => {
  if (activeFilter.value === 'all') {
    return bookmarks.value
  }

  return bookmarks.value.filter(
    (item: any) =>
      item.content_type === activeFilter.value
  )
})


/* =========================
   OPEN DETAIL
========================= */

const openDetail = (item: any) => {
  if (!item.content) {
    return
  }

  selectedBookmark.value = item
  showDetail.value = true
}


/* =========================
   CLOSE DETAIL
========================= */

const closeDetail = () => {
  showDetail.value = false
  selectedBookmark.value = null
}


/* =========================
   DELETE BOOKMARK
========================= */

const removeBookmark = async (item: any) => {
  try {
    const token = getToken()

    if (!token) {
      alert('Silakan login kembali.')
      return
    }

    await axios.delete(
      `${API_URL}/bookmarks`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },

        data: {
          content_id: item.content_id,
          content_type: item.content_type
        }
      }
    )

    bookmarks.value = bookmarks.value.filter(
      (bookmark: any) =>
        !(
          Number(bookmark.content_id) ===
            Number(item.content_id) &&
          bookmark.content_type ===
            item.content_type
        )
    )

    if (
      selectedBookmark.value &&
      Number(selectedBookmark.value.content_id) ===
        Number(item.content_id) &&
      selectedBookmark.value.content_type ===
        item.content_type
    ) {
      closeDetail()
    }

  } catch (error: any) {
    console.error(
      'Gagal menghapus bookmark:',
      error
    )

    if (error.response?.status === 401) {
      alert('Sesi login berakhir. Silakan login kembali.')
    } else {
      alert(
        error.response?.data?.message ||
        'Gagal menghapus bookmark.'
      )
    }
  }
}


/* =========================
   FORMAT DATE
========================= */

const formatDate = (date: string) => {
  if (!date) {
    return '-'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString(
    'id-ID',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  )
}


/* =========================
   TRUNCATE TEXT
========================= */

const truncateText = (
  text: string,
  maxLength = 100
) => {
  if (!text) {
    return 'Tidak ada deskripsi.'
  }

  if (text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength) + '...'
}


/* =========================
   INITIALIZE
========================= */

onMounted(() => {
  loadBookmarks()
})
</script>

<style scoped>

/* =====================================================
   GLOBAL PAGE
===================================================== */

.bookmark-page {
  --background: #f5f8fc;
  background: #f5f8fc;
}

/* =====================================================
   HEADER
===================================================== */

.header-toolbar {
  --background: #1769c2;
  --color: white;
  --border-width: 0;
}

.header-toolbar ion-title {
  font-weight: 700;
}

/* =====================================================
   PAGE HEADER
===================================================== */

.page-header {
  width: 100%;
  box-sizing: border-box;

  background: #1769c2;
  color: white;

  padding: 10px 20px 28px;

  border-radius: 0 0 28px 28px;
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

.page-header p:not(.small-text) {
  margin: 5px 0 0;

  font-size: 13px;
  line-height: 1.5;

  opacity: 0.85;
}

/* =====================================================
   FILTER
===================================================== */

.filter-wrapper {
  width: 100%;
  box-sizing: border-box;

  display: flex;
  align-items: center;

  gap: 8px;

  padding: 18px 16px 10px;

  overflow-x: auto;

  scrollbar-width: none;
}

.filter-wrapper::-webkit-scrollbar {
  display: none;
}

.filter-btn {
  flex-shrink: 0;

  border: none;

  white-space: nowrap;

  background: #eaf2fb;

  color: #64748b;

  padding: 9px 16px;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 600;

  transition: all 0.2s ease;
}

.filter-btn.active {
  background: #1769c2;

  color: white;

  box-shadow: 0 4px 10px rgba(23, 105, 194, 0.15);
}

.filter-btn:active {
  transform: scale(0.96);
}

/* =====================================================
   STATE
===================================================== */

.state-container {
  width: 100%;
  box-sizing: border-box;

  min-height: 350px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 30px 20px 130px;

  text-align: center;
}

.state-container ion-spinner {
  --color: #1769c2;

  width: 40px;
  height: 40px;
}

.state-container h3 {
  margin: 12px 0 4px;

  color: #222;

  font-size: 17px;
  font-weight: 700;
}

.state-container p {
  margin: 0;

  color: #777;

  font-size: 13px;

  line-height: 1.6;
}

.state-icon,
.empty-icon {
  font-size: 48px;
}

.retry-btn {
  border: none;

  background: #1769c2;

  color: white;

  padding: 11px 20px;

  border-radius: 10px;

  font-weight: 600;

  margin-top: 10px;
}

/* =====================================================
   BOOKMARK LIST
===================================================== */

.bookmark-list {
  display: block;

  width: 100%;

  box-sizing: border-box;

  padding: 5px 16px 130px;

  margin: 0;
}

/* =====================================================
   BOOKMARK CARD
===================================================== */

.bookmark-card {
  width: 100%;

  min-width: 0;

  box-sizing: border-box;

  display: flex;

  align-items: flex-start;

  gap: 12px;

  background: #ffffff;

  padding: 15px;

  margin: 0 0 12px 0;

  border-radius: 18px;

  border: none;

  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.05);

  transition: transform 0.2s ease;
}

.bookmark-card:active {
  transform: scale(0.98);
}

/* =====================================================
   BOOKMARK ICON
===================================================== */

.bookmark-icon {
  width: 48px;

  height: 52px;

  min-width: 48px;

  flex-shrink: 0;

  border-radius: 14px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 21px;
}

.announcement-icon {
  background: #eaf2fb;
}

.event-icon {
  background: #fff3df;
}

/* =====================================================
   BOOKMARK CONTENT
===================================================== */

.bookmark-content {
  flex: 1;

  width: 0;

  min-width: 0;
}

.bookmark-top {
  width: 100%;

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 8px;
}

/* =====================================================
   BADGE
===================================================== */

.type-badge {
  display: inline-block;

  padding: 4px 8px;

  border-radius: 8px;

  font-size: 10px;

  font-weight: 700;

  white-space: nowrap;
}

.announcement-badge {
  background: #eaf2fb;

  color: #1769c2;
}

.event-badge {
  background: #fff3df;

  color: #c47a00;
}

.bookmark-date {
  color: #999;

  font-size: 10px;

  white-space: nowrap;

  flex-shrink: 0;
}

/* =====================================================
   TITLE
===================================================== */

.bookmark-content h3 {
  width: 100%;

  margin: 8px 0 5px;

  color: #222;

  font-size: 16px;

  font-weight: 700;

  line-height: 1.3;

  word-break: break-word;
}

.bookmark-content p {
  width: 100%;

  margin: 0;

  color: #777;

  font-size: 12px;

  line-height: 1.5;

  word-break: break-word;
}

/* =====================================================
   EVENT / ANNOUNCEMENT INFO
===================================================== */

.event-info {
  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 4px;

  margin-top: 8px;

  color: #777;

  font-size: 11px;

  line-height: 1.5;
}

.event-info span {
  display: block;

  width: 100%;

  word-break: break-word;
}

/* =====================================================
   DELETE BUTTON
===================================================== */

.delete-btn {
  width: 32px;

  height: 32px;

  min-width: 32px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border: none;

  background: transparent;

  padding: 5px;

  font-size: 17px;
}

/* =====================================================
   MODAL
===================================================== */

.modal-toolbar {
  --background: #1769c2;

  --color: white;

  --border-width: 0;
}

.modal-content {
  --background: #f5f8fc;
}

.modal-content > div {
  width: 100%;

  box-sizing: border-box;

  padding: 25px 20px 40px;
}

/* =====================================================
   DETAIL ICON
===================================================== */

.detail-icon {
  width: 65px;

  height: 65px;

  border-radius: 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 30px;

  margin-bottom: 15px;
}

.large-badge {
  font-size: 11px;
}

/* =====================================================
   DETAIL TITLE
===================================================== */

.modal-content h1 {
  color: #222;

  font-size: 25px;

  line-height: 1.3;

  margin: 15px 0 10px;

  font-weight: 800;

  word-break: break-word;
}

.detail-date {
  color: #777;

  font-size: 13px;

  margin-bottom: 20px;
}

/* =====================================================
   DETAIL BODY
===================================================== */

.detail-body {
  width: 100%;

  box-sizing: border-box;

  background: white;

  padding: 18px;

  border-radius: 15px;

  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.04);
}

.detail-body p {
  margin: 0;

  color: #555;

  font-size: 14px;

  line-height: 1.7;

  white-space: pre-line;

  word-break: break-word;
}

/* =====================================================
   DETAIL EVENT INFO
===================================================== */

.detail-info {
  display: flex;

  flex-direction: column;

  gap: 15px;

  margin-top: 20px;
}

.detail-info div {
  display: flex;

  flex-direction: column;

  gap: 4px;
}

.detail-info strong {
  color: #1769c2;

  font-size: 13px;
}

.detail-info span {
  color: #555;

  font-size: 13px;

  word-break: break-word;
}

/* =====================================================
   REMOVE BUTTON
===================================================== */

.remove-detail-btn {
  width: 100%;

  margin-top: 20px;

  border: none;

  border-radius: 12px;

  padding: 13px;

  background: #1769c2;

  color: white;

  font-size: 14px;

  font-weight: 700;
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 400px) {

  .bookmark-list {
    padding-left: 12px;
    padding-right: 12px;
  }

  .bookmark-card {
    padding: 14px;

    gap: 10px;
  }

  .bookmark-icon {
    width: 44px;
    height: 48px;
    min-width: 44px;
  }

  .bookmark-content h3 {
    font-size: 15px;
  }

  .bookmark-content p {
    font-size: 11px;
  }

  .delete-btn {
    width: 28px;
    min-width: 28px;
  }
}

</style>
