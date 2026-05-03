import axios, { AxiosError } from 'axios'

export interface ApiError {
  status: number | null
  message: string
  validationErrors?: Record<string, string[]>
  isConflict: boolean
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
      }
      return Promise.reject(apiError)
    }
    const { status, data } = error.response
    const apiError: ApiError = {
      status,
      message: data?.message ?? 'Request failed',
      validationErrors: data?.errors,
      isConflict: status === 409,
    }
    return Promise.reject(apiError)
  },
)

export default client
