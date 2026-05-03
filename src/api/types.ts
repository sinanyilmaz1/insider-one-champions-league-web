export interface Team {
  id: number
  name: string
  strength: number
}

export interface MatchResult {
  id: number
  homeScore: number
  awayScore: number
}

export interface Fixture {
  id: number
  week: number
  homeTeam: Team
  awayTeam: Team
  matchResult: MatchResult | null
}

export interface StandingRow {
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface TeamPrediction {
  team: Team
  championPercentage: number
}

export interface WeekGroup {
  week: number
  fixtures: Fixture[]
}

export interface SimulationState {
  standings: StandingRow[]
  predictions: TeamPrediction[]
  fixtures: Fixture[]
  lastPlayedWeek: number | null
  nextWeek: number | null
}

export interface UpdateMatchResultBody {
  homeScore: number
  awayScore: number
}
