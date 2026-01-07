<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNav from '../components/BottomNav.vue'
</script>

<template>
  <div class="app-shell">
    <div class="app-content app-scroll">
      <RouterView />
    </div>
    <div class="app-tabbar">
      <BottomNav />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  height: 100dvh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at 20% -10%, #f3edff, #f7f6ff 45%, #ffffff 100%);
}

.app-content {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: var(--page-py) var(--page-px);
  padding-bottom: calc(var(--tabbar-h) + var(--safe-bottom) + 12px);
  max-width: 520px;
  margin: 0 auto;
  width: 100%;
}

.app-tabbar {
  flex: 0 0 auto;
  position: sticky;
  bottom: 0;
  z-index: 10;
  height: calc(var(--tabbar-h) + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
</style>


