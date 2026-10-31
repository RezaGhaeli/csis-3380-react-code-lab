/*
   Code Lab checker: renders a student's files and grades them.
   The page is rendered twice in hidden frames (desktop and phone width), then each check runs
   against the real DOM, computed styles, CSS rules, and (for JavaScript) the running page.
   With LAB.jsx = true, the JS file is compiled from JSX with Babel (in this page) before it runs,
   and grading waits for React to render. See references/authoring-activities.md for the check API.
*/
const Checker = (() => {
  const CFG = typeof LAB !== 'undefined' ? LAB : {};
  const DESK = CFG.desktopWidth || 960;
  const PHONE = CFG.phoneWidth || 400;
  /* Python labs have one file, lab.py (see pylab.js); web labs have up to three. */
  const NAMES = CFG.python ? { py: (CFG.files && CFG.files.py) || 'lab.py' }
                           : Object.assign({ html: 'index.html', css: 'style.css', js: 'script.js' }, CFG.files || {});
  const JSX = !!CFG.jsx;
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  /* console noise that is not the student's fault (library deprecation notices) */
  const IGNORE = [/React Router Future Flag Warning/i, /Download the React DevTools/i].concat(CFG.ignoreWarnings || []);

  /* Records errors, console.log output, and console.error/warn (React's warnings) before any student code runs. */
  const PROBE = '<script>window.__lab={errors:[],logs:[],warnings:[]};' +
    'window.addEventListener("error",function(e){var s=window.__labJsStart,l=e.lineno;' +
    '__lab.errors.push(e.message+(l?(s&&l>=s?" (' + NAMES.js + ' line "+(l-s+1)+")":" (line "+l+")"):""));});' +
    '(function(){function fmt(a){a=[].slice.call(a);var f=a[0];if(typeof f==="string"&&/%[sdo]/.test(f)){var i=1;f=f.replace(/%[sdo]/g,function(){return String(a[i++]);});a=[f].concat(a.slice(i));}' +
    'return a.map(function(x){return typeof x==="object"?(function(){try{return JSON.stringify(x);}catch(e){return String(x);}})():String(x);}).join(" ");}' +
    'var l=console.log,er=console.error,w=console.warn;' +
    'console.log=function(){try{__lab.logs.push(fmt(arguments));}catch(x){}return l.apply(console,arguments);};' +
    'console.error=function(){try{__lab.warnings.push(fmt(arguments));}catch(x){}return er.apply(console,arguments);};' +
    'console.warn=function(){try{__lab.warnings.push(fmt(arguments));}catch(x){}return w.apply(console,arguments);};' +
    /* remember what code focused; only really move focus once the student has clicked into this page,
       so a preview that calls focus() (useRef/autofocus lessons) never steals the cursor from the editor */
    'var fo=HTMLElement.prototype.focus;HTMLElement.prototype.focus=function(){__lab.focused=this;if(document.hasFocus())return fo.apply(this,arguments);};})();<\/script>';

  /* JSX → plain JavaScript, keeping line numbers. Returns { code } or { error, line }. */
  const cache = new Map();
  function compile(js) {
    if (!JSX) return { code: js };
    if (cache.has(js)) return cache.get(js);
    let out;
    try {
      if (typeof Babel === 'undefined') throw new Error('Babel did not load (check your internet connection)');
      out = { code: Babel.transform(js, { presets: ['react'], retainLines: true, sourceType: 'script', filename: NAMES.js }).code };
    } catch (e) {
      const line = e.loc ? e.loc.line : null;
      const msg = String(e.message || e).split('\n')[0].replace(/^[^:]*?:\s*/, '').replace(/\s*\(\d+:\d+\)\s*$/, '');
      out = { error: 'SyntaxError: ' + msg + (line ? ' (' + NAMES.js + ' line ' + line + ')' : ''), line };
    }
    if (cache.size > 60) cache.clear();
    cache.set(js, out);
    return out;
  }

  /* Put the CSS and JS files into the page the way <link> and <script src> would. */
  function compose(html, css, js) {
    let doc = String(html || '');
    doc = doc.replace(new RegExp('<link[^>]*href=["\']?(\\./)?' + esc(NAMES.css) + '["\']?[^>]*>', 'i'), '');
    doc = doc.replace(new RegExp('<script[^>]*src=["\']?(\\./)?' + esc(NAMES.js) + '["\']?[^>]*>\\s*</script>', 'i'), '');
    if (JSX) doc = doc.replace(/<script[^>]*babel[^>]*>\s*<\/script>/gi, '');   // the lab compiles JSX itself
    const head = PROBE + '\n<style id="lab-css">\n' + (css || '') + '\n</style>';
    doc = /<\/head>/i.test(doc) ? doc.replace(/<\/head>/i, head + '\n</head>') : head + '\n' + doc;
    if (js && js.trim()) {
      const r = compile(js);
      const body = r.error ? 'window.__lab.errors.push(' + JSON.stringify(r.error) + ');' : r.code;
      const tag = '<script>window.__labJsStart=@@LINE@@;<\/script>\n<script id="lab-js">\n' + body.replace(/<\/script/gi, '<\\/script') + '\n<\/script>';
      doc = /<\/body>/i.test(doc) ? doc.replace(/<\/body>(?![\s\S]*<\/body>)/i, tag + '\n</body>') : doc + '\n' + tag;
      /* line numbers in errors should refer to the student's file, not to the combined page */
      const before = doc.slice(0, doc.indexOf('<script id="lab-js">')).split('\n').length;
      doc = doc.replace('@@LINE@@', String(before + 1));
    }
    return doc;
  }

  function frame(width) {
    const f = document.createElement('iframe');
    f.setAttribute('aria-hidden', 'true');
    f.tabIndex = -1;
    /* off-screen but not visibility:hidden, so elements can take focus (useRef/focus checks) */
    f.style.cssText = 'position:absolute;left:-12000px;top:0;height:900px;border:0;opacity:0;pointer-events:none;width:' + width + 'px';
    document.body.appendChild(f);
    return f;
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function load(f, src) {
    return new Promise(res => {
      let done = false;
      const finish = () => { if (!done) { done = true; setTimeout(res, 80); } };
      f.onload = finish;
      f.srcdoc = src;
      setTimeout(finish, 9000);
    });
  }
  /* React renders after the scripts run; wait until the root has content (or an error), up to 2.5 s. */
  async function settleRender(f) {
    const sel = CFG.readySelector || (JSX ? '#root' : null);
    if (!sel) return;
    for (let t = 0; t < 50; t++) {
      const d = f.contentDocument, w = f.contentWindow;
      const el = d && d.querySelector(sel);
      if ((el && el.childElementCount) || (w && w.__lab && w.__lab.errors.length)) break;
      await sleep(50);
    }
    await sleep(40);
  }

  /* Flatten every style rule, including those inside @media. */
  function flatRules(doc) {
    const out = [], media = [];
    const sheet = doc.getElementById('lab-css');
    if (!sheet || !sheet.sheet) return { out, media };
    (function walk(list, inMedia) {
      for (const r of list) {
        if (r.type === 1) { r.inMedia = inMedia; out.push(r); }
        else if (r.type === 4) { media.push(r); walk(r.cssRules, true); }
      }
    })(sheet.sheet.cssRules, false);
    return { out, media };
  }

  function makeContext(wide, narrow, src) {
    const doc = wide.contentDocument, win = wide.contentWindow;
    const ndoc = narrow.contentDocument, nwin = narrow.contentWindow;
    const { out: rules, media } = flatRules(doc);
    const lab = win.__lab || { errors: [], logs: [], warnings: [] };
    lab.warnings = (lab.warnings || []).filter(w => !IGNORE.some(re => re.test(w)));
    const c = {
      doc, win, ndoc, nwin, src,
      /* the student's code without comments, for text checks (starter comments often contain the very words you look for) */
      code: {
        html: (src.html || '').replace(/<!--[\s\S]*?-->/g, ''),
        css: (src.css || '').replace(/\/\*[\s\S]*?\*\//g, ''),
        js: (src.js || '').replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:"'`\\])\/\/.*$/gm, '$1')
      },
      /* ---- HTML ---- */
      q: s => { try { return doc.querySelector(s); } catch (e) { return null; } },
      qa: s => { try { return [...doc.querySelectorAll(s)]; } catch (e) { return []; } },
      has: s => !!c.q(s),
      text: s => { const e = c.q(s); return e ? e.textContent.trim().replace(/\s+/g, ' ') : ''; },
      attr: (s, n) => { const e = c.q(s); return e ? e.getAttribute(n) : null; },
      /* ---- CSS and layout ---- */
      cs: (s, p) => { const e = c.q(s); return e ? win.getComputedStyle(e).getPropertyValue(p).trim() : '(element not found)'; },
      csN: (s, p) => { let e = null; try { e = ndoc.querySelector(s); } catch (x) {} return e ? nwin.getComputedStyle(e).getPropertyValue(p).trim() : '(element not found)'; },
      rect: s => { const e = c.q(s); return e ? e.getBoundingClientRect() : { width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0 }; },
      rectN: s => { let e = null; try { e = ndoc.querySelector(s); } catch (x) {} return e ? e.getBoundingClientRect() : { width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0 }; },
      px: v => parseFloat(v) || 0,
      rules: () => rules,
      media: () => media,
      /* ---- JavaScript ---- */
      errors: lab.errors,                       // runtime errors (and JSX syntax errors) while the page ran
      logs: lab.logs,                           // everything passed to console.log
      warnings: lab.warnings,                   // console.error / console.warn, e.g. React's "unique key" warning
      fn: name => typeof win[name] === 'function',
      call: (name, ...args) => { if (typeof win[name] !== 'function') throw new Error('no function named ' + name); return win[name](...args); },
      click: s => { const e = typeof s === 'string' ? c.q(s) : s; if (!e) return false; e.click(); return true; },
      /* sets the value the way a user does, so React's onChange fires on controlled inputs */
      type: (s, v) => {
        const e = typeof s === 'string' ? c.q(s) : s; if (!e) return false;
        const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e), 'value');
        if (d && d.set) d.set.call(e, v); else e.value = v;
        e.dispatchEvent(new win.Event('input', { bubbles: true })); e.dispatchEvent(new win.Event('change', { bubbles: true }));
        return true;
      },
      submit: s => { const f = c.q(s || 'form'); if (!f) return false; f.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })); return true; },
      /* wait for re-renders, effects, and timers: tests that use it must be async and await it */
      settle: (ms = 60) => sleep(ms),
      /* the element the code last called .focus() on (or the active element) */
      focused: () => (win.__lab && win.__lab.focused) || doc.activeElement,
      /* ---- result ---- */
      ok: (ok, found) => ({ ok: !!ok, found })
    };
    return c;
  }

  /* Tags that must be closed explicitly; a mismatch usually means a missing end tag. */
  const PAIRED = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer', 'div', 'ul', 'ol', 'form', 'fieldset',
                  'select', 'textarea', 'video', 'audio', 'blockquote', 'a', 'h1', 'h2', 'h3', 'button', 'label', 'p', 'li', 'table', 'script'];
  function lintHtml(html) {
    const clean = html.replace(/<!--[\s\S]*?-->/g, '');
    const notes = [];
    for (const t of PAIRED) {
      const open = (clean.match(new RegExp('<' + t + '(\\s[^>]*)?>', 'gi')) || []).length;
      const close = (clean.match(new RegExp('</' + t + '\\s*>', 'gi')) || []).length;
      if (open > close && !(t === 'li' || t === 'p')) notes.push('`<' + t + '>` is opened ' + open + '× but closed ' + close + '×: check for a missing `</' + t + '>`.');
      else if (close > open) notes.push('`</' + t + '>` appears ' + close + '× but `<' + t + '>` only ' + open + '×: check for an extra closing tag.');
    }
    if (/<img(?![^>]*\balt=)[^>]*>/i.test(clean)) notes.push('An `<img>` has no `alt` attribute.');
    return notes;
  }
  function lintCss(css) {
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const notes = [];
    const o = (clean.match(/{/g) || []).length, cl = (clean.match(/}/g) || []).length;
    if (o !== cl) notes.push('Your CSS has ' + o + ' `{` but ' + cl + ' `}`: a rule is not closed, so the rules after it may be ignored.');
    for (const body of clean.match(/{[^{}]*}/g) || []) {
      const lines = body.slice(1, -1).split('\n').map(l => l.trim()).filter(Boolean);
      for (let i = 0; i < lines.length - 1; i++) {
        if (/^[a-z-]+\s*:/i.test(lines[i]) && !/;$/.test(lines[i]) && /^[a-z-]+\s*:/i.test(lines[i + 1])) {
          notes.push('A semicolon is missing after `' + lines[i] + '`, so the next declaration is ignored too.');
        }
      }
    }
    if (/:\s*#[0-9a-f]{1,2}(?![0-9a-f])/i.test(clean) || /:\s*#[0-9a-f]{4,5}(?![0-9a-f])/i.test(clean)) notes.push('A colour like `#3B26` has the wrong number of digits; use 3 or 6 hex digits.');
    return notes;
  }
  function lintJs(js, errors, warnings) {
    const notes = [];
    if (JSX) { const r = compile(js); if (r.error) notes.push('Your code has a syntax error: ' + r.error.replace(/^SyntaxError: /, '') + '. Nothing in the file runs until it is fixed.'); }
    else { try { new Function(js); } catch (e) { notes.push('Your JavaScript has a syntax error: ' + e.message + '. Nothing in the file runs until it is fixed.'); } }
    for (const e of (errors || []).filter(e => !/^SyntaxError/.test(e)).slice(0, 3)) notes.push('When the page ran, the browser reported: `' + e + '`.');
    for (const w of [...new Set(warnings || [])].slice(0, 2)) notes.push('The console showed a warning: `' + w.replace(/\s+/g, ' ').slice(0, 220) + '`.');
    return notes;
  }

  let frames = null;
  function getFrames() {
    if (!frames) frames = { wide: frame(DESK), narrow: frame(PHONE) };
    return frames;
  }

  /* Grade one activity. files = { html, css, js } (or { py } in a Python lab). Returns { score, earned, total, results, lint } */
  async function grade(activity, files) {
    if (CFG.python) return PyLab.grade(activity, files);
    const { wide, narrow } = getFrames();
    const src = compose(files.html, files.css, files.js);
    await Promise.all([load(wide, src), load(narrow, src)]);
    await Promise.all([settleRender(wide), settleRender(narrow)]);
    const c = makeContext(wide, narrow, { html: files.html || '', css: files.css || '', js: files.js || '' });
    let earned = 0, total = 0;
    const results = [];
    for (const ch of activity.checks) {           // in order: interaction checks change the page
      total += ch.pts;
      let r;
      try { r = await ch.test(c); } catch (e) { r = { ok: false, found: 'could not check (' + e.message + ')' }; }
      if (typeof r === 'boolean') r = { ok: r, found: r ? '' : 'not found' };
      if (r.ok) earned += ch.pts;
      results.push({ check: ch, ok: r.ok, found: r.found || '' });
    }
    const lint = activity.edit === 'html' ? lintHtml(files.html || '') : activity.edit === 'css' ? lintCss(files.css || '') : lintJs(files.js || '', c.errors, c.warnings);
    return { score: Math.round(100 * earned / total), earned, total, results, lint };
  }

  return { grade, compose, compile, lintHtml, lintCss, lintJs, NAMES, IGNORE };
})();
