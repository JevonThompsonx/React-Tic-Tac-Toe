import { describe, expect, it } from 'vitest'

import { WIN_LINES, type Board, type CellValue, type GameState, type Player } from '@/lib/types'
import { checkResult, createInitialState, getAvailableMoves, makeMove } from '@/lib/game-engine'

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

function buildWinningBoard(line: readonly [number, number, number], player: Player): Board {
  return createBoard(
    line.includes(0) ? player : null,
    line.includes(1) ? player : null,
    line.includes(2) ? player : null,
    line.includes(3) ? player : null,
    line.includes(4) ? player : null,
    line.includes(5) ? player : null,
    line.includes(6) ? player : null,
    line.includes(7) ? player : null,
    line.includes(8) ? player : null,
  )
}

describe('game engine', () => {
  it('createInitialState returns an empty board and X to move', () => {
    const state = createInitialState()

    expect(state.board).toEqual([null, null, null, null, null, null, null, null, null])
    expect(state.currentPlayer).toBe('X')
    expect(state.result).toEqual({ status: 'in_progress' })
    expect(state.moveHistory).toEqual([])
  })

  it('makeMove places a mark on an empty cell and switches the player', () => {
    const nextState = makeMove(createInitialState(), 4)

    if (nextState === null) {
      throw new Error('Expected a valid move.')
    }

    expect(nextState.board[4]).toBe('X')
    expect(nextState.currentPlayer).toBe('O')
    expect(nextState.moveHistory).toEqual([4])
    expect(nextState.result).toEqual({ status: 'in_progress' })
  })

  it('makeMove returns null when the target cell is occupied', () => {
    const firstMove = makeMove(createInitialState(), 0)

    if (firstMove === null) {
      throw new Error('Expected first move to succeed.')
    }

    expect(makeMove(firstMove, 0)).toBeNull()
  })

  it('makeMove returns null when the game is already over', () => {
    const finishedState: GameState = {
      board: createBoard('X', 'X', 'X', null, null, null, null, null, null),
      currentPlayer: 'O',
      result: checkResult(createBoard('X', 'X', 'X', null, null, null, null, null, null)),
      moveHistory: [0, 3, 1, 4, 2],
    }

    expect(makeMove(finishedState, 5)).toBeNull()
  })

  it('checkResult detects every win line for both players', () => {
    for (const line of WIN_LINES) {
      expect(checkResult(buildWinningBoard(line, 'X'))).toEqual({
        status: 'win',
        winner: 'X',
        winningLine: line,
      })

      expect(checkResult(buildWinningBoard(line, 'O'))).toEqual({
        status: 'win',
        winner: 'O',
        winningLine: line,
      })
    }
  })

  it('checkResult detects a full-board draw', () => {
    const board = createBoard('X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X')

    expect(checkResult(board)).toEqual({ status: 'draw', reason: 'filled' })
  })

  it('checkResult detects a forced draw before the board is full', () => {
    const board = createBoard(null, null, 'X', 'X', 'O', 'O', 'O', 'X', 'X')

    expect(checkResult(board)).toEqual({ status: 'draw', reason: 'no_future_wins' })
  })

  it('checkResult returns in progress when a winning future still exists', () => {
    const board = createBoard('X', 'O', null, null, 'X', null, null, null, 'O')

    expect(checkResult(board)).toEqual({ status: 'in_progress' })
  })

  it('getAvailableMoves returns the correct indices', () => {
    const board = createBoard('X', null, 'O', null, null, 'X', 'O', null, null)

    expect(getAvailableMoves(board)).toEqual([1, 3, 4, 7, 8])
  })
})
