<script setup lang="ts">
import { ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { useTelegramUser } from '../composables/useTelegramUser'

const { user } = useTelegramUser()

const BOT_USERNAME = 'compliment_chef_bot'

const registrationType = ref<'place' | 'user'>('place')

const payload = computed(() => {
  const baseId = user.value?.id ?? 0
  return registrationType.value === 'place'
    ? `place_${baseId}`
    : `user_${baseId}`
})

const deepLink = computed(() => {
  return `https://t.me/${BOT_USERNAME}?start=${payload.value}`
})

const isTestMode = computed(() => {
  return !user.value?.id || user.value.isMock
})

const registrationTypeLabel = computed(() => {
  return registrationType.value === 'place'
    ? 'Зарегистрировать заведение'
    : 'Зарегистрировать пользователя (реферал)'
})

const copyToClipboard = async () => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(deepLink.value)
      // Можно добавить уведомление об успешном копировании
    } else {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea')
      textArea.value = deepLink.value
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  } catch (error) {
    console.error('Ошибка при копировании:', error)
  }
}
</script>

<template>
  <div class="screen">
    <div class="screen-container">
      <header class="header">
        <h1 class="title">Регистрации</h1>
        <p class="subtitle">Сгенерируйте QR-код для приглашения</p>
      </header>

      <main class="content">
        <!-- Предупреждение о тестовом режиме -->
        <section v-if="isTestMode" class="card warning-card">
          <p class="warning-text">
            ⚠️ Тестовый режим: используется ID = 0. В реальном Telegram будет использован ваш ID.
          </p>
        </section>

        <!-- Выбор типа регистрации -->
        <section class="card">
          <h2 class="card-title">Тип регистрации</h2>
          <div class="radio-group">
            <label class="radio-label">
              <input
                v-model="registrationType"
                type="radio"
                value="place"
                class="radio-input"
              />
              <span class="radio-text">Зарегистрировать заведение</span>
            </label>
            <label class="radio-label">
              <input
                v-model="registrationType"
                type="radio"
                value="user"
                class="radio-input"
              />
              <span class="radio-text">Зарегистрировать пользователя (реферал)</span>
            </label>
          </div>
        </section>

        <!-- QR-код -->
        <section class="card qr-card">
          <h2 class="card-title">{{ registrationTypeLabel }}</h2>
          <div class="qr-container">
            <QrcodeVue :value="deepLink" :size="220" level="M" />
          </div>
          <p class="qr-hint">Отсканируйте QR-код для перехода к регистрации</p>
        </section>

        <!-- Информация о ссылке -->
        <section class="card info-card">
          <h2 class="card-title">Ссылка для регистрации</h2>
          <div class="link-container">
            <code class="link-text">{{ deepLink }}</code>
            <button
              type="button"
              class="copy-button"
              @click="copyToClipboard"
            >
              Копировать
            </button>
          </div>
          <p class="info-text">
            Payload: <code class="payload-text">{{ payload }}</code>
          </p>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.screen {
  min-height: 100vh;
  background: #f8f8f8;
  display: flex;
  justify-content: center;
  padding-bottom: 70px;
}

.screen-container {
  width: 100%;
  max-width: 420px;
  padding: 24px 16px 40px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #131212;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #6c7080;
  line-height: 1.4;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
}

.warning-card {
  background: #fff3cd;
  border: 1px solid #ffc107;
}

.warning-text {
  margin: 0;
  font-size: 13px;
  color: #856404;
  line-height: 1.4;
}

.card-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #131212;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #978bca;
}

.radio-text {
  font-size: 14px;
  color: #131212;
}

.qr-card {
  text-align: center;
  padding: 24px;
}

.qr-container {
  display: flex;
  justify-content: center;
  margin: 16px 0;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 12px;
}

.qr-hint {
  margin: 16px 0 0;
  font-size: 13px;
  color: #6c7080;
  line-height: 1.4;
}

.info-card {
  padding: 20px;
}

.link-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.link-text {
  display: block;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 8px;
  font-size: 12px;
  color: #131212;
  word-break: break-all;
  font-family: 'Courier New', monospace;
  line-height: 1.4;
}

.copy-button {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #978bca;
  border-radius: 12px;
  background: transparent;
  color: #978bca;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.copy-button:active {
  background: #978bca;
  color: #ffffff;
}

.info-text {
  margin: 0;
  font-size: 13px;
  color: #6c7080;
  line-height: 1.4;
}

.payload-text {
  font-family: 'Courier New', monospace;
  background: #f8f8f8;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #131212;
}
</style>
