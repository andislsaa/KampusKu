<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header>
      <ion-toolbar class="chat-toolbar">

        <ion-buttons slot="start">
          <ion-back-button
            default-href="/dashboard"
            text=""
          />
        </ion-buttons>

        <div class="header-title">
          <div class="bot-avatar">
            🤖
          </div>

          <div>
            <h2>Chatbot KampusKu</h2>
            <p>Asisten informasi kampus</p>
          </div>
        </div>

      </ion-toolbar>
    </ion-header>


    <!-- CONTENT -->
    <ion-content
      class="chat-content"
      ref="content"
    >

      <!-- WELCOME -->
      <div
        v-if="messages.length === 0"
        class="welcome-container"
      >

        <div class="welcome-icon">
          🤖
        </div>

        <h1>
          Halo! 👋
        </h1>

        <p>
          Saya siap membantu kamu mencari
          informasi di KampusKu.
        </p>

        <div class="suggestions">

          <button
            @click="sendSuggestion(
              'Ada pengumuman terbaru?'
            )"
          >
            📢 Pengumuman terbaru
          </button>

          <button
            @click="sendSuggestion(
              'Ada event kampus?'
            )"
          >
            🎫 Event kampus
          </button>

        </div>

      </div>


      <!-- CHAT -->
      <div class="messages-container">

        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message-wrapper"
          :class="message.sender"
        >

          <div
            v-if="message.sender === 'bot'"
            class="message-avatar"
          >
            🤖
          </div>

          <div class="message-bubble">

            <div class="message-text">
              {{ message.text }}
            </div>

          </div>

        </div>


        <!-- LOADING -->
        <div
          v-if="loading"
          class="message-wrapper bot"
        >

          <div class="message-avatar">
            🤖
          </div>

          <div class="message-bubble typing">

            <span></span>
            <span></span>
            <span></span>

          </div>

        </div>

      </div>

      <div class="bottom-padding"></div>

    </ion-content>


    <!-- INPUT -->
    <div class="input-area">

      <div class="input-wrapper">

        <input
          v-model="question"
          type="text"
          placeholder="Tulis pertanyaan..."
          :disabled="loading"
          @keyup.enter="sendMessage"
        />

        <button
          class="send-button"
          :disabled="
            loading ||
            !question.trim()
          "
          @click="sendMessage"
        >
          ➤
        </button>

      </div>

    </div>

  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  onIonViewWillLeave,
  onIonViewDidEnter,
} from '@ionic/vue'

import {
  ref,
  nextTick,
} from 'vue'

import axios from 'axios'


/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

const API_URL = 'https://kampusku-api-production.up.railway.app/api'


/*
|--------------------------------------------------------------------------
| CONTENT
|--------------------------------------------------------------------------
*/

const content = ref<any>(null)

onIonViewDidEnter(() => {
  // Pastikan fokus berada pada halaman yang aktif
  const activeElement = document.activeElement

  if (
    activeElement instanceof HTMLElement &&
    !activeElement.closest('ion-page')
  ) {
    activeElement.blur()
  }
})

onIonViewWillLeave(() => {
  // Lepaskan fokus sebelum Ionic menyembunyikan halaman
  const activeElement = document.activeElement

  if (activeElement instanceof HTMLElement) {
    activeElement.blur()
  }
})

/*
|--------------------------------------------------------------------------
| QUESTION
|--------------------------------------------------------------------------
*/

const question = ref('')


/*
|--------------------------------------------------------------------------
| LOADING
|--------------------------------------------------------------------------
*/

const loading = ref(false)


/*
|--------------------------------------------------------------------------
| MESSAGE
|--------------------------------------------------------------------------
*/

interface ChatMessage {

  sender: 'user' | 'bot'

  text: string

}


const messages =
  ref<ChatMessage[]>([])


/*
|--------------------------------------------------------------------------
| TOKEN
|--------------------------------------------------------------------------
*/

const getToken = () => {

  return localStorage.getItem(
    'kampusku_token'
  )

}


/*
|--------------------------------------------------------------------------
| SCROLL CHAT
|--------------------------------------------------------------------------
*/

const scrollToBottom =
  async () => {

    await nextTick()

    if (
      content.value &&
      content.value.$el
    ) {

      content.value.$el.scrollToBottom(
        300
      )

    }

  }


/*
|--------------------------------------------------------------------------
| SEND SUGGESTION
|--------------------------------------------------------------------------
*/

const sendSuggestion =
  (text: string) => {

    question.value = text

    sendMessage()

  }


/*
|--------------------------------------------------------------------------
| SEND MESSAGE
|--------------------------------------------------------------------------
*/

const sendMessage =
  async () => {

    const text =
      question.value.trim()

    if (
      !text ||
      loading.value
    ) {

      return

    }


    /*
    |--------------------------------------------------------------------------
    | TOKEN
    |--------------------------------------------------------------------------
    */

    const token =
      getToken()


    if (!token) {

      messages.value.push({

        sender: 'bot',

        text:
          'Sesi login kamu sudah berakhir. Silakan login kembali.',

      })

      return

    }


    /*
    |--------------------------------------------------------------------------
    | Tampilkan pesan user
    |--------------------------------------------------------------------------
    */

    messages.value.push({

      sender: 'user',

      text: text,

    })


    /*
    |--------------------------------------------------------------------------
    | Kosongkan input
    |--------------------------------------------------------------------------
    */

    question.value = ''


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    loading.value = true


    await scrollToBottom()


    try {

      /*
      |--------------------------------------------------------------------------
      | Request ke Laravel
      |--------------------------------------------------------------------------
      */

      const response =
        await axios.post(

          `${API_URL}/chatbot`,

          {
            question: text,
          },

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

              Accept:
                'application/json',

              'Content-Type':
                'application/json',

            },

          }

        )


      /*
      |--------------------------------------------------------------------------
      | Ambil jawaban
      |--------------------------------------------------------------------------
      */

      const botMessage =
        response.data?.message ||
        'Maaf, saya belum memiliki jawaban untuk pertanyaan tersebut.'


      /*
      |--------------------------------------------------------------------------
      | Tampilkan jawaban bot
      |--------------------------------------------------------------------------
      */

      messages.value.push({

        sender: 'bot',

        text: botMessage,

      })

    }

    catch (error: any) {

      console.error(
        'Chatbot error:',
        error
      )


      /*
      |--------------------------------------------------------------------------
      | Error 401
      |--------------------------------------------------------------------------
      */

      if (
        error.response?.status === 401
      ) {

        messages.value.push({

          sender: 'bot',

          text:
            'Sesi login kamu tidak valid. Silakan login kembali.',

        })

      }


      /*
      |--------------------------------------------------------------------------
      | Error 422
      |--------------------------------------------------------------------------
      */

      else if (
        error.response?.status === 422
      ) {

        messages.value.push({

          sender: 'bot',

          text:
            'Pertanyaan tidak dapat diproses. Coba gunakan pertanyaan yang lebih singkat.',

        })

      }


      /*
      |--------------------------------------------------------------------------
      | Error lainnya
      |--------------------------------------------------------------------------
      */

      else {

        messages.value.push({

          sender: 'bot',

          text:
            'Maaf, terjadi masalah saat menghubungkan ke server KampusKu.',

        })

      }

    }

    finally {

      loading.value = false

      await scrollToBottom()

    }

  }

</script>


<style scoped>

/* =========================
   PAGE
========================= */

ion-content {
  --background: #f5f8fc;
}


/* =========================
   HEADER
========================= */

.chat-toolbar {
  --background: #1769c2;
  --color: white;
  --border-width: 0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bot-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.15);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
}

.header-title h2 {
  margin: 0;

  color: white;

  font-size: 15px;

  font-weight: 800;
}

.header-title p {
  margin: 2px 0 0;

  color: #dcecff;

  font-size: 9px;
}


/* =========================
   WELCOME
========================= */

.welcome-container {
  text-align: center;

  padding:
    45px
    20px
    20px;
}

.welcome-icon {
  width: 75px;
  height: 75px;

  margin: 0 auto 15px;

  border-radius: 24px;

  background: #1769c2;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 38px;

  box-shadow:
    0 8px 20px
    rgba(23, 105, 194, 0.2);
}

.welcome-container h1 {
  margin: 0 0 8px;

  color: #1769c2;

  font-size: 24px;

  font-weight: 800;
}

.welcome-container > p {
  margin: 0 auto;

  max-width: 280px;

  color: #777;

  font-size: 12px;

  line-height: 1.6;
}


/* =========================
   SUGGESTIONS
========================= */

.suggestions {
  display: flex;

  flex-direction: column;

  gap: 10px;

  margin-top: 25px;
}

.suggestions button {
  width: 100%;

  padding: 13px 15px;

  border: 1px solid #dce8f5;

  border-radius: 14px;

  background: white;

  color: #1769c2;

  text-align: left;

  font-size: 12px;

  font-weight: 600;

  box-shadow:
    0 3px 10px
    rgba(0, 0, 0, 0.04);

  transition: 0.2s ease;
}

.suggestions button:active {
  transform: scale(0.98);
  background: #f1f7fd;
}


/* =========================
   MESSAGES
========================= */

.messages-container {
  padding: 15px 20px;
}

.message-wrapper {
  display: flex;

  align-items: flex-end;

  gap: 8px;

  margin-bottom: 13px;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-wrapper.bot {
  justify-content: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;

  min-width: 32px;

  border-radius: 11px;

  background: #1769c2;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 17px;
}

.message-bubble {
  max-width: 78%;

  padding:
    11px
    14px;

  border-radius: 16px;

  white-space: pre-line;

  font-size: 12px;

  line-height: 1.55;
}


/* USER */

.message-wrapper.user .message-bubble {
  background: #1769c2;

  color: white;

  border-bottom-right-radius: 5px;

  box-shadow:
    0 3px 10px
    rgba(23, 105, 194, 0.15);
}


/* BOT */

.message-wrapper.bot .message-bubble {
  background: white;

  color: #444;

  border-bottom-left-radius: 5px;

  box-shadow:
    0 3px 10px
    rgba(0, 0, 0, 0.05);
}


/* =========================
   TYPING
========================= */

.typing {
  display: flex;

  align-items: center;

  gap: 4px;

  min-width: 55px;

  padding: 13px;
}

.typing span {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #1769c2;

  animation:
    typingAnimation
    1.2s
    infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingAnimation {

  0%,
  60%,
  100% {
    opacity: 0.3;

    transform:
      translateY(0);
  }

  30% {
    opacity: 1;

    transform:
      translateY(-3px);
  }
}


/* =========================
   BOTTOM PADDING
========================= */

.bottom-padding {
  height: 20px;
}


/* =========================
   INPUT AREA
========================= */

.input-area {
  padding:
    10px
    15px
    calc(
      10px
      + env(
        safe-area-inset-bottom
      )
    );

  background: white;

  border-top:
    1px solid #e5edf5;
}

.input-wrapper {
  display: flex;

  align-items: center;

  gap: 8px;

  background: #f5f8fc;

  border:
    1px solid #e2ebf5;

  border-radius: 17px;

  padding:
    5px
    5px
    5px
    15px;
}

.input-wrapper input {
  flex: 1;

  border: none;

  outline: none;

  background: transparent;

  color: #333;

  font-size: 12px;
}

.input-wrapper input::placeholder {
  color: #aaa;
}

.send-button {
  width: 39px;
  height: 39px;

  border: none;

  border-radius: 13px;

  background: #1769c2;

  color: white;

  font-size: 17px;

  transition: 0.2s ease;
}

.send-button:active {
  transform: scale(0.94);
}

.send-button:disabled {
  opacity: 0.4;
}


/* =========================
   ORANGE ACCENT
========================= */

.suggestions button:first-child::first-letter {
  color: #f59e0b;
}


/* =========================
   DESKTOP
========================= */

@media (min-width: 600px) {

  .messages-container {
    padding-left: 25px;
    padding-right: 25px;
  }

  .suggestions {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .input-area {
    padding-left: 25px;
    padding-right: 25px;
  }

}

</style>
