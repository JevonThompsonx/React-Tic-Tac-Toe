import { type GameMode } from '@/lib/types'

interface ControlsProps {
  readonly gameMode: GameMode
  readonly moveCount: number
  readonly onResetGame: () => void
  readonly onNewSession: () => void
}

function getModeLabel(gameMode: GameMode): string {
  if (gameMode.type === 'pvp') {
    return 'PvP'
  }

  return `AI ${gameMode.difficulty}`
}

export function Controls({ gameMode, moveCount, onResetGame, onNewSession }: ControlsProps) {
  return (
    <section className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted-color)]">Controls</p>
          <h3 className="mt-2 font-display text-2xl text-[var(--text-color)]">Stay in the rhythm</h3>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-color)]">
          <span className="rounded-full border border-[var(--border-color)] bg-[var(--chip-bg)] px-3 py-2">{getModeLabel(gameMode)}</span>
          <span className="rounded-full border border-[var(--border-color)] bg-[var(--chip-bg)] px-3 py-2">Moves {moveCount}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onResetGame}
          className="rounded-[18px] border border-[var(--accent-strong)] bg-[var(--accent-strong)] px-4 py-3 text-sm font-bold text-[var(--accent-contrast)] transition hover:-translate-y-0.5"
        >
          New round
        </button>
        <button
          type="button"
          onClick={onNewSession}
          className="rounded-[18px] border border-[var(--border-color)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-bold text-[var(--text-color)] transition hover:-translate-y-0.5"
        >
          New game
        </button>
      </div>
    </section>
  )
}
