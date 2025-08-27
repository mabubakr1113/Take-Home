Decisions & Trade-offs

- Mock GraphQL implemented with Express + Apollo Server for quick setup.
- In-memory data store resets on server restart; fine for demo.
- Status logic centralised in resolver to keep UI dumb.
- Trend data synthesized from totals; real impl would aggregate by date.
- Tailwind for rapid UI; minimal custom CSS.

Further Improvements (with more time)

- Persist mutations (e.g., lowdb or sqlite) and add tests.
- Add sorting on table columns and server-side pagination.
- Debounce search, add URL state (query params) for shareable filters.
- Add skeleton loaders and empty states.
- Add E2E tests (Playwright) and component tests (RTL).
- Extract components further and add Storybook.
