# Todo List

A lightweight React to-do app with a Microsoft To Do–style layout, styled with the Synpulse Design System (`DESIGN.md`).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Features

- Smart lists: My Day, Important, Planned, Tasks, plus your own lists (add, rename, delete)
- Task details pane: steps, due date (quick picks or date picker), My Day toggle, note
- Search across all tasks; collapsible Completed section
- Data saved in `localStorage`; works offline

## Design notes

- Greyscale UI; the primary button is `ink-800`
- Orange (`flag-*`) appears only for tasks due today or overdue: a left rail on the row, a `flag-700` date, and counts in the sidebar
- Completed checks use `ok-500`; destructive confirms use `stop-700`
- Important stars are `ink-800`, never orange
