import { useEffect, useState } from 'react'

import { Board } from '@/components/Board'
import { Controls } from '@/components/Controls'
import { GameStatus } from '@/components/GameStatus'
import { ModeSelector } from '@/components/ModeSelector'
import { ScoreBoard } from '@/components/ScoreBoard'
import { useGame } from '@/hooks/useGame'
import { type Theme } from '@/lib/types'

const THEME_STORAGE_KEY = 'sunline-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

    return storedTheme === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const { gameState, score, gameMode, isAiThinking, handleCellClick, resetGame, newSession, setGameMode } = useGame()

  useEffect(() => {
    document.documentElement.dataset.theme = theme

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      return
    }
  }, [theme])

  const winningLine = gameState.result.status === 'win' ? gameState.result.winningLine : null
  const boardLocked =
    gameState.result.status !== 'in_progress' || isAiThinking || (gameMode !== null && gameMode.type === 'ai' && gameState.currentPlayer === 'O')

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--text-color)] transition-colors duration-300">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-7rem] h-72 w-72 rounded-full bg-[var(--orb-primary)] blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-6rem] h-80 w-80 rounded-full bg-[var(--orb-secondary)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,var(--top-glow),transparent)]" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="panel-sheen rounded-[32px] border border-[var(--border-color)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted-color)]">React Tic Tac Toe</p>
              <h1 className="mt-3 max-w-[12ch] font-display text-[clamp(2.4rem,5vw,4.75rem)] leading-[0.95] text-[var(--text-color)]">
                Sunline strategy in two colorways.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-color)] sm:text-base">
                A polished TypeScript rebuild with Tailwind styling, PvP and PvAI play, persistent theme memory, and a stricter engine that ends rounds the moment no winning future remains.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))}
              aria-pressed={theme === 'dark'}
              className="rounded-full border border-[var(--border-color)] bg-[var(--chip-bg)] px-4 py-3 text-sm font-bold text-[var(--text-color)] transition hover:-translate-y-0.5"
            >
              {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            </button>
          </div>
        </section>

        {gameMode === null ? (
          <ModeSelector onSelectMode={setGameMode} />
        ) : (
          <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_360px]">
            <article className="rounded-[30px] border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-6">
              <GameStatus currentPlayer={gameState.currentPlayer} result={gameState.result} gameMode={gameMode} isAiThinking={isAiThinking} />

              <div className="mt-5 rounded-[30px] border border-[var(--border-color)] bg-[var(--surface-strong)]/75 p-4 sm:p-5">
                <Board board={gameState.board} winningLine={winningLine} disabled={boardLocked} onCellClick={handleCellClick} />
              </div>
            </article>

            <aside className="grid gap-5">
              <ScoreBoard score={score} />
              <Controls gameMode={gameMode} moveCount={gameState.moveHistory.length} onResetGame={resetGame} onNewSession={newSession} />

              <section className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted-color)]">What changed</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-color)] sm:text-base">
                  <li>Theme choice is stored in local storage, so the preferred palette survives a reboot.</li>
                  <li>The engine now explores remaining move trees before allowing play to continue, which catches hidden forced draws.</li>
                  <li>Hard mode uses minimax with alpha-beta pruning, so the AI does not hand away wins.</li>
                </ul>
              </section>
            </aside>
          </section>
        )}
      </main>
    </div>
  )
}
