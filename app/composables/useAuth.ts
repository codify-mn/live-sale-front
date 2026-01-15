import { createSharedComposable } from '@vueuse/core'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  picture: string
  role: string
  facebook_id: string
  onboarding_completed: boolean
  shop_id: number | null
}

interface AuthResponse {
  authenticated: boolean
  user: User | null
  onboarding_completed: boolean
}

const _useAuth = () => {
  const config = useRuntimeConfig()
  const user = ref<User | null>(null)
  const isLoading = ref(true)
  const isAuthenticated = computed(() => !!user.value)
  const needsOnboarding = computed(() => user.value && !user.value.onboarding_completed)

  const fetchUser = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<AuthResponse>(`${config.public.apiUrl}/auth/me`, {
        credentials: 'include'
      })

      if (data.authenticated && data.user) {
        user.value = data.user
      } else {
        user.value = null
      }
    } catch {
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  const loginWithFacebook = () => {
    window.location.href = `${config.public.apiUrl}/auth/facebook/login`
  }

  const logout = async () => {
    try {
      await $fetch(`${config.public.apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } finally {
      user.value = null
      navigateTo('/login')
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    needsOnboarding,
    fetchUser,
    loginWithFacebook,
    logout
  }
}

export const useAuth = createSharedComposable(_useAuth)
