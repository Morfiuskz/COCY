<script setup lang="ts">
import { computed } from 'vue'
import ComplimentsTopBar from '../components/compliments/ComplimentsTopBar.vue'
import ComplimentCard from '../components/compliments/ComplimentCard.vue'
import { mockCompliments } from '../data/mockCompliments'

const activeFilter = 'home' as const

const displayedCompliments = computed(() => mockCompliments)
</script>

<template>
  <div class="page">
    <ComplimentsTopBar :active-filter="activeFilter" />
    <div class="grid">
      <ComplimentCard v-for="compliment in displayedCompliments" :key="compliment.id" :compliment="compliment" />
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 360px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
