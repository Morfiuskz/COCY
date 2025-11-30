<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useTelegramUser } from '../composables/useTelegramUser'

const { user } = useTelegramUser()

interface ProfileData {
  serviceNickname: string
  gender: 'none' | 'male' | 'female'
  age: number | null
}

const serviceNickname = ref<string>('')
const gender = ref<'none' | 'male' | 'female'>('none')
const age = ref<number | null>(null)
const saved = ref(false)
const profileLoaded = ref(false)

const firstLetter = computed(() => {
  return user.value?.firstName?.[0]?.toUpperCase() ?? 'Г'
})

const telegramUsername = computed(() => {
  return user.value?.username || null
})

const displayTelegramUsername = computed(() => {
  if (telegramUsername.value) {
    return `Ник в Telegram: @${telegramUsername.value}`
  }
  return 'Ник в Telegram не указан'
})

const ageOptions = Array.from({ length: 63 }, (_, i) => i + 18)

onMounted(() => {
  // Загружаем профиль из localStorage
  try {
    const savedProfile = localStorage.getItem('chef_profile')
    if (savedProfile) {
      const profile: ProfileData = JSON.parse(savedProfile)
      serviceNickname.value = profile.serviceNickname || ''
      gender.value = profile.gender || 'none'
      age.value = profile.age || null
    } else {
      // Если профиля нет, подставляем Telegram username по умолчанию
      if (telegramUsername.value) {
        serviceNickname.value = telegramUsername.value
      }
    }
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error)
    // Если ошибка, всё равно подставляем Telegram username
    if (telegramUsername.value) {
      serviceNickname.value = telegramUsername.value
    }
  }
  profileLoaded.value = true
})

// Если Telegram username появился позже и serviceNickname пустой, подставляем его
watch(telegramUsername, (newUsername) => {
  if (newUsername && profileLoaded.value && !serviceNickname.value) {
    serviceNickname.value = newUsername
  }
})

const saveProfile = () => {
  const profile: ProfileData = {
    serviceNickname: serviceNickname.value,
    gender: gender.value,
    age: age.value
  }

  try {
    localStorage.setItem('chef_profile', JSON.stringify(profile))
    saved.value = true
    setTimeout(() => {
      saved.value = false
    }, 3000)
  } catch (error) {
    console.error('Ошибка при сохранении профиля:', error)
  }
}
</script>

<template>
  <div class="screen">
    <div class="screen-container">
      <header class="header">
        <h1 class="title">Профиль</h1>
        <p class="subtitle">Это данные внутри сервиса, их можно менять независимо от Telegram.</p>
      </header>

      <main class="content">
        <!-- Верхний блок с аватаркой -->
        <section class="card profile-header-card">
          <div class="profile-header">
            <div class="user-avatar">
              <span class="user-avatar-letter">{{ firstLetter }}</span>
            </div>
            <div class="profile-header-info">
              <p class="telegram-username">{{ displayTelegramUsername }}</p>
              <button type="button" class="change-photo-button">Изменить фото</button>
            </div>
          </div>
        </section>

        <!-- Форма -->
        <section class="card form-card">
          <div class="form-field">
            <label class="form-label">Ник в сервисе</label>
            <input
              v-model="serviceNickname"
              type="text"
              class="form-input"
              placeholder="Введите ник"
            />
          </div>

          <div class="form-field">
            <label class="form-label">Пол</label>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  v-model="gender"
                  type="radio"
                  value="none"
                  class="radio-input"
                />
                <span class="radio-text">не хочу указывать</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="gender"
                  type="radio"
                  value="male"
                  class="radio-input"
                />
                <span class="radio-text">М</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="gender"
                  type="radio"
                  value="female"
                  class="radio-input"
                />
                <span class="radio-text">Ж</span>
              </label>
            </div>
          </div>

          <div class="form-field">
            <label class="form-label">Количество полных лет</label>
            <select v-model="age" class="form-select">
              <option :value="null" disabled>Выберите возраст</option>
              <option v-for="ageOption in ageOptions" :key="ageOption" :value="ageOption">
                {{ ageOption }}
              </option>
            </select>
          </div>
        </section>

        <!-- Кнопка сохранения -->
        <button type="button" class="save-button" @click="saveProfile">
          Сохранить профиль
        </button>

        <p v-if="saved" class="saved-message">Изменения сохранены</p>
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

.profile-header-card {
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #978bca;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-avatar-letter {
  color: #ffffff;
  font-weight: 600;
  font-size: 24px;
}

.profile-header-info {
  flex: 1;
  min-width: 0;
}

.telegram-username {
  margin: 0 0 8px;
  font-size: 14px;
  color: #6c7080;
}

.change-photo-button {
  background: transparent;
  border: none;
  color: #978bca;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}

.change-photo-button:active {
  opacity: 0.8;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #131212;
}

.form-input,
.form-select {
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
.form-select:focus {
  outline: none;
  border-color: #978bca;
}

.form-select {
  cursor: pointer;
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

.save-button {
  width: 100%;
  border: none;
  outline: none;
  cursor: pointer;
  height: 44px;
  border-radius: 22px;
  background: #978bca;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
  margin-top: 8px;
}

.save-button:active {
  opacity: 0.9;
}

.saved-message {
  margin: 8px 0 0;
  text-align: center;
  font-size: 12px;
  color: #6c7080;
}
</style>

