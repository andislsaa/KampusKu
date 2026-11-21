<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/dashboard"></ion-back-button>
        </ion-buttons>

        <ion-title>Profil Saya</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="profile-container">

        <!-- HEADER PROFIL -->
        <section class="profile-header">
          <div class="profile-avatar">
            {{ getInitial(form.name) }}
          </div>

          <h1>{{ form.name || 'Mahasiswa' }}</h1>
          <p>{{ form.nim || '-' }}</p>
        </section>

        <!-- FORM -->
        <section class="form-section">

          <div class="section-title">
            <h2>Data Mahasiswa</h2>
            <p>Perbarui informasi profil kamu</p>
          </div>

          <!-- NAMA -->
          <div class="form-group">
            <label>Nama Lengkap</label>

            <ion-input
              v-model="form.name"
              type="text"
              placeholder="Masukkan nama lengkap"
              fill="outline"
            />
          </div>

          <!-- EMAIL -->
          <div class="form-group">
            <label>Email</label>

            <ion-input
              v-model="form.email"
              type="email"
              fill="outline"
              readonly
            />
          </div>

          <!-- NIM -->
          <div class="form-group">
            <label>NIM</label>

            <ion-input
              v-model="form.nim"
              type="text"
              placeholder="Masukkan NIM"
              fill="outline"
            />
          </div>

          <!-- FAKULTAS -->
          <div class="form-group">
            <label>Fakultas</label>

            <ion-input
              v-model="form.fakultas"
              type="text"
              placeholder="Masukkan fakultas"
              fill="outline"
            />
          </div>

          <!-- PRODI -->
          <div class="form-group">
            <label>Program Studi</label>

            <ion-input
              v-model="form.prodi"
              type="text"
              placeholder="Masukkan program studi"
              fill="outline"
            />
          </div>

          <!-- ANGKATAN -->
          <div class="form-group">
            <label>Angkatan</label>

            <ion-input
              v-model="form.angkatan"
              type="text"
              placeholder="Contoh: 2024"
              fill="outline"
            />
          </div>

          <!-- KELAS -->
          <div class="form-group">
            <label>Kelas</label>

            <ion-input
              v-model="form.kelas"
              type="text"
              placeholder="Contoh: A"
              fill="outline"
            />
          </div>

          <!-- ERROR -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <!-- SUCCESS -->
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <!-- BUTTON -->
          <button
            class="save-button"
            @click="saveProfile"
            :disabled="loading"
          >
            <span v-if="loading">Menyimpan...</span>
            <span v-else>Simpan Perubahan</span>
          </button>

        </section>

      </div>
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
  IonInput
} from '@ionic/vue'

import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const API_URL = 'https://kampusku-api-production.up.railway.app/api'

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  nim: '',
  fakultas: '',
  prodi: '',
  angkatan: '',
  kelas: ''
})

const getInitial = (name: string) => {
  if (!name) return 'M'

  return name
    .trim()
    .charAt(0)
    .toUpperCase()
}

const loadProfile = () => {
  const savedUser = localStorage.getItem('kampusku_user')

  if (!savedUser) {
    router.replace('/login')
    return
  }

  try {
    const user = JSON.parse(savedUser)

    form.name = user.name || ''
    form.email = user.email || ''
    form.nim = user.nim || ''
    form.fakultas = user.fakultas || ''
    form.prodi = user.prodi || ''
    form.angkatan = user.angkatan || ''
    form.kelas = user.kelas || ''
  } catch (error) {
    console.error('Gagal membaca data user:', error)

    localStorage.removeItem('kampusku_user')
    router.replace('/login')
  }
}

const saveProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const token = localStorage.getItem('kampusku_token')

  if (!token) {
    router.replace('/login')
    return
  }

  if (
    !form.name ||
    !form.nim ||
    !form.fakultas ||
    !form.prodi ||
    !form.angkatan ||
    !form.kelas
  ) {
    errorMessage.value = 'Semua data mahasiswa wajib diisi.'
    return
  }

  loading.value = true

  try {
    const response = await axios.put(
      `${API_URL}/profile`,
      {
        name: form.name,
        nim: form.nim,
        fakultas: form.fakultas,
        prodi: form.prodi,
        angkatan: form.angkatan,
        kelas: form.kelas
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const updatedUser = response.data.user

    localStorage.setItem(
      'kampusku_user',
      JSON.stringify(updatedUser)
    )

    form.name = updatedUser.name || ''
    form.email = updatedUser.email || ''
    form.nim = updatedUser.nim || ''
    form.fakultas = updatedUser.fakultas || ''
    form.prodi = updatedUser.prodi || ''
    form.angkatan = updatedUser.angkatan || ''
    form.kelas = updatedUser.kelas || ''

    successMessage.value = 'Profil berhasil diperbarui.'

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (error: any) {
    console.error('Gagal memperbarui profil:', error)

    if (error.response?.status === 401) {
      localStorage.removeItem('kampusku_token')
      localStorage.removeItem('kampusku_user')

      router.replace('/login')
      return
    }

    if (error.response?.status === 422) {
      const errors = error.response.data?.errors

      if (errors?.nim) {
        errorMessage.value = 'NIM tersebut sudah digunakan.'
      } else {
        errorMessage.value =
          'Data profil tidak valid. Periksa kembali data kamu.'
      }

      return
    }

    errorMessage.value =
      'Gagal memperbarui profil. Pastikan server Laravel berjalan.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>

/* =========================
   PAGE
========================= */

ion-content {
  --background: #f5f8fc;
}


/* =========================
   TOOLBAR
========================= */

ion-toolbar {
  --background: #1769c2;
  --color: #ffffff;
  --border-width: 0;
}

ion-title {
  color: #ffffff !important;
  font-weight: 700;
}

ion-back-button {
  --color: #ffffff;
}


/* =========================
   PROFILE CONTAINER
========================= */

.profile-container {
  width: 100%;
  padding-bottom: 40px;
}


/* =========================
   PROFILE HEADER
========================= */

.profile-header {
  width: 100%;
  box-sizing: border-box;

  background: #1769c2;
  color: #ffffff;

  padding: 25px 20px 30px;

  text-align: center;

  border-radius: 0 0 28px 28px;
}


/* =========================
   AVATAR
========================= */

.profile-avatar {
  width: 75px;
  height: 75px;

  margin: 0 auto 14px;

  border-radius: 50%;

  background: #ffffff;

  color: #1769c2;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 32px;
  font-weight: 800;

  box-shadow:
    0 5px 15px
    rgba(0, 0, 0, 0.15);
}


/* =========================
   NAME
========================= */

.profile-header h1 {
  margin: 0;

  color: #ffffff !important;

  font-size: 24px;

  font-weight: 800;
}

.profile-header p {
  margin: 5px 0 0;

  color: #dcecff !important;

  font-size: 13px;
}


/* =========================
   FORM SECTION
========================= */

.form-section {
  margin: 18px 16px 0;

  padding: 20px;

  background: #ffffff;

  border-radius: 20px;

  box-shadow:
    0 4px 15px
    rgba(0, 0, 0, 0.05);
}


/* =========================
   SECTION TITLE
========================= */

.section-title {
  margin-bottom: 22px;
}

.section-title h2 {
  margin: 0;

  color: #1f2937 !important;

  font-size: 20px;

  font-weight: 800;
}

.section-title p {
  margin: 5px 0 0;

  color: #64748b !important;

  font-size: 12px;
}


/* =========================
   FORM GROUP
========================= */

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;

  margin-bottom: 7px;

  color: #334155 !important;

  font-size: 12px;

  font-weight: 700;
}


/* =========================
   ION INPUT
========================= */

.form-group ion-input {
  --background: #ffffff;

  --color: #1f2937;

  --placeholder-color: #94a3b8;

  --placeholder-opacity: 1;

  --border-color: #d9e2ec;

  --border-style: solid;

  --border-width: 1px;

  --border-radius: 13px;

  --padding-start: 13px;

  --padding-end: 13px;

  --highlight-color-focused: #1769c2;

  font-size: 13px;
}


/* =========================
   READONLY EMAIL
========================= */

.form-group ion-input[readonly] {
  --background: #f1f5f9;

  --color: #475569;

  --border-color: #d9e2ec;
}


/* =========================
   INPUT TEXT
========================= */

.form-group ion-input::part(native) {
  color: #1f2937;
}


/* =========================
   BUTTON
========================= */

.save-button {
  width: 100%;

  margin-top: 5px;

  padding: 14px;

  border: none;

  border-radius: 14px;

  background: #1769c2;

  color: #ffffff;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

  box-shadow:
    0 5px 15px
    rgba(23, 105, 194, 0.20);

  transition: 0.2s ease;
}

.save-button:active {
  transform: scale(0.98);
}

.save-button:disabled {
  opacity: 0.6;
}


/* =========================
   SUCCESS
========================= */

.success-message {
  margin-top: 12px;

  padding: 11px 13px;

  border-radius: 12px;

  background: #e7f5eb;

  color: #278044 !important;

  font-size: 12px;

  font-weight: 600;

  text-align: center;
}


/* =========================
   ERROR
========================= */

.error-message {
  margin-top: 12px;

  padding: 11px 13px;

  border-radius: 12px;

  background: #fdecec;

  color: #c0392b !important;

  font-size: 12px;

  font-weight: 600;

  text-align: center;
}


/* =========================
   RESPONSIVE
========================= */

@media (min-width: 600px) {

  .form-section {
    max-width: 650px;

    margin-left: auto;
    margin-right: auto;
  }

}
</style>
