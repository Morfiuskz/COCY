<script setup lang="ts">
type Variant = 'primary' | 'outline' | 'ghost'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    block?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    block: false,
    disabled: false,
    type: 'button'
  }
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit('click', event)
}
</script>

<template>
  <button
    :type="props.type"
    :class="['ui-button', `ui-button--${props.variant}`, { 'ui-button--block': props.block, 'ui-button--disabled': props.disabled }]"
    :disabled="props.disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 16px;
  border: 1px solid transparent;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #6a50c2;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(106, 80, 194, 0.35);
}

.ui-button--outline {
  background: #ffffff;
  color: #4a3a99;
  border-color: #a489ff;
  box-shadow: none;
}

.ui-button--ghost {
  background: transparent;
  color: #4a3a99;
  border-color: transparent;
  box-shadow: none;
}

.ui-button--block {
  width: 100%;
}

.ui-button:active {
  transform: translateY(1px);
}

.ui-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}
</style>



