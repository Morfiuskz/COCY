<script setup lang="ts">
import ComplimentsTopBar from '../components/compliments/ComplimentsTopBar.vue'
</script>

<template>
  <div class="page">
    <ComplimentsTopBar active-filter="location" />
    <div class="placeholder">
      <p class="placeholder__text">Карта будет здесь</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
}

.placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #efe8ff;
  box-shadow: 0 4px 12px rgba(63, 43, 133, 0.06);
}

.placeholder__text {
  margin: 0;
  font-size: 16px;
  color: #7b7693;
  font-weight: 500;
}
</style>
