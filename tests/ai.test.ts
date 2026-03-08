import { describe, expect, it } from 'vitest'

import { getAiMove } from '@/lib/ai'
import { createInitialState, getAvailableMoves, makeMove } from '@/lib/game-engine'
import { type Board, type CellValue, type Player } from '@/lib/types'

function createBoard(
  c0: CellValue,
  c1: CellValue,
  c2: CellValue,
  c3: CellValue,
  c4: CellValue,
  c5: CellValue,
  c6: CellValue,
  c7: CellValue,
  c8: CellValue,
): Board {
  return [c0, c1, c2, c3, c4, c5, c6, c7, c8]
}

function getRandomMove(board: Board): number {
  const availableMoves = getAvailableMoves(board)
  const selectedMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]

  if (typeof selectedMove !== 'number') {
    throw new Error('No moves remain.')
  }

  return selectedMove
}

function playRandomGameAgainstHardAi(aiPlayer: Player) {
  let state = createInitialState()

  while (state.result.status === 'in_progress') {
    const nextMove = state.currentPlayer === aiPlayer ? getAiMove(state.board, aiPlayer, 'hard') : getRandomMove(state.board)
    const nextState = makeMove(state, nextMove)

    if (nextState === null) {
      throw new Error('Received an invalid move during simulation.')
    }

    state = nextState
  }

  return state.result
}

describe('AI', () => {
  it('easy AI always returns a valid move', () => {
    const state = createInitialState()
    const move = getAiMove(state.board, 'X', 'easy')

    expect(getAvailableMoves(state.board)).toContain(move)
  })

  it('hard AI never loses when going first', () => {
    for (let game = 0; game < 60; game += 1) {
      const result = playRandomGameAgainstHardAi('X')

      expect(result.status === 'win' && result.winner === 'O').toBe(false)
    }
  })

  it('hard AI never loses when going second', () => {
    for (let game = 0; game < 60; game += 1) {
      const result = playRandomGameAgainstHardAi('O')

      expect(result.status === 'win' && result.winner === 'X').toBe(false)
    }
  })

  it('AI returns the only valid move when one cell remains', () => {
    const board = createBoard('X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null)

    expect(getAiMove(board, 'X', 'hard')).toBe(8)
  })
})
