<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    modelValue: string
    placeholder?: string
    type?: string
    readonly?: boolean
  }>(),
  {
    label: '',
    placeholder: '',
    type: 'text',
    readonly: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label class="field">
    <span v-if="label" class="field__label">{{ label }}</span>
    <input
      class="field__input"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :readonly="readonly"
      @input="onInput"
    />
  </label>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field__label {
  font-size: 13px;
  color: #4c4a5f;
  font-weight: 600;
}

.field__input {
  width: 100%;
  padding: 13px 14px;
  border-radius: 14px;
  border: 1px solid #d9d2ff;
  background: #ffffff;
  font-size: 15px;
  color: #1f1b2d;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field__input:focus {
  outline: none;
  border-color: #a489ff;
  box-shadow: 0 0 0 3px rgba(164, 137, 255, 0.2);
}

.field__input[readonly] {
  background: #f9f7ff;
  color: #4c4a5f;
}
</style>



