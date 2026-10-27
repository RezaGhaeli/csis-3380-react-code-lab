/* Typical student mistakes: each must LOSE points (checked by verify_lab.js). */
const MISTAKES = {
  1: [
    ['ReactDOM before React', f => ({ ...f, html: f.html.replace(/(\s*<script crossorigin src="https:\/\/unpkg.com\/react@[^\n]*\n)(\s*<script crossorigin src="https:\/\/unpkg.com\/react-dom@[^\n]*\n)/, '$2$1') })],
    ['app.js without type="text/babel"', f => ({ ...f, html: f.html.replace('<script type="text/babel" src="./app.js">', '<script src="./app.js">') })]
  ],
  2: [
    ['typed-in title and class=', f => ({ ...f, js: f.js.replace('<h1>{ title }</h1>', '<h1>Movie Night</h1>').replace('<span className="stats">', '<span class="stats">') })],
    ['if-free but hard-coded footer', f => ({ ...f, js: f.js.replace(/\{ watchedCount === movies\.length[\s\S]*?movies\.length \}/, 'Watched 2 of 4') })]
  ],
  3: [
    ['typed the data into the JSX', f => ({ ...f, js: f.js.replace('<Movie title={ movies[0].title }', '<Movie title="Spirited Away"') })],
    ['class instead of className, lowercase component', f => ({ ...f, js: f.js.replace('<div className="movie">', '<div class="movie">').replace(/<Movie /g, '<movie ').replace('const Movie =', 'const movie =') })]
  ],
  4: [
    ['no key', f => ({ ...f, js: f.js.replace('          key={ movie.id }\n', '') })],
    ['watchedCount left at 0', f => ({ ...f, js: f.js.replace('const watchedCount = props.movies.filter(movie => movie.watched).length;', 'const watchedCount = 0;') })]
  ],
  5: [
    ['mutating state directly', f => ({ ...f, js: f.js.replace(/this\.setState\(prevState => \(\{[\s\S]*?\}\)\);\n  \}/, 'const item = this.state.items.find(i => i.id === id);\n    item.qty = item.qty + delta;\n  }') })],
    ['total not fixed to 2 decimals', f => ({ ...f, js: f.js.replace('.reduce((sum, item) => sum + item.price * item.qty, 0)\n      .toFixed(2);', '.reduce((sum, item) => sum + item.price * item.qty, 0);') })]
  ],
  6: [
    ['called the handler during render', f => ({ ...f, js: f.js.replace('onClick={() => props.onToggle(props.id)}', 'onClick={ props.onToggle(props.id) }') })],
    ['mutated the movie object', f => ({ ...f, js: f.js.replace('movie.id === id ? { ...movie, watched: !movie.watched } : movie', 'movie.id === id ? (movie.watched = !movie.watched, movie) : movie') })]
  ],
  7: [
    ['uncontrolled input', f => ({ ...f, js: f.js.replace(' value={ title } onChange={ e => setTitle(e.target.value) }', '') })],
    ['no preventDefault and no blank check', f => ({ ...f, js: f.js.replace('    e.preventDefault();\n    if (!title.trim()) return;\n', '') })]
  ],
  8: [
    ['no cleanup', f => ({ ...f, js: f.js.replace('    return () => clearInterval(id);\n', '') })],
    ['title effect without dependencies list', f => ({ ...f, js: f.js.replace('document.title = "Movie Night (" + watchedCount + "/" + list.length + ")";\n  }, [watchedCount]);', 'document.title = "Movie Night (" + watchedCount + "/" + list.length + ")";\n  }, []);') })]
  ],
  9: [
    ['prop drilling instead of context', f => ({ ...f, js: f.js.replace('const Header = () => {\n  // 4. read theme and toggleTheme from the context\n  const { theme, toggleTheme } = React.useContext(ThemeContext);', 'const Header = ({ theme, toggleTheme }) => {\n  // 4. read theme and toggleTheme from the context').replace('<Header />', '<Header theme={ theme } toggleTheme={ toggleTheme } />') })],
    ['theme class missing on the box', f => ({ ...f, js: f.js.replace('<div className={ "watchlist " + theme }>', '<div className="watchlist">') })]
  ],
  10: [
    ['id compared as a string', f => ({ ...f, js: f.js.replace('movies.find(m => m.id === Number(id))', 'movies.find(m => m.id === id)') })],
    ['no catch-all route', f => ({ ...f, js: f.js.replace('        <Route path="*" element={ <NotFound /> } />\n', '') })]
  ]
};
