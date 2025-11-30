<script setup lang="ts">
import { computed } from 'vue'
import { useTelegramUser } from '../composables/useTelegramUser'

const { user, isLoading, isTelegramEnv } = useTelegramUser()

const firstLetter = computed(() => {
  return user.value?.firstName?.[0]?.toUpperCase() ?? 'Г'
})

const displayName = computed(() => {
  if (!user.value) return 'Гость'
  const { firstName, lastName } = user.value
  return [firstName, lastName].filter(Boolean).join(' ')
})

const displayUsername = computed(() => {
  if (!user.value?.username) return ''
  return '@' + user.value.username
})

const modeLabel = computed(() => {
  if (!isTelegramEnv.value) {
    return 'Локальный режим (браузер)'
  }
  if (user.value?.isMock) {
    return 'Без данных Telegram'
  }
  return 'Через Telegram'
})
</script>

<template>
  <div class="screen">
    <div class="screen-container">
      <header class="header">
        <h1 class="title">Комплимент от шефа</h1>
        <p class="subtitle">Добро пожаловать!</p>
      </header>

      <main v-if="!isLoading" class="content">
        <!-- Карточка пользователя -->
        <section class="card user-card">
          <div class="user-avatar">
            <span class="user-avatar-letter">{{ firstLetter }}</span>
          </div>

          <div class="user-info">
            <div class="user-name">{{ displayName }}</div>
            <div v-if="displayUsername" class="user-username">
              {{ displayUsername }}
            </div>
            <div class="user-mode" :class="{ 'user-mode--mock': user?.isMock }">
              {{ modeLabel }}
            </div>
          </div>
        </section>

        <!-- О приложении -->
        <section class="card">
          <h2 class="card-title">О приложении</h2>
          <p class="card-text">
            Получайте персональные комплименты и приятные слова от шефа.
            Приложение работает прямо в Telegram.
          </p>
        </section>

        <!-- Начать -->
        <section class="card">
          <h2 class="card-title">Начать</h2>
          <p class="card-text">
            Готовы получить свой первый комплимент?
          </p>
          <button type="button" class="primary-button">
            Получить комплимент
          </button>
        </section>
      </main>

      <div v-else class="loading">Загрузка…</div>

      <!-- Debug info (аккуратный) -->
      <div class="debug-info">
        <span class="debug-text">Telegram env: {{ isTelegramEnv ? 'да' : 'нет' }}</span>
      </div>
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
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 600;
  color: #131212;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #6c7080;
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

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #978bca;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar-letter {
  color: #ffffff;
  font-weight: 600;
  font-size: 20px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #131212;
}

.user-username {
  font-size: 14px;
  color: #6c7080;
  margin-top: 2px;
}

.user-mode {
  display: inline-block;
  margin-top: 8px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  color: #ffffff;
  background: #6c7080;
}

.user-mode--mock {
  background: #8e8b8d;
}

.card-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #131212;
}

.card-text {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.4;
  color: #6c7080;
}

.primary-button {
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
}

.primary-button:active {
  opacity: 0.9;
}

.loading {
  text-align: center;
  margin-top: 40px;
  color: #6c7080;
  font-size: 14px;
}

.debug-info {
  margin-top: 24px;
  padding-top: 16px;
  text-align: center;
}

.debug-text {
  font-size: 11px;
  color: #8e8b8d;
}
</style>

