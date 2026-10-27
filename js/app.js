/* Code Lab engine: views, editors, progress, and scoring. Settings come from config.js (LAB). */
(() => {
  const KEY = LAB.storageKey || 'codeLab.v1';
  const N = ACTIVITIES.length;
  const FILES = Checker.NAMES;                       // file names shown on the tabs (LAB.files)
  const MODES = { html: 'htmlmixed', css: 'css', js: LAB.jsx ? 'jsx' : 'javascript' };
  const $ = (s, el = document) => el.querySelector(s);
  const view = $('#view');

  /* ---------------------------------------------------------------- state */
  const fresh = () => ({ name: '', run: newRun(1), history: [] });
  function newRun(n) { return { n, started: new Date().toISOString(), results: {}, drafts: {} }; }
  function loadState() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.run) return s; } catch (e) {} return fresh(); }
  let state = loadState();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  const result = id => state.run.results[id];
  const unlocked = id => id === 1 || !!result(id - 1);
  const nextOpen = () => { for (let i = 1; i <= N; i++) if (!result(i)) return i; return null; };
  const overall = () => { const r = ACTIVITIES.map(a => result(a.id)).filter(Boolean); return r.length ? Math.round(r.reduce((s, x) => s + x.score, 0) / N) : 0; };
  const bestEver = () => state.history.reduce((m, h) => Math.max(m, h.overall), 0);
  const filesOf = a => Object.keys(FILES).filter(f => a.starter[f] != null || a.solution[f] != null);
  const kind = f => f === 'js' && LAB.jsx ? 'JSX' : f.toUpperCase();   // what students call the file they write

  /* ---------------------------------------------------------------- helpers */
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const md = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const verdict = p => p >= 90 ? ['Excellent', 'You have this topic nailed.'] : p >= 75 ? ['Good work', 'A few details to tidy up.'] : p >= 50 ? ['Getting there', 'Review the explanations below and try again.'] : ['Keep practising', 'Read each explanation, compare with the proper code, and try again.'];
  const band = p => p >= 90 ? 'great' : p >= 75 ? 'good' : p >= 50 ? 'ok' : 'low';
  /* An image, or a coloured banner when there is no picture. */
  const art = (src, cls, label, alt = '') => src ? `<img class="${cls}" src="${src}" alt="${esc(alt)}">` : `<div class="${cls} art-fallback" aria-hidden="true"><span>${esc(label)}</span></div>`;
  function ring(p, size = 120) {
    const r = size / 2 - 9, C = 2 * Math.PI * r;
    return `<svg class="ring ${band(p)}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${p} percent">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - p / 100)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle">${p}%</text></svg>`;
  }
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  /* Line diff (LCS) so students can see which lines differ from the proper code. */
  function diff(a, b) {
    const norm = l => l.trim().replace(/\s+/g, ' ').toLowerCase();
    const A = String(a).replace(/\s+$/, '').split('\n'), B = String(b).replace(/\s+$/, '').split('\n');
    const n = A.length, m = B.length, dp = Array.from({ length: n + 1 }, () => new Int16Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
      dp[i][j] = norm(A[i]) === norm(B[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const left = [], right = [];
    let i = 0, j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && norm(A[i]) === norm(B[j])) { left.push([A[i], 'same']); right.push([B[j], 'same']); i++; j++; }
      else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) { right.push([B[j], norm(B[j]) ? 'add' : 'same']); j++; }
      else { left.push([A[i], norm(A[i]) ? 'del' : 'same']); i++; }
    }
    return { left, right };
  }
  const codeLines = (lines) => '<pre class="diff">' + lines.map(([t, k], i) => `<span class="ln ${k}"><i>${i + 1}</i>${esc(t) || ' '}</span>`).join('') + '</pre>';

  /* ---------------------------------------------------------------- top bar */
  function renderTop() {
    document.title = LAB.title;
    $('.brand').innerHTML = (LAB.logo ? `<img src="${LAB.logo}" alt="">` : '') + `<span>${esc(LAB.brand || LAB.title)}</span>`;
    $('.brand').classList.toggle('no-logo', !LAB.logo);
    $('#footText').innerHTML = esc(LAB.footer || LAB.title) + (LAB.guide ? ` · <a href="${LAB.guide}" target="_blank" rel="noopener">Student guide (PDF)</a>` : '') + ' · Your progress is saved in this browser only.';
  }
  function renderStepper(current) {
    $('#stepper').innerHTML = ACTIVITIES.map(a => {
      const r = result(a.id), open = unlocked(a.id);
      const cls = ['step', r ? 'done ' + band(r.score) : '', a.id === current ? 'current' : '', open ? '' : 'locked'].join(' ');
      const label = `Activity ${a.id}: ${a.title}` + (r ? `, ${r.score}%` : open ? '' : ' (locked)');
      return open ? `<a class="${cls}" href="#/activity/${a.id}" title="${esc(label)}" aria-label="${esc(label)}">${a.id}</a>`
                  : `<span class="${cls}" title="${esc(label)}" aria-label="${esc(label)}">${a.id}</span>`;
    }).join('');
  }

  /* ---------------------------------------------------------------- home */
  function home() {
    renderStepper(0);
    const next = nextOpen(), done = Object.keys(state.run.results).length;
    const startLabel = done === 0 ? 'Start Activity 1' : next ? `Continue with Activity ${next}` : 'See my results';
    const startHref = next ? `#/activity/${next}` : '#/summary';
    const guide = LAB.guide ? `<a class="btn ghost" href="${LAB.guide}" target="_blank" rel="noopener" id="guideBtn">📘 Student guide (PDF)</a>` : '';
    view.innerHTML = `
    <section class="hero">
      <div class="hero-text">
        <p class="kicker">${esc(LAB.kicker || '')}</p>
        <h1>${esc(LAB.title)}</h1>
        <p class="lead">${md(LAB.lead || '')}</p>
        <label class="name-field">Your name (shown on your results)
          <input id="nameInput" type="text" autocomplete="name" placeholder="e.g. Jordan Lee" value="${esc(state.name)}">
        </label>
        <div class="hero-actions">
          <a class="btn primary" href="${startHref}" id="startBtn">${startLabel}</a>
          ${guide}
          ${done ? `<span class="muted">Run ${state.run.n}: ${done} of ${N} submitted · ${overall()}% so far</span>` : ''}
        </div>
      </div>
      ${art(LAB.heroArt, 'hero-art', LAB.title, LAB.heroAlt)}
    </section>

    <section class="how">
      <h2>How it works</h2>
      <ol class="how-list">
        ${(LAB.how || []).map((h, i) => `<li>${art(h.img, 'how-art', String(i + 1))}<strong>${esc(h.title)}</strong><span>${esc(h.text)}</span></li>`).join('')}
      </ol>
      <p class="muted">Submit an activity to unlock the next one. You can redo any activity, and start the whole lab again as many times as you like.${LAB.guide ? ` New here? Read the <a href="${LAB.guide}" target="_blank" rel="noopener">student guide</a> first.` : ''}</p>
    </section>

    <section class="cards-grid">
      <h2>The activities</h2>
      <div class="act-grid">
        ${ACTIVITIES.map(a => { const r = result(a.id), open = unlocked(a.id); return `
        <${open ? 'a' : 'div'} class="act-card ${open ? '' : 'locked'}" ${open ? `href="#/activity/${a.id}"` : 'aria-disabled="true"'}>
          ${art(a.art, 'act-art', String(a.id))}
          <div class="act-body">
            <span class="chip">${esc(a.module)} · ${kind(a.edit)}</span>
            <strong>${a.id}. ${esc(a.title)}</strong>
            <span class="muted">${esc(a.topic)}</span>
          </div>
          <span class="act-status ${r ? band(r.score) : ''}">${r ? r.score + '%' : open ? 'Open' : '🔒'}</span>
        </${open ? 'a' : 'div'}>`; }).join('')}
      </div>
    </section>

    ${state.history.length ? `
    <section class="history">
      <h2>Your earlier runs</h2>
      <table><thead><tr><th>Run</th><th>Finished</th><th>Overall</th></tr></thead><tbody>
      ${state.history.slice().reverse().map(h => `<tr><td>${h.n}</td><td>${new Date(h.finished).toLocaleString()}</td><td><span class="pill ${band(h.overall)}">${h.overall}%</span></td></tr>`).join('')}
      </tbody></table>
      <p class="muted">Best overall so far: <strong>${bestEver()}%</strong></p>
    </section>` : ''}`;
    $('#nameInput').addEventListener('input', e => { state.name = e.target.value.slice(0, 60); save(); });
  }

  /* ---------------------------------------------------------------- editors */
  let cm = null;
  function editors() {
    if (cm) return cm;
    const mk = mode => CodeMirror(document.createElement('div'), { mode, lineNumbers: true, tabSize: 2, indentUnit: 2, lineWrapping: true,
      autoCloseTags: mode === 'htmlmixed', autoCloseBrackets: true, matchBrackets: true, viewportMargin: Infinity });
    cm = { html: mk(MODES.html), css: mk(MODES.css), js: mk(MODES.js) };
    return cm;
  }
  const current = () => { const ed = editors(); return { html: ed.html.getValue(), css: ed.css.getValue(), js: ed.js.getValue() }; };

  /* ---------------------------------------------------------------- activity */
  function activity(id) {
    const a = ACTIVITIES[id - 1];
    if (!a) return go('#/');
    renderStepper(id);
    if (!unlocked(id)) {
      view.innerHTML = `<section class="locked-view">${art(LAB.summaryArt, 'locked-art', '🔒')}<h1>Activity ${id} is locked</h1>
        <p>Submit Activity ${id - 1} first. Each activity unlocks when you submit the one before it.</p>
        <a class="btn primary" href="#/activity/${nextOpen()}">Go to Activity ${nextOpen()}</a></section>`;
      return;
    }
    const draft = state.run.drafts[id] || {};
    const files = filesOf(a);
    const start = f => draft[f] != null ? draft[f] : (a.starter[f] || '');
    const given = files.filter(f => f !== a.edit).map(f => kind(f) === 'JSX' ? 'JS' : kind(f));

    view.innerHTML = `
    <div class="workspace">
      <aside class="brief">
        ${art(a.art, 'brief-art', a.module + ' · Activity ' + a.id)}
        <p class="chip-row"><span class="chip">${esc(a.module)}</span><span class="chip outline">${esc(a.topic)}</span></p>
        <h1><span class="num">Activity ${a.id} of ${N}</span>${esc(a.title)}</h1>
        <p>${md(a.story)}</p>
        <div class="you-edit ${a.edit}">You write the <strong>${kind(a.edit)}</strong> in <code>${FILES[a.edit]}</code>.${given.length ? ` The ${given.join(' and ')} ${given.length > 1 ? 'are' : 'is'} given.` : ''}</div>
        <h2>Your task</h2>
        <ol class="steps">${a.steps.map(s => typeof s === 'string' ? `<li>${md(s)}</li>` : `<li>${md(s.text)}${s.code ? `<pre class="step-code">${esc(s.code)}</pre>` : ''}</li>`).join('')}</ol>
        <details class="checklist"><summary>What will be checked (${a.checks.length} items)</summary>
          <ul>${a.checks.map(c => `<li>${md(c.text)} <span class="pts">${c.pts} pt${c.pts > 1 ? 's' : ''}</span></li>`).join('')}</ul>
        </details>
        <p class="practise">${(a.practise || []).map(p => `<span class="tag">${esc(p)}</span>`).join('')}</p>
      </aside>

      <section class="work">
        <div class="panel editor-panel">
          <div class="tabs" role="tablist">
            ${files.map(f => `<button role="tab" class="tab" data-file="${f}">${FILES[f]} ${a.edit === f ? '<em>edit</em>' : '<em class="lock">given</em>'}</button>`).join('')}
            <span class="spacer"></span>
            <button class="btn small ghost" id="resetBtn" title="Put the starter code back">Reset</button>
          </div>
          <div class="cm-host" id="cmHost"></div>
          <p class="readonly-note" id="roNote" hidden>This file is given and read-only. Switch to the tab marked EDIT to write your code.</p>
        </div>

        <div class="panel preview-panel">
          <div class="preview-bar">
            <div class="seg" role="group" aria-label="What to preview">
              <button class="on" data-show="mine">Your page</button><button data-show="goal">Goal</button>
            </div>
            <div class="seg" role="group" aria-label="Screen size">
              <button class="on" data-size="desk">Desktop</button><button data-size="phone">Phone</button>
            </div>
            <span class="spacer"></span>
            <span class="live" id="liveNote">Updates as you type</span>
          </div>
          <div class="frame-wrap" id="frameWrap"><iframe id="preview" title="Preview of your page"></iframe></div>
          ${files.includes('js') ? '<div class="console" aria-live="polite"><span class="console-label">Console</span><pre id="consoleOut">(nothing logged yet)</pre></div>' : ''}
        </div>

        <div class="submit-row">
          <p class="muted">Happy with it? Submit to see your score, your mistakes, and the proper code.</p>
          <button class="btn primary big" id="submitBtn">Submit Activity ${a.id}</button>
        </div>

        <section id="report" class="report" tabindex="-1" hidden></section>
      </section>
    </div>`;
    $('#frameWrap').style.setProperty('--phone', (LAB.phoneWidth || 400) + 'px');

    const ed = editors();
    for (const f of Object.keys(FILES)) {
      $('#cmHost').appendChild(ed[f].getWrapperElement());
      ed[f].off('change', ed[f]._keep);
      ed[f].setValue(start(f));
      ed[f].setOption('readOnly', a.edit !== f);
      ed[f].clearHistory();
    }

    let showing = 'mine';
    const preview = $('#preview');
    /* Console panel (JS activities): mirror the preview's console.log output and errors. */
    clearInterval(window.__labConsole);
    if ($('#consoleOut')) {
      let last = '';
      window.__labConsole = setInterval(() => {
        const out = $('#consoleOut'); if (!out) return clearInterval(window.__labConsole);
        const lab = preview.contentWindow && preview.contentWindow.__lab;
        const text = lab ? [...lab.logs, ...[...new Set(lab.warnings || [])].filter(w => !Checker.IGNORE.some(re => re.test(w))).map(w => '△ ' + w.replace(/\s+/g, ' ').slice(0, 300)), ...lab.errors.map(e => '⚠ ' + e)].join('\n') : '';
        if (text !== last) { last = text; out.textContent = text || '(nothing logged yet)'; out.classList.toggle('has-error', !!(lab && lab.errors.length)); out.classList.toggle('has-warning', /△/.test(text)); }
      }, 400);
    }
    const run = () => {
      const s = showing === 'goal' ? a.solution : current();
      preview.srcdoc = Checker.compose(s.html, s.css, s.js);
    };
    const keep = debounce(() => { state.run.drafts[id] = current(); save(); if (showing === 'mine') run(); }, 450);
    for (const f of Object.keys(FILES)) { ed[f]._keep = keep; ed[f].on('change', keep); }

    const tabs = [...view.querySelectorAll('.tab')];
    const show = f => {
      tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.file === f));
      for (const g of Object.keys(FILES)) ed[g].getWrapperElement().style.display = g === f ? '' : 'none';
      $('#roNote').hidden = f === a.edit;
      ed[f].refresh(); if (f === a.edit) ed[f].focus();
    };
    tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.file)));
    show(a.edit);

    view.querySelectorAll('[data-show]').forEach(b => b.addEventListener('click', () => {
      showing = b.dataset.show;
      view.querySelectorAll('[data-show]').forEach(x => x.classList.toggle('on', x === b));
      $('#liveNote').textContent = showing === 'goal' ? 'This is what you are aiming for' : 'Updates as you type';
      run();
    }));
    view.querySelectorAll('[data-size]').forEach(b => b.addEventListener('click', () => {
      view.querySelectorAll('[data-size]').forEach(x => x.classList.toggle('on', x === b));
      $('#frameWrap').classList.toggle('phone', b.dataset.size === 'phone');
    }));
    $('#resetBtn').addEventListener('click', () => {
      if (!confirm('Replace your code with the starter code for this activity?')) return;
      ed[a.edit].setValue(a.starter[a.edit] || '');
    });
    $('#submitBtn').addEventListener('click', () => submit(a));
    run();
    if (result(id)) report(a, result(id), false);
  }

  async function submit(a) {
    const btn = $('#submitBtn');
    btn.disabled = true; btn.textContent = 'Checking…';
    const files = current();
    const g = await Checker.grade(a, files);
    const prev = result(a.id);
    const r = { score: g.score, earned: g.earned, total: g.total, at: new Date().toISOString(), attempts: (prev ? prev.attempts : 0) + 1,
                files, passed: g.results.map(x => x.ok), found: g.results.map(x => x.found), lint: g.lint };
    state.run.results[a.id] = r; save();
    btn.disabled = false; btn.textContent = 'Submit again';
    renderStepper(a.id);
    report(a, r, true);
  }

  function report(a, r, focus) {
    const el = $('#report');
    const [title, sub] = verdict(r.score);
    const files = r.files || { html: r.html, css: r.css, js: r.js };
    const d = diff(files[a.edit] || '', a.solution[a.edit] || '');
    const failed = a.checks.map((c, i) => ({ c, ok: r.passed[i], found: r.found[i] })).filter(x => !x.ok);
    const passed = a.checks.map((c, i) => ({ c, ok: r.passed[i] })).filter(x => x.ok);
    const last = a.id === N;
    el.hidden = false;
    el.innerHTML = `
      <div class="report-head">
        ${ring(r.score)}
        <div>
          <p class="kicker">Activity ${a.id} result · attempt ${r.attempts}</p>
          <h2>${title}: ${r.score}%</h2>
          <p>${sub} You earned <strong>${r.earned} of ${r.total}</strong> points.</p>
        </div>
      </div>

      ${failed.length ? `<h3 class="bad-h">What to fix (${failed.length})</h3>
      <ol class="results">${failed.map(x => `
        <li class="fail">
          <p class="r-title">✗ ${md(x.c.text)} <span class="pts">0 / ${x.c.pts}</span></p>
          ${x.found ? `<p class="found"><strong>We found:</strong> ${esc(x.found)}</p>` : ''}
          <p class="why"><strong>Why:</strong> ${md(x.c.explain)}</p>
          <p class="fix-label">The correct code:</p>
          <pre class="fix">${esc(x.c.fix)}</pre>
        </li>`).join('')}</ol>` : '<p class="all-good">✓ Every check passed. Nicely done!</p>'}

      ${r.lint && r.lint.length ? `<div class="lint"><strong>Also worth a look in your code (not scored):</strong><ul>${r.lint.map(n => `<li>${md(n)}</li>`).join('')}</ul></div>` : ''}

      ${passed.length ? `<details class="passed"><summary>✓ What you got right (${passed.length})</summary>
        <ul>${passed.map(x => `<li>${md(x.c.text)} <span class="pts">${x.c.pts} / ${x.c.pts}</span><br><span class="muted">${md(x.c.explain)}</span></li>`).join('')}</ul></details>` : ''}

      <h3>Compare your ${kind(a.edit)} with the proper code</h3>
      <p class="muted legend"><span class="ln del">red</span> lines in yours are different or extra · <span class="ln add">green</span> lines in the proper code are the ones you were missing or wrote differently.</p>
      <div class="compare">
        <div><h4>Your code</h4>${codeLines(d.left)}</div>
        <div><h4>Proper code</h4>${codeLines(d.right)}</div>
      </div>

      <h3>Compare the results</h3>
      <div class="compare">
        <div><h4>Your page</h4><div class="mini-frame"><iframe title="Your submitted page" id="mineFrame"></iframe></div></div>
        <div><h4>Goal</h4><div class="mini-frame"><iframe title="The goal page" id="goalFrame"></iframe></div></div>
      </div>

      <div class="report-actions">
        <button class="btn ghost" id="retryBtn">Try this activity again</button>
        <a class="btn primary big" href="${last ? '#/summary' : '#/activity/' + (a.id + 1)}">${last ? 'See my final results →' : 'Next: Activity ' + (a.id + 1) + ' →'}</a>
      </div>`;
    $('#mineFrame').srcdoc = Checker.compose(files.html, files.css, files.js);
    $('#goalFrame').srcdoc = Checker.compose(a.solution.html, a.solution.css, a.solution.js);
    $('#retryBtn').addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); editors()[a.edit].focus(); });
    if (focus) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.focus({ preventScroll: true }); }
  }

  /* ---------------------------------------------------------------- summary */
  function summary() {
    renderStepper(0);
    const done = ACTIVITIES.filter(a => result(a.id)).length, p = overall();
    if (done < N) {
      view.innerHTML = `<section class="locked-view">${art(LAB.summaryArt, 'locked-art', LAB.title)}
        <h1>Your results so far</h1>
        <p>You have submitted <strong>${done} of ${N}</strong> activities in run ${state.run.n}. Finish all ${N} to get your full-cycle score.</p>
        ${bars()}
        <a class="btn primary" href="#/activity/${nextOpen()}">Continue with Activity ${nextOpen()}</a></section>`;
      return;
    }
    const [title, sub] = verdict(p), best = bestEver();
    const pass = LAB.passMark || 80;
    const weakest = ACTIVITIES.slice().sort((x, y) => result(x.id).score - result(y.id).score).slice(0, 3).filter(a => result(a.id).score < 100);
    view.innerHTML = `
    <section class="summary">
      <div class="summary-head">
        ${art(LAB.summaryArt, 'summary-art', '✓')}
        <div>
          <p class="kicker">Full cycle · Run ${state.run.n} complete</p>
          <h1>${esc(state.name ? state.name + ', y' : 'Y')}ou finished the ${esc(LAB.title)}!</h1>
          <div class="summary-score">${ring(p, 150)}<div><h2>${title}</h2><p>${sub}</p>
            <p class="muted">Approximate overall score${LAB.scope ? ' across ' + esc(LAB.scope) : ''}.${best ? ` Your best earlier run: ${best}%.` : ''}</p></div></div>
        </div>
      </div>
      <h2>Score by activity</h2>
      ${bars()}
      ${weakest.length ? `<div class="advice"><h3>Where to practise next</h3><ul>${weakest.map(a => `<li><a href="#/activity/${a.id}">Activity ${a.id}: ${esc(a.title)}</a>: ${result(a.id).score}% (${esc(a.module)}, ${esc(a.topic)})${result(a.id).score < pass ? ' · below ' + pass + '%' : ''}</li>`).join('')}</ul></div>` : ''}
      <div class="report-actions">
        <button class="btn ghost" onclick="window.print()">Print or save as PDF</button>
        <button class="btn primary big" id="newRun">Start the lab again</button>
      </div>
      <p class="muted print-note">Printed ${new Date().toLocaleString()} · ${esc(state.name || 'Student')} · Run ${state.run.n}</p>
    </section>`;
    $('#newRun').addEventListener('click', () => {
      if (!confirm('Start a new run? This run’s scores are saved in your history, and every activity starts fresh.')) return;
      state.history.push({ n: state.run.n, finished: new Date().toISOString(), overall: p, scores: ACTIVITIES.map(a => result(a.id).score) });
      state.run = newRun(state.run.n + 1); save(); go('#/activity/1');
    });
  }
  function bars() {
    return `<ol class="bars">${ACTIVITIES.map(a => { const r = result(a.id); const s = r ? r.score : 0; return `
      <li><a href="${unlocked(a.id) ? '#/activity/' + a.id : '#/'}"><span class="b-label">${a.id}. ${esc(a.title)} <em>${esc(a.module)}</em></span>
      <span class="b-track"><span class="b-fill ${r ? band(s) : 'none'}" style="width:${s}%"></span></span>
      <span class="b-val">${r ? s + '%' : '–'}</span></a></li>`; }).join('')}</ol>`;
  }

  /* ---------------------------------------------------------------- router */
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  function route() {
    const h = location.hash || '#/';
    let m;
    if ((m = h.match(/^#\/activity\/(\d+)/))) activity(+m[1]);
    else if (h.startsWith('#/summary')) summary();
    else home();
    view.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  renderTop();
  window.addEventListener('hashchange', route);
  route();
})();
