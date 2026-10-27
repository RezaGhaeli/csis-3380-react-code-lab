/*
   React Code Lab: CSIS 3380, Modules 4 to 7.
   Activities continue the course case studies: Movie Night (tutorials) and Alex's Café (labs).
   Students write app.js in JSX (Activity 1: index.html). React 18 and React Router 6 load from
   the CDN, as in the course's CDN projects; the lab compiles JSX with Babel itself.
*/

/* ------------------------------------------------------------ shared pieces */
const REACT_TAGS = `    <script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>`;
const ROUTER_TAGS = `    <script src="https://unpkg.com/@remix-run/router@1.23.0/dist/router.umd.min.js"></script>
    <script src="https://unpkg.com/react-router@6.30.1/dist/umd/react-router.development.js"></script>
    <script src="https://unpkg.com/react-router-dom@6.30.1/dist/umd/react-router-dom.development.js"></script>`;
const PAGE = (title, extra = '') => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <link rel="stylesheet" href="./app.css" />
  </head>

  <body>
    <div id="root"></div>

${REACT_TAGS}
${extra}    <script type="text/babel" src="./app.js"></script>
  </body>
</html>
`;

const MOVIES = `const movies = [
  { id: 1, title: "Spirited Away", year: 2001, genre: "Animation", rating: 5, watched: true, staffPick: true },
  { id: 2, title: "Inception", year: 2010, genre: "Sci-Fi", rating: 4, watched: true, staffPick: false },
  { id: 3, title: "The Grand Budapest Hotel", year: 2014, genre: "Comedy", rating: 4, watched: false, staffPick: true },
  { id: 4, title: "Coco", year: 2017, genre: "Animation", rating: 5, watched: false, staffPick: false }
];
`;

/* Movie Night styles (from the Module 4 tutorial), plus the classes later activities use. */
const MN_CSS = `/* Movie Night styles (given). Every class used in the activities is styled here. */
body { margin: 0; background: #eef1f6; font-family: Arial, Helvetica, sans-serif; color: #1d2433; }
header { display: flex; align-items: center; gap: 10px; padding: 18px 24px; background: #1f3a5f; color: #ffffff; border-bottom: 4px solid #f2b134; }
header h1 { flex-grow: 1; margin: 0; font-size: 1.6em; letter-spacing: 1px; }
.watchlist { width: 640px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 14px rgba(31, 58, 95, 0.18); }
.stats { padding: 6px 12px; background: #f2b134; color: #1f3a5f; border-radius: 14px; font-weight: bold; font-size: 0.9em; }
.movie { display: flex; align-items: center; border-bottom: 1px solid #e3e7ee; }
.movie-info { flex-grow: 1; padding: 14px 20px; }
.movie-title { display: block; font-size: 1.15em; font-weight: bold; color: #1f3a5f; }
.movie-meta { display: block; margin-top: 4px; font-size: 0.85em; color: #6b7486; }
.badge { display: inline-block; margin-left: 8px; padding: 2px 8px; border-radius: 10px; font-size: 0.7em; font-weight: bold; vertical-align: middle; }
.badge-pick { background: #fff1d1; color: #8a5a00; }
.badge-watched { background: #dcf0e7; color: #0d6a50; }
.badge-unwatched { background: #eceff4; color: #6b7486; }
.toggle { margin-right: 16px; padding: 6px 10px; border: 1px solid #c9d2df; border-radius: 4px; background: #ffffff; color: #1f3a5f; cursor: pointer; }
footer { padding: 12px 20px; background: #f6f8fb; color: #6b7486; font-size: 0.85em; text-align: center; }
form.add { display: flex; gap: 8px; padding: 14px 20px; background: #f6f8fb; border-bottom: 1px solid #e3e7ee; }
form.add input { flex-grow: 1; padding: 8px; border: 1px solid #c9d2df; border-radius: 4px; font: inherit; }
button.primary { padding: 8px 14px; border: none; border-radius: 4px; background: #1f3a5f; color: #ffffff; font-weight: bold; cursor: pointer; }
.countdown { padding: 8px 20px; background: #fff1d1; color: #8a5a00; text-align: center; font-weight: bold; }
.theme-btn { padding: 6px 12px; border: 1px solid #f2b134; border-radius: 4px; background: transparent; color: #ffffff; cursor: pointer; }
.watchlist.dark { background: #16243a; color: #e6ecf5; }
.watchlist.dark .movie { border-bottom-color: #2a3b57; }
.watchlist.dark .movie-title { color: #f2b134; }
.watchlist.dark footer { background: #101b2c; color: #9fb0c9; }
.movie-link { display: block; padding: 14px 20px; border-bottom: 1px solid #e3e7ee; color: #1f3a5f; font-weight: bold; text-decoration: none; }
.detail { padding: 20px 24px; }
.detail h2 { margin: 0 0 6px; color: #1f3a5f; }
.detail a { color: #1f6fc5; }
`;

/* Café styles (from the Module 5 Café Order lab, shortened). */
const CAFE_CSS = `/* Alex's Café styles (given). */
body { margin: 0; background: #f4efe9; font-family: Arial, Helvetica, sans-serif; color: #2b1d14; }
.menu { width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 14px rgba(75, 46, 31, 0.18); }
header { display: flex; align-items: center; gap: 8px; padding: 18px 24px; background: #4b2e1f; color: #ffffff; border-bottom: 4px solid #c8a27a; }
header h1 { flex-grow: 1; margin: 0; font-size: 1.5em; }
.count { padding: 6px 12px; background: #c8a27a; color: #4b2e1f; border-radius: 14px; font-weight: bold; font-size: 0.85em; }
.menu-item { display: flex; align-items: center; padding: 14px 24px; border-bottom: 1px solid #efe7df; }
.item-name { flex-grow: 1; font-weight: bold; color: #4b2e1f; }
.price { font-family: "Courier New", monospace; font-weight: bold; margin-right: 12px; }
.qty { display: flex; align-items: center; }
.qty-action { width: 30px; height: 30px; border: none; border-radius: 50%; background: #efe7df; color: #4b2e1f; font-weight: bold; cursor: pointer; }
.qty-action:disabled { opacity: 0.35; cursor: not-allowed; }
.qty-count { width: 32px; text-align: center; font-family: "Courier New", monospace; font-weight: bold; }
footer { padding: 12px 24px; background: #faf7f3; color: #7a6a5e; font-size: 0.85em; text-align: center; }
`;

/* small helpers for checks */
const rowOf = (c, title) => c.qa('.movie').find(m => m.textContent.includes(title));
const countOf = (s, re) => (s.match(re) || []).length;

const ACTIVITIES = [

/* =====================================================================  1  */
{
  id: 1, module: 'Module 4', topic: 'Adding React to a page', edit: 'html', art: 'img/a01-jsx-babel.png',
  title: 'Add React to the Movie Night Page',
  story: 'The Movie Night `app.js` is written, but `index.html` loads nothing, so the page is empty. A React page needs four things: an empty element for React to fill, the React library, a translator for JSX (Babel), and your code. Nothing is installed: the libraries come from **unpkg**, a free CDN (a website that serves code files), just as in class.',
  steps: [
    { text: 'Replace comment 1 with the **root element**. It starts empty; React draws the whole app inside it.',
      code: '<div id="root"></div>' },
    { text: 'Replace comment 2 with these **two script tags**, in this order. The first loads **React**, which builds the components; the second loads **ReactDOM**, which draws them on the page. ReactDOM needs React, so React must come first.',
      code: '<script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>\n<script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>' },
    { text: 'Replace comment 3 with **Babel**. Browsers cannot read JSX (the HTML-like code in `app.js`); Babel translates it into plain JavaScript.',
      code: '<script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>' },
    { text: 'Replace comment 4 with your **app**. `type="text/babel"` tells Babel to translate this file before it runs.',
      code: '<script type="text/babel" src="./app.js"></script>' },
    'Look at the preview: the Movie Night header and four movies appear. If the page stays empty, read the red message in the **Console** strip under the preview.'
  ],
  practise: ['script order', 'the root element', 'type="text/babel"'],
  starter: {
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Movie Night</title>
    <link rel="stylesheet" href="./app.css" />
  </head>

  <body>
    <!-- 1. the root element -->

    <!-- 2. React, then ReactDOM -->

    <!-- 3. Babel -->

    <!-- 4. app.js, as JSX -->

  </body>
</html>
`,
    css: MN_CSS,
    js: `// Movie Night (given). It needs React, ReactDOM, Babel, and a #root element.
${MOVIES}
const App = () => (
  <div className="watchlist">
    <header>
      <h1>Movie Night</h1>
      <span className="stats">Movies: { movies.length }</span>
    </header>
    { movies.map(movie =>
      <div className="movie" key={movie.id}>
        <div className="movie-info">
          <span className="movie-title">{ movie.title }</span>
          <span className="movie-meta">{ movie.year } · { movie.genre }</span>
        </div>
      </div>
    ) }
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`
  },
  solution: {
    html: PAGE('Movie Night'),
    css: null, js: null
  },
  checks: [
    { text: 'The page has `<div id="root">`', pts: 1,
      test: c => c.ok(/<div[^>]*id=["']root["']/.test(c.code.html), /root/.test(c.code.html) ? 'found “root”, but not as <div id="root">' : 'no root element'),
      explain: '`ReactDOM.createRoot(document.getElementById("root"))` needs an element with that id. React renders everything inside it.',
      fix: '<div id="root"></div>' },
    { text: 'React loads before ReactDOM', pts: 2,
      test: c => { const h = c.code.html; const a = h.search(/unpkg\.com\/react@[^"']*umd\/react\./), b = h.search(/unpkg\.com\/react-dom@/); return c.ok(a >= 0 && b > a, a < 0 ? 'no React script' : b < 0 ? 'no ReactDOM script' : 'ReactDOM is loaded before React'); },
      explain: 'ReactDOM is built on React: when its script runs it looks for the global `React`, so React must already be loaded.',
      fix: '<script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>\n<script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>' },
    { text: 'Babel standalone is loaded', pts: 1,
      test: c => c.ok(/@babel\/standalone/.test(c.code.html), 'no @babel/standalone script'),
      explain: 'Browsers do not understand JSX. Babel standalone translates `<h1>…</h1>` into `React.createElement(…)` in the browser.',
      fix: '<script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>' },
    { text: '`app.js` is loaded with `type="text/babel"`', pts: 2,
      test: c => { const t = (c.code.html.match(/<script[^>]*app\.js[^>]*>/i) || [''])[0]; return c.ok(/type=["']text\/babel["']/.test(t), t ? 'tag: ' + t : 'no <script> loads app.js'); },
      explain: 'Babel only translates scripts marked `type="text/babel"`. Without it the browser runs the JSX as plain JavaScript and stops at the first `<`.',
      fix: '<script type="text/babel" src="./app.js"></script>' },
    { text: 'The scripts come after `#root`', pts: 1,
      test: c => { const h = c.code.html; const r = h.search(/<div[^>]*id=["']root/), s = h.search(/<script[^>]*react/); return c.ok(r >= 0 && s > r, r < 0 ? 'no root element' : 'a React script comes before #root'); },
      explain: 'Scripts run as soon as they load. Putting them at the end of `<body>` means `#root` already exists when `app.js` looks for it.',
      fix: '<div id="root"></div>\n<!-- scripts below -->' },
    { text: 'Movie Night renders in the preview', pts: 3,
      test: c => c.ok(c.text('header h1') === 'Movie Night' && c.qa('.movie').length === 4, c.has('header h1') ? c.qa('.movie').length + ' movies rendered' : (c.errors[0] || 'nothing rendered')),
      explain: 'When React, ReactDOM, the root, and app.js are all in place, `root.render(<App />)` draws the app.',
      fix: '<!-- root, React, ReactDOM, Babel, app.js: in that order -->' }
  ]
},

/* =====================================================================  2  */
{
  id: 2, module: 'Module 4', topic: 'JSX, expressions, conditionals', edit: 'js', art: 'img/a02-movie-night.png',
  title: 'Write the Header in JSX',
  story: 'Build the Movie Night header and footer from data, not typed-in text: if a movie is added, the numbers must update on their own.',
  steps: [
    'In `App`, render `<h1>{ title }</h1>` inside the `<header>`: use the `title` variable, do not type the text.',
    'After the `<h1>`, render `<span className="stats">Movies: { movies.length }</span>`, but **only when** `showStats` is true (use `&&`).',
    'In the `<footer>`, use a **ternary** (`? :`): when `watchedCount === movies.length` show `All watched!`, otherwise `Watched 2 of 4` (built from `watchedCount` and `movies.length`).',
    'Remember: JSX uses `className`, not `class`.'
  ],
  practise: ['{ } expressions', '&&', '? :', 'className'],
  starter: {
    html: PAGE('Movie Night'), css: MN_CSS,
    js: `${MOVIES}
const title = "Movie Night";
const showStats = true;
const watchedCount = movies.filter(movie => movie.watched).length;

const App = () => {
  return (
    <div className="watchlist">
      <header>
        {/* 1. the h1 from title */}

        {/* 2. the stats badge, only when showStats is true */}

      </header>

      <footer>
        {/* 3. All watched! or Watched 2 of 4 */}

      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`
  },
  solution: { html: null, css: null,
    js: `${MOVIES}
const title = "Movie Night";
const showStats = true;
const watchedCount = movies.filter(movie => movie.watched).length;

const App = () => {
  return (
    <div className="watchlist">
      <header>
        {/* 1. the h1 from title */}
        <h1>{ title }</h1>

        {/* 2. the stats badge, only when showStats is true */}
        { showStats && <span className="stats">Movies: { movies.length }</span> }
      </header>

      <footer>
        {/* 3. All watched! or Watched 2 of 4 */}
        { watchedCount === movies.length
            ? "All watched!"
            : "Watched " + watchedCount + " of " + movies.length }
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
` },
  checks: [
    { text: 'The `<h1>` shows the `title` variable', pts: 2,
      test: c => c.ok(c.text('header h1') === 'Movie Night' && /<h1>\s*\{\s*title\s*\}\s*<\/h1>/.test(c.code.js), c.has('header h1') ? 'h1: “' + c.text('header h1') + '”' + (/\{\s*title\s*\}/.test(c.code.js) ? '' : ', but the text is typed in instead of { title }') : (c.errors[0] || 'no h1 in the header')),
      explain: 'Curly braces put a JavaScript expression into JSX. `{ title }` shows whatever the variable holds, so changing the data changes the page.',
      fix: '<h1>{ title }</h1>' },
    { text: 'The stats badge shows “Movies: 4” from `movies.length`', pts: 2,
      test: c => c.ok(c.text('.stats') === 'Movies: 4' && /movies\.length/.test(c.code.js.split('<footer')[0].split('const App')[1] || ''), c.has('.stats') ? 'badge: “' + c.text('.stats') + '”' : 'no .stats badge'),
      explain: '`movies.length` counts the array, so the badge stays right when a movie is added. Typing 4 would go out of date.',
      fix: '<span className="stats">Movies: { movies.length }</span>' },
    { text: 'The badge is shown with `showStats &&`', pts: 1,
      test: c => c.ok(/showStats\s*&&/.test(c.code.js), 'no “showStats &&” in your JSX'),
      explain: '`condition && <element>` renders the element only when the condition is true; when it is false React renders nothing.',
      fix: '{ showStats && <span className="stats">Movies: { movies.length }</span> }' },
    { text: 'The footer says “Watched 2 of 4” using a ternary', pts: 2,
      test: c => c.ok(c.text('footer') === 'Watched 2 of 4' && /\?[\s\S]*:/.test(c.code.js.split('<footer')[1] || ''), 'footer: “' + c.text('footer') + '”'),
      explain: '`condition ? A : B` is an expression, so it can go inside `{ }`. An `if` statement cannot.',
      fix: '{ watchedCount === movies.length\n    ? "All watched!"\n    : "Watched " + watchedCount + " of " + movies.length }' },
    { text: 'The numbers are not typed in', pts: 1,
      test: c => c.ok(c.has('.stats') && !/Movies:\s*4|of\s*4/.test(c.code.js), !c.has('.stats') ? 'no badge yet' : 'found a typed-in “4” in your JSX'),
      explain: 'Typed numbers do not change when the data does. Always build them from the array.',
      fix: '"Watched " + watchedCount + " of " + movies.length' },
    { text: 'JSX uses `className`, not `class`', pts: 1,
      test: c => c.ok(c.has('.stats') && !/\sclass=/.test(c.code.js) && !c.warnings.some(w => /Invalid DOM property `class`/.test(w)), !c.has('.stats') ? 'no element with className="stats" yet' : 'found class= in your JSX'),
      explain: '`class` is a reserved word in JavaScript, so JSX uses `className`. React warns in the console when it sees `class`.',
      fix: '<span className="stats">' }
  ]
},

/* =====================================================================  3  */
{
  id: 3, module: 'Module 4', topic: 'Components and props', edit: 'js', art: 'img/a03-props-flow.png',
  title: 'Build the Movie Component',
  story: 'Each movie row looks the same; only the data changes. Make a reusable `Movie` component and pass each movie’s details in as props.',
  steps: [
    'Write a component `Movie` that takes `props` and returns a `<div className="movie">` containing a `<div className="movie-info">`.',
    'Inside it, show `<span className="movie-title">{ props.title }</span>` and `<span className="movie-meta">{ props.year } · { props.genre }</span>`.',
    'In `App`, render `<Header title="Movie Night" totalMovies={ movies.length } />` (Header is given).',
    'Below it, render **two** `<Movie />` elements for `movies[0]` and `movies[1]`, passing `title`, `year`, and `genre` from the array.'
  ],
  practise: ['function components', 'props', 'composing components'],
  starter: {
    html: PAGE('Movie Night'), css: MN_CSS,
    js: `${MOVIES}
// Given: the header reads its text from props
const Header = (props) => {
  return (
    <header>
      <h1>{ props.title }</h1>
      <span className="stats">Movies: { props.totalMovies }</span>
    </header>
  );
};

// 1. and 2. the Movie component


const App = () => {
  return (
    <div className="watchlist">
      {/* 3. the Header, with title and totalMovies props */}

      {/* 4. two Movie elements: movies[0] and movies[1] */}

    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`
  },
  solution: { html: null, css: null,
    js: `${MOVIES}
// Given: the header reads its text from props
const Header = (props) => {
  return (
    <header>
      <h1>{ props.title }</h1>
      <span className="stats">Movies: { props.totalMovies }</span>
    </header>
  );
};

// 1. and 2. the Movie component
const Movie = (props) => {
  return (
    <div className="movie">
      <div className="movie-info">
        <span className="movie-title">{ props.title }</span>
        <span className="movie-meta">{ props.year } · { props.genre }</span>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="watchlist">
      {/* 3. the Header, with title and totalMovies props */}
      <Header title="Movie Night" totalMovies={ movies.length } />

      {/* 4. two Movie elements: movies[0] and movies[1] */}
      <Movie title={ movies[0].title } year={ movies[0].year } genre={ movies[0].genre } />
      <Movie title={ movies[1].title } year={ movies[1].year } genre={ movies[1].genre } />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
` },
  checks: [
    { text: 'A `Movie` component is defined and used', pts: 1,
      test: c => c.ok(/(const|function)\s+Movie\b/.test(c.code.js) && /<Movie[\s/>]/.test(c.code.js), /(const|function)\s+Movie\b/.test(c.code.js) ? 'Movie is defined but never rendered as <Movie />' : 'no component named Movie'),
      explain: 'A component is a function that returns JSX. Its name must start with a capital letter so JSX treats `<Movie />` as a component, not an HTML tag.',
      fix: 'const Movie = (props) => {\n  return ( … );\n};' },
    { text: 'The header shows “Movie Night” and “Movies: 4” through props', pts: 2,
      test: c => c.ok(c.text('header h1') === 'Movie Night' && c.text('.stats') === 'Movies: 4' && /totalMovies=\{\s*movies\.length\s*\}/.test(c.code.js), 'h1 “' + c.text('header h1') + '”, badge “' + c.text('.stats') + '”'),
      explain: 'Props are the attributes you write on a component. `Header` reads them as `props.title` and `props.totalMovies`.',
      fix: '<Header title="Movie Night" totalMovies={ movies.length } />' },
    { text: 'Two movie rows: Spirited Away and Inception', pts: 2,
      test: c => { const t = c.qa('.movie .movie-title').map(e => e.textContent.trim()); return c.ok(t.length === 2 && t[0] === 'Spirited Away' && t[1] === 'Inception', t.length ? 'titles: ' + t.join(', ') : 'no .movie rows'); },
      explain: 'The same component renders different data: each `<Movie />` receives its own props.',
      fix: '<Movie title={ movies[0].title } year={ movies[0].year } genre={ movies[0].genre } />' },
    { text: 'Each row shows the year and genre: “2001 · Animation”', pts: 2,
      test: c => c.ok(c.text('.movie .movie-meta') === '2001 · Animation', c.has('.movie-meta') ? 'first meta: “' + c.text('.movie .movie-meta') + '”' : 'no .movie-meta'),
      explain: 'Several expressions can sit in one element: `{ props.year } · { props.genre }`.',
      fix: '<span className="movie-meta">{ props.year } · { props.genre }</span>' },
    { text: 'The data comes from the array, not typed into the JSX', pts: 1,
      test: c => c.ok(c.qa('.movie').length > 0 && countOf(c.code.js, /Spirited Away/g) === 1 && countOf(c.code.js, /Inception/g) === 1, !c.qa('.movie').length ? 'no movies rendered yet' : 'the movie titles appear more than once in your code'),
      explain: 'Pass `movies[0].title` as a prop instead of typing "Spirited Away": then the component works for any movie.',
      fix: 'title={ movies[0].title }' }
  ]
},

/* =====================================================================  4  */
{
  id: 4, module: 'Module 4', topic: 'Lists with map() and keys', edit: 'js', art: 'img/a04-map.png',
  title: 'Render the Whole Watchlist with map()',
  story: 'Typing one `<Movie />` per film does not scale. Turn the array into a list of components with `map()`, and give React the keys it needs.',
  steps: [
    'In `App`, replace the comment with `{ props.movies.map(movie => <Movie … />) }`.',
    'Pass `title`, `year`, `genre`, `watched`, and `staffPick` from each `movie`.',
    'Give each `<Movie />` a `key` from the movie’s `id`: `key={ movie.id }`.',
    'Set `watchedCount` to the number of movies with `watched: true` (use `filter`), so the footer is right.'
  ],
  practise: ['map()', 'key', 'filter()', 'conditional badges'],
  starter: {
    html: PAGE('Movie Night'), css: MN_CSS,
    js: `${MOVIES}
const Header = (props) => (
  <header>
    <h1>{ props.title }</h1>
    <span className="stats">Movies: { props.totalMovies }</span>
  </header>
);

// Given: one row. The badges use && and ? :
const Movie = (props) => (
  <div className="movie">
    <div className="movie-info">
      <span className="movie-title">
        { props.title }
        { props.staffPick && <span className="badge badge-pick">STAFF PICK</span> }
      </span>
      <span className="movie-meta">
        { props.year } · { props.genre }
        { props.watched
            ? <span className="badge badge-watched">WATCHED</span>
            : <span className="badge badge-unwatched">NOT YET</span> }
      </span>
    </div>
  </div>
);

const Footer = (props) => (
  <footer>Watched { props.watchedCount } of { props.totalMovies } · Made with React</footer>
);

const App = (props) => {
  // 4. how many movies are watched?
  const watchedCount = 0;

  return (
    <div className="watchlist">
      <Header title="Movie Night" totalMovies={ props.movies.length } />

      {/* 1. to 3. one Movie per item, with a key */}

      <Footer watchedCount={ watchedCount } totalMovies={ props.movies.length } />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App movies={ movies } />);
`
  },
  solution: { html: null, css: null, js: null },
  checks: [
    { text: 'All four movies are rendered', pts: 2,
      test: c => c.ok(c.qa('.movie').length === 4, c.qa('.movie').length + ' movie row(s)' + (c.errors[0] ? ' (' + c.errors[0] + ')' : '')),
      explain: '`map()` calls your function once per item and returns a new array of `<Movie />` elements, which React renders in order.',
      fix: '{ props.movies.map(movie =>\n  <Movie key={ movie.id } title={ movie.title } … />\n) }' },
    { text: 'The list is built with `map()`, not typed four times', pts: 1,
      test: c => c.ok(/\.map\(/.test(c.code.js) && countOf(c.code.js, /<Movie[\s/>]/g) === 1, countOf(c.code.js, /<Movie[\s/>]/g) + ' <Movie> element(s) written in your code'),
      explain: 'With `map()` one line of JSX handles any number of movies, including ones added later.',
      fix: '{ props.movies.map(movie => <Movie … />) }' },
    { text: 'Every movie has a `key` from its `id` (no React warning)', pts: 2,
      test: c => { const warned = c.warnings.some(w => /unique "key"/.test(w)); return c.ok(c.qa('.movie').length > 0 && !warned && /key=\{\s*movie\.id/.test(c.code.js), warned ? 'React warned: each child in a list should have a unique "key" prop' : /key=/.test(c.code.js) ? 'the key is not movie.id' : 'no key'); },
      explain: 'Keys tell React which item is which between renders. Use a stable id from the data; array indexes break when items are added, removed, or sorted.',
      fix: '<Movie key={ movie.id } … />' },
    { text: 'Badges show: Spirited Away is a STAFF PICK and WATCHED; Coco is NOT YET', pts: 2,
      test: c => { const s = rowOf(c, 'Spirited Away'), k = rowOf(c, 'Coco'); return c.ok(!!s && !!k && /STAFF PICK/.test(s.textContent) && /WATCHED/.test(s.textContent) && /NOT YET/.test(k.textContent), s ? 'Spirited Away row: “' + s.textContent.trim().replace(/\s+/g, ' ') + '”' : 'movie rows missing'); },
      explain: 'The badges only work if you pass `watched` and `staffPick` down as props.',
      fix: '<Movie … watched={ movie.watched } staffPick={ movie.staffPick } />' },
    { text: 'The footer says “Watched 2 of 4”, counted with `filter`', pts: 2,
      test: c => c.ok(/Watched 2 of 4/.test(c.text('footer')) && /\.filter\(/.test(c.code.js), 'footer: “' + c.text('footer') + '”'),
      explain: '`filter()` keeps the items that pass a test; `.length` counts them.',
      fix: 'const watchedCount = props.movies.filter(movie => movie.watched).length;' }
  ]
},

/* =====================================================================  5  */
{
  id: 5, module: 'Module 5', topic: 'Class components and state', edit: 'js', art: 'img/a05-cafe-order.png',
  title: 'Count the Café Order with State',
  story: 'Alex’s Café needs an order tally: + and − change each item’s quantity and the header shows the order total. The menu row is given; you write the `App` class that owns the state.',
  steps: [
    'Write `class App extends React.Component` with `state = { items: this.props.items }`.',
    { text: 'Add an arrow-function method `handleQtyChange(delta, id)`. It asks React for new state based on the previous state: map over the items and replace only the one with that `id` by a copy with the new quantity (never below 0).',
      code: 'handleQtyChange = (delta, id) => {\n  this.setState(prevState => ({\n    items: prevState.items.map(item =>\n      item.id === id\n        ? { ...item, qty: Math.max(item.qty + delta, 0) }\n        : item\n    )\n  }));\n}' },
    'In `render()`, work out `orderTotal`: the sum of `price * qty`, with `.toFixed(2)`.',
    'Return the `<div className="menu">` with `<MenuHeader itemCount={…} orderTotal={orderTotal} />` and one `<MenuItem key={item.id} {...item} changeQty={this.handleQtyChange} />` per item.'
  ],
  practise: ['class components', 'this.state', 'setState(prevState => …)', 'immutable updates'],
  starter: {
    html: PAGE('Café Order Tally'), css: CAFE_CSS,
    js: `const menu = [
  { id: 1, name: "Espresso", price: 3.25, qty: 0 },
  { id: 2, name: "Maple Latte", price: 5.5, qty: 0 },
  { id: 3, name: "Smoked Salmon Bagel", price: 9.75, qty: 0 }
];

// Given
const MenuHeader = (props) => (
  <header>
    <h1>Alex's Café</h1>
    <span className="count">Items: { props.itemCount }</span>
    <span className="count order">Order: \${ props.orderTotal }</span>
  </header>
);

// Given: reports clicks back to App with props.changeQty(delta, id)
const MenuItem = (props) => (
  <div className="menu-item" data-id={ props.id }>
    <span className="item-name">{ props.name }</span>
    <span className="price">\${ props.price.toFixed(2) }</span>
    <div className="qty">
      <button className="qty-action minus" onClick={() => props.changeQty(-1, props.id)} disabled={ props.qty === 0 }>-</button>
      <span className="qty-count">{ props.qty }</span>
      <button className="qty-action plus" onClick={() => props.changeQty(1, props.id)}>+</button>
    </div>
  </div>
);

// 1. to 4. the App class


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App items={ menu } />);
`
  },
  solution: { html: null, css: null,
    js: `const menu = [
  { id: 1, name: "Espresso", price: 3.25, qty: 0 },
  { id: 2, name: "Maple Latte", price: 5.5, qty: 0 },
  { id: 3, name: "Smoked Salmon Bagel", price: 9.75, qty: 0 }
];

// Given
const MenuHeader = (props) => (
  <header>
    <h1>Alex's Café</h1>
    <span className="count">Items: { props.itemCount }</span>
    <span className="count order">Order: \${ props.orderTotal }</span>
  </header>
);

// Given: reports clicks back to App with props.changeQty(delta, id)
const MenuItem = (props) => (
  <div className="menu-item" data-id={ props.id }>
    <span className="item-name">{ props.name }</span>
    <span className="price">\${ props.price.toFixed(2) }</span>
    <div className="qty">
      <button className="qty-action minus" onClick={() => props.changeQty(-1, props.id)} disabled={ props.qty === 0 }>-</button>
      <span className="qty-count">{ props.qty }</span>
      <button className="qty-action plus" onClick={() => props.changeQty(1, props.id)}>+</button>
    </div>
  </div>
);

// 1. to 4. the App class
class App extends React.Component {
  state = {
    items: this.props.items
  };

  handleQtyChange = (delta, id) => {
    this.setState(prevState => ({
      items: prevState.items.map(item =>
        item.id === id
          ? { ...item, qty: Math.max(item.qty + delta, 0) }
          : item
      )
    }));
  }

  render() {
    const orderTotal = this.state.items
      .reduce((sum, item) => sum + item.price * item.qty, 0)
      .toFixed(2);

    return (
      <div className="menu">
        <MenuHeader itemCount={ this.state.items.length } orderTotal={ orderTotal } />
        { this.state.items.map(item =>
          <MenuItem key={ item.id } { ...item } changeQty={ this.handleQtyChange } />
        ) }
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App items={ menu } />);
` },
  checks: [
    { text: '`App` is a class that extends `React.Component` and renders the menu', pts: 1,
      test: c => c.ok(/class\s+App\s+extends\s+React\.Component/.test(c.code.js) && c.qa('.menu-item').length === 3, c.errors[0] || (c.qa('.menu-item').length + ' menu item(s) rendered')),
      explain: 'A class component keeps its data in `this.state` and draws it in `render()`.',
      fix: 'class App extends React.Component {\n  state = { items: this.props.items };\n  render() { … }\n}' },
    { text: 'Clicking + on Espresso shows 1 and an order of $3.25', pts: 3,
      test: async c => { c.click('.menu-item[data-id="1"] .plus'); await c.settle(); const q = c.text('.menu-item[data-id="1"] .qty-count'), t = c.text('.order'); return c.ok(q === '1' && t === 'Order: $3.25', 'Espresso shows ' + (q || '?') + ', header “' + t + '”'); },
      explain: '`setState` stores the new items and makes React call `render()` again, so the count and the total update together.',
      fix: 'handleQtyChange = (delta, id) => {\n  this.setState(prevState => ({ items: prevState.items.map(…) }));\n}' },
    { text: 'Two clicks on Maple Latte: 2, and the order becomes $14.25', pts: 2,
      test: async c => { c.click('.menu-item[data-id="2"] .plus'); await c.settle(); c.click('.menu-item[data-id="2"] .plus'); await c.settle(); const q = c.text('.menu-item[data-id="2"] .qty-count'), t = c.text('.order'); return c.ok(q === '2' && t === 'Order: $14.25', 'Maple Latte shows ' + (q || '?') + ', header “' + t + '”'); },
      explain: 'Only the item with the clicked `id` changes; the others are returned unchanged by `map()`.',
      fix: 'item.id === id ? { ...item, qty: Math.max(item.qty + delta, 0) } : item' },
    { text: 'The − button lowers the count again', pts: 1,
      test: async c => { c.click('.menu-item[data-id="2"] .minus'); await c.settle(); return c.ok(c.text('.menu-item[data-id="2"] .qty-count') === '1', 'Maple Latte shows ' + c.text('.menu-item[data-id="2"] .qty-count') + ' after −'); },
      explain: 'The same handler serves both buttons: `delta` is +1 or −1.',
      fix: 'onClick={() => props.changeQty(-1, props.id)}  // given' },
    { text: 'The total always shows two decimals (Maple Latte alone: $5.50)', pts: 1,
      test: async c => { c.click('.menu-item[data-id="1"] .minus'); await c.settle(); const t = c.text('.order'); return c.ok(t === 'Order: $5.50', 'header “' + t + '”'); },
      explain: 'Prices are money: `5.5` should read `5.50`. `toFixed(2)` turns the number into a string with exactly two decimals.',
      fix: 'const orderTotal = this.state.items\n  .reduce((sum, item) => sum + item.price * item.qty, 0)\n  .toFixed(2);' },
    { text: 'State is updated with `setState(prevState => …)`, never changed directly', pts: 1,
      test: c => c.ok(/setState\(\s*\(?\s*prev/.test(c.code.js) && !/this\.state\.\w+(\[[^\]]+\])?(\.\w+)*\s*(=(?!=)|\+\+|--|\+=|-=)/.test(c.code.js) && !/\.qty\s*(\+\+|--|\+=|-=)/.test(c.code.js), 'use this.setState(prevState => …) and build new objects with { ...item }'),
      explain: 'Changing `this.state` directly does not re-render. The updater form uses the latest state, which matters when updates happen quickly.',
      fix: 'this.setState(prevState => ({ items: … }))' },
    { text: 'Each menu item has a `key`', pts: 1,
      test: c => c.ok(c.qa('.menu-item').length > 0 && !c.warnings.some(w => /unique "key"/.test(w)), c.qa('.menu-item').length ? 'React warned about a missing key' : 'no menu items rendered yet'),
      explain: 'Lists of components need a stable `key`, such as the item’s `id`.',
      fix: '<MenuItem key={ item.id } … />' }
  ]
},

/* =====================================================================  6  */
{
  id: 6, module: 'Module 5', topic: 'Lifting state up', edit: 'js', art: 'img/a06-lift-state.png',
  title: 'Lift the Watched State into App',
  story: 'Each movie needs a “Mark watched” button, and the footer must count watched movies. The footer cannot see inside a `Movie`, so the state has to live in their common parent: `App`.',
  steps: [
    'In `App`, add `handleToggleWatched = (id) => { … }` that uses `setState(prevState => …)` to flip `watched` for the movie with that `id` (map + spread).',
    'Pass it to each movie: `<Movie … onToggle={ this.handleToggleWatched } />`.',
    'In `Movie`, add a `<button className="toggle">` that calls `props.onToggle(props.id)` when clicked. Its label is `Mark unwatched` when watched, otherwise `Mark watched`.',
    'The footer already counts from `this.state.movies`, so it updates on its own.'
  ],
  practise: ['lifting state', 'passing functions as props', 'events up, data down'],
  starter: {
    html: PAGE('Movie Night'), css: MN_CSS,
    js: `${MOVIES}
const Movie = (props) => (
  <div className="movie" data-id={ props.id }>
    <div className="movie-info">
      <span className="movie-title">{ props.title }</span>
      <span className="movie-meta">
        { props.year } · { props.genre }
        { props.watched
            ? <span className="badge badge-watched">WATCHED</span>
            : <span className="badge badge-unwatched">NOT YET</span> }
      </span>
    </div>
    {/* 3. the toggle button */}

  </div>
);

const Footer = (props) => (
  <footer>Watched { props.watchedCount } of { props.totalMovies }</footer>
);

class App extends React.Component {
  state = { movies: this.props.movies };

  // 1. handleToggleWatched


  render() {
    const watchedCount = this.state.movies.filter(movie => movie.watched).length;
    return (
      <div className="watchlist">
        <header><h1>Movie Night</h1></header>
        { this.state.movies.map(movie =>
          <Movie
            key={ movie.id }
            { ...movie }
            /* 2. pass the handler as onToggle */
          />
        ) }
        <Footer watchedCount={ watchedCount } totalMovies={ this.state.movies.length } />
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App movies={ movies } />);
`
  },
  solution: { html: null, css: null,
    js: `${MOVIES}
const Movie = (props) => (
  <div className="movie" data-id={ props.id }>
    <div className="movie-info">
      <span className="movie-title">{ props.title }</span>
      <span className="movie-meta">
        { props.year } · { props.genre }
        { props.watched
            ? <span className="badge badge-watched">WATCHED</span>
            : <span className="badge badge-unwatched">NOT YET</span> }
      </span>
    </div>
    {/* 3. the toggle button */}
    <button className="toggle" onClick={() => props.onToggle(props.id)}>
      { props.watched ? "Mark unwatched" : "Mark watched" }
    </button>
  </div>
);

const Footer = (props) => (
  <footer>Watched { props.watchedCount } of { props.totalMovies }</footer>
);

class App extends React.Component {
  state = { movies: this.props.movies };

  // 1. handleToggleWatched
  handleToggleWatched = (id) => {
    this.setState(prevState => ({
      movies: prevState.movies.map(movie =>
        movie.id === id ? { ...movie, watched: !movie.watched } : movie
      )
    }));
  }

  render() {
    const watchedCount = this.state.movies.filter(movie => movie.watched).length;
    return (
      <div className="watchlist">
        <header><h1>Movie Night</h1></header>
        { this.state.movies.map(movie =>
          <Movie
            key={ movie.id }
            { ...movie }
            onToggle={ this.handleToggleWatched }
          />
        ) }
        <Footer watchedCount={ watchedCount } totalMovies={ this.state.movies.length } />
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App movies={ movies } />);
` },
  checks: [
    { text: 'Each movie has a toggle button with the right label', pts: 1,
      test: c => { const b = c.qa('.movie .toggle').map(x => x.textContent.trim()); return c.ok(b.length === 4 && b[0] === 'Mark unwatched' && b[3] === 'Mark watched', b.length ? 'labels: ' + b.join(' | ') : (c.errors[0] || 'no .toggle buttons')); },
      explain: 'A ternary picks the label from the `watched` prop.',
      fix: '{ props.watched ? "Mark unwatched" : "Mark watched" }' },
    { text: 'The page loads without errors and the footer says “Watched 2 of 4”', pts: 1,
      test: c => c.ok(c.qa('.movie .toggle').length === 4 && !c.errors.length && c.text('footer') === 'Watched 2 of 4', c.errors[0] || (c.qa('.movie .toggle').length ? 'footer: “' + c.text('footer') + '”' : 'no toggle buttons yet')),
      explain: 'Writing `onClick={ props.onToggle(props.id) }` calls the function while rendering, which sets state during render and crashes. Pass a function: `onClick={() => props.onToggle(props.id)}`.',
      fix: 'onClick={() => props.onToggle(props.id)}' },
    { text: 'Clicking Coco’s button marks it watched and the footer says 3 of 4', pts: 3,
      test: async c => { const r = rowOf(c, 'Coco'); if (!r || !r.querySelector('.toggle')) return c.ok(false, 'no toggle button on Coco'); c.click(r.querySelector('.toggle')); await c.settle(); const r2 = rowOf(c, 'Coco'); return c.ok(/WATCHED/.test(r2.textContent) && !/NOT YET/.test(r2.textContent) && c.text('footer') === 'Watched 3 of 4', 'Coco: ' + (/NOT YET/.test(r2.textContent) ? 'NOT YET' : 'WATCHED') + ', footer “' + c.text('footer') + '”'); },
      explain: 'The child reports the click up (`props.onToggle(id)`); App updates its state; the new data flows down to both the row and the footer.',
      fix: 'handleToggleWatched = (id) => {\n  this.setState(prevState => ({\n    movies: prevState.movies.map(movie =>\n      movie.id === id ? { ...movie, watched: !movie.watched } : movie\n    )\n  }));\n}' },
    { text: 'Clicking Inception’s button marks it unwatched (2 of 4 again)', pts: 2,
      test: async c => { const r = rowOf(c, 'Inception'); if (!r || !r.querySelector('.toggle')) return c.ok(false, 'no toggle button on Inception'); c.click(r.querySelector('.toggle')); await c.settle(); const r2 = rowOf(c, 'Inception'); return c.ok(/NOT YET/.test(r2.textContent) && c.text('footer') === 'Watched 2 of 4', 'Inception: ' + (/NOT YET/.test(r2.textContent) ? 'NOT YET' : 'WATCHED') + ', footer “' + c.text('footer') + '”'); },
      explain: '`!movie.watched` flips true to false and back.',
      fix: '{ ...movie, watched: !movie.watched }' },
    { text: 'The state stays in App (Movie has no state of its own)', pts: 1,
      test: c => c.ok(/handleToggleWatched\s*=/.test(c.code.js) && !/class\s+Movie/.test(c.code.js) && !/useState/.test(c.code.js) && countOf(c.code.js, /state\s*=\s*\{/g) === 1, !/handleToggleWatched\s*=/.test(c.code.js) ? 'no handleToggleWatched in App yet' : 'state found outside App'),
      explain: 'One source of truth: if each Movie kept its own `watched` state, the footer could never know about it.',
      fix: '// keep state = { movies } in App only' },
    { text: 'The update copies objects instead of changing them', pts: 1,
      test: c => c.ok(/\.\.\.\s*movie\s*,/.test(c.code.js) && !/\.watched\s*=\s*!/.test(c.code.js), 'use { ...movie, watched: !movie.watched }'),
      explain: 'React compares old and new objects to decide what to re-render. Changing the old object in place hides the change.',
      fix: '{ ...movie, watched: !movie.watched }' }
  ]
},

/* =====================================================================  7  */
{
  id: 7, module: 'Module 6', topic: 'useState and controlled inputs', edit: 'js', art: 'img/a07-controlled.png',
  title: 'Add Movies with a Controlled Form',
  story: 'Movie Night moves to function components and hooks. Add a small form that adds a movie to the list, with the text box controlled by React state.',
  steps: [
    'In `App`, create two pieces of state: `const [movies, setMovies] = React.useState(initialMovies);` and `const [title, setTitle] = React.useState("");`.',
    'Make the input controlled: `value={ title }` and `onChange={ e => setTitle(e.target.value) }`.',
    { text: 'Write `handleSubmit`. It stops the page reload, ignores a blank title, adds a new movie to a **new** array, and clears the box. Fill in the `…` parts:',
      code: 'const handleSubmit = (e) => {\n  e.preventDefault();\n  if (!title.trim()) return;\n  const newMovie = { id: Date.now(), title: …, year: 2026, genre: "New" };\n  setMovies([...movies, …]);\n  setTitle(…);\n};' },
    'Connect it with `<form className="add" onSubmit={ handleSubmit }>`, show `{ movies.length }` in the badge, and render the list with `movies.map`.'
  ],
  practise: ['useState', 'controlled inputs', 'onSubmit + preventDefault', 'spread to add'],
  starter: {
    html: PAGE('Movie Night'), css: MN_CSS,
    js: `const initialMovies = [
  { id: 1, title: "Spirited Away", year: 2001, genre: "Animation" },
  { id: 2, title: "Inception", year: 2010, genre: "Sci-Fi" },
  { id: 3, title: "The Grand Budapest Hotel", year: 2014, genre: "Comedy" },
  { id: 4, title: "Coco", year: 2017, genre: "Animation" }
];

const Movie = (props) => (
  <div className="movie">
    <div className="movie-info">
      <span className="movie-title">{ props.title }</span>
      <span className="movie-meta">{ props.year } · { props.genre }</span>
    </div>
  </div>
);

const App = () => {
  // 1. state for the list and for the text box


  // 3. handleSubmit


  return (
    <div className="watchlist">
      <header>
        <h1>Movie Night</h1>
        <span className="stats">Movies: {/* movies.length */}</span>
      </header>

      {/* 2. and 4. the controlled form */}
      <form className="add">
        <input id="newTitle" placeholder="Movie title" />
        <button className="primary" type="submit">Add movie</button>
      </form>

      {/* the list: map over movies */}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`
  },
  solution: { html: null, css: null,
    js: `const initialMovies = [
  { id: 1, title: "Spirited Away", year: 2001, genre: "Animation" },
  { id: 2, title: "Inception", year: 2010, genre: "Sci-Fi" },
  { id: 3, title: "The Grand Budapest Hotel", year: 2014, genre: "Comedy" },
  { id: 4, title: "Coco", year: 2017, genre: "Animation" }
];

const Movie = (props) => (
  <div className="movie">
    <div className="movie-info">
      <span className="movie-title">{ props.title }</span>
      <span className="movie-meta">{ props.year } · { props.genre }</span>
    </div>
  </div>
);

const App = () => {
  // 1. state for the list and for the text box
  const [movies, setMovies] = React.useState(initialMovies);
  const [title, setTitle] = React.useState("");

  // 3. handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newMovie = { id: Date.now(), title: title.trim(), year: 2026, genre: "New" };
    setMovies([...movies, newMovie]);
    setTitle("");
  };

  return (
    <div className="watchlist">
      <header>
        <h1>Movie Night</h1>
        <span className="stats">Movies: { movies.length }</span>
      </header>

      {/* 2. and 4. the controlled form */}
      <form className="add" onSubmit={ handleSubmit }>
        <input id="newTitle" placeholder="Movie title" value={ title } onChange={ e => setTitle(e.target.value) } />
        <button className="primary" type="submit">Add movie</button>
      </form>

      {/* the list: map over movies */}
      { movies.map(movie => <Movie key={ movie.id } { ...movie } />) }
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
` },
  checks: [
    { text: 'Four movies and “Movies: 4” on load, using `useState`', pts: 1,
      test: c => c.ok(c.qa('.movie').length === 4 && c.text('.stats') === 'Movies: 4' && /useState/.test(c.code.js), c.errors[0] || (c.qa('.movie').length + ' movies, badge “' + c.text('.stats') + '”')),
      explain: '`useState(initial)` returns the current value and a setter. Calling the setter re-renders the component.',
      fix: 'const [movies, setMovies] = React.useState(initialMovies);' },
    { text: 'The input is controlled by state', pts: 2,
      test: c => c.ok(/value=\{\s*title\s*\}/.test(c.code.js) && /onChange=/.test(c.code.js), 'the input needs value={ title } and an onChange'),
      explain: 'With `value` and `onChange`, React state is the single source of truth: every keystroke updates state, and state decides what the box shows.',
      fix: '<input id="newTitle" value={ title } onChange={ e => setTitle(e.target.value) } />' },
    { text: 'Typing “Arrival” and submitting adds it to the end of the list', pts: 3,
      test: async c => { c.type('#newTitle', 'Arrival'); await c.settle(); c.submit('form.add'); await c.settle(); const t = c.qa('.movie .movie-title').map(e => e.textContent.trim()); return c.ok(t.length === 5 && t[4] === 'Arrival' && c.text('.stats') === 'Movies: 5', 'titles: ' + (t.join(', ') || 'none') + '; badge “' + c.text('.stats') + '”'); },
      explain: '`setMovies([...movies, newMovie])` makes a new array with everything that was there plus the new movie. React needs a new array to notice the change.',
      fix: 'setMovies([...movies, newMovie]);' },
    { text: 'The box is cleared after adding', pts: 1,
      test: c => { const i = c.q('#newTitle'); return c.ok(!!i && i.value === '' && c.qa('.movie').length === 5, i ? (c.qa('.movie').length === 5 ? 'the box still says “' + i.value + '”' : 'nothing was added') : 'no #newTitle'); },
      explain: 'Because the input is controlled, `setTitle("")` empties it.',
      fix: 'setTitle("");' },
    { text: 'Submitting an empty or blank title adds nothing', pts: 1,
      test: async c => { const n = c.qa('.movie').length; c.type('#newTitle', '   '); await c.settle(); c.submit('form.add'); await c.settle(); return c.ok(n === 5 && c.qa('.movie').length === 5, c.qa('.movie').length + ' movies after submitting spaces'); },
      explain: '`title.trim()` removes spaces; an empty string is falsy, so `if (!title.trim()) return;` stops early.',
      fix: 'if (!title.trim()) return;' },
    { text: 'The form uses `onSubmit` with `preventDefault()`', pts: 1,
      test: c => c.ok(/onSubmit=/.test(c.code.js) && /preventDefault\(\)/.test(c.code.js), 'need onSubmit={ handleSubmit } and e.preventDefault()'),
      explain: 'A form normally reloads the page on submit, which would wipe the app’s state.',
      fix: 'e.preventDefault();' }
  ]
},

/* =====================================================================  8  */
{
  id: 8, module: 'Module 6', topic: 'useEffect and useRef', edit: 'js', art: 'img/a08-cleanup.png',
  title: 'Effects: Title, Focus, and a Countdown',
  story: 'Three small side effects for Movie Night: keep the browser tab title up to date, put the cursor in the search box on load, and show a countdown that stops cleanly when hidden.',
  steps: [
    { text: 'In `App`, add an effect that sets the browser tab title to `Movie Night (2/4)` (watched / total). The array at the end lists what the effect depends on, so it re-runs when `watchedCount` changes:',
      code: 'React.useEffect(() => {\n  document.title = "Movie Night (" + … + "/" + … + ")";\n}, [watchedCount]);' },
    'Create `const searchRef = React.useRef(null);`, attach it with `ref={ searchRef }` on the search input, and focus it once after the first render (an effect with `[]`).',
    { text: 'In `Countdown`, start a timer in an effect that lowers `seconds` by 1 every second, and **return a cleanup** function. React calls the cleanup when the component disappears:',
      code: 'React.useEffect(() => {\n  const id = setInterval(() => setSeconds(s => s - 1), 1000);\n  return () => …;   // stop the timer\n}, []);' },
    'The given “Hide countdown” button unmounts `Countdown`; with the cleanup, its timer stops.'
  ],
  practise: ['useEffect + dependencies', 'cleanup functions', 'useRef', 'document.title'],
  starter: {
    html: PAGE('Movie Night', `    <!-- lab helper (given): counts running timers so the checks can see your cleanup -->
    <script>
      window.__timers = 0;
      const _si = window.setInterval, _ci = window.clearInterval, _live = new Set();
      window.setInterval = function () { const id = _si.apply(window, arguments); _live.add(id); window.__timers = _live.size; return id; };
      window.clearInterval = function (id) { _live.delete(id); window.__timers = _live.size; return _ci.call(window, id); };
    </script>
`), css: MN_CSS,
    js: `const movies = [
  { id: 1, title: "Spirited Away", watched: true },
  { id: 2, title: "Inception", watched: true },
  { id: 3, title: "The Grand Budapest Hotel", watched: false },
  { id: 4, title: "Coco", watched: false }
];

const Countdown = () => {
  const [seconds, setSeconds] = React.useState(10);

  // 3. start an interval; return a cleanup that clears it


  return <div className="countdown">Movie starts in <span id="secs">{ seconds }</span></div>;
};

const App = () => {
  const [list, setList] = React.useState(movies);
  const [showCountdown, setShowCountdown] = React.useState(true);
  const watchedCount = list.filter(m => m.watched).length;

  // 1. keep document.title up to date


  // 2. a ref for the search box, focused once after the first render


  const toggle = (id) => setList(list.map(m => m.id === id ? { ...m, watched: !m.watched } : m));

  return (
    <div className="watchlist">
      <header><h1>Movie Night</h1></header>
      { showCountdown && <Countdown /> }
      <form className="add" onSubmit={ e => e.preventDefault() }>
        <input id="search" placeholder="Search movies" />
        <button type="button" className="primary" id="hide" onClick={ () => setShowCountdown(false) }>Hide countdown</button>
      </form>
      { list.map(m =>
        <div className="movie" key={ m.id }>
          <div className="movie-info"><span className="movie-title">{ m.title }</span></div>
          <button className="toggle" data-id={ m.id } onClick={ () => toggle(m.id) }>{ m.watched ? "Watched" : "Not yet" }</button>
        </div>
      ) }
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`
  },
  solution: { html: null, css: null,
    js: `const movies = [
  { id: 1, title: "Spirited Away", watched: true },
  { id: 2, title: "Inception", watched: true },
  { id: 3, title: "The Grand Budapest Hotel", watched: false },
  { id: 4, title: "Coco", watched: false }
];

const Countdown = () => {
  const [seconds, setSeconds] = React.useState(10);

  // 3. start an interval; return a cleanup that clears it
  React.useEffect(() => {
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <div className="countdown">Movie starts in <span id="secs">{ seconds }</span></div>;
};

const App = () => {
  const [list, setList] = React.useState(movies);
  const [showCountdown, setShowCountdown] = React.useState(true);
  const watchedCount = list.filter(m => m.watched).length;

  // 1. keep document.title up to date
  React.useEffect(() => {
    document.title = "Movie Night (" + watchedCount + "/" + list.length + ")";
  }, [watchedCount]);

  // 2. a ref for the search box, focused once after the first render
  const searchRef = React.useRef(null);
  React.useEffect(() => {
    searchRef.current.focus();
  }, []);

  const toggle = (id) => setList(list.map(m => m.id === id ? { ...m, watched: !m.watched } : m));

  return (
    <div className="watchlist">
      <header><h1>Movie Night</h1></header>
      { showCountdown && <Countdown /> }
      <form className="add" onSubmit={ e => e.preventDefault() }>
        <input id="search" placeholder="Search movies" ref={ searchRef } />
        <button type="button" className="primary" id="hide" onClick={ () => setShowCountdown(false) }>Hide countdown</button>
      </form>
      { list.map(m =>
        <div className="movie" key={ m.id }>
          <div className="movie-info"><span className="movie-title">{ m.title }</span></div>
          <button className="toggle" data-id={ m.id } onClick={ () => toggle(m.id) }>{ m.watched ? "Watched" : "Not yet" }</button>
        </div>
      ) }
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
` },
  checks: [
    { text: 'The tab title reads “Movie Night (2/4)”', pts: 2,
      test: c => c.ok(c.doc.title === 'Movie Night (2/4)', 'document.title is “' + c.doc.title + '”' + (c.errors[0] ? ' (' + c.errors[0] + ')' : '')),
      explain: 'Changing `document.title` is a side effect: it touches something outside React, so it belongs in `useEffect`, which runs after the render.',
      fix: 'React.useEffect(() => {\n  document.title = "Movie Night (" + watchedCount + "/" + list.length + ")";\n}, [watchedCount]);' },
    { text: 'The title updates when a movie is toggled (3/4)', pts: 2,
      test: async c => { c.click('.toggle[data-id="3"]'); await c.settle(); return c.ok(c.doc.title === 'Movie Night (3/4)', 'after toggling: “' + c.doc.title + '”'); },
      explain: 'The dependency array `[watchedCount]` tells React to run the effect again whenever that value changes.',
      fix: '}, [watchedCount]);' },
    { text: 'The search box has the focus after the first render, using `useRef`', pts: 2,
      test: c => { const a = c.focused(); return c.ok(a && a.id === 'search' && /useRef/.test(c.code.js), 'focused element: ' + (a && a.id ? '#' + a.id : a ? a.tagName.toLowerCase() : 'none')); },
      explain: '`useRef` gives you the real DOM element in `ref.current`. An effect with `[]` runs once, after the element exists.',
      fix: 'const searchRef = React.useRef(null);\nReact.useEffect(() => { searchRef.current.focus(); }, []);\n<input id="search" ref={ searchRef } />' },
    { text: 'The countdown ticks down every second', pts: 1,
      test: async c => { const a = +c.text('#secs'); await c.settle(1150); const b = +c.text('#secs'); return c.ok(b < a, 'went from ' + a + ' to ' + b + ' in about one second'); },
      explain: '`setInterval` calls your function every 1000 ms; `setSeconds(s => s - 1)` always uses the latest value.',
      fix: 'const id = setInterval(() => setSeconds(s => s - 1), 1000);' },
    { text: 'Hiding the countdown stops its timer (cleanup)', pts: 3,
      test: async c => { const before = c.win.__timers; c.click('#hide'); await c.settle(); const after = c.win.__timers; return c.ok(before >= 1 && after === 0 && !c.has('.countdown'), 'running timers: ' + before + ' before hiding, ' + after + ' after'); },
      explain: 'When a component unmounts, React runs the function your effect returned. Without `clearInterval`, the timer keeps running and tries to update a component that is gone.',
      fix: 'return () => clearInterval(id);' }
  ]
},

/* =====================================================================  9  */
{
  id: 9, module: 'Module 6', topic: 'useContext', edit: 'js', art: 'img/a09-dark.png',
  title: 'Share a Light/Dark Theme with Context',
  story: 'Movie Night gets a dark mode. The theme is needed by the header button and by the outer box, and later by more components. Instead of passing props through every level, share it with context.',
  steps: [
    'Create the context outside the components: `const ThemeContext = React.createContext(null);`.',
    'In `App`, keep `const [theme, setTheme] = React.useState("light");` and a `toggleTheme` that switches between `"light"` and `"dark"`.',
    'Wrap the app in `<ThemeContext.Provider value={{ theme, toggleTheme }}>`, and give the outer box `className={ "watchlist " + theme }`.',
    'In `Header`, read the context with `React.useContext(ThemeContext)` (no props), and show a `<button className="theme-btn">` labelled `Dark` in light mode and `Light` in dark mode that calls `toggleTheme`.'
  ],
  practise: ['createContext', 'Provider', 'useContext', 'avoiding prop drilling'],
  starter: {
    html: PAGE('Movie Night'), css: MN_CSS,
    js: `${MOVIES}
// 1. the context


const Header = () => {
  // 4. read theme and toggleTheme from the context

  return (
    <header>
      <h1>Movie Night</h1>
      {/* 4. the theme button */}
    </header>
  );
};

const App = () => {
  // 2. theme state and toggleTheme


  return (
    // 3. the Provider around everything, and the theme class on the box
    <div className="watchlist">
      <Header />
      { movies.map(m =>
        <div className="movie" key={ m.id }>
          <div className="movie-info"><span className="movie-title">{ m.title }</span></div>
        </div>
      ) }
      <footer>Made with React</footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`
  },
  solution: { html: null, css: null,
    js: `${MOVIES}
// 1. the context
const ThemeContext = React.createContext(null);

const Header = () => {
  // 4. read theme and toggleTheme from the context
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  return (
    <header>
      <h1>Movie Night</h1>
      {/* 4. the theme button */}
      <button className="theme-btn" onClick={ toggleTheme }>{ theme === "light" ? "Dark" : "Light" }</button>
    </header>
  );
};

const App = () => {
  // 2. theme state and toggleTheme
  const [theme, setTheme] = React.useState("light");
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    // 3. the Provider around everything, and the theme class on the box
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={ "watchlist " + theme }>
        <Header />
        { movies.map(m =>
          <div className="movie" key={ m.id }>
            <div className="movie-info"><span className="movie-title">{ m.title }</span></div>
          </div>
        ) }
        <footer>Made with React</footer>
      </div>
    </ThemeContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
` },
  checks: [
    { text: 'A context is created and provided around the app', pts: 2,
      test: c => c.ok(/createContext\(/.test(c.code.js) && /<ThemeContext\.Provider\s+value=/.test(c.code.js) && !c.errors.length, c.errors[0] || 'need React.createContext() and <ThemeContext.Provider value={…}>'),
      explain: 'The Provider makes its `value` available to every component inside it, however deep.',
      fix: '<ThemeContext.Provider value={{ theme, toggleTheme }}>\n  …\n</ThemeContext.Provider>' },
    { text: 'The app starts light, with a “Dark” button', pts: 1,
      test: c => c.ok(c.q('.watchlist') && c.q('.watchlist').classList.contains('light') && c.text('.theme-btn') === 'Dark', 'box classes: “' + (c.q('.watchlist') ? c.q('.watchlist').className : 'none') + '”, button “' + c.text('.theme-btn') + '”'),
      explain: 'The theme class on the outer box lets the given CSS style light and dark.',
      fix: '<div className={ "watchlist " + theme }>' },
    { text: 'Clicking the button switches to dark (button now says “Light”)', pts: 3,
      test: async c => { if (!c.has('.theme-btn')) return c.ok(false, 'no .theme-btn button'); c.click('.theme-btn'); await c.settle(); const box = c.q('.watchlist'); return c.ok(box && box.classList.contains('dark') && c.text('.theme-btn') === 'Light' && c.cs('.watchlist', 'background-color') === 'rgb(22, 36, 58)', 'box classes: “' + (box ? box.className : 'none') + '”, button “' + c.text('.theme-btn') + '”'); },
      explain: 'The Header calls `toggleTheme` from context; App’s state changes; every component that reads the context re-renders.',
      fix: 'const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");' },
    { text: 'Clicking again switches back to light', pts: 1,
      test: async c => { if (!c.has('.theme-btn')) return c.ok(false, 'no .theme-btn button'); const wasDark = c.q('.watchlist').classList.contains('dark'); c.click('.theme-btn'); await c.settle(); return c.ok(wasDark && c.q('.watchlist').classList.contains('light'), 'box classes: “' + c.q('.watchlist').className + '”'); },
      explain: 'A toggle must work both ways.',
      fix: 'theme === "light" ? "dark" : "light"' },
    { text: 'Header reads the theme with `useContext`, not props', pts: 2,
      test: c => c.ok(/useContext\(\s*ThemeContext\s*\)/.test(c.code.js) && !/<Header[^>]*\b(theme|toggleTheme)=/.test(c.code.js), /<Header[^>]*\b(theme|toggleTheme)=/.test(c.code.js) ? 'Header still receives the theme as a prop' : 'no useContext(ThemeContext)'),
      explain: 'That is the point of context: no prop drilling. Any component can call `useContext` and get the value straight from the nearest Provider.',
      fix: 'const { theme, toggleTheme } = React.useContext(ThemeContext);' }
  ]
},

/* =====================================================================  10 */
{
  id: 10, module: 'Module 7', topic: 'React Router', edit: 'js', art: 'img/a10-route-map.png',
  title: 'Route to a Movie Details Page',
  story: 'Movie Night gets pages: the watchlist at `/`, a details page for each movie at `/movies/:id`, and a “not found” page for anything else.',
  steps: [
    { text: 'In `App`, inside the given `<MemoryRouter>`, add the routes. Each `<Route>` pairs an address (`path`) with the page to show (`element`); `:id` is a placeholder, and `*` matches anything else:',
      code: '<Routes>\n  <Route path="/" element={ <MovieList /> } />\n  <Route path="/movies/:id" element={ … } />\n  <Route path="*" element={ … } />\n</Routes>' },
    'In `MovieList`, make each title a `<Link className="movie-link" to={ "/movies/" + movie.id }>` (not an `<a href>`).',
    'In `MovieDetail`, read the id with `const { id } = useParams();`, find the movie (`movies.find(m => m.id === Number(id))`), and show `<h2>{ movie.title }</h2>`, a `<p>` with the year and genre, and `<Link to="/">← Back to the watchlist</Link>`.',
    'Click a movie in the preview, then the back link.'
  ],
  practise: ['Routes and Route', 'Link', 'useParams', 'catch-all routes'],
  starter: {
    html: PAGE('Movie Night', ROUTER_TAGS + '\n'), css: MN_CSS,
    js: `// React Router from the CDN (in a Vite app: import { … } from "react-router")
const { MemoryRouter, Routes, Route, Link, useParams } = ReactRouterDOM;

${MOVIES}
// 2. links to each movie
const MovieList = () => (
  <div>
    { movies.map(movie =>
      <span key={ movie.id } className="movie-link">{ movie.title }</span>
    ) }
  </div>
);

// 3. the details page
const MovieDetail = () => {
  return <div className="detail"></div>;
};

const NotFound = () => <div className="detail"><h2>Page not found</h2><Link to="/">Back home</Link></div>;

const App = () => (
  // MemoryRouter keeps the address in memory: the lab preview has no address bar.
  // In your Vite project you use <BrowserRouter> the same way.
  <MemoryRouter>
    <div className="watchlist">
      <header><h1>Movie Night</h1></header>
      {/* 1. the routes */}

    </div>
  </MemoryRouter>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`
  },
  solution: { html: null, css: null,
    js: `// React Router from the CDN (in a Vite app: import { … } from "react-router")
const { MemoryRouter, Routes, Route, Link, useParams } = ReactRouterDOM;

${MOVIES}
// 2. links to each movie
const MovieList = () => (
  <div>
    { movies.map(movie =>
      <Link key={ movie.id } className="movie-link" to={ "/movies/" + movie.id }>{ movie.title }</Link>
    ) }
  </div>
);

// 3. the details page
const MovieDetail = () => {
  const { id } = useParams();
  const movie = movies.find(m => m.id === Number(id));
  return (
    <div className="detail">
      <h2>{ movie.title }</h2>
      <p>{ movie.year } · { movie.genre }</p>
      <Link to="/">← Back to the watchlist</Link>
    </div>
  );
};

const NotFound = () => <div className="detail"><h2>Page not found</h2><Link to="/">Back home</Link></div>;

const App = () => (
  // MemoryRouter keeps the address in memory: the lab preview has no address bar.
  // In your Vite project you use <BrowserRouter> the same way.
  <MemoryRouter>
    <div className="watchlist">
      <header><h1>Movie Night</h1></header>
      {/* 1. the routes */}
      <Routes>
        <Route path="/" element={ <MovieList /> } />
        <Route path="/movies/:id" element={ <MovieDetail /> } />
        <Route path="*" element={ <NotFound /> } />
      </Routes>
    </div>
  </MemoryRouter>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
` },
  checks: [
    { text: 'The home route shows four movie links', pts: 2,
      test: c => { const a = c.qa('a.movie-link'); return c.ok(a.length === 4, c.errors[0] || (a.length + ' link(s) with class movie-link')); },
      explain: '`<Route path="/" element={ <MovieList /> } />` renders the list when the address is `/`. `<Link>` renders an `<a>` that React Router controls.',
      fix: '<Routes>\n  <Route path="/" element={ <MovieList /> } />\n  …\n</Routes>' },
    { text: 'Links use `<Link to>`, not `<a href>`', pts: 1,
      test: c => c.ok(/<Link[^>]*\bto=\{\s*["']\/movies\/["']\s*\+\s*movie\.id/.test(c.code.js) || /<Link[^>]*\bto=\{\s*`\/movies\/\$\{\s*movie\.id\s*\}`/.test(c.code.js), 'no <Link to={ "/movies/" + movie.id }> in MovieList'),
      explain: 'An `<a href>` reloads the whole page and loses React’s state. `<Link>` changes the route without a reload.',
      fix: '<Link className="movie-link" to={ "/movies/" + movie.id }>{ movie.title }</Link>' },
    { text: 'Clicking The Grand Budapest Hotel opens its details page', pts: 3,
      test: async c => { const a = c.qa('a.movie-link').find(x => /Grand Budapest/.test(x.textContent)); if (!a) return c.ok(false, 'no link to The Grand Budapest Hotel'); c.click(a); await c.settle(80); return c.ok(c.text('.detail h2') === 'The Grand Budapest Hotel' && /2014/.test(c.text('.detail p')) && !c.has('a.movie-link'), c.has('.detail h2') ? 'details page: “' + c.text('.detail h2') + '” / “' + c.text('.detail p') + '”' : (c.errors[0] || 'no details page after clicking')); },
      explain: '`path="/movies/:id"` matches `/movies/3`; `useParams()` returns `{ id: "3" }`. The id is a string, so convert it with `Number()` before comparing.',
      fix: 'const { id } = useParams();\nconst movie = movies.find(m => m.id === Number(id));' },
    { text: 'The back link returns to the watchlist', pts: 2,
      test: async c => { const a = c.qa('.detail a').find(x => /back/i.test(x.textContent)); if (!a) return c.ok(false, 'no back link on the details page'); c.click(a); await c.settle(80); return c.ok(c.qa('a.movie-link').length === 4, c.qa('a.movie-link').length + ' movie links after going back'); },
      explain: '`<Link to="/">` navigates back to the home route.',
      fix: '<Link to="/">← Back to the watchlist</Link>' },
    { text: 'The details page uses `useParams`, and there is a catch-all route', pts: 2,
      test: c => c.ok(/useParams\(\)/.test(c.code.js) && /path=["']\*["']/.test(c.code.js), !/path=["']\*["']/.test(c.code.js) ? 'no <Route path="*">' : 'MovieDetail does not call useParams()'),
      explain: '`path="*"` matches any address no other route matched, so visitors see “Page not found” instead of a blank page.',
      fix: '<Route path="*" element={ <NotFound /> } />' }
  ]
}
];

/* Files the student does not edit are the same in starter and solution. */
ACTIVITIES.forEach(a => { for (const f of ['html', 'css', 'js']) if (a.solution[f] == null && a.starter[f] != null) a.solution[f] = a.starter[f]; });

/* Activity 4's proper code: the starter with its gaps filled */
(() => {
  const a = ACTIVITIES[3];
  a.solution.js = a.starter.js
    .replace('  // 4. how many movies are watched?\n  const watchedCount = 0;', '  // 4. how many movies are watched?\n  const watchedCount = props.movies.filter(movie => movie.watched).length;')
    .replace('      {/* 1. to 3. one Movie per item, with a key */}\n', `      {/* 1. to 3. one Movie per item, with a key */}
      { props.movies.map(movie =>
        <Movie
          key={ movie.id }
          title={ movie.title }
          year={ movie.year }
          genre={ movie.genre }
          watched={ movie.watched }
          staffPick={ movie.staffPick }
        />
      ) }
`);
})();
