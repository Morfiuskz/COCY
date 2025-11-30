<script setup lang="ts">
export type TabType = 'compliments' | 'profile' | 'registrations'

interface Props {
  activeTab: TabType
}

interface Emits {
  (e: 'update:activeTab', value: TabType): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tabs: { id: TabType; label: string }[] = [
  { id: 'compliments', label: 'Комплименты' },
  { id: 'profile', label: 'Профиль' },
  { id: 'registrations', label: 'Регистрации' }
]

const handleTabClick = (tabId: TabType) => {
  emit('update:activeTab', tabId)
}

const isActive = (tabId: TabType) => props.activeTab === tabId
</script>

<template>
  <nav class="bottom-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['nav-button', { 'nav-button--active': isActive(tab.id) }]"
      @click="handleTabClick(tab.id)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  padding: 8px;
  gap: 8px;
  z-index: 100;
  max-width: 420px;
  margin: 0 auto;
  box-sizing: border-box;
}

.nav-button {
  flex: 1;
  height: 40px;
  border: none;
  background: transparent;
  color: #6c7080;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.nav-button--active {
  background: #978bca;
  color: #ffffff;
}

.nav-button:active {
  opacity: 0.8;
}
</style>

