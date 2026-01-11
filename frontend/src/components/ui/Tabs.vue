<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  options: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onSelect = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="tabs">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="['tabs__btn', { 'tabs__btn--active': modelValue === option.value }]"
      @click="onSelect(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  background: #f4f1ff;
  padding: 6px;
  border-radius: 16px;
  border: 1px solid #e3dbff;
}

.tabs__btn {
  border: 1px solid transparent;
  background: transparent;
  color: #53458f;
  padding: 12px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tabs__btn--active {
  background: #ffffff;
  border-color: #b5a2ff;
  box-shadow: 0 8px 18px rgba(95, 63, 189, 0.15);
  color: #2f216b;
}

.tabs__btn:active {
  transform: translateY(1px);
}
</style>



