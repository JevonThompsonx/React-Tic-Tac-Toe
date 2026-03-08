import { type Score } from '@/lib/types'

interface ScoreBoardProps {
  readonly score: Score
}

function ScoreCard({ label, value, tone }: { readonly label: string; readonly value: number; readonly tone: string }) {
  return (
    <div className="rounded-[22px] border border-[var(--border-color)] bg-[var(--surface-strong)]/80 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl">
      <p className="text-sm text-[var(--muted-color)]">{label}</p>
      <p className={`mt-3 font-display text-4xl ${tone}`}>{value}</p>
    </div>
  )
}

export function ScoreBoard({ score }: ScoreBoardProps) {
  return (
    <section className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted-color)]">Scoreboard</p>
          <h3 className="mt-2 font-display text-2xl text-[var(--text-color)]">First to find momentum</h3>
        </div>
        <span className="rounded-full border border-[var(--border-color)] bg-[var(--chip-bg)] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-color)]">
          Live match
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ScoreCard label="Player X" value={score.x} tone="text-[var(--x-color)]" />
        <ScoreCard label="Player O" value={score.o} tone="text-[var(--o-color)]" />
        <ScoreCard label="Draws" value={score.draws} tone="text-[var(--draw-color)]" />
      </div>
    </section>
  )
}
