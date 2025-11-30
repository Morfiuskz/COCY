<script setup lang="ts">
import { ref } from 'vue'
import BottomNav, { type TabType } from './components/BottomNav.vue'
import ComplimentsScreen from './components/ComplimentsScreen.vue'
import ProfileScreen from './components/ProfileScreen.vue'
import RegistrationsScreen from './components/RegistrationsScreen.vue'

const activeTab = ref<TabType>('compliments')

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
