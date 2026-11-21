<template>
  <div class="bottom-nav">

    <!-- BERANDA -->
    <button
      class="nav-item"
      :class="{ active: isActive('/dashboard') }"
      @click="goTo('/dashboard')"
    >
      <div class="nav-icon">
        🏠
      </div>

      <span>Beranda</span>
    </button>


    <!-- JADWAL -->
    <button
      class="nav-item"
      :class="{ active: isActive('/jadwal') }"
      @click="goTo('/jadwal')"
    >
      <div class="nav-icon">
        📅
      </div>

      <span>Jadwal</span>
    </button>


    <!-- INFO -->
    <button
      class="nav-item"
      :class="{ active: isActive('/pengumuman') }"
      @click="goTo('/pengumuman')"
    >
      <div class="nav-icon">
        📢
      </div>

      <span>Info</span>
    </button>


    <!-- EVENT -->
    <button
      class="nav-item"
      :class="{ active: isActive('/event') }"
      @click="goTo('/event')"
    >
      <div class="nav-icon">
        🎉
      </div>

      <span>Event</span>
    </button>


    <!-- BOOKMARK -->
    <button
      class="nav-item"
      :class="{ active: isActive('/bookmark') }"
      @click="goTo('/bookmark')"
    >
      <div class="nav-icon">
        🔖
      </div>

      <span>Bookmark</span>
    </button>

  </div>
</template>


<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()


const goTo = (path: string) => {

  // Lepaskan focus dari tombol sebelum berpindah halaman
  const activeElement = document.activeElement

  if (activeElement instanceof HTMLElement) {
    activeElement.blur()
  }

  router.push(path)
}


const isActive = (path: string) => {

  if (path === '/pengumuman') {
    return route.path.startsWith('/pengumuman')
  }

  return route.path === path
}

</script>


<style scoped>

.bottom-nav {

  position: fixed;

  left: 50%;

  /* =========================
     SAFE AREA ANDROID
  ========================= */

  bottom: calc(12px + env(safe-area-inset-bottom, 0px));

  transform: translateX(-50%);

  width: calc(100% - 20px);

  max-width: 720px;

  height: 72px;

  display: grid;

  grid-template-columns: repeat(5, 1fr);

  align-items: center;

  padding: 6px 8px;

  box-sizing: border-box;

  background: rgba(255, 255, 255, 0.97);

  border: 1px solid #e7eef7;

  border-radius: 22px;

  box-shadow:
    0 10px 30px rgba(21, 101, 192, 0.15),
    0 4px 12px rgba(255, 138, 0, 0.08);

  backdrop-filter: blur(12px);

  -webkit-backdrop-filter: blur(12px);

  z-index: 9999;

}


/* =========================
   BUTTON
========================= */

.nav-item {

  position: relative;

  width: 100%;

  height: 60px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 3px;

  border: none;

  outline: none;

  background: transparent;

  color: #7b8794;

  font-size: 9px;

  font-weight: 700;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  transition:
    transform 0.2s ease,
    color 0.2s ease;

}


/* =========================
   ICON
========================= */

.nav-icon {

  width: 38px;

  height: 34px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  font-size: 18px;

  transition:
    all 0.2s ease;

  background: transparent;

}


/* =========================
   ACTIVE
========================= */

.nav-item.active {

  color: #1565c0;

}


.nav-item.active .nav-icon {

  background: #fff1df;

  transform: translateY(-2px);

  box-shadow:
    0 4px 10px rgba(255, 138, 0, 0.18);

}


/* =========================
   ORANGE INDICATOR
========================= */

.nav-item.active::after {

  content: '';

  position: absolute;

  bottom: 1px;

  width: 5px;

  height: 5px;

  border-radius: 50%;

  background: #ff8a00;

}


/* =========================
   CLICK EFFECT
========================= */

.nav-item:active {

  transform: scale(0.92);

}


.nav-item:active .nav-icon {

  transform: scale(0.95);

}


/* =========================
   HOVER
========================= */

@media (hover: hover) {

  .nav-item:hover {

    color: #1565c0;

  }

  .nav-item:hover .nav-icon {

    background: #eef6ff;

  }

}


/* =========================
   DESKTOP
========================= */

@media (min-width: 600px) {

  .bottom-nav {

    bottom: calc(18px + env(safe-area-inset-bottom, 0px));

    border-radius: 24px;

  }

  .nav-item {

    font-size: 10px;

  }

  .nav-icon {

    font-size: 19px;

  }

}

</style>