import { Cell } from '@/components/Cell'
import { type Board, type WinningLine } from '@/lib/types'

interface BoardProps {
  readonly board: Board
  readonly winningLine: WinningLine | null
  readonly disabled: boolean
  readonly onCellClick: (index: number) => void
}

export function Board({ board, winningLine, disabled, onCellClick }: BoardProps) {
  const winningCells = new Set<number>(winningLine ?? [])

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4" role="grid" aria-label="Tic Tac Toe board">
      {board.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          disabled={disabled || value !== null}
          isWinning={winningCells.has(index)}
          onClick={onCellClick}
        />
      ))}
    </div>
  )
}
