<script setup lang="ts">
import { onMounted, ref } from "vue";

const tg = (window as any).Telegram?.WebApp;
const user = ref<any>(null);
const theme = ref<string>("light");

onMounted(() => {
  if (tg) {
    tg.ready();

    // Получаем пользователя
    user.value = tg.initDataUnsafe?.user ?? null;

    // Получаем тему (dark / light)
    theme.value = tg.colorScheme || "light";
  }
});
</script>

<template>
  <div :style="{ padding: '20px', color: theme === 'dark' ? '#fff' : '#000' }">
    <h1>Комплимент от шефа</h1>

    <p v-if="user">
      Привет, {{ user.first_name }}!
    </p>

    <p v-else>
      Локальный режим. Запусти через Telegram Mini App.
    </p>
  </div>
</template>