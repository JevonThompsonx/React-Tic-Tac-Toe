export type Player = 'X' | 'O'

export type CellValue = Player | null

export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Board = readonly [
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
]

export type WinningLine = readonly [CellIndex, CellIndex, CellIndex]

export type DrawReason = 'filled' | 'no_future_wins'

export type GameResult =
  | { status: 'in_progress' }
  | { status: 'win'; winner: Player; winningLine: WinningLine }
  | { status: 'draw'; reason: DrawReason }

export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameMode =
  | { type: 'pvp' }
  | { type: 'ai'; difficulty: Difficulty }

export interface GameState {
  readonly board: Board
  readonly currentPlayer: Player
  readonly result: GameResult
  readonly moveHistory: readonly number[]
}

export interface Score {
  readonly x: number
  readonly o: number
  readonly draws: number
}

export type Theme = 'light' | 'dark'

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] satisfies readonly WinningLine[]

export const DIFFICULTIES = ['easy', 'medium', 'hard'] satisfies readonly Difficulty[]
