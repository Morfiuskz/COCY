<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  activeFilter?: 'home' | 'recent' | 'location' | 'food' | 'price'
}

const props = withDefaults(defineProps<Props>(), {
  activeFilter: 'home'
})

const router = useRouter()
const dropdownOpen = ref(false)

const filterType = ref<'offered' | 'my' | 'favorites'>('offered')

const handleFilterClick = (filter: 'home' | 'recent' | 'location' | 'food' | 'price' | 'search') => {
  if (filter === 'home') {
    router.push('/compliments')
  } else if (filter === 'location') {
    router.push('/location')
  } else if (filter === 'search') {
    alert('Поиск будет позже')
  }
  // Остальные фильтры пока только визуально
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const selectFilterType = (type: 'offered' | 'my' | 'favorites') => {
  filterType.value = type
  dropdownOpen.value = false
}

const filterLabels = {
  offered: 'Предлагаются',
  my: 'Мои',
  favorites: 'Избранное'
}
</script>

<template>
  <div class="top-bar">
    <div class="top-bar__header">
      <button class="dropdown" @click="toggleDropdown">
        <span class="dropdown__label">{{ filterLabels[filterType] }}</span>
        <svg
          class="dropdown__icon"
          :class="{ 'dropdown__icon--open': dropdownOpen }"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div v-if="dropdownOpen" class="dropdown__menu">
        <button class="dropdown__item" @click="selectFilterType('offered')">
          Предлагаются
        </button>
        <button class="dropdown__item" @click="selectFilterType('my')">Мои</button>
        <button class="dropdown__item" @click="selectFilterType('favorites')">
          Избранное
        </button>
      </div>
    </div>

    <div class="top-bar__filters">
      <button
        class="filter-btn"
        :class="{ 'filter-btn--active': activeFilter === 'home' }"
        @click="handleFilterClick('home')"
        type="button"
        aria-label="Дом"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 10L10 3L17 10M5 10V16C5 16.5523 5.44772 17 6 17H8V13C8 12.4477 8.44772 12 9 12H11C11.5523 12 12 12.4477 12 13V17H14C14.5523 17 15 16.5523 15 16V10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        class="filter-btn"
        :class="{ 'filter-btn--active': activeFilter === 'recent' }"
        @click="handleFilterClick('recent')"
        type="button"
        aria-label="Часы"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M10 6V10L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>

      <button
        class="filter-btn"
        :class="{ 'filter-btn--active': activeFilter === 'location' }"
        @click="handleFilterClick('location')"
        type="button"
        aria-label="Локация"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 10.5C11.3807 10.5 12.5 9.38071 12.5 8C12.5 6.61929 11.3807 5.5 10 5.5C8.61929 5.5 7.5 6.61929 7.5 8C7.5 9.38071 8.61929 10.5 10 10.5Z"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M10 2.5C7.23858 2.5 5 4.73858 5 7.5C5 11.5 10 17.5 10 17.5C10 17.5 15 11.5 15 7.5C15 4.73858 12.7614 2.5 10 2.5Z"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
      </button>

      <button
        class="filter-btn"
        :class="{ 'filter-btn--active': activeFilter === 'food' }"
        @click="handleFilterClick('food')"
        type="button"
        aria-label="Блюдо"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 3V17M3 10H17"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <circle cx="10" cy="10" r="6.5" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>

      <button
        class="filter-btn"
        :class="{ 'filter-btn--active': activeFilter === 'price' }"
        @click="handleFilterClick('price')"
        type="button"
        aria-label="Цена"
      >
        <span class="filter-btn__text">₽</span>
      </button>

      <button
        class="filter-btn filter-btn--search"
        @click="handleFilterClick('search')"
        type="button"
        aria-label="Поиск"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.top-bar {
  background: #ffffff;
  border-radius: 18px;
  padding: 14px;
  border: 1px solid #efe8ff;
  box-shadow: 0 4px 12px rgba(63, 43, 133, 0.06);
  margin-bottom: 16px;
}

.top-bar__header {
  position: relative;
  margin-bottom: 12px;
}

.dropdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: transparent;
  border: none;
  padding: 8px 0;
  cursor: pointer;
  font-family: inherit;
}

.dropdown__label {
  font-size: 15px;
  font-weight: 700;
  color: #1f1b2d;
}

.dropdown__icon {
  transition: transform 0.2s ease;
  color: #6a50c2;
}

.dropdown__icon--open {
  transform: rotate(180deg);
}

.dropdown__menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #efe8ff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(63, 43, 133, 0.12);
  z-index: 10;
  margin-top: 4px;
  overflow: hidden;
}

.dropdown__item {
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #1f1b2d;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s ease;
}

.dropdown__item:hover {
  background: #f8f6ff;
}

.top-bar__filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.filter-btn {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f6ff;
  border: 1px solid #e6ddff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6a50c2;
  font-family: inherit;
}

.filter-btn:active {
  transform: scale(0.96);
}

.filter-btn--active {
  background: #ede7ff;
  border-color: #a489ff;
  color: #2f216b;
  box-shadow: 0 2px 8px rgba(164, 137, 255, 0.3);
}

.filter-btn__text {
  font-size: 18px;
  font-weight: 700;
}
</style>
