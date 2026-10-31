/*
   Lab settings: everything that makes this lab yours. The engine (app.js, checker.js) reads
   these values; the activities themselves live in activities.js.
   Image paths are relative to index.html. Any image can be null: the app then draws a
   coloured banner instead.
*/
const LAB = {
  title: 'React Code Lab',                    // big title on the home page and in the browser tab
  brand: 'React Code Lab',                    // short name beside the logo in the top bar, e.g. "Code Lab"
  kicker: 'CSIS 3380 · Modules 4 to 7',                  // small line above the title, e.g. "CSIS 1280 · Modules 1 to 6"
  scope: 'Modules 4–7',                    // used in sentences, e.g. "Modules 1–6"
  lead: 'Ten short, hands-on React activities built on the **Movie Night** and **café** case studies. Write the code, see it render, submit it, and get your mistakes explained with the proper code beside yours.',                      // one or two sentences under the title
  footer: 'CSIS 3380 · Web Application Development',                  // footer text, e.g. "CSIS 1280 · Web Design"
  storageKey: 'codeLab.react-code-lab.v1',         // unique per lab, so two labs never share progress
  author: { name: 'Reza Ghaeli', url: 'https://github.com/RezaGhaeli' },   // credit: home byline, footer, printed results

  logo: null,                            // e.g. 'img/logo.png' (wide logo for the dark top bar)
  heroArt: 'img/hero.png',                         // e.g. 'img/hero.png' (wide picture on the home page)
  heroAlt: 'The Movie Night app showing The Grand Budapest Hotel details page',
  summaryArt: 'img/summary.png',                      // picture on the final results page
  how: [                                 // the four "How it works" cards; img may be null
    { img: 'img/how-tree.png', title: 'Read the task', text: 'Each activity continues the Movie Night or café app and lists the steps.' },
    { img: 'img/how-cafe-menu.png', title: 'Write the code', text: 'Usually you write app.js in JSX; in Activity 1 you write the HTML. The other files are given.' },
    { img: 'img/how-hooks.png', title: 'Run and submit', text: 'Your app re-renders as you type. Submit when it matches the goal.' },
    { img: 'img/how-cafe-router.png', title: 'Learn from the report', text: 'See each mistake, why it matters, the proper code, and your score.' }
  ],
  guide: 'guide/React-Code-Lab-Student-Guide.pdf',                           // e.g. 'guide/Student_Guide.pdf' adds a "Student guide" button

  files: { html: 'index.html', css: 'app.css', js: 'app.js' },   // names on the editor tabs and in <link>/<script src>
  jsx: true,                            // true: compile the JS file from JSX with Babel (React labs); see the React section of the authoring guide
  readySelector: null,                   // grading waits until this element has children (default '#root' when jsx is true)

  passMark: 80,                          // "redo anything below this" advice on the results page
  desktopWidth: 960,                     // width of the hidden grading frame for desktop checks
  phoneWidth: 400                        // width used for csN()/rectN() checks and the Phone preview
};
