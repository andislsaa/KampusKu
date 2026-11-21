
<template>
  <ion-page>
    <div class="welcome-page">
      <img
        class="welcome-image"
        src="/assets/welcome-kampusku.png"
        alt="Welcome KampusKu dengan gerbang Universitas Halu Oleo"
      />

      <!-- Area tombol transparan di atas tombol pada gambar -->
      <button
        class="start-button"
        type="button"
        aria-label="Mulai Sekarang"
        @click="goToLogin"
      ></button>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from '@ionic/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.welcome-page {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: #0754bd;
}

.welcome-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

/* Tombol transparan mengikuti posisi tombol pada gambar */
.start-button {
  position: absolute;
  left: 20%;
  bottom: 8.8%;
  width: 60%;
  height: 6.2%;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.start-button:focus-visible {
  outline: 3px solid white;
  outline-offset: 4px;
}
</style>
