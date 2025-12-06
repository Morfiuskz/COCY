<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { useTelegramUser } from '../composables/useTelegramUser'

const { user } = useTelegramUser()

const BOT_USERNAME = 'compliment_chef_bot'
const API_BASE_URL = '/api'

// Режимы экрана
const sessionId = ref<string | null>(null)
const isInviteMode = computed(() => !!sessionId.value)

// Состояние загрузки сессии
const isLoadingSession = ref(false)
const sessionError = ref<string | null>(null)
const sessionData = ref<any>(null)

// Форма регистрации заведения
const placeName = ref('')
const venueType = ref('')
const seats = ref('')
const avgCheck = ref('')
const location = ref('')
const contactPersonsCount = ref<'1' | '2'>('1')

// Контактное лицо 1
const contactPerson1 = ref({
  fullName: '',
  position: '',
  telegramNick: '',
  phone: ''
})

// Контактное лицо 2
const contactPerson2 = ref({
  fullName: '',
  position: '',
  telegramNick: '',
  phone: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref<string | null>(null)

// Опции для select
const venueTypes = [
  'Бар',
  'Ресторан',
  'Кафе',
  'Кофейня',
  'Пиццерия',
  'Лаундж-бар',
  'Другое'
]

const avgCheckOptions = [
  '< 1000 руб.',
  '1000–2000 руб.',
  '2000–3000 руб.',
  '> 3000 руб.'
]

// Режим официанта (генерация QR)
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

// Загрузка сессии при монтировании в режиме приглашения
onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const sessionIdParam = params.get('sessionId')
  
  if (sessionIdParam) {
    sessionId.value = sessionIdParam
    await loadSession()
  }
})

// Загрузка данных сессии с backend
const loadSession = async () => {
  if (!sessionId.value) return

  isLoadingSession.value = true
  sessionError.value = null

  try {
    const response = await fetch(`${API_BASE_URL}/registration-sessions/${sessionId.value}`)

    if (!response.ok) {
      if (response.status === 404) {
        sessionError.value = 'Ссылка недействительна или устарела'
      } else {
        sessionError.value = 'Ошибка при загрузке сессии'
      }
      return
    }

    sessionData.value = await response.json()
  } catch (error) {
    console.error('Error loading session:', error)
    sessionError.value = 'Ошибка при загрузке сессии'
  } finally {
    isLoadingSession.value = false
  }
}

// Отправка формы регистрации
const submitRegistration = async () => {
  if (!sessionId.value) return

  // Валидация
  if (!placeName.value.trim()) {
    submitError.value = 'Название заведения обязательно'
    return
  }
  if (!venueType.value) {
    submitError.value = 'Выберите вид заведения'
    return
  }
  if (!avgCheck.value) {
    submitError.value = 'Выберите сумму среднего чека'
    return
  }
  if (!contactPerson1.value.fullName.trim()) {
    submitError.value = 'Заполните ФИО контактного лица 1'
    return
  }
  if (!contactPerson1.value.position.trim()) {
    submitError.value = 'Заполните должность контактного лица 1'
    return
  }
  if (!contactPerson1.value.telegramNick.trim()) {
    submitError.value = 'Заполните ник в Telegram контактного лица 1'
    return
  }
  if (!contactPerson1.value.phone.trim()) {
    submitError.value = 'Заполните телефон контактного лица 1'
    return
  }

  if (contactPersonsCount.value === '2') {
    if (!contactPerson2.value.fullName.trim()) {
      submitError.value = 'Заполните ФИО контактного лица 2'
      return
    }
    if (!contactPerson2.value.position.trim()) {
      submitError.value = 'Заполните должность контактного лица 2'
      return
    }
    if (!contactPerson2.value.telegramNick.trim()) {
      submitError.value = 'Заполните ник в Telegram контактного лица 2'
      return
    }
    if (!contactPerson2.value.phone.trim()) {
      submitError.value = 'Заполните телефон контактного лица 2'
      return
    }
  }

  isSubmitting.value = true
  submitError.value = null
  submitSuccess.value = false

  try {
    const contactPersons = [
      {
        fullName: contactPerson1.value.fullName.trim(),
        position: contactPerson1.value.position.trim(),
        telegramNick: contactPerson1.value.telegramNick.trim(),
        phone: contactPerson1.value.phone.trim()
      }
    ]

    if (contactPersonsCount.value === '2') {
      contactPersons.push({
        fullName: contactPerson2.value.fullName.trim(),
        position: contactPerson2.value.position.trim(),
        telegramNick: contactPerson2.value.telegramNick.trim(),
        phone: contactPerson2.value.phone.trim()
      })
    }

    const payload = {
      sessionId: sessionId.value,
      placeName: placeName.value.trim(),
      venueType: venueType.value,
      seats: seats.value.trim() || undefined,
      avgCheck: avgCheck.value,
      location: location.value.trim() || undefined,
      contactPersons
    }

    const response = await fetch(`${API_BASE_URL}/place-registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Ошибка при отправке заявки')
    }

    submitSuccess.value = true
    // Можно закрыть WebApp или показать сообщение об успехе
    setTimeout(() => {
      const tg = (window as any).Telegram?.WebApp
      if (tg && typeof tg.close === 'function') {
        tg.close()
      }
    }, 2000)
  } catch (error: any) {
    console.error('Error submitting registration:', error)
    submitError.value = error.message || 'Ошибка при отправке заявки'
  } finally {
    isSubmitting.value = false
  }
}

// Отмена регистрации
const handleCancel = () => {
  const tg = (window as any).Telegram?.WebApp
  if (tg && typeof tg.close === 'function') {
    tg.close()
  } else {
    // Fallback: можно вернуться назад или показать сообщение
    window.history.back()
  }
}

const copyToClipboard = async () => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(deepLink.value)
    } else {
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
      <!-- Режим официанта: генерация QR-кодов -->
      <template v-if="!isInviteMode">
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
      </template>

      <!-- Режим заведения: форма регистрации -->
      <template v-else>
        <header class="header">
          <h1 class="title">Регистрация заведения</h1>
          <p class="subtitle">Заполните форму для регистрации</p>
        </header>

        <main class="content">
          <!-- Ошибка загрузки сессии -->
          <section v-if="sessionError" class="card error-card">
            <p class="error-text">{{ sessionError }}</p>
          </section>

          <!-- Загрузка сессии -->
          <section v-else-if="isLoadingSession" class="card">
            <p class="loading-text">Загрузка...</p>
          </section>

          <!-- Форма регистрации -->
          <template v-else>
            <!-- Название -->
            <section class="card form-card">
              <div class="form-field">
                <label class="form-label">Название заведения *</label>
                <input
                  v-model="placeName"
                  type="text"
                  class="form-input"
                  placeholder="Введите название"
                  required
                />
              </div>
            </section>

            <!-- Вид заведения -->
            <section class="card form-card">
              <div class="form-field">
                <label class="form-label">Вид заведения *</label>
                <select v-model="venueType" class="form-select" required>
                  <option value="" disabled>Выберите вид заведения</option>
                  <option v-for="type in venueTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>
            </section>

            <!-- Количество посадочных мест -->
            <section class="card form-card">
              <div class="form-field">
                <label class="form-label">Количество посадочных мест</label>
                <input
                  v-model="seats"
                  type="text"
                  class="form-input"
                  placeholder="Например: 50"
                />
              </div>
            </section>

            <!-- Сумма среднего чека -->
            <section class="card form-card">
              <div class="form-field">
                <label class="form-label">Сумма среднего чека *</label>
                <select v-model="avgCheck" class="form-select" required>
                  <option value="" disabled>Выберите сумму</option>
                  <option v-for="option in avgCheckOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </div>
            </section>

            <!-- Местоположение -->
            <section class="card form-card">
              <div class="form-field">
                <label class="form-label">Адрес</label>
                <textarea
                  v-model="location"
                  class="form-textarea"
                  placeholder="Введите адрес заведения"
                  rows="3"
                ></textarea>
              </div>
            </section>

            <!-- Количество контактных лиц -->
            <section class="card form-card">
              <div class="form-field">
                <label class="form-label">Количество контактных лиц</label>
                <select v-model="contactPersonsCount" class="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
            </section>

            <!-- Контактное лицо 1 -->
            <section class="card form-card">
              <h3 class="form-section-title">Контактное лицо 1 *</h3>
              <div class="form-fields-group">
                <div class="form-field">
                  <label class="form-label">ФИО *</label>
                  <input
                    v-model="contactPerson1.fullName"
                    type="text"
                    class="form-input"
                    placeholder="Иванов Иван Иванович"
                    required
                  />
                </div>
                <div class="form-field">
                  <label class="form-label">Должность *</label>
                  <input
                    v-model="contactPerson1.position"
                    type="text"
                    class="form-input"
                    placeholder="Директор"
                    required
                  />
                </div>
                <div class="form-field">
                  <label class="form-label">Ник в Telegram *</label>
                  <input
                    v-model="contactPerson1.telegramNick"
                    type="text"
                    class="form-input"
                    placeholder="@username"
                    required
                  />
                </div>
                <div class="form-field">
                  <label class="form-label">Телефон *</label>
                  <input
                    v-model="contactPerson1.phone"
                    type="tel"
                    class="form-input"
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>
              </div>
            </section>

            <!-- Контактное лицо 2 -->
            <section v-if="contactPersonsCount === '2'" class="card form-card">
              <h3 class="form-section-title">Контактное лицо 2 *</h3>
              <div class="form-fields-group">
                <div class="form-field">
                  <label class="form-label">ФИО *</label>
                  <input
                    v-model="contactPerson2.fullName"
                    type="text"
                    class="form-input"
                    placeholder="Петров Петр Петрович"
                    required
                  />
                </div>
                <div class="form-field">
                  <label class="form-label">Должность *</label>
                  <input
                    v-model="contactPerson2.position"
                    type="text"
                    class="form-input"
                    placeholder="Менеджер"
                    required
                  />
                </div>
                <div class="form-field">
                  <label class="form-label">Ник в Telegram *</label>
                  <input
                    v-model="contactPerson2.telegramNick"
                    type="text"
                    class="form-input"
                    placeholder="@username"
                    required
                  />
                </div>
                <div class="form-field">
                  <label class="form-label">Телефон *</label>
                  <input
                    v-model="contactPerson2.phone"
                    type="tel"
                    class="form-input"
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>
              </div>
            </section>

            <!-- Сообщения об ошибке/успехе -->
            <section v-if="submitError" class="card error-card">
              <p class="error-text">{{ submitError }}</p>
            </section>

            <section v-if="submitSuccess" class="card success-card">
              <p class="success-text">✅ Заявка успешно отправлена!</p>
            </section>

            <!-- Кнопки -->
            <section class="card buttons-card">
              <div class="buttons-group">
                <button
                  type="button"
                  class="cancel-button"
                  @click="handleCancel"
                  :disabled="isSubmitting"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  class="submit-button"
                  @click="submitRegistration"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Отправка...' : 'Ок' }}
                </button>
              </div>
            </section>
          </template>
        </main>
      </template>
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

.error-card {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
}

.error-text {
  margin: 0;
  font-size: 13px;
  color: #721c24;
  line-height: 1.4;
}

.success-card {
  background: #d4edda;
  border: 1px solid #c3e6cb;
}

.success-text {
  margin: 0;
  font-size: 14px;
  color: #155724;
  line-height: 1.4;
  font-weight: 500;
}

.loading-text {
  margin: 0;
  text-align: center;
  font-size: 14px;
  color: #6c7080;
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

/* Форма регистрации */
.form-card {
  padding: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-fields-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #131212;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d8d8d8;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #131212;
  background: #ffffff;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #978bca;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-select {
  cursor: pointer;
}

.form-section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #131212;
}

.buttons-card {
  padding: 20px;
}

.buttons-group {
  display: flex;
  gap: 12px;
}

.cancel-button,
.submit-button {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.cancel-button {
  background: #f8f8f8;
  color: #6c7080;
  border: 1px solid #d8d8d8;
}

.cancel-button:active:not(:disabled) {
  background: #e8e8e8;
}

.submit-button {
  background: #978bca;
  color: #ffffff;
}

.submit-button:active:not(:disabled) {
  background: #8579b8;
}

.cancel-button:disabled,
.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
