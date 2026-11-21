<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header class="ion-no-border">

      <ion-toolbar class="header">

        <div class="header-inner">

          <button
            class="back-button"
            @click="goBack"
          >
            ←
          </button>

          <div class="header-title">
            <span>CAMPUS UPDATE</span>
            <h1>Detail Informasi</h1>
          </div>

          <button
            class="bookmark-top"
            @click="toggleBookmark"
          >
            {{ isBookmarked ? '🔖' : '♡' }}
          </button>

        </div>

      </ion-toolbar>

    </ion-header>


    <!-- CONTENT -->
    <ion-content>

      <main class="page">

        <!-- HERO -->
        <section class="hero">

          <div class="hero-decoration decoration-one"></div>
          <div class="hero-decoration decoration-two"></div>

          <div class="hero-icon">
            {{ announcement.icon }}
          </div>

          <div class="hero-label">
            {{ announcement.category }}
          </div>

          <h1>
            {{ announcement.title }}
          </h1>

          <div class="hero-date">
            📅 {{ announcement.date }}
          </div>

        </section>


        <!-- ARTICLE -->
        <article class="article-card">

          <div class="article-header">

            <div>
              <span class="article-label">
                INFORMASI KAMPUS
              </span>

              <h2>
                Informasi terbaru untuk mahasiswa
              </h2>
            </div>

            <div class="verified">
              ✓
            </div>

          </div>


          <div class="divider"></div>


          <p class="lead">
            {{ announcement.description }}
          </p>


          <p>
            Halo mahasiswa KampusKu! 👋
          </p>

          <p>
            Berikut merupakan informasi terbaru yang perlu
            diperhatikan oleh seluruh mahasiswa. Pastikan kamu
            membaca informasi ini sampai selesai agar tidak
            melewatkan hal-hal penting yang berkaitan dengan
            kegiatan perkuliahan.
          </p>


          <!-- INFO BOX -->
          <div class="info-box">

            <div class="info-icon">
              💡
            </div>

            <div>
              <strong>
                Catatan penting
              </strong>

              <p>
                Simpan informasi ini ke bookmark agar
                mudah ditemukan kembali.
              </p>
            </div>

          </div>


          <p>
            Jika terdapat perubahan jadwal atau informasi
            tambahan, pihak kampus akan memberikan
            pemberitahuan melalui kanal informasi resmi.
          </p>


          <p>
            Terima kasih dan tetap semangat menjalani
            aktivitas perkuliahan! 🎓
          </p>

        </article>


        <!-- BOOKMARK ACTION -->
        <section class="bookmark-card">

          <div class="bookmark-left">

            <div class="bookmark-icon">
              {{ isBookmarked ? '🔖' : '♡' }}
            </div>

            <div>

              <h3>
                {{ isBookmarked
                  ? 'Tersimpan di Bookmark'
                  : 'Simpan informasi ini'
                }}
              </h3>

              <p>
                {{ isBookmarked
                  ? 'Kamu bisa menemukannya di menu Simpan.'
                  : 'Akses kembali informasi ini kapan saja.'
                }}
              </p>

            </div>

          </div>


          <button
            class="bookmark-action"
            :class="{ saved: isBookmarked }"
            @click="toggleBookmark"
          >
            {{ isBookmarked ? 'Tersimpan' : 'Simpan' }}
          </button>

        </section>


        <!-- BACK BUTTON -->
        <button
          class="back-list"
          @click="goBack"
        >
          <span>←</span>
          Kembali ke Pengumuman
        </button>


        <div class="bottom-space"></div>

      </main>

    </ion-content>


    <!-- BOTTOM NAV -->
    <ion-footer class="ion-no-border">

      <nav class="bottom-nav">

        <button
          class="nav"
          @click="goTo('/dashboard')"
        >
          <span>🏠</span>
          <small>Home</small>
        </button>


        <button
          class="nav"
          @click="goTo('/jadwal')"
        >
          <span>📅</span>
          <small>Jadwal</small>
        </button>


        <button
          class="nav center"
          @click="goTo('/pengumuman')"
        >
          <div>
            📢
          </div>

          <small>
            Info
          </small>
        </button>


        <button
          class="nav"
          @click="goTo('/bookmark')"
        >
          <span>🔖</span>
          <small>Simpan</small>
        </button>

      </nav>

    </ion-footer>

  </ion-page>
</template>


<script setup lang="ts">

import {
  ref,
  onMounted
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonFooter
} from '@ionic/vue'


// ======================================
// ROUTER
// ======================================

const router = useRouter()

const route = useRoute()


// ======================================
// ID PENGUMUMAN
// ======================================

const announcementId =
  Number(route.params.id)


// ======================================
// DATA PENGUMUMAN
// ======================================

const announcement = {

  id: announcementId,

  title:
    'Informasi Perkuliahan Semester Ganjil',

  category:
    'Akademik',

  date:
    '23 September 2026',

  icon:
    '📚',

  description:
    'Informasi terbaru mengenai jadwal dan kegiatan perkuliahan mahasiswa KampusKu.'

}


// ======================================
// BOOKMARK
// ======================================

const isBookmarked = ref(false)


const getBookmarks = (): number[] => {

  const saved =
    localStorage.getItem(
      'kampusku_bookmarks'
    )

  if (!saved) {
    return []
  }

  try {

    return JSON.parse(saved)

  } catch {

    return []

  }

}


const loadBookmarkStatus = () => {

  const bookmarks =
    getBookmarks()

  isBookmarked.value =
    bookmarks.includes(
      announcementId
    )

}


const toggleBookmark = () => {

  let bookmarks =
    getBookmarks()


  if (
    bookmarks.includes(
      announcementId
    )
  ) {

    bookmarks =
      bookmarks.filter(
        id => id !== announcementId
      )

    isBookmarked.value = false

  } else {

    bookmarks.push(
      announcementId
    )

    isBookmarked.value = true

  }


  localStorage.setItem(
    'kampusku_bookmarks',
    JSON.stringify(bookmarks)
  )

}


// ======================================
// NAVIGATION
// ======================================

const goBack = () => {

  router.push('/pengumuman')

}


const goTo = (path: string) => {

  router.push(path)

}


// ======================================
// LOAD BOOKMARK
// ======================================

onMounted(() => {

  loadBookmarkStatus()

})

</script>


<style scoped>

/* =====================================
   GENERAL
===================================== */

ion-content {
  --background: #fff9f7;
}


/* =====================================
   HEADER
===================================== */

.header {
  --background: #ffffff;

  --min-height: 68px;

  border-bottom: 1px solid #f0e5e9;

  padding: 0 15px;
}


.header-inner {
  width: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;
}


.back-button,
.bookmark-top {
  width: 40px;

  height: 40px;

  border: none;

  border-radius: 13px;

  background: #f9e8ee;

  color: #7f1d3a;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 20px;
}


.header-title {
  text-align: center;
}


.header-title span {
  display: block;

  margin-bottom: 2px;

  color: #7f1d3a;

  font-size: 7px;

  font-weight: 900;

  letter-spacing: 1px;
}


.header-title h1 {
  margin: 0;

  color: #551329;

  font-size: 16px;

  font-weight: 900;
}


/* =====================================
   PAGE
===================================== */

.page {
  max-width: 850px;

  margin: auto;

  padding: 18px 16px;
}


/* =====================================
   HERO
===================================== */

.hero {
  position: relative;

  min-height: 245px;

  padding: 23px;

  border-radius: 27px;

  overflow: hidden;

  background:
    linear-gradient(
      145deg,
      #7f1d3a,
      #551329
    );

  color: white;

  box-shadow:
    0 15px 30px rgba(85,19,41,.18);
}


.hero::after {
  content: '';

  position: absolute;

  width: 190px;

  height: 190px;

  right: -80px;

  bottom: -105px;

  border-radius: 50%;

  background: rgba(255,255,255,.07);
}


.hero::before {
  content: '';

  position: absolute;

  width: 105px;

  height: 105px;

  right: 25px;

  top: -65px;

  border-radius: 50%;

  border: 16px solid rgba(255,255,255,.06);
}


.hero-decoration {
  position: absolute;

  border-radius: 50%;

  background: rgba(255,255,255,.05);
}


.decoration-one {
  width: 20px;

  height: 20px;

  right: 30px;

  top: 90px;
}


.decoration-two {
  width: 9px;

  height: 9px;

  right: 65px;

  top: 125px;

  background: #d9a441;
}


.hero-icon {
  position: relative;

  z-index: 2;

  width: 61px;

  height: 61px;

  border-radius: 19px;

  background: rgba(255,255,255,.13);

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 29px;

  margin-bottom: 16px;

  transform: rotate(-3deg);
}


.hero-label {
  position: relative;

  z-index: 2;

  display: inline-block;

  padding: 5px 8px;

  border-radius: 7px;

  background: rgba(255,255,255,.13);

  color: #f3ccd7;

  font-size: 7px;

  font-weight: 900;

  letter-spacing: .8px;
}


.hero h1 {
  position: relative;

  z-index: 2;

  max-width: 500px;

  margin: 9px 0 12px;

  font-size: 23px;

  line-height: 1.25;

  font-weight: 900;
}


.hero-date {
  position: relative;

  z-index: 2;

  color: #dfc0ca;

  font-size: 9px;
}


/* =====================================
   ARTICLE
===================================== */

.article-card {
  margin-top: 13px;

  padding: 20px;

  background: white;

  border: 1px solid #f0e5e9;

  border-radius: 22px;

  box-shadow:
    0 7px 22px rgba(85,19,41,.04);
}


.article-header {
  display: flex;

  justify-content: space-between;

  gap: 10px;
}


.article-label {
  color: #7f1d3a;

  font-size: 7px;

  font-weight: 900;

  letter-spacing: .8px;
}


.article-header h2 {
  margin: 5px 0 0;

  color: #551329;

  font-size: 16px;

  line-height: 1.35;

  font-weight: 900;
}


.verified {
  width: 28px;

  height: 28px;

  min-width: 28px;

  border-radius: 9px;

  background: #f9e8ee;

  color: #7f1d3a;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 13px;

  font-weight: 900;
}


.divider {
  height: 1px;

  margin: 16px 0;

  background: #f0e5e9;
}


.article-card p {
  margin: 0 0 14px;

  color: #75666d;

  font-size: 11px;

  line-height: 1.8;
}


.article-card p.lead {
  color: #4b3941;

  font-size: 12px;

  line-height: 1.7;

  font-weight: 600;
}


/* =====================================
   INFO BOX
===================================== */

.info-box {
  display: flex;

  align-items: flex-start;

  gap: 11px;

  padding: 13px;

  margin: 18px 0;

  border-radius: 15px;

  background: #fff8e8;

  border: 1px solid #f4e4bc;
}


.info-icon {
  width: 34px;

  height: 34px;

  min-width: 34px;

  border-radius: 10px;

  background: #f9edcf;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 17px;
}


.info-box strong {
  display: block;

  margin-bottom: 3px;

  color: #755921;

  font-size: 10px;
}


.info-box p {
  margin: 0;

  color: #987d43;

  font-size: 9px;

  line-height: 1.5;
}


/* =====================================
   BOOKMARK CARD
===================================== */

.bookmark-card {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin-top: 13px;

  padding: 15px;

  background: #f9e8ee;

  border-radius: 20px;
}


.bookmark-left {
  display: flex;

  align-items: center;

  gap: 11px;

  min-width: 0;
}


.bookmark-icon {
  width: 45px;

  height: 45px;

  min-width: 45px;

  border-radius: 14px;

  background: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 21px;
}


.bookmark-left h3 {
  margin: 0;

  color: #551329;

  font-size: 11px;

  font-weight: 850;
}


.bookmark-left p {
  margin: 4px 0 0;

  color: #987c87;

  font-size: 8px;

  line-height: 1.4;
}


.bookmark-action {
  flex-shrink: 0;

  border: none;

  padding: 10px 13px;

  border-radius: 11px;

  background: #7f1d3a;

  color: white;

  font-size: 9px;

  font-weight: 800;
}


.bookmark-action.saved {
  background: #551329;
}


/* =====================================
   BACK BUTTON
===================================== */

.back-list {
  width: 100%;

  height: 46px;

  margin-top: 13px;

  border: 1px solid #eadde2;

  border-radius: 14px;

  background: white;

  color: #7f1d3a;

  font-size: 10px;

  font-weight: 800;
}


.back-list span {
  margin-right: 6px;

  font-size: 15px;
}


/* =====================================
   BOTTOM NAV
===================================== */

.bottom-nav {
  height: 67px;

  display: flex;

  align-items: center;

  justify-content: space-around;

  background: rgba(255,255,255,.98);

  border-top: 1px solid #f0e5e9;

  box-shadow:
    0 -5px 20px rgba(85,19,41,.06);

  padding-bottom: env(safe-area-inset-bottom);
}


.nav {
  flex: 1;

  height: 100%;

  border: none;

  background: transparent;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 3px;

  color: #a08d95;
}


.nav span {
  font-size: 18px;
}


.nav small {
  font-size: 8px;

  font-weight: 700;
}


.nav.center div {
  width: 42px;

  height: 42px;

  margin-top: -20px;

  border-radius: 15px;

  background: #7f1d3a;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 19px;

  box-shadow:
    0 8px 18px rgba(127,29,58,.25);
}


.nav.center small {
  margin-top: 2px;
}


.bottom-space {
  height: 20px;
}


/* =====================================
   DESKTOP
===================================== */

@media (min-width: 700px) {

  .page {
    padding-left: 25px;

    padding-right: 25px;
  }

  .hero {
    padding: 28px;
  }

  .hero h1 {
    font-size: 27px;
  }

  .article-card {
    padding: 25px;
  }

}

</style>
