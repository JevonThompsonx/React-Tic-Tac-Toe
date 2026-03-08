# Tic-Tac-Toe React App — AI Build Prompt

## PRIORITY RULES — Always Active

> **These rules override everything below. Re-read before every response.**

| # | Rule | Non-Negotiable |
|---|------|----------------|
| 1 | `strict: true` in tsconfig.json. No `any`, no `as` type assertions, no `!` non-null assertions. | YES |
| 2 | Validate all game state transitions. Never trust UI events to produce valid state — verify in the game engine. | YES |
| 3 | Server Components do not apply. This is a client-side SPA. Every component uses React hooks/state. | YES |
| 4 | Type narrowing with discriminated unions and type guards — never `as` or `!`. | YES |
| 5 | Pin exact dependency versions. `bun.lock` committed. Reproducible builds. | YES |
| 6 | Search for current stable versions of Vite, React, TypeScript, and Tailwind before scaffolding. Use exact latest stable versions. | YES |
| 7 | The entire game must be delivered as a single working `bun create vite` project that runs with `bun install && bun run dev` — zero additional steps. | YES |
| 8 | All game logic lives in a pure TypeScript module (`src/lib/game-engine.ts`) with no React imports. UI components consume it. This makes the logic testable and portable. | YES |

---

## Role

You are a senior TypeScript engineer building a polished, production-quality Tic-Tac-Toe web game as a Vite + React SPA. You write strict TypeScript, separate game logic from UI, and deliver a complete project that compiles and runs on the first try. You treat this like a portfolio piece — not a tutorial demo.

---

## Technology Stack

| Layer | Choice |
|-------|--------|
| **Language** | TypeScript (`strict: true`) |
| **Build Tool** | Vite (latest stable) |
| **UI** | React 19 (latest stable) + Tailwind CSS 4 (latest stable) |
| **Package Manager** | bun |
| **Testing** | Vitest (unit tests for game engine) |

No backend, no database, no routing library. Single-page app.

---

## Project Structure

```
tictactoe/
├── public/
├── src/
│   ├── main.tsx                  # Entry point — renders <App />
│   ├── App.tsx                   # Root component — orchestrates game
│   ├── components/
│   │   ├── Board.tsx             # 3×3 grid, renders Cell components
│   │   ├── Cell.tsx              # Single square — displays X, O, or empty
│   │   ├── GameStatus.tsx        # Shows whose turn / winner / draw
│   │   ├── ScoreBoard.tsx        # Tracks wins/losses/draws across rounds
│   │   ├── Controls.tsx          # Reset game, new round, toggle AI, difficulty selector
│   │   └── ModeSelector.tsx      # Choose PvP or PvAI + difficulty before starting
│   ├── lib/
│   │   ├── game-engine.ts        # Pure game logic — zero React imports
│   │   ├── ai.ts                 # AI opponent (minimax) — zero React imports
│   │   └── types.ts              # All shared types/interfaces
│   ├── hooks/
│   │   └── useGame.ts            # Custom hook — connects game-engine to React state
│   ├── index.css                 # Tailwind directives + custom styles
│   └── vite-env.d.ts
├── tests/
│   ├── game-engine.test.ts       # Unit tests for game logic
│   └── ai.test.ts                # Unit tests for AI
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts            # Only if Tailwind 4 still requires one — check docs
└── README.md
```

---

## Game Engine Specification (`src/lib/game-engine.ts`)

This module is **pure functions only** — no side effects, no React, no DOM. It receives state and returns new state.

### Types (`src/lib/types.ts`)

```typescript
export type Player = "X" | "O";
export type CellValue = Player | null;
export type Board = readonly [
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
];
// Board indices:
// 0 | 1 | 2
// 3 | 4 | 5
// 6 | 7 | 8

export type GameResult =
  | { status: "in_progress" }
  | { status: "win"; winner: Player; winningLine: readonly [number, number, number] }
  | { status: "draw" };

export type Difficulty = "easy" | "medium" | "hard";

export type GameMode =
  | { type: "pvp" }
  | { type: "ai"; difficulty: Difficulty };

export interface GameState {
  readonly board: Board;
  readonly currentPlayer: Player;
  readonly result: GameResult;
  readonly moveHistory: readonly number[]; // indices of moves in order
}

export interface Score {
  x: number;
  o: number;
  draws: number;
}
```

### Required Functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| `createInitialState` | `() => GameState` | Returns fresh game state (empty board, X goes first) |
| `makeMove` | `(state: GameState, cellIndex: number) => GameState \| null` | Returns new state if move is valid, `null` if invalid (cell occupied, game over). **This is the single source of truth for move validation.** |
| `checkResult` | `(board: Board) => GameResult` | Evaluates board for win/draw/in-progress |
| `getAvailableMoves` | `(board: Board) => readonly number[]` | Returns indices of empty cells |
| `switchPlayer` | `(player: Player) => Player` | Returns opposite player |

### Win Detection

Check all 8 lines (3 rows, 3 columns, 2 diagonals). Store the winning line indices so the UI can highlight them.

```typescript
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
] as const;
```

---

## AI Opponent (`src/lib/ai.ts`)

Pure functions. No React imports. Receives board state, returns a move index.

| Difficulty | Behavior |
|------------|----------|
| **Easy** | Random valid move |
| **Medium** | 50% chance of optimal move (minimax), 50% random |
| **Hard** | Minimax with alpha-beta pruning — unbeatable |

### Minimax Implementation

- Recursive minimax with alpha-beta pruning for `hard` difficulty.
- Maximizing player = AI's mark, minimizing player = human's mark.
- Terminal evaluation: `+10` for AI win, `-10` for human win, `0` for draw. Adjust by depth so the AI prefers faster wins and slower losses.
- For `medium`, use a random number check before each move decision to decide whether to use minimax or pick randomly.

**The AI function signature:**

```typescript
export function getAiMove(
  board: Board,
  aiPlayer: Player,
  difficulty: Difficulty,
): number;
```

---

## React Hook (`src/hooks/useGame.ts`)

Single custom hook that owns all game state and exposes:

```typescript
interface UseGameReturn {
  gameState: GameState;
  score: Score;
  gameMode: GameMode | null;        // null = mode not yet selected
  handleCellClick: (index: number) => void;
  resetGame: () => void;            // reset board, keep score + mode
  newSession: () => void;           // reset everything, go back to mode select
  setGameMode: (mode: GameMode) => void;
}
```

### AI Move Timing

When it's the AI's turn, add a short delay (300–600ms via `setTimeout`) before making the move so the UI doesn't feel instant. Disable cell clicks during the AI's "thinking" time. Clean up the timeout on unmount.

### State Flow

1. App mounts → `gameMode` is `null` → show `ModeSelector`
2. Player selects mode → `setGameMode()` → show `Board` + `GameStatus` + `ScoreBoard` + `Controls`
3. Player clicks cell → `handleCellClick()` → `makeMove()` → state updates → if AI mode and now AI's turn → schedule AI move after delay
4. Game ends (win/draw) → `GameStatus` shows result → winning cells highlighted → `score` updates → player can click "New Round" or "New Game"
5. "New Round" = `resetGame()` (board clears, score persists, same mode)
6. "New Game" = `newSession()` (everything resets, back to mode select)

---

## UI/UX Requirements

### Layout

- Centered on screen, responsive (works on mobile down to 320px width).
- Board is a 3×3 CSS Grid with equal-sized square cells.
- Below the board: game status message, scoreboard, controls.
- Above the board (or at top): minimal title/branding.

### Visual Design

Pick a **distinctive, opinionated aesthetic** — not the default blue-on-white tutorial look. Suggestions (pick one and commit fully):

- **Brutalist/monochrome** — black/white/red only, heavy borders, monospace type, harsh shadows
- **Retro arcade** — dark background, neon glow effects, pixel-style or display font, CRT scanline texture
- **Soft/playful** — rounded shapes, warm pastel palette, bouncy animations, hand-drawn feel
- **Editorial/refined** — serif display font, muted earth tones, thin lines, generous whitespace

Whatever you choose: custom font imported from Google Fonts (not Inter, Roboto, Arial, or system fonts), cohesive color palette defined as CSS variables, and at least one non-trivial visual flourish (glow, texture, gradient, shadow, etc.).

### Interactions & Animations

| Event | Animation |
|-------|-----------|
| Cell hover (empty, clickable) | Subtle highlight or scale — indicate it's interactive |
| Mark placed | Entrance animation (fade-in, scale-up, or draw-in) |
| Winning line | Highlight/pulse the 3 winning cells. Distinct from normal cells. |
| Game over (draw) | Subtle visual indication (e.g., board dims slightly) |
| Board reset | Brief exit animation on marks before clearing |
| AI "thinking" | Visual indicator that AI is deciding (spinner, pulsing dot, etc.) |

Use CSS transitions/animations. No animation library needed.

### Accessibility

- All interactive elements keyboard-navigable (cells are `<button>` elements).
- `aria-label` on each cell: `"Row 1, Column 2: X"` or `"Row 1, Column 2: empty"`.
- Focus visible styles on cells.
- Color is not the only differentiator between X and O (shape is primary).
- Game status announced to screen readers (use `aria-live="polite"` region).

### Scoreboard

Persistent across rounds (not across page reloads — in-memory state is fine). Shows:

```
X: 3  |  O: 1  |  Draws: 2
```

---

## TypeScript Rules (Restated for This Project)

| Rule | Enforcement |
|------|-------------|
| `strict: true` | tsconfig.json |
| `noUncheckedIndexedAccess: true` | tsconfig.json |
| No `any` | Use `unknown` + type guards, or define proper types |
| No `as` type assertions | Use discriminated unions, type guards, or `satisfies` |
| No `!` non-null assertions | Handle the null/undefined case explicitly |
| Prefer `interface` for object shapes | Better error messages |
| Prefer `type` for unions/intersections | `Player`, `CellValue`, `GameResult` |
| `readonly` on all arrays/tuples in game state | Prevent accidental mutation |
| `satisfies` for config objects | Use where applicable |

### tsconfig.json

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "module": "esnext",
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "react-jsx",
    "isolatedModules": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "tests/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Tests (`tests/`)

Write Vitest unit tests for the game engine and AI. Minimum coverage:

### `game-engine.test.ts`

- `createInitialState()` returns empty board, X as current player, in_progress status
- `makeMove()` on empty cell returns valid new state with mark placed and player switched
- `makeMove()` on occupied cell returns `null`
- `makeMove()` when game is already over returns `null`
- `checkResult()` detects all 8 win lines for both X and O
- `checkResult()` detects draw (full board, no winner)
- `checkResult()` returns in_progress for incomplete game
- `getAvailableMoves()` returns correct indices

### `ai.test.ts`

- Easy AI returns a valid move (index is in available moves)
- Hard AI never loses when going first (play 50+ random games against it)
- Hard AI never loses when going second (play 50+ random games against it)
- AI returns valid move on boards with only one move left

### Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

## Package Scripts

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

---

## README.md

Include:

- Project name and one-line description
- `bun install && bun run dev` quick start
- Feature list (PvP, PvAI with 3 difficulties, score tracking)
- `bun test` to run tests
- Tech stack list

Keep it short. No fluff.

---

## Delivery Checklist

Before presenting the finished project, verify **every item**:

- [ ] `bun install` completes with zero errors
- [ ] `bun run type-check` (`tsc --noEmit`) passes with zero errors
- [ ] `bun run dev` starts Vite dev server and the game loads in browser
- [ ] `bun run build` produces a production build with zero errors
- [ ] `bun test` — all tests pass
- [ ] Mode selection screen works (PvP and PvAI with difficulty)
- [ ] PvP mode: alternating turns, win detection, draw detection all work
- [ ] PvAI mode: AI makes moves after delay, AI respects difficulty setting
- [ ] Hard AI is unbeatable (verified by tests)
- [ ] Winning line is visually highlighted
- [ ] Scoreboard tracks across rounds
- [ ] "New Round" resets board but keeps score and mode
- [ ] "New Game" resets everything and returns to mode select
- [ ] All cells are keyboard-accessible `<button>` elements
- [ ] No `any`, `as`, or `!` anywhere in the codebase
- [ ] Game engine module has zero React imports
- [ ] AI module has zero React imports
- [ ] All state arrays/tuples use `readonly`
- [ ] Responsive layout works at 320px viewport width

---

## REINFORCEMENT — Critical Rules Restated

> **Re-read before finalizing.**

1. **`strict: true`** — no `any`, no `as`, no `!`
2. **Game logic is pure TypeScript** — `game-engine.ts` and `ai.ts` have zero React/DOM imports
3. **All moves validated by the engine** — UI calls `makeMove()`, engine returns new state or `null`
4. **Readonly state** — board and move history are `readonly` arrays. Never mutate; always return new state.
5. **Latest stable versions** — search for current Vite, React, TypeScript, Tailwind versions before scaffolding
6. **Runs on first try** — `bun install && bun run dev` with zero errors, zero warnings
7. **Tests pass** — game engine and AI fully tested, hard AI provably unbeatable
8. **Distinctive visual design** — not a tutorial demo. Polished, opinionated aesthetic.
9. **Accessible** — keyboard nav, aria labels, focus styles, screen reader announcements