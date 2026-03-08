import { useEffect, useRef, useState } from 'react'

import { getAiMove } from '@/lib/ai'
import { createInitialState, makeMove } from '@/lib/game-engine'
import { type GameMode, type GameResult, type GameState, type Player, type Score } from '@/lib/types'

const AI_PLAYER: Player = 'O'
const AI_THINK_DELAY_MS = 460

function createInitialScore(): Score {
  return { x: 0, o: 0, draws: 0 }
}

function getResultToken(result: GameResult): string {
  if (result.status === 'win') {
    return `win:${result.winner}`
  }

  if (result.status === 'draw') {
    return `draw:${result.reason}`
  }

  return 'in_progress'
}

function isAiTurn(gameMode: GameMode | null, gameState: GameState): gameMode is Extract<GameMode, { type: 'ai' }> {
  return gameMode !== null && gameMode.type === 'ai' && gameState.result.status === 'in_progress' && gameState.currentPlayer === AI_PLAYER
}

export interface UseGameReturn {
  readonly gameState: GameState
  readonly score: Score
  readonly gameMode: GameMode | null
  readonly isAiThinking: boolean
  readonly handleCellClick: (index: number) => void
  readonly resetGame: () => void
  readonly newSession: () => void
  readonly setGameMode: (mode: GameMode) => void
}

export function useGame(): UseGameReturn {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState())
  const [score, setScore] = useState<Score>(() => createInitialScore())
  const [gameMode, setSelectedGameMode] = useState<GameMode | null>(null)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const aiTimeoutRef = useRef<number | undefined>(undefined)
  const resultTokenRef = useRef('in_progress')

  function clearAiTimer(): void {
    if (typeof aiTimeoutRef.current === 'number') {
      window.clearTimeout(aiTimeoutRef.current)
      aiTimeoutRef.current = undefined
    }
  }

  useEffect(() => {
    const resultToken = getResultToken(gameState.result)

    if (resultToken === 'in_progress') {
      resultTokenRef.current = 'in_progress'
      return
    }

    if (resultTokenRef.current !== 'in_progress') {
      return
    }

    if (gameState.result.status === 'win') {
      const winner = gameState.result.winner

      setScore((currentScore) => {
        if (winner === 'X') {
          return { ...currentScore, x: currentScore.x + 1 }
        }

        return { ...currentScore, o: currentScore.o + 1 }
      })
    }

    if (gameState.result.status === 'draw') {
      setScore((currentScore) => ({ ...currentScore, draws: currentScore.draws + 1 }))
    }

    resultTokenRef.current = resultToken
  }, [gameState.result])

  useEffect(() => {
    clearAiTimer()

    if (!isAiTurn(gameMode, gameState)) {
      setIsAiThinking(false)
      return
    }

    const difficulty = gameMode.difficulty
    setIsAiThinking(true)

    aiTimeoutRef.current = window.setTimeout(() => {
      setGameState((currentState) => {
        if (currentState.result.status !== 'in_progress' || currentState.currentPlayer !== AI_PLAYER) {
          return currentState
        }

        const aiMove = getAiMove(currentState.board, AI_PLAYER, difficulty)
        const nextState = makeMove(currentState, aiMove)

        return nextState === null ? currentState : nextState
      })

      setIsAiThinking(false)
      aiTimeoutRef.current = undefined
    }, AI_THINK_DELAY_MS)

    return () => {
      clearAiTimer()
    }
  }, [gameMode, gameState])

  useEffect(() => {
    return () => {
      clearAiTimer()
    }
  }, [])

  function handleCellClick(index: number): void {
    if (gameMode === null || isAiThinking) {
      return
    }

    if (gameMode.type === 'ai' && gameState.currentPlayer === AI_PLAYER) {
      return
    }

    setGameState((currentState) => {
      const nextState = makeMove(currentState, index)

      return nextState === null ? currentState : nextState
    })
  }

  function resetGame(): void {
    clearAiTimer()
    setIsAiThinking(false)
    setGameState(createInitialState())
    resultTokenRef.current = 'in_progress'
  }

  function newSession(): void {
    clearAiTimer()
    setIsAiThinking(false)
    setGameState(createInitialState())
    setScore(createInitialScore())
    setSelectedGameMode(null)
    resultTokenRef.current = 'in_progress'
  }

  function setGameMode(mode: GameMode): void {
    clearAiTimer()
    setIsAiThinking(false)
    setGameState(createInitialState())
    setSelectedGameMode(mode)
    resultTokenRef.current = 'in_progress'
  }

  return {
    gameState,
    score,
    gameMode,
    isAiThinking,
    handleCellClick,
    resetGame,
    newSession,
    setGameMode,
  }
}
