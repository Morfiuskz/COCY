import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import ComplimentsPage from '../pages/ComplimentsPage.vue'
import ComplimentDetailsPage from '../pages/ComplimentDetailsPage.vue'
import LocationPage from '../pages/LocationPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import RegistrationsPage from '../pages/RegistrationsPage.vue'
import SelectRestaurantPage from '../pages/SelectRestaurantPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: '/compliments' },
      { path: 'compliments', name: 'compliments', component: ComplimentsPage },
      { path: 'compliments/:id', name: 'compliment-details', component: ComplimentDetailsPage },
      { path: 'location', name: 'location', component: LocationPage },
      { path: 'profile', name: 'profile', component: ProfilePage },
      { path: 'registrations', name: 'registrations', component: RegistrationsPage },
      { path: 'select-restaurant', name: 'select-restaurant', component: SelectRestaurantPage }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/compliments'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router



