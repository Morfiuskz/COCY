<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import QrcodeVue from 'qrcode.vue'
import Tabs from '../components/ui/Tabs.vue'
import Button from '../components/ui/Button.vue'
import { useTelegram } from '../composables/useTelegram'

const { userId } = useTelegram()

const BOT_USERNAME = 'compliment_chef_bot'
const tabStorageKey = 'registration_tab'
const hideNameKey = 'hide_telegram_name'

const tab = ref<'place' | 'user'>('place')
const hideName = ref(false)

onMounted(() => {
  const savedTab = localStorage.getItem(tabStorageKey)
  const savedHide = localStorage.getItem(hideNameKey)
  if (savedTab === 'place' || savedTab === 'user') {
    tab.value = savedTab
  }
  hideName.value = savedHide === 'true'
})

watch(tab, (value) => {
  localStorage.setItem(tabStorageKey, value)
})

watch(hideName, (value) => {
  localStorage.setItem(hideNameKey, String(value))
})

const payload = computed(() => {
  const base = userId.value ?? 0
  return tab.value === 'place' ? `PLACE-${base}` : `USER-${base}`
})

const deepLink = computed(() => `https://t.me/${BOT_USERNAME}?start=${payload.value}`)

const copyLink = async () => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(deepLink.value)
    }
  } catch (error) {
    console.warn('Copy failed', error)
  }
}
</script>

<template>
  <div class="page">
    <div class="head">
      <p class="eyebrow">Зарегистрировать:</p>
      <Tabs v-model="tab" :options="[{ label: 'заведение', value: 'place' }, { label: 'пользователя', value: 'user' }]" />
    </div>

    <section class="card card--center">
      <QrcodeVue :value="deepLink" :size="240" level="M" />
      <p class="hint">Сканируйте, чтобы открыть регистрацию в Telegram</p>
    </section>

    <section class="card link-card">
      <div class="link-row">
        <span class="link-text">{{ deepLink }}</span>
        <Button variant="outline" @click="copyLink">copy</Button>
      </div>
      <label class="checkbox">
        <input v-model="hideName" type="checkbox" />
        <span>Не отображать у зарегистрированного мой ник в Telegram</span>
      </label>
      <a v-if="tab === 'user'" class="info-link" href="#" @click.prevent>О регистрации заведений</a>
    </section>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
}

.head {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.eyebrow {
  margin: 0;
  font-size: 13px;
  color: #6a50c2;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 16px 14px;
  border: 1px solid #efe8ff;
  box-shadow: 0 20px 36px rgba(63, 43, 133, 0.06);
}

.card--center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.hint {
  margin: 0;
  color: #7b7693;
  font-size: 13px;
}

.link-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.link-text {
  display: inline-block;
  flex: 1;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px dashed #b5a2ff;
  background: #f8f6ff;
  font-size: 13px;
  color: #2f264d;
  word-break: break-all;
}

.checkbox {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: #514c68;
  font-size: 14px;
}

.checkbox input {
  margin-top: 3px;
  accent-color: #6a50c2;
}

.info-link {
  color: #6a50c2;
  font-weight: 700;
  text-decoration: none;
}
</style>



