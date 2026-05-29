# Task Manager

A clean, responsive task manager built with Next.js, TypeScript, and Tailwind CSS.

🔗 Live demo: https://task-manager-livid-psi-61.vercel.app

## Features

- Add tasks with priority levels (high, medium, low)
- Mark tasks as complete / incomplete
- Delete individual tasks
- Filter by All / Active / Completed
- Persists data via localStorage
- Smooth animations with Framer Motion
- Fully responsive (mobile + desktop)

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Getting started

```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager
npm install
npm run dev
```

Open http://localhost:3000

## Project structure

src/
├── app/ → pages and global styles
├── components/ → TaskInput, FilterBar, TaskList, TaskCard
├── hooks/ → useTasks (all logic + localStorage)
└── types/ → Task, Filter, Priority types

## Key decisions

- All task logic lives in a single custom hook `useTasks` — keeps components clean and focused on UI only
- TypeScript interfaces defined upfront in `/types` — enforces consistency across components
- localStorage synced via `useEffect` — simple persistence without a backend
