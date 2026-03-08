import { type GameMode, type GameResult, type Player } from '@/lib/types'

interface GameStatusProps {
  readonly currentPlayer: Player
  readonly result: GameResult
  readonly gameMode: GameMode
  readonly isAiThinking: boolean
}

function getModeCopy(gameMode: GameMode): string {
  if (gameMode.type === 'pvp') {
    return 'Player vs player'
  }

  return `Player vs AI on ${gameMode.difficulty}`
}

export function GameStatus({ currentPlayer, result, gameMode, isAiThinking }: GameStatusProps) {
  let title = `${currentPlayer} to play`
  let description = `${getModeCopy(gameMode)}. Pick a square and build a clean line before the board closes.`
  const showThinkingDots = isAiThinking && result.status === 'in_progress'

  if (result.status === 'win') {
    title = `${result.winner} wins the round`
    description = 'The highlighted line seals it. Start a new round to keep the score rolling.'
  }

  if (result.status === 'draw' && result.reason === 'filled') {
    title = 'Round ends in a full-board draw'
    description = 'Every square is taken and nobody found a clean line.'
  }

  if (result.status === 'draw' && result.reason === 'no_future_wins') {
    title = 'Round ends early in a stalemate'
    description = 'No legal move sequence can create a winner from here, so the engine closes the round now.'
  }

  if (showThinkingDots) {
    title = 'AI is thinking'
    description = `The computer is evaluating the ${gameMode.type === 'ai' ? gameMode.difficulty : 'current'} board.`
  }

  return (
    <section className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface-strong)]/80 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted-color)]">Status</p>
      <div className="mt-3 flex flex-wrap items-center gap-3" aria-live="polite">
        <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-[var(--text-color)]">{title}</h2>
        {showThinkingDots ? (
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="thinking-dot" />
            <span className="thinking-dot [animation-delay:150ms]" />
            <span className="thinking-dot [animation-delay:300ms]" />
          </div>
        ) : null}
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-color)] sm:text-base">{description}</p>
    </section>
  )
}
