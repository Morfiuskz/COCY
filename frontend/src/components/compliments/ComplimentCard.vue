<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Compliment } from '../../data/mockCompliments'

interface Props {
  compliment: Compliment
}

const props = defineProps<Props>()
const router = useRouter()

const budgetRange = computed(() => {
  if (props.compliment.budgetFrom && props.compliment.budgetTo) {
    return `${props.compliment.budgetFrom}–${props.compliment.budgetTo}`
  }
  return null
})

const handleClick = () => {
  router.push(`/compliments/${props.compliment.id}`)
}
</script>

<template>
  <div class="card" @click="handleClick">
    <div class="card__image-wrapper">
      <img :src="compliment.imageUrl" :alt="compliment.title" class="card__image" />
      <span v-if="budgetRange" class="card__badge">{{ budgetRange }}</span>
    </div>
    <div class="card__content">
      <h3 class="card__title">{{ compliment.title }}</h3>
      <div class="card__meta">
        <span class="card__price">{{ compliment.priceRub }} ₽</span>
        <span class="card__weight">{{ compliment.weightG }} г</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #efe8ff;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(63, 43, 133, 0.06);
}

.card:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(63, 43, 133, 0.1);
}

.card__image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  background: #f8f6ff;
  overflow: hidden;
}

.card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: #2f264d;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card__content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card__title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1f1b2d;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.card__price {
  color: #6a50c2;
  font-weight: 700;
}

.card__weight {
  color: #7b7693;
  font-weight: 500;
}
</style>
