<script setup lang="ts">
// Заглушка для экрана регистраций
</script>

<template>
  <div class="screen">
    <div class="screen-container">
      <main class="content">
        <section class="card">
          <h2 class="card-title">Регистрации</h2>
          <p class="card-text">Раздел в разработке.</p>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.screen {
  min-height: 100vh;
  background: #f8f8f8;
  display: flex;
  justify-content: center;
  padding-bottom: 70px;
}

.screen-container {
  width: 100%;
  max-width: 420px;
  padding: 24px 16px 40px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
}

.card-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #131212;
}

.card-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: #6c7080;
}
</style>

