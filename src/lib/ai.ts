import { checkResult, getAvailableMoves, switchPlayer } from '@/lib/game-engine'
import { type Board, type CellIndex, type Difficulty, type GameResult, type Player } from '@/lib/types'

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

function getRandomMove(availableMoves: readonly CellIndex[]): CellIndex {
  const selectedMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]

  if (typeof selectedMove !== 'number') {
    throw new Error('AI cannot move on a finished board.')
  }

  return selectedMove
}

function scoreTerminalResult(result: GameResult, aiPlayer: Player, depth: number): number {
  if (result.status === 'draw' || result.status === 'in_progress') {
    return 0
  }

  if (result.winner === aiPlayer) {
    return 10 - depth
  }

  return depth - 10
}

function minimax(board: Board, currentPlayer: Player, aiPlayer: Player, depth: number, alpha: number, beta: number): number {
  const result = checkResult(board)

  if (result.status !== 'in_progress') {
    return scoreTerminalResult(result, aiPlayer, depth)
  }

  const availableMoves = getAvailableMoves(board)
  const isMaximizingTurn = currentPlayer === aiPlayer

  if (isMaximizingTurn) {
    let bestScore = Number.NEGATIVE_INFINITY

    for (const move of availableMoves) {
      const nextBoard = placeMark(board, move, currentPlayer)
      const score = minimax(nextBoard, switchPlayer(currentPlayer), aiPlayer, depth + 1, alpha, beta)

      if (score > bestScore) {
        bestScore = score
      }

      if (score > alpha) {
        alpha = score
      }

      if (beta <= alpha) {
        break
      }
    }

    return bestScore
  }

  let bestScore = Number.POSITIVE_INFINITY

  for (const move of availableMoves) {
    const nextBoard = placeMark(board, move, currentPlayer)
    const score = minimax(nextBoard, switchPlayer(currentPlayer), aiPlayer, depth + 1, alpha, beta)

    if (score < bestScore) {
      bestScore = score
    }

    if (score < beta) {
      beta = score
    }

    if (beta <= alpha) {
      break
    }
  }

  return bestScore
}

function getBestMove(board: Board, aiPlayer: Player): CellIndex {
  const availableMoves = getAvailableMoves(board)
  const firstMove = availableMoves[0]

  if (typeof firstMove !== 'number') {
    throw new Error('AI cannot move on a finished board.')
  }

  let bestMove = firstMove
  let bestScore = Number.NEGATIVE_INFINITY

  for (const move of availableMoves) {
    const nextBoard = placeMark(board, move, aiPlayer)
    const score = minimax(nextBoard, switchPlayer(aiPlayer), aiPlayer, 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)

    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

export function getAiMove(board: Board, aiPlayer: Player, difficulty: Difficulty): number {
  const availableMoves = getAvailableMoves(board)

  if (availableMoves.length === 0) {
    throw new Error('AI cannot move on a finished board.')
  }

  if (difficulty === 'easy') {
    return getRandomMove(availableMoves)
  }

  if (difficulty === 'medium' && Math.random() < 0.5) {
    return getRandomMove(availableMoves)
  }

  return getBestMove(board, aiPlayer)
}
