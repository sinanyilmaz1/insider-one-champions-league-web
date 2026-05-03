import { describe, it, expect, vi, beforeEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import client from '../client'
import type { ApiError } from '../client'

vi.mock('@/composables/useToast', () => ({ showToast: vi.fn<(message: string) => void>() }))

describe('client error interceptor', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(client)
  })

  it('passes through 2xx responses unchanged', async () => {
    mock.onGet('/teams').reply(200, [{ id: 1, name: 'Chelsea' }])

    const response = await client.get('/teams')

    expect(response.status).toBe(200)
    expect(response.data).toEqual([{ id: 1, name: 'Chelsea' }])
  })

  it('rejects with ApiError on 4xx with message and validation errors', async () => {
    mock.onPut('/match-results/1').reply(422, {
      message: 'The given data was invalid.',
      errors: { homeScore: ['must be at most 255'] },
    })

    await expect(
      client.put('/match-results/1', { homeScore: 999, awayScore: 1 }),
    ).rejects.toMatchObject({
      status: 422,
      message: 'The given data was invalid.',
      validationErrors: { homeScore: ['must be at most 255'] },
      isConflict: false,
    } satisfies Partial<ApiError>)
  })

  it('flags 429 rate-limit with friendly message and isRateLimited', async () => {
    mock.onGet('/teams').reply(429, { message: 'Too Many Attempts.' })

    await expect(client.get('/teams')).rejects.toMatchObject({
      status: 429,
      isRateLimited: true,
      isConflict: false,
      message: 'Too many requests. Please slow down and try again in a moment.',
    } satisfies Partial<ApiError>)
  })

  it('flags 409 conflict via isConflict', async () => {
    mock.onPost('/simulation/play-week').reply(409, {
      message: 'All weeks have been played. Reset to play again.',
    })

    await expect(client.post('/simulation/play-week')).rejects.toMatchObject({
      status: 409,
      isConflict: true,
    })
  })

  it('returns null status and "Network error" when no response is received', async () => {
    mock.onGet('/teams').networkError()

    await expect(client.get('/teams')).rejects.toMatchObject({
      status: null,
      message: 'Network error',
      isConflict: false,
    })
  })

  it('falls back to "Request failed" when message field is missing', async () => {
    mock.onGet('/teams').reply(500, {})

    await expect(client.get('/teams')).rejects.toMatchObject({
      status: 500,
      message: 'Request failed',
    })
  })
})
