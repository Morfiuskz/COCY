<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BottomNav, { type TabType } from './components/BottomNav.vue'
import ComplimentsScreen from './components/ComplimentsScreen.vue'
import ProfileScreen from './components/ProfileScreen.vue'
import RegistrationsScreen from './components/RegistrationsScreen.vue'

const activeTab = ref<'compliments' | 'profile' | 'registrations'>('compliments')

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get('sessionId')

  if (sessionId) {
    // если пришли по ссылке из бота с sessionId — сразу открываем экран Регистраций
    activeTab.value = 'registrations'
  }
})
const handleTabUpdate = (tab: TabType) => {
  activeTab.value = tab
}
</script>

<template>
  <div class="app">
    <ComplimentsScreen v-if="activeTab === 'compliments'" />
    <ProfileScreen v-if="activeTab === 'profile'" />
    <RegistrationsScreen v-if="activeTab === 'registrations'" />
    <BottomNav :active-tab="activeTab" @update:active-tab="handleTabUpdate" />
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}

.app {
  position: relative;
  min-height: 100vh;
}
</style>
