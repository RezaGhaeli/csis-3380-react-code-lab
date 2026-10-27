# React Code Lab (CSIS 3380, Modules 4–7)

Ten auto-graded React activities built on the course case studies (Movie Night and Alex's Café).
Students write JSX (`app.js`) or HTML in the browser, see it render, submit, and get a score, an
explanation of every mistake, and the proper code side by side. Progress stays in the browser.

| # | Module | Students write | Topic |
|---|--------|----------------|-------|
| 1 | 4 | HTML | Adding React to a page (CDN scripts, root, `text/babel`) |
| 2 | 4 | JSX | JSX expressions and conditionals |
| 3 | 4 | JSX | Components and props |
| 4 | 4 | JSX | Lists with `map()` and keys |
| 5 | 5 | JSX | Class components and state (café order tally) |
| 6 | 5 | JSX | Lifting state up |
| 7 | 6 | JSX | `useState` and controlled inputs |
| 8 | 6 | JSX | `useEffect` (title, cleanup) and `useRef` (focus) |
| 9 | 6 | JSX | `useContext` (light/dark theme) |
| 10 | 7 | JSX | React Router (routes, `Link`, `useParams`, catch-all) |

React 18 and React Router 6 load from unpkg as in the course's CDN projects; Activity 10 uses
`MemoryRouter` because the preview has no address bar (a Vite app uses `BrowserRouter`).

Built with the `code-lab-builder` skill. To change an activity, edit `js/activities.js`, add a typical
mistake to `tests/mistakes.js`, and run `node <skill>/scripts/verify_lab.js .` before publishing.
