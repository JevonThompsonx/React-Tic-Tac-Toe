import { type CellValue } from '@/lib/types'

interface CellProps {
  readonly index: number
  readonly value: CellValue
  readonly disabled: boolean
  readonly isWinning: boolean
  readonly onClick: (index: number) => void
}

export function Cell({ index, value, disabled, isWinning, onClick }: CellProps) {
  const row = Math.floor(index / 3) + 1
  const column = (index % 3) + 1
  const markTone = value === 'X' ? 'text-[var(--x-color)]' : value === 'O' ? 'text-[var(--o-color)]' : 'text-transparent'
  const stateClassName = [
    'group relative flex aspect-square items-center justify-center overflow-hidden rounded-[26px] border border-[var(--tile-border)] bg-[var(--tile-bg)] shadow-[var(--tile-shadow)] transition duration-200',
    disabled ? 'cursor-default' : 'cursor-pointer hover:-translate-y-1 hover:shadow-[var(--tile-shadow-hover)]',
    isWinning ? 'win-cell border-[var(--accent-strong)]' : '',
    value === null && !disabled ? 'hover:border-[var(--accent-soft)]' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={stateClassName}
      disabled={disabled}
      onClick={() => onClick(index)}
      aria-label={`Row ${row}, Column ${column}: ${value === null ? 'empty' : value}`}
    >
      <span className={`cell-mark font-display text-[clamp(3rem,9vw,5.25rem)] leading-none ${markTone}`}>
        {value ?? '•'}
      </span>
    </button>
  )
}
