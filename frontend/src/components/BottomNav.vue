<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type TabType = 'compliments' | 'profile' | 'registrations'

const router = useRouter()
const route = useRoute()

const tabs: { id: TabType; label: string; to: string }[] = [
  { id: 'compliments', label: 'Комплименты', to: '/compliments' },
  { id: 'profile', label: 'Профиль', to: '/profile' },
  { id: 'registrations', label: 'Регистрации', to: '/registrations' }
]

const activeId = computed<TabType | null>(() => {
  const found = tabs.find((tab) => route.path.startsWith(tab.to))
  return found?.id ?? null
})

const handleTabClick = (tab: TabType, to: string) => {
  if (route.path !== to) {
    router.push(to)
  }
}
</script>

<template>
  <nav class="bottom-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['nav-button', { 'nav-button--active': activeId === tab.id }]"
      type="button"
      @click="handleTabClick(tab.id, tab.to)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: flex;
  padding: 10px 12px;
  gap: 10px;
  max-width: 520px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.nav-button {
  flex: 1;
  height: 44px;
  border: 1px solid #a489ff;
  background: #ffffff;
  color: #6a50c2;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.nav-button--active {
  background: #ede7ff;
  color: #2f216b;
  box-shadow: 0 6px 20px rgba(164, 137, 255, 0.35);
}

.nav-button:active {
  transform: translateY(1px);
}
</style>

