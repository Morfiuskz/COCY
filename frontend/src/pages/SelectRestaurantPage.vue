<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../components/ui/Button.vue'

const restaurants = [
  'Нога барана',
  'Рюмочная №3',
  'Приют вегана',
  'Говяжья кровь',
  'Патерсон и племянница',
  'Калигула в огне',
  'Три поросёнка',
  'Горячая булка'
]

const storageKey = 'selected_restaurant'
const defaultRestaurant = 'Ресторан Панония'

const selected = ref(defaultRestaurant)
const router = useRouter()

onMounted(() => {
  const saved = localStorage.getItem(storageKey)
  selected.value = saved ?? defaultRestaurant
})

const choose = (name: string) => {
  selected.value = name
  localStorage.setItem(storageKey, name)
}

const handleSave = () => {
  localStorage.setItem(storageKey, selected.value)
  router.push('/profile')
}
</script>

<template>
  <div class="page">
    <h1 class="title">Выберите заведение</h1>
    <p class="subtitle">Сохранится в профиле и будет использоваться в регистрациях.</p>

    <div class="list">
      <label v-for="name in restaurants" :key="name" class="item">
        <input
          class="item__radio"
          type="radio"
          name="restaurant"
          :value="name"
          :checked="selected === name"
          @change="choose(name)"
        />
        <span class="item__label">{{ name }}</span>
      </label>
    </div>

    <Button block @click="handleSave">Сохранить и вернуться</Button>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
}

.title {
  margin: 0;
  font-size: 22px;
  color: #1f1b2d;
}

.subtitle {
  margin: 0 0 4px;
  color: #625f73;
  font-size: 14px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #efe8ff;
  box-shadow: 0 8px 20px rgba(63, 43, 133, 0.05);
  cursor: pointer;
}

.item__radio {
  width: 18px;
  height: 18px;
  accent-color: #6a50c2;
}

.item__label {
  font-size: 15px;
  color: #2f264d;
  font-weight: 600;
}
</style>


