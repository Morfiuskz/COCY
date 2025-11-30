import { ref, onMounted } from 'vue'

export interface TelegramUser {
  id?: number
  firstName: string
  lastName?: string
  username?: string
  photoUrl?: string
  isMock: boolean
}

export function useTelegramUser() {
  const user = ref<TelegramUser | null>(null)
  const isLoading = ref(true)
  const isTelegramEnv = ref(false)

  onMounted(() => {
    // Проверяем доступность Telegram WebApp
    const tg = (window as any).Telegram?.WebApp

    // Логируем для отладки
    console.log('Telegram.WebApp:', tg)
    if (tg) {
      console.log('initDataUnsafe:', tg.initDataUnsafe)
      console.log('initDataUnsafe.user:', tg.initDataUnsafe?.user)
    }

    if (tg) {
      // Telegram WebApp доступен
      isTelegramEnv.value = true

      // Инициализируем Telegram WebApp
      try {
        if (typeof tg.ready === 'function') {
          tg.ready()
        }
        if (typeof tg.expand === 'function') {
          tg.expand()
        }
      } catch (error) {
        console.warn('Ошибка при инициализации Telegram WebApp:', error)
      }

      // Получаем данные пользователя
      const tgUser = tg.initDataUnsafe?.user

      if (tgUser && tgUser.first_name) {
        // Пользователь найден в Telegram
        user.value = {
          id: tgUser.id,
          firstName: tgUser.first_name || 'Пользователь',
          lastName: tgUser.last_name || undefined,
          username: tgUser.username || undefined,
          photoUrl: tgUser.photo_url || undefined,
          isMock: false
        }
      } else {
        // Telegram WebApp доступен, но пользователя нет
        user.value = {
          firstName: 'Гость',
          isMock: true
        }
      }
    } else {
      // Telegram WebApp не доступен - локальная разработка
      isTelegramEnv.value = false
      user.value = {
        id: 123456789,
        firstName: 'Иван',
        lastName: 'Иванов',
        username: 'ivan_ivanov',
        isMock: true
      }
    }

    isLoading.value = false
  })

  return {
    user,
    isLoading,
    isTelegramEnv
  }
}

