import client from './client'
import type {
  Team,
  WeekGroup,
  SimulationState,
  UpdateMatchResultBody,
  StandingRow,
  TeamPrediction,
} from './types'

export const getTeams = (): Promise<Team[]> => client.get<Team[]>('/teams').then((r) => r.data)

export const getFixtures = (): Promise<WeekGroup[]> =>
  client.get<WeekGroup[]>('/fixtures').then((r) => r.data)

export const getStandings = (): Promise<{
  standings: StandingRow[]
  lastPlayedWeek: number | null
  nextWeek: number | null
}> => client.get('/league/standings').then((r) => r.data)

export const getPredictions = (): Promise<{
  predictions: TeamPrediction[]
  lastPlayedWeek: number | null
  nextWeek: number | null
}> => client.get('/predictions').then((r) => r.data)

export const generateFixtures = (): Promise<SimulationState> =>
  client.post<SimulationState>('/fixtures/generate').then((r) => r.data)

export const playWeek = (): Promise<SimulationState> =>
  client.post<SimulationState>('/simulation/play-week').then((r) => r.data)

export const playAll = (): Promise<SimulationState> =>
  client.post<SimulationState>('/simulation/play-all').then((r) => r.data)

export const resetSimulation = (): Promise<SimulationState> =>
  client.delete<SimulationState>('/simulation').then((r) => r.data)

export const updateMatchResult = (
  id: number,
  body: UpdateMatchResultBody,
): Promise<SimulationState> =>
  client.put<SimulationState>(`/match-results/${id}`, body).then((r) => r.data)
