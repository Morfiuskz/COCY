import { computed, onMounted, ref } from 'vue'

type TelegramUnsafeUser = {
  id?: number
  username?: string
  first_name?: string
  last_name?: string
}

type TelegramWebApp = {
  initDataUnsafe?: { user?: TelegramUnsafeUser }
  ready?: () => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

const MOCK_USER = {
  id: 999999,
  username: 'chef_mock',
  firstName: 'Иван'
}

export function useTelegram() {
  const telegramUser = ref<TelegramUnsafeUser | null>(null)
  const isTelegramAvailable = ref(false)

  onMounted(() => {
    const tg = window.Telegram?.WebApp

    if (tg) {
      isTelegramAvailable.value = true
      try {
        tg.ready?.()
      } catch (error) {
        console.warn('Telegram ready() error', error)
      }
      telegramUser.value = tg.initDataUnsafe?.user ?? null
    } else {
      telegramUser.value = {
        id: MOCK_USER.id,
        username: MOCK_USER.username,
        first_name: MOCK_USER.firstName
      }
    }
  })

  const telegramUsername = computed(() => telegramUser.value?.username ?? MOCK_USER.username)
  const firstName = computed(() => telegramUser.value?.first_name ?? MOCK_USER.firstName)
  const userId = computed(() => telegramUser.value?.id ?? MOCK_USER.id)

  return {
    telegramUsername,
    firstName,
    userId,
    isTelegramAvailable
  }
}


