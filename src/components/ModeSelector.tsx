import { DIFFICULTIES, type Difficulty, type GameMode } from '@/lib/types'

interface ModeSelectorProps {
  readonly onSelectMode: (mode: GameMode) => void
}

function getDifficultyCopy(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'Loose, fast, and forgiving.'
    case 'medium':
      return 'Balanced between mistakes and smart reads.'
    case 'hard':
      return 'Minimax all the way down. No freebies.'
  }
}

export function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  return (
    <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <article className="rounded-[30px] border border-[var(--border-color)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted-color)]">Choose your match</p>
        <h2 className="mt-3 max-w-[12ch] font-display text-[clamp(2rem,4vw,3.5rem)] leading-none text-[var(--text-color)]">
          Start with a mode that fits your mood.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted-color)] sm:text-base">
          Keep it social with a local two-player duel, or switch on the engine and pick how merciful the AI should be.
        </p>

        <button
          type="button"
          onClick={() => onSelectMode({ type: 'pvp' })}
          className="mt-6 w-full rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-strong)] p-5 text-left transition hover:-translate-y-1 hover:border-[var(--accent-soft)]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted-color)]">Local duel</p>
          <h3 className="mt-3 font-display text-3xl text-[var(--text-color)]">Player vs player</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-color)]">Pass the device, trade turns, and let the sharper read win.</p>
        </button>
      </article>

      <article className="rounded-[30px] border border-[var(--border-color)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted-color)]">Computer opponent</p>
        <h3 className="mt-3 font-display text-3xl text-[var(--text-color)]">Player vs AI</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--muted-color)] sm:text-base">
          You always open as X. The AI answers as O after a short thinking delay so the round feels deliberate.
        </p>

        <div className="mt-6 grid gap-3">
          {DIFFICULTIES.map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              onClick={() => onSelectMode({ type: 'ai', difficulty })}
              className="rounded-[22px] border border-[var(--border-color)] bg-[var(--surface-strong)] p-5 text-left transition hover:-translate-y-1 hover:border-[var(--accent-soft)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-display text-2xl capitalize text-[var(--text-color)]">{difficulty}</h4>
                <span className="rounded-full border border-[var(--border-color)] bg-[var(--chip-bg)] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-color)]">
                  AI mode
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-color)]">{getDifficultyCopy(difficulty)}</p>
            </button>
          ))}
        </div>
      </article>
    </section>
  )
}
