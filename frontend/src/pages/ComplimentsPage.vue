<script setup lang="ts">
import { computed } from 'vue'
import { useTelegram } from '../composables/useTelegram'
import Button from '../components/ui/Button.vue'

const { firstName } = useTelegram()

const headline = computed(() => `${firstName.value}, скоро здесь будут комплименты`)
</script>

<template>
  <section class="card">
    <p class="eyebrow">Комплименты</p>
    <h1 class="title">{{ headline }}</h1>
    <p class="text">
      Экран-заглушка. Здесь появятся ваши персональные комплименты от шефа. Пока можете
      перейти в профиль или сгенерировать регистрации.
    </p>
    <div class="actions">
      <RouterLink to="/profile">
        <Button block variant="outline">К профилю</Button>
      </RouterLink>
      <RouterLink to="/registrations">
        <Button block>К регистрации</Button>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 18px;
  box-shadow: 0 20px 40px rgba(63, 43, 133, 0.08);
  border: 1px solid #efe8ff;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 11px;
  color: #6a50c2;
  margin: 0 0 6px;
  font-weight: 700;
}

.title {
  margin: 0 0 10px;
  font-size: 22px;
  line-height: 1.2;
  color: #1f1b2d;
}

.text {
  margin: 0 0 16px;
  color: #625f73;
  font-size: 14px;
  line-height: 1.5;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>



