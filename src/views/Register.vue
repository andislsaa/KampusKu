<template>
  <ion-page>

    <ion-content :fullscreen="true">

      <div class="register-page">

        <!-- DECORATION -->
        <div class="blob blob-one"></div>
        <div class="blob blob-two"></div>

        <div class="small-dot dot-one"></div>
        <div class="small-dot dot-two"></div>


        <!-- BRAND -->
        <div class="brand-section">

          <div class="logo">
            <img
              src="/assets/logo-kampusku.png"
              alt="Logo KampusKu"
            />
          </div>

          <h1>
            Kampus<span>Ku</span>
          </h1>

          <p>
            Buat akun mahasiswa kamu.
          </p>

        </div>


        <!-- REGISTER CARD -->
        <div class="register-card">

          <div class="card-header">

            <span class="welcome-badge">
              CREATE ACCOUNT ✨
            </span>

            <h2>
              Daftar di KampusKu
            </h2>

            <p>
              Lengkapi data mahasiswa untuk membuat akun.
            </p>

          </div>


          <!-- NAMA -->
          <div class="input-wrapper">

            <label>
              Nama Lengkap
            </label>

            <div class="input-box">

              <span class="input-icon">
                👤
              </span>

              <input
                v-model="form.name"
                type="text"
                placeholder="Nama lengkap"
                autocomplete="name"
                :disabled="loading"
              />

            </div>

          </div>


          <!-- EMAIL -->
          <div class="input-wrapper">

            <label>
              Email
            </label>

            <div class="input-box">

              <span class="input-icon">
                ✉️
              </span>

              <input
                v-model="form.email"
                type="email"
                placeholder="nama@email.com"
                autocomplete="email"
                :disabled="loading"
              />

            </div>

          </div>


          <!-- NIM -->
          <div class="input-wrapper">

            <label>
              NIM
            </label>

            <div class="input-box">

              <span class="input-icon">
                🎓
              </span>

              <input
                v-model="form.nim"
                type="text"
                placeholder="Nomor Induk Mahasiswa"
                :disabled="loading"
              />

            </div>

          </div>


          <!-- PASSWORD -->
          <div class="input-wrapper">

            <label>
              Password
            </label>

            <div class="input-box">

              <span class="input-icon">
                🔒
              </span>

              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 8 karakter"
                autocomplete="new-password"
                :disabled="loading"
              />

              <button
                type="button"
                class="eye-button"
                @click="showPassword = !showPassword"
                :disabled="loading"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>

            </div>

          </div>


          <!-- FAKULTAS -->
          <div class="input-wrapper">

            <label>
              Fakultas
            </label>

            <div class="input-box">

              <span class="input-icon">
                🏫
              </span>

              <input
                v-model="form.fakultas"
                type="text"
                placeholder="Contoh: FMIPA"
                :disabled="loading"
              />

            </div>

          </div>


          <!-- PRODI -->
          <div class="input-wrapper">

            <label>
              Program Studi
            </label>

            <div class="input-box">

              <span class="input-icon">
                📚
              </span>

              <input
                v-model="form.prodi"
                type="text"
                placeholder="Contoh: Ilmu Komputer"
                :disabled="loading"
              />

            </div>

          </div>


          <!-- ANGKATAN + KELAS -->
          <div class="two-column">

            <div class="input-wrapper">

              <label>
                Angkatan
              </label>

              <div class="input-box">

                <span class="input-icon">
                  📅
                </span>

                <input
                  v-model="form.angkatan"
                  type="text"
                  placeholder="2024"
                  :disabled="loading"
                />

              </div>

            </div>


            <div class="input-wrapper">

              <label>
                Kelas
              </label>

              <div class="input-box">

                <span class="input-icon">
                  🔤
                </span>

                <input
                  v-model="form.kelas"
                  type="text"
                  placeholder="B"
                  :disabled="loading"
                />

              </div>

            </div>

          </div>


          <!-- ERROR -->
          <div
            v-if="errorMessage"
            class="error-message"
          >
            {{ errorMessage }}
          </div>


          <!-- REGISTER BUTTON -->
          <button
            type="button"
            class="register-button"
            @click="register"
            :disabled="loading"
          >

            <span>
              {{ loading ? 'Membuat akun...' : 'Buat Akun' }}
            </span>

            <span
              v-if="!loading"
              class="button-arrow"
            >
              →
            </span>

            <span
              v-else
              class="loading-spinner"
            >
              ⏳
            </span>

          </button>


          <!-- LOGIN LINK -->
          <div class="login-link">

            <span>
              Sudah punya akun?
            </span>

            <button
              type="button"
              @click="goToLogin"
              :disabled="loading"
            >
              Login
            </button>

          </div>


          <!-- INFO -->
          <div class="register-info">

            <span>
              🔐
            </span>

            <p>
              Password kamu disimpan secara aman.
            </p>

          </div>

        </div>


        <!-- FOOTER -->
        <div class="footer">

          <span>
            Made for students • 2026
          </span>

        </div>

      </div>

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import { reactive, ref } from 'vue'

import { useRouter } from 'vue-router'

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import axios from 'axios'


// ========================================
// ROUTER
// ========================================

const router = useRouter()


// ========================================
// API
// ========================================

const API_URL =
  'https://kampusku-api-production.up.railway.app/api'


// ========================================
// FORM
// ========================================

const form = reactive({

  name: '',

  email: '',

  nim: '',

  password: '',

  fakultas: '',

  prodi: '',

  angkatan: '',

  kelas: ''

})


// ========================================
// STATE
// ========================================

const loading = ref(false)

const errorMessage = ref('')

const showPassword = ref(false)


// ========================================
// REGISTER
// ========================================

const register = async () => {

  errorMessage.value = ''


  // Validasi
  if (!form.name.trim()) {

    errorMessage.value =
      'Nama lengkap wajib diisi.'

    return

  }


  if (!form.email.trim()) {

    errorMessage.value =
      'Email wajib diisi.'

    return

  }


  if (!form.nim.trim()) {

    errorMessage.value =
      'NIM wajib diisi.'

    return

  }


  if (!form.password) {

    errorMessage.value =
      'Password wajib diisi.'

    return

  }


  if (form.password.length < 8) {

    errorMessage.value =
      'Password minimal 8 karakter.'

    return

  }


  if (!form.fakultas.trim()) {

    errorMessage.value =
      'Fakultas wajib diisi.'

    return

  }


  if (!form.prodi.trim()) {

    errorMessage.value =
      'Program studi wajib diisi.'

    return

  }


  if (!form.angkatan.trim()) {

    errorMessage.value =
      'Angkatan wajib diisi.'

    return

  }


  if (!form.kelas.trim()) {

    errorMessage.value =
      'Kelas wajib diisi.'

    return

  }


  loading.value = true


  try {

    const response = await axios.post(
      `${API_URL}/register`,
      {

        name: form.name.trim(),

        email: form.email.trim(),

        nim: form.nim.trim(),

        password: form.password,

        fakultas: form.fakultas.trim(),

        prodi: form.prodi.trim(),

        angkatan: form.angkatan.trim(),

        kelas: form.kelas.trim()

      }
    )


    console.log(
      'Registrasi berhasil:',
      response.data
    )


    // Ambil token
    const token =
      response.data.token


    // Ambil user
    const user =
      response.data.user


    // Simpan token
    if (token) {

      localStorage.setItem(
        'kampusku_token',
        token
      )

    }


    // Simpan user
    if (user) {

      localStorage.setItem(
        'kampusku_user',
        JSON.stringify(user)
      )

    }


    // Langsung masuk dashboard
    await router.replace('/dashboard')


  } catch (error: any) {

    console.error(
      'Register error:',
      error
    )


    if (error.response) {

      const status =
        error.response.status


      // Validasi Laravel
      if (status === 422) {

        const errors =
          error.response.data?.errors


        if (errors?.email?.length) {

          errorMessage.value =
            errors.email[0]

        }

        else if (errors?.nim?.length) {

          errorMessage.value =
            errors.nim[0]

        }

        else if (errors?.password?.length) {

          errorMessage.value =
            errors.password[0]

        }

        else {

          errorMessage.value =
            'Data pendaftaran tidak valid.'

        }

      }

      else if (status >= 500) {

        errorMessage.value =
          'Terjadi kesalahan pada server.'

      }

      else {

        errorMessage.value =
          error.response.data?.message ||
          'Registrasi gagal. Silakan coba lagi.'

      }

    }

    else if (error.request) {

      errorMessage.value =
        'Tidak dapat terhubung ke server.'

    }

    else {

      errorMessage.value =
        'Terjadi kesalahan. Silakan coba lagi.'

    }

  } finally {

    loading.value = false

  }

}


// ========================================
// KEMBALI KE LOGIN
// ========================================

const goToLogin = () => {

  router.replace('/login')

}

</script>


<style scoped>

/* ========================================
   PAGE
======================================== */

ion-content {
  --background: #1769c2;
}

.register-page {

  position: relative;

  min-height: 100%;

  overflow: hidden;

  display: flex;

  flex-direction: column;

  align-items: center;

  padding: 35px 20px 25px;

  box-sizing: border-box;

  background:
    linear-gradient(
      145deg,
      #1769c2 0%,
      #236bd0 45%,
      #1555b1 100%
    );

}


/* ========================================
   DECORATION
======================================== */

.blob {

  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  border: 35px solid rgba(255,255,255,.08);

  background: transparent;

}


.blob-one {

  width: 220px;

  height: 220px;

  top: -100px;

  right: -80px;

}


.blob-two {

  width: 180px;

  height: 180px;

  bottom: 70px;

  left: -110px;

}


.small-dot {

  position: absolute;

  width: 8px;

  height: 8px;

  border-radius: 50%;

  background: #ffd21f;

}


.dot-one {

  top: 120px;

  left: 25px;

}


.dot-two {

  right: 30px;

  bottom: 150px;

  width: 6px;

  height: 6px;

  background: #ffd21f;

}


/* ========================================
   BRAND
======================================== */

.brand-section {

  position: relative;

  z-index: 2;

  text-align: center;

  margin-bottom: 25px;

}


.logo {

  width: 70px;

  height: 70px;

  margin: auto;

  border-radius: 20px;

  background: white;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  box-shadow:
    0 12px 30px
    rgba(0,0,0,.18);

}


.logo img {

  width: 62px;

  height: 62px;

  object-fit: contain;

}


.brand-section h1 {

  margin: 14px 0 4px;

  color: white;

  font-size: 29px;

  font-weight: 900;

  letter-spacing: -1px;

}


.brand-section h1 span {

  color: #ffd21f;

}


.brand-section p {

  margin: 0;

  color: rgba(255,255,255,.88);

  font-size: 11px;

}


/* ========================================
   REGISTER CARD
======================================== */

.register-card {

  position: relative;

  z-index: 3;

  width: 100%;

  max-width: 430px;

  padding: 25px 21px;

  box-sizing: border-box;

  background: #234487;

  border-radius: 28px;

  box-shadow:
    0 18px 45px
    rgba(0,0,0,.20);

}


/* ========================================
   HEADER
======================================== */

.welcome-badge {

  display: inline-block;

  padding: 6px 10px;

  border-radius: 20px;

  background: rgba(255,255,255,.12);

  color: #ffd21f;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: .5px;

}


.card-header h2 {

  margin: 12px 0 5px;

  color: white;

  font-size: 22px;

  font-weight: 850;

}


.card-header p {

  margin: 0 0 23px;

  color: rgba(255,255,255,.72);

  font-size: 11px;

  line-height: 1.6;

}


/* ========================================
   INPUT
======================================== */

.input-wrapper {

  margin-bottom: 14px;

}


.input-wrapper label {

  display: block;

  margin-bottom: 7px;

  color: white;

  font-size: 11px;

  font-weight: 700;

}


.input-box {

  height: 49px;

  display: flex;

  align-items: center;

  gap: 9px;

  padding: 0 13px;

  border: none;

  border-radius: 15px;

  background: #ffffff;

}


.input-box:focus-within {

  box-shadow:
    0 0 0 3px
    rgba(255,210,31,.30);

}


.input-icon {

  font-size: 16px;

}


.input-box input {

  flex: 1;

  width: 100%;

  height: 100%;

  outline: none;

  border: none;

  background: transparent;

  color: #1f2937;

  font-size: 12px;

}


.input-box input::placeholder {

  color: #94a3b8;

}


.eye-button {

  border: none;

  background: transparent;

  cursor: pointer;

  font-size: 15px;

}


.eye-button:disabled {

  opacity: .5;

  cursor: not-allowed;

}


/* ========================================
   TWO COLUMN
======================================== */

.two-column {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

}


/* ========================================
   ERROR
======================================== */

.error-message {

  margin: -2px 0 15px;

  padding: 10px 12px;

  border-radius: 12px;

  background: #fff0f0;

  color: #b42318;

  font-size: 10px;

  font-weight: 600;

  text-align: center;

}


/* ========================================
   REGISTER BUTTON
======================================== */

.register-button {

  width: 100%;

  height: 52px;

  border: none;

  border-radius: 16px;

  background:
    linear-gradient(
      135deg,
      #ffd21f,
      #ffb800
    );

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  font-size: 14px;

  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 8px 20px
    rgba(255,190,0,.28);

}


.register-button:disabled {

  opacity: .65;

  cursor: not-allowed;

}


.button-arrow {

  font-size: 19px;

}


.loading-spinner {

  font-size: 15px;

}


/* ========================================
   LOGIN LINK
======================================== */

.login-link {

  margin-top: 16px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  color: rgba(255,255,255,.80);

  font-size: 10px;

}


.login-link button {

  padding: 0;

  border: none;

  background: transparent;

  color: #ffd21f;

  font-size: 10px;

  font-weight: 800;

  cursor: pointer;

}


.login-link button:disabled {

  opacity: .5;

  cursor: not-allowed;

}


/* ========================================
   INFO
======================================== */

.register-info {

  margin-top: 17px;

  padding: 11px;

  border-radius: 13px;

  background: rgba(255,255,255,.08);

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

}


.register-info p {

  margin: 0;

  color: rgba(255,255,255,.72);

  font-size: 9px;

}


/* ========================================
   FOOTER
======================================== */

.footer {

  position: relative;

  z-index: 2;

  margin-top: auto;

  padding-top: 25px;

  color: rgba(255,255,255,.65);

  font-size: 9px;

}


/* ========================================
   MOBILE
======================================== */

@media (max-width: 380px) {

  .register-page {

    padding-left: 15px;

    padding-right: 15px;

  }


  .register-card {

    padding-left: 17px;

    padding-right: 17px;

  }

}

</style>