import { createSharedComposable } from '@vueuse/core'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  picture: string
  role: string
  facebook_id?: string
  google_id?: string
  onboarding_completed: boolean
  shop_id: number | null
}

interface AuthResponse {
  authenticated: boolean
  user: User | null
  onboarding_completed: boolean
}

interface LoginResponse {
  success: boolean
  user: User
}

interface ErrorResponse {
  error: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  first_name: string
  last_name: string
}

const _useAuth = () => {
  const config = useRuntimeConfig()
  const user = ref<User | null>(null)
  const isLoading = ref(true)
  const authError = ref<string | null>(null)
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

  const loginWithGoogle = () => {
    window.location.href = `${config.public.apiUrl}/auth/google/login`
  }

  const loginWithEmail = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    authError.value = null
    try {
      const data = await $fetch<LoginResponse>(`${config.public.apiUrl}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        body: credentials
      })

      if (data.success && data.user) {
        user.value = data.user
        return true
      }
      return false
    } catch (error: any) {
      if (error.data?.error) {
        authError.value = error.data.error
      } else {
        authError.value = 'Login failed. Please try again.'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    isLoading.value = true
    authError.value = null
    try {
      const data = await $fetch<LoginResponse>(`${config.public.apiUrl}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        body: credentials
      })

      if (data.success && data.user) {
        user.value = data.user
        return true
      }
      return false
    } catch (error: any) {
      if (error.data?.error) {
        authError.value = error.data.error
      } else {
        authError.value = 'Registration failed. Please try again.'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    isLoading.value = true
    authError.value = null
    try {
      await $fetch(`${config.public.apiUrl}/auth/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        body: { email }
      })
      return true
    } catch (error: any) {
      if (error.data?.error) {
        authError.value = error.data.error
      } else {
        authError.value = 'Failed to process request. Please try again.'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    isLoading.value = true
    authError.value = null
    try {
      await $fetch(`${config.public.apiUrl}/auth/reset-password`, {
        method: 'POST',
        credentials: 'include',
        body: { token, new_password: newPassword }
      })
      return true
    } catch (error: any) {
      if (error.data?.error) {
        authError.value = error.data.error
      } else {
        authError.value = 'Failed to reset password. Please try again.'
      }
      return false
    } finally {
      isLoading.value = false
    }
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

  const clearError = () => {
    authError.value = null
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    needsOnboarding,
    authError,
    fetchUser,
    loginWithFacebook,
    loginWithGoogle,
    loginWithEmail,
    register,
    forgotPassword,
    resetPassword,
    logout,
    clearError
  }
}

export const useAuth = createSharedComposable(_useAuth)
