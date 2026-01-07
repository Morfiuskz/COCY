<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegram } from '../composables/useTelegram'
import { useUserProfile } from '../composables/useUserProfile'
import Button from '../components/ui/Button.vue'
import TextField from '../components/ui/TextField.vue'

type Role = 'owner' | 'staff' | 'guest'

const router = useRouter()
const { telegramUsername, firstName, userId } = useTelegram()
const { profile, loadProfile, saveProfile: saveUserProfile } = useUserProfile()

const ROLE: Role = 'owner'
const inviterOrRegistrar = '@Gromin_Kolay'
const defaultRestaurant = 'Ресторан Панония'
const restaurantStorageKey = 'selected_restaurant'

const restaurantName = ref(defaultRestaurant)
const appNickname = ref('')
const userAge = ref<number | null>(null)
const userGender = ref<'М' | 'Ж' | null>(null)
const editing = ref(false)

// Snapshots для отмены изменений
const nicknameSnapshot = ref('')
const ageSnapshot = ref<number | null>(null)
const genderSnapshot = ref<'М' | 'Ж' | null>(null)

const firstLetter = computed(() => (firstName.value?.[0] ?? 'Г').toUpperCase())
const telegramNickDisplay = computed(() => (telegramUsername.value ? `@${telegramUsername.value}` : '—'))
const roleText = computed(() => (ROLE === 'owner' ? 'Зарегистрировал' : 'Меня пригласил'))

const ageDisplay = computed(() => {
  if (userAge.value === null || userAge.value === undefined) {
    return '—'
  }
  return String(userAge.value)
})

const genderDisplay = computed(() => userGender.value ?? '—')

onMounted(() => {
  // Загружаем профиль из localStorage
  loadProfile()

  // Синхронизируем локальные поля с загруженным профилем
  appNickname.value = profile.displayName || (telegramUsername.value ? `@${telegramUsername.value}` : '')
  userAge.value = profile.age
  userGender.value = profile.gender

  // Если профиль пустой, инициализируем телеграм-данными
  if (!profile.id && userId.value) {
    profile.id = userId.value
    profile.username = telegramUsername.value
  }

  // Загружаем заведение
  const savedRestaurant = localStorage.getItem(restaurantStorageKey)
  restaurantName.value = savedRestaurant ?? defaultRestaurant
})

const startEdit = () => {
  nicknameSnapshot.value = appNickname.value
  ageSnapshot.value = userAge.value
  genderSnapshot.value = userGender.value
  editing.value = true
}

const cancelEdit = () => {
  appNickname.value = nicknameSnapshot.value
  userAge.value = ageSnapshot.value
  userGender.value = genderSnapshot.value
  editing.value = false
}

const saveProfile = () => {
  // Валидация возраста
  if (userAge.value !== null && userAge.value !== undefined) {
    if (userAge.value < 14 || userAge.value > 120) {
      alert('Возраст должен быть от 14 до 120 лет')
      return
    }
  }

  // Сохраняем профиль через composable
  saveUserProfile({
    id: profile.id || userId.value,
    username: profile.username || telegramUsername.value,
    displayName: appNickname.value,
    age: userAge.value,
    gender: userGender.value
  })

  editing.value = false
}

const goSelectRestaurant = () => {
  router.push('/select-restaurant')
}
</script>

<template>
  <div class="page">
    <header class="top">
      <div class="top__line">
        <span class="top__label">Мое заведение:</span>
        <span class="top__value">{{ restaurantName }}</span>
        <button class="top__change" type="button" @click="goSelectRestaurant">изменить</button>
      </div>
      <div class="top__line">
        <span class="top__label">
          {{ roleText }}:
        </span>
        <span class="top__value">{{ inviterOrRegistrar }}</span>
      </div>
    </header>

    <section class="card">
      <div class="profile">
        <div class="avatar">
          <span class="avatar__letter">{{ firstLetter }}</span>
          <button class="avatar__camera" type="button" aria-label="Изменить фото">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.5 3.5L6.5 5H4C2.89543 5 2 5.89543 2 7V15C2 16.1046 2.89543 17 4 17H16C17.1046 17 18 16.1046 18 15V7C18 5.89543 17.1046 5 16 5H13.5L12.5 3.5H7.5Z"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="10" cy="11" r="3.2" stroke="currentColor" stroke-width="1.3" />
            </svg>
          </button>
        </div>
        <div class="profile__info">
          <p class="profile__username">Ник в Telegram: {{ telegramNickDisplay }}</p>
          <p class="profile__hint">Считывается автоматически, менять нельзя</p>
        </div>
      </div>
    </section>

    <section class="card fields">
      <TextField label='"Ник в "Комплемент от Шефа"' v-model="appNickname" :readonly="!editing" />
      
      <div class="field-wrapper">
        <label class="field-label">Пол</label>
        <div v-if="editing" class="radio-group">
          <label class="radio-option">
            <input
              v-model="userGender"
              type="radio"
              value="М"
              class="radio-input"
            />
            <span class="radio-text">М</span>
          </label>
          <label class="radio-option">
            <input
              v-model="userGender"
              type="radio"
              value="Ж"
              class="radio-input"
            />
            <span class="radio-text">Ж</span>
          </label>
          <label class="radio-option">
            <input
              v-model="userGender"
              type="radio"
              :value="null"
              class="radio-input"
            />
            <span class="radio-text">Не указан</span>
          </label>
        </div>
        <div v-else class="field-display">{{ genderDisplay }}</div>
      </div>

      <div class="field-wrapper">
        <label class="field-label">Количество полных лет</label>
        <input
          v-if="editing"
          v-model.number="userAge"
          type="number"
          class="field-input"
          placeholder="14–120"
          min="14"
          max="120"
        />
        <div v-else class="field-display">{{ ageDisplay }}</div>
      </div>
    </section>

    <div class="actions">
      <Button v-if="!editing" block variant="outline" @click="startEdit">Изменить</Button>
      <div v-else class="actions__row">
        <Button block variant="ghost" @click="cancelEdit">Отмена</Button>
        <Button block @click="saveProfile">Сохранить</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 24px;
}

.top {
  background: #ffffff;
  border: 1px solid #efe8ff;
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 14px 32px rgba(74, 58, 153, 0.08);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.top__line {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #2f264d;
}

.top__label {
  font-weight: 700;
}

.top__value {
  font-weight: 600;
}

.top__change {
  margin-left: auto;
  background: transparent;
  border: none;
  color: #6a50c2;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 0;
}

.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 16px 14px;
  border: 1px solid #efe8ff;
  box-shadow: 0 20px 36px rgba(63, 43, 133, 0.06);
}

.profile {
  display: flex;
  gap: 14px;
  align-items: center;
}

.avatar {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7d63d5, #a58cff);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 28px;
  box-shadow: 0 12px 28px rgba(108, 82, 201, 0.25);
}

.avatar__camera {
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #dcd2ff;
  background: #ffffff;
  color: #6a50c2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(89, 61, 193, 0.18);
  cursor: pointer;
}

.profile__info {
  flex: 1;
  min-width: 0;
}

.profile__username {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
  color: #1f1b2d;
}

.profile__hint {
  margin: 0;
  color: #7b7693;
  font-size: 13px;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.actions {
  margin-top: 4px;
}

.actions__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #4c4a5f;
}

.field-input {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #d9d2ff;
  border-radius: 14px;
  font-size: 15px;
  font-family: inherit;
  color: #1f1b2d;
  background: #ffffff;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input:focus {
  outline: none;
  border-color: #a489ff;
  box-shadow: 0 0 0 3px rgba(164, 137, 255, 0.2);
}

.field-input::placeholder {
  color: #b5a2ff;
}

.field-display {
  padding: 13px 14px;
  border: 1px solid #d9d2ff;
  border-radius: 14px;
  font-size: 15px;
  color: #4c4a5f;
  background: #f9f7ff;
  box-sizing: border-box;
}

.radio-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 10px 14px;
  border: 1px solid #d9d2ff;
  border-radius: 12px;
  background: #ffffff;
  transition: all 0.2s ease;
}

.radio-option:has(.radio-input:checked) {
  border-color: #a489ff;
  background: #f9f7ff;
}

.radio-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #6a50c2;
}

.radio-text {
  font-size: 14px;
  color: #1f1b2d;
  font-weight: 500;
}
</style>


