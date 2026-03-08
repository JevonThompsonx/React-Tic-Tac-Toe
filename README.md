# Sunline Tic Tac Toe

A polished React + TypeScript Tic Tac Toe SPA with PvP, PvAI, theme persistence, and early stalemate detection.

## Quick Start

```bash
bun install
bun run dev
```

## Features

- Player vs player rounds
- Player vs AI with easy, medium, and hard difficulties
- Score tracking across rounds
- Persistent light and dark theme toggle
- Automatic draw detection when no future win remains

## Commands

```bash
bun test
bun run type-check
bun run build
```

## GitHub Upload

1. Create a new empty GitHub repository.
2. Upload the project files, including `bun.lock`.
3. Do not upload `node_modules` or `dist` - `.gitignore` already excludes them.
4. GitHub Actions will run the CI workflow on pushes and pull requests.

Example:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Deploy To Vercel

This repo is ready for Vercel with `vercel.json` configured for Bun + Vite.

### Web Dashboard

1. Push the repo to GitHub.
2. Sign in to Vercel.
3. Click `Add New...` -> `Project`.
4. Import the GitHub repository.
5. Vercel should detect the project settings automatically.
6. Confirm these values if prompted:
   - Install Command: `bun install`
   - Build Command: `bun run build`
   - Output Directory: `dist`
7. Click `Deploy`.

### Vercel CLI

```bash
bunx vercel
```

For production deployment:

```bash
bunx vercel --prod
```

## Pre-Launch Checklist

- `bun install`
- `bun run type-check`
- `bun test`
- `bun run build`
- Push to GitHub
- Import to Vercel and deploy

## Tech Stack

- React 19
- TypeScript (strict)
- Vite 7
- Tailwind CSS 4
- Vitest
