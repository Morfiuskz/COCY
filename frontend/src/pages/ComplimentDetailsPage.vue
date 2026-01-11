<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getComplimentById, getComplimentIndex, mockCompliments } from '../data/mockCompliments'
import type { Compliment } from '../data/mockCompliments'

const route = useRoute()
const router = useRouter()

const compliment = ref<Compliment | null>(null)
const currentIndex = ref(-1)

const loadCompliment = (id: string) => {
  const found = getComplimentById(id)
  if (found) {
    compliment.value = found
    currentIndex.value = getComplimentIndex(id)
  } else {
    router.push('/compliments')
  }
}

onMounted(() => {
  loadCompliment(route.params.id as string)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadCompliment(newId as string)
    }
  }
)

const prevCompliment = computed(() => {
  if (currentIndex.value <= 0) return null
  return mockCompliments[currentIndex.value - 1]
})

const nextCompliment = computed(() => {
  if (currentIndex.value < 0 || currentIndex.value >= mockCompliments.length - 1) return null
  return mockCompliments[currentIndex.value + 1]
})

const budgetRange = computed(() => {
  if (compliment.value?.budgetFrom && compliment.value?.budgetTo) {
    return `${compliment.value.budgetFrom}–${compliment.value.budgetTo}`
  }
  return null
})

const handleClose = () => {
  router.push('/compliments')
}

const handlePrev = () => {
  if (prevCompliment.value) {
    router.push(`/compliments/${prevCompliment.value.id}`)
  }
}

const handleNext = () => {
  if (nextCompliment.value) {
    router.push(`/compliments/${nextCompliment.value.id}`)
  }
}
</script>

<template>
  <div v-if="compliment" class="page">
    <header class="header">
      <div class="header__content">
        <div class="header__info">
          <h1 class="header__title">{{ compliment.title }}</h1>
          <div class="header__meta">
            <span class="header__price">{{ compliment.priceRub }} ₽</span>
            <span class="header__weight">{{ compliment.weightG }} г</span>
          </div>
        </div>
        <button class="header__close" @click="handleClose" type="button" aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>

    <div class="image-wrapper">
      <img :src="compliment.imageUrl" :alt="compliment.title" class="image" />
      <span v-if="budgetRange" class="badge">{{ budgetRange }}</span>
    </div>

    <section class="description">
      <p class="description__text">
        {{ compliment.description || 'Описание будет добавлено позже.' }}
      </p>
    </section>

    <div class="navigation">
      <button
        class="nav-button"
        :class="{ 'nav-button--disabled': !prevCompliment }"
        @click="handlePrev"
        type="button"
        :disabled="!prevCompliment"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        class="nav-button"
        :class="{ 'nav-button--disabled': !nextCompliment }"
        @click="handleNext"
        type="button"
        :disabled="!nextCompliment"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 4L14 10L8 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  background: #ffffff;
  border-radius: 18px;
  padding: 16px;
  border: 1px solid #efe8ff;
  box-shadow: 0 4px 12px rgba(63, 43, 133, 0.06);
}

.header__content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.header__info {
  flex: 1;
  min-width: 0;
}

.header__title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1f1b2d;
  line-height: 1.3;
}

.header__meta {
  display: flex;
  gap: 12px;
  font-size: 15px;
}

.header__price {
  color: #6a50c2;
  font-weight: 700;
}

.header__weight {
  color: #7b7693;
  font-weight: 500;
}

.header__close {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #e6ddff;
  border-radius: 12px;
  color: #6a50c2;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header__close:active {
  background: #f8f6ff;
  transform: scale(0.95);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  background: #f8f6ff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #efe8ff;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: #2f264d;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.description {
  background: #ffffff;
  border-radius: 18px;
  padding: 16px;
  border: 1px solid #efe8ff;
  box-shadow: 0 4px 12px rgba(63, 43, 133, 0.06);
}

.description__text {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #2f264d;
}

.navigation {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 16px 0;
}

.nav-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #a489ff;
  border-radius: 12px;
  color: #6a50c2;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.nav-button:active:not(.nav-button--disabled) {
  background: #ede7ff;
  transform: scale(0.95);
}

.nav-button--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #e6ddff;
}
</style>
