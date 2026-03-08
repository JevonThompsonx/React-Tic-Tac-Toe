import { WIN_LINES, type Board, type CellIndex, type GameResult, type GameState, type Player } from '@/lib/types'

function createEmptyBoard(): Board {
  return [null, null, null, null, null, null, null, null, null]
}

function isCellIndex(value: number): value is CellIndex {
  return Number.isInteger(value) && value >= 0 && value <= 8
}

function placeMark(board: Board, cellIndex: CellIndex, player: Player): Board {
  return [
    cellIndex === 0 ? player : board[0],
    cellIndex === 1 ? player : board[1],
    cellIndex === 2 ? player : board[2],
    cellIndex === 3 ? player : board[3],
    cellIndex === 4 ? player : board[4],
    cellIndex === 5 ? player : board[5],
    cellIndex === 6 ? player : board[6],
    cellIndex === 7 ? player : board[7],
    cellIndex === 8 ? player : board[8],
  ]
}

function serializeBoard(board: Board, currentPlayer: Player): string {
  return `${currentPlayer}:${board.map((cell) => cell ?? '-').join('')}`
}

function getMarkCounts(board: Board): { readonly x: number; readonly o: number } {
  let x = 0
  let o = 0

  for (const cell of board) {
    if (cell === 'X') {
      x += 1
    }

    if (cell === 'O') {
      o += 1
    }
  }

  return { x, o }
}

function getImmediateResult(board: Board): GameResult {
  for (const line of WIN_LINES) {
    const [first, second, third] = line
    const firstCell = board[first]

    if (firstCell !== null && firstCell === board[second] && firstCell === board[third]) {
      return {
        status: 'win',
        winner: firstCell,
        winningLine: line,
      }
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { status: 'draw', reason: 'filled' }
  }

  return { status: 'in_progress' }
}

function getNextPlayerFromBoard(board: Board): Player {
  const counts = getMarkCounts(board)

  return counts.x > counts.o ? 'O' : 'X'
}

function canAnyFutureSequenceProduceWin(board: Board, currentPlayer: Player, cache: Map<string, boolean>): boolean {
  const immediateResult = getImmediateResult(board)

  if (immediateResult.status === 'win') {
    return true
  }

  if (immediateResult.status === 'draw') {
    return false
  }

  const cacheKey = serializeBoard(board, currentPlayer)
  const cachedResult = cache.get(cacheKey)

  if (typeof cachedResult === 'boolean') {
    return cachedResult
  }

  for (const move of getAvailableMoves(board)) {
    const nextBoard = placeMark(board, move, currentPlayer)

    if (canAnyFutureSequenceProduceWin(nextBoard, switchPlayer(currentPlayer), cache)) {
      cache.set(cacheKey, true)
      return true
    }
  }

  cache.set(cacheKey, false)
  return false
}

export function createInitialState(): GameState {
  const board = createEmptyBoard()

  return {
    board,
    currentPlayer: 'X',
    result: checkResult(board),
    moveHistory: [],
  }
}

export function switchPlayer(player: Player): Player {
  return player === 'X' ? 'O' : 'X'
}

export function getAvailableMoves(board: Board): readonly CellIndex[] {
  const moves: CellIndex[] = []

  if (board[0] === null) {
    moves.push(0)
  }

  if (board[1] === null) {
    moves.push(1)
  }

  if (board[2] === null) {
    moves.push(2)
  }

  if (board[3] === null) {
    moves.push(3)
  }

  if (board[4] === null) {
    moves.push(4)
  }

  if (board[5] === null) {
    moves.push(5)
  }

  if (board[6] === null) {
    moves.push(6)
  }

  if (board[7] === null) {
    moves.push(7)
  }

  if (board[8] === null) {
    moves.push(8)
  }

  return moves
}

export function checkResult(board: Board): GameResult {
  const immediateResult = getImmediateResult(board)

  if (immediateResult.status !== 'in_progress') {
    return immediateResult
  }

  const nextPlayer = getNextPlayerFromBoard(board)
  const canStillWin = canAnyFutureSequenceProduceWin(board, nextPlayer, new Map<string, boolean>())

  if (!canStillWin) {
    return { status: 'draw', reason: 'no_future_wins' }
  }

  return { status: 'in_progress' }
}

export function makeMove(state: GameState, cellIndex: number): GameState | null {
  if (!isCellIndex(cellIndex)) {
    return null
  }

  if (state.currentPlayer !== getNextPlayerFromBoard(state.board)) {
    return null
  }

  if (checkResult(state.board).status !== 'in_progress') {
    return null
  }

  if (state.board[cellIndex] !== null) {
    return null
  }

  const nextBoard = placeMark(state.board, cellIndex, state.currentPlayer)

  return {
    board: nextBoard,
    currentPlayer: switchPlayer(state.currentPlayer),
    result: checkResult(nextBoard),
    moveHistory: [...state.moveHistory, cellIndex],
  }
}
