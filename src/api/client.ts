import axios, { AxiosError } from 'axios'

export interface ApiError {
  status: number | null
  message: string
  validationErrors?: Record<string, string[]>
  isConflict: boolean
  isRateLimited: boolean
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    if (!error.response) {
      const apiError: ApiError = {
        status: null,
        message: 'Network error',
        isConflict: false,
        isRateLimited: false,
      }
      return Promise.reject(apiError)
    }
    const { status, data } = error.response
    const isRateLimited = status === 429
    const apiError: ApiError = {
      status,
      // Override the backend's "Too Many Attempts." default with something user-friendly.
      message: isRateLimited
        ? 'Too many requests. Please slow down and try again in a moment.'
        : (data?.message ?? 'Request failed'),
      validationErrors: data?.errors,
      isConflict: status === 409,
      isRateLimited,
    }
    return Promise.reject(apiError)
  },
)

export default client
