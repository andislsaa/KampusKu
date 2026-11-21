<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="login-page">

        <!-- DECORATION -->
        <div class="circle circle-one"></div>
        <div class="circle circle-two"></div>
        <div class="circle circle-three"></div>

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
            Universitas Halu Oleo
          </p>

        </div>

        <!-- LOGIN CARD -->
        <div class="login-card">

          <div class="card-header">

            <span class="welcome-badge">
              HELLO 👋
            </span>

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
                v-model="email"
                type="email"
                placeholder="nama@email.com"
                autocomplete="email"
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
                🔑
              </span>

              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                autocomplete="current-password"
                :disabled="loading"
                @keyup.enter="login"
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

            <div class="password-info">
              <span>Use your KampusKu password.</span>
              <span>{{ password.length }}/32</span>
            </div>

          </div>

          <!-- OPTIONS -->
          <div class="options">

            <label class="remember">

              <input
                type="checkbox"
                v-model="rememberMe"
                :disabled="loading"
              />

              <span>
                Remember me
              </span>

            </label>

            <button
              type="button"
              class="forgot"
              @click="forgotPassword"
              :disabled="loading"
            >
              Lupa password?
            </button>

          </div>

          <!-- ERROR MESSAGE -->
          <div
            v-if="errorMessage"
            class="error-message"
          >
            {{ errorMessage }}
          </div>

          <!-- LOGIN BUTTON -->
          <button
            type="button"
            class="login-button"
            @click="login"
            :disabled="loading"
          >

            <span>
              {{ loading ? 'Sedang masuk...' : 'Login' }}
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

          <!-- REGISTER LINK -->
          <div class="register-link">

            <span>
              Belum punya akun?
            </span>

            <button
              type="button"
              @click="goToRegister"
              :disabled="loading"
            >
              Daftar
            </button>

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

import { ref } from 'vue'

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
// FORM
// ========================================

const email = ref('')

const password = ref('')

const rememberMe = ref(false)

const showPassword = ref(false)


// ========================================
// LOGIN STATE
// ========================================

const loading = ref(false)

const errorMessage = ref('')


// ========================================
// API
// ========================================

const API_URL = 'https://kampusku-api-production.up.railway.app/api'


// ========================================
// LOGIN
// ========================================

const login = async () => {

  // Reset error
  errorMessage.value = ''


  // Validasi email
  if (!email.value.trim()) {

    errorMessage.value =
      'Email wajib diisi.'

    return
  }


  // Validasi password
  if (!password.value) {

    errorMessage.value =
      'Password wajib diisi.'

    return
  }


  // Mulai loading
  loading.value = true


  try {

    // ========================================
    // REQUEST LOGIN KE LARAVEL
    // ========================================

    const response = await axios.post(
      `${API_URL}/login`,
      {
        email: email.value.trim(),
        password: password.value
      }
    )


    console.log(
      'Login berhasil:',
      response.data
    )


    // ========================================
    // AMBIL TOKEN
    // ========================================

    const token =
      response.data.token


    // ========================================
    // AMBIL DATA USER
    // ========================================

    const user =
      response.data.user


    // Pastikan token tersedia
    if (!token) {

      errorMessage.value =
        'Token login tidak ditemukan.'

      return
    }


    // ========================================
    // SIMPAN TOKEN
    // ========================================

    localStorage.setItem(
      'kampusku_token',
      token
    )


    // ========================================
    // SIMPAN DATA USER
    // ========================================

    if (user) {

      localStorage.setItem(
        'kampusku_user',
        JSON.stringify(user)
      )
    }


    // ========================================
    // SIMPAN STATUS REMEMBER ME
    // ========================================

    localStorage.setItem(
      'kampusku_remember',
      rememberMe.value
        ? 'true'
        : 'false'
    )


    // ========================================
    // PINDAH KE DASHBOARD
    // ========================================

    await router.replace('/dashboard')


  } catch (error: any) {

    console.error(
      'Login error:',
      error
    )


    // ========================================
    // ERROR DARI SERVER
    // ========================================

    if (error.response) {

      const status =
        error.response.status


      // Email/password salah
      if (status === 401) {

        errorMessage.value =
          'Email atau password salah.'

      }


      // Validasi Laravel
      else if (status === 422) {

        const errors =
          error.response.data?.errors


        if (errors?.email?.length) {

          errorMessage.value =
            errors.email[0]

        }


        else if (errors?.password?.length) {

          errorMessage.value =
            errors.password[0]

        }


        else {

          errorMessage.value =
            'Data login tidak valid.'

        }

      }


      // Server error
      else if (status >= 500) {

        errorMessage.value =
          'Terjadi kesalahan pada server.'

      }


      // Error lainnya
      else {

        errorMessage.value =
          error.response.data?.message ||
          'Login gagal. Silakan coba lagi.'

      }

    }


    // ========================================
    // SERVER TIDAK TERHUBUNG
    // ========================================

    else if (error.request) {

      errorMessage.value =
        'Tidak dapat terhubung ke server Laravel. Pastikan API sedang berjalan.'

    }


    // ========================================
    // ERROR LAINNYA
    // ========================================

    else {

      errorMessage.value =
        'Terjadi kesalahan. Silakan coba lagi.'

    }

  } finally {

    loading.value = false

  }

}


// ========================================
// LUPA PASSWORD
// ========================================

const forgotPassword = () => {

  errorMessage.value =
    'Fitur lupa password belum tersedia.'

}


const goToRegister = () => {

  router.push('/register')

}

</script>


<style scoped>

/* ========================================
   PAGE
======================================== */

ion-content {
  --background: #1769c2;
}

.login-page {

  position: relative;

  min-height: 100%;

  overflow: hidden;

  display: flex;

  flex-direction: column;

  align-items: center;

  padding: 45px 20px 25px;

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

.circle {

  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  border: 35px solid rgba(255,255,255,.08);

}


.circle-one {

  width: 220px;

  height: 220px;

  top: -100px;

  right: -80px;

}


.circle-two {

  width: 180px;

  height: 180px;

  bottom: 80px;

  left: -110px;

}


.circle-three {

  width: 100px;

  height: 100px;

  top: 270px;

  left: -55px;

  border-width: 20px;

}


/* ========================================
   BRAND
======================================== */

.brand-section {

  position: relative;

  z-index: 2;

  text-align: center;

  margin-bottom: 35px;

}


/* LOGO */

.logo {

  width: 82px;

  height: 82px;

  margin: auto;

  border-radius: 22px;

  background: white;

  display: flex;

  align-items: center;

  justify-content: center;

  box-shadow:
    0 12px 30px
    rgba(0,0,0,.18);

}


.logo-symbol {

  font-size: 43px;

}


/* BRAND TITLE */

.brand-section h1 {

  margin: 14px 0 3px;

  color: white;

  font-size: 31px;

  font-weight: 900;

  letter-spacing: -1px;

}


.brand-section h1 span {

  color: #ffd21f;

}


.brand-section p {

  margin: 0;

  color: rgba(255,255,255,.85);

  font-size: 13px;

  font-weight: 500;

}


/* ========================================
   LOGIN CARD
======================================== */

.login-card {

  position: relative;

  z-index: 3;

  width: 100%;

  max-width: 430px;

  padding: 30px 25px;

  box-sizing: border-box;

  background: #234487;

  border-radius: 30px;

  box-shadow:
    0 18px 45px
    rgba(0,0,0,.20);

}


/* ========================================
   HEADER
======================================== */

.card-header {

  margin-bottom: 25px;

}


.card-header h2 {

  margin: 0;

  color: white;

  font-size: 18px;

  font-weight: 800;

  line-height: 1.4;

}


/* ========================================
   INPUT
======================================== */

.input-wrapper {

  margin-bottom: 18px;

}


.input-wrapper label {

  display: block;

  margin-bottom: 7px;

  color: white;

  font-size: 11px;

  font-weight: 700;

}


.input-box {

  height: 53px;

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 0 14px;

  border: none;

  border-radius: 15px;

  background: #ffffff;

  transition: .2s;

}


.input-box:focus-within {

  box-shadow:
    0 0 0 3px
    rgba(255,210,31,.35);

}


.input-icon {

  font-size: 18px;

}


.input-box input {

  flex: 1;

  width: 100%;

  height: 100%;

  outline: none;

  border: none;

  background: transparent;

  color: #1f2937;

  font-size: 13px;

}


.input-box input::placeholder {

  color: #94a3b8;

}


.input-box input:disabled {

  opacity: .6;

}


/* ========================================
   PASSWORD
======================================== */

.password-info {

  display: flex;

  justify-content: space-between;

  margin-top: 5px;

  padding: 0 3px;

  color: rgba(255,255,255,.75);

  font-size: 9px;

}


.eye-button {

  border: none;

  background: transparent;

  cursor: pointer;

  font-size: 16px;

}


.eye-button:disabled {

  opacity: .5;

  cursor: not-allowed;

}


/* ========================================
   OPTIONS
======================================== */

.options {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin: 4px 0 23px;

}


.remember {

  display: flex;

  align-items: center;

  gap: 7px;

  color: white;

  font-size: 11px;

}


.remember input {

  width: 18px;

  height: 18px;

  accent-color: #ffd21f;

}


.forgot {

  border: none;

  background: transparent;

  color: white;

  font-size: 10px;

  font-weight: 700;

  cursor: pointer;

}


.forgot:disabled {

  opacity: .5;

  cursor: not-allowed;

}


/* ========================================
   ERROR
======================================== */

.error-message {

  margin: -5px 0 15px;

  padding: 10px 12px;

  border-radius: 12px;

  background: #fff0f0;

  color: #b42318;

  font-size: 10px;

  font-weight: 600;

  text-align: center;

}


/* ========================================
   LOGIN BUTTON
======================================== */

.login-button {

  width: 100%;

  height: 54px;

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

  font-size: 15px;

  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 8px 20px
    rgba(255,190,0,.28);

  transition: .2s;

}


.login-button:active {

  transform: scale(.98);

}


.login-button:disabled {

  opacity: .65;

  cursor: not-allowed;

  transform: none;

}


.button-arrow {

  font-size: 20px;

}


.loading-spinner {

  font-size: 15px;

}


/* ========================================
   REGISTER
======================================== */

.register-link {

  margin-top: 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  color: rgba(255,255,255,.8);

  font-size: 10px;

}


.register-link button {

  padding: 0;

  border: none;

  background: transparent;

  color: #ffd21f;

  font-size: 10px;

  font-weight: 800;

  cursor: pointer;

}


.register-link button:disabled {

  opacity: .5;

  cursor: not-allowed;

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
   DESKTOP
======================================== */

@media (min-width: 700px) {

  .login-page {

    justify-content: center;

    padding: 35px;

  }


  .brand-section {

    margin-bottom: 25px;

  }

}

</style>