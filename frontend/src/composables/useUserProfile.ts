import { reactive, readonly } from 'vue'

export interface UserProfile {
  id: number | null
  username: string | null
  displayName: string
  age: number | null
  gender: 'М' | 'Ж' | null
}

const STORAGE_KEY = 'userProfile'

const state = reactive<UserProfile>({
  id: null,
  username: null,
  displayName: '',
  age: null,
  gender: null
})

export function useUserProfile() {
  const loadProfile = (): UserProfile => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<UserProfile>
        state.id = parsed.id ?? null
        state.username = parsed.username ?? null
        state.displayName = parsed.displayName ?? ''
        state.age = parsed.age ?? null
        state.gender = parsed.gender ?? null
      }
    } catch (error) {
      console.error('Failed to load profile from localStorage:', error)
    }
    return { ...state }
  }

  const saveProfile = (partial: Partial<UserProfile>): void => {
    Object.assign(state, partial)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save profile to localStorage:', error)
    }
  }

  const getProfile = () => readonly(state)

  return {
    profile: state,
    loadProfile,
    saveProfile,
    getProfile
  }
}


