/* =============================================================================
 * Gridaflex, interactive layout builder
 * Floating control panel (left) + live preview & generated markup (right).
 * The "Configuration" group is the source of truth: columns, breakpoints and
 * gutter sizes drive every control AND the live preview (the preview CSS is
 * generated from the config, faithfully replicating the framework formulas),
 * and produce a downloadable `_gridaflex-settings.scss`.
 * Mounts on #gx-builder. Optional initial config via data-* attributes:
 *   data-breakpoints="phone,tablet-portrait,…"   data-columns="12"
 *   data-gutters="default,sm,lg"
 * ========================================================================== */
(function () {
  'use strict';

  // Default breakpoint values (px) used to seed the config from names.
  var BP_DEFAULTS = {
    'phone': 0, 'tablet-portrait': 600, 'tablet-landscape': 900,
    'desktop': 1200, 'medium-desktop': 1440, 'big-desktop': 1800,
    'tablet': 768, 'small': 0, 'medium': 640, 'large': 1024, 'xlarge': 1200, 'xxlarge': 1440
  };
  var GUT_DEFAULTS = { 'default': '16px', 'sm': '8px', 'lg': '32px', 'xs': '4px', 'md': '16px', 'xl': '48px' };

  function init(root) {
    if (!root || root.dataset.gxReady === '1') return;
    root.dataset.gxReady = '1';
    root.innerHTML = '';

    var initBps = (root.dataset.breakpoints ||
      'phone,tablet-portrait,tablet-landscape,desktop,medium-desktop,big-desktop')
      .split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var initCols = parseInt(root.dataset.columns || '12', 10);
    var initGut = (root.dataset.gutters || 'default,sm,lg')
      .split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (initGut.indexOf('default') === -1) initGut.unshift('default');

    var state = {
      config: {
        columns: initCols,
        container: '1200px',
        breakpoints: initBps.map(function (n) {
          return { name: n, value: (BP_DEFAULTS[n] != null ? BP_DEFAULTS[n] : 0) };
        }),
        gutters: initGut.map(function (n) {
          return { name: n, value: (GUT_DEFAULTS[n] || '16px') };
        })
      },
      mode: 'classic',
      direction: 'flex-x',
      container: '',
      alignX: '', alignY: '',
      gapAxis: 'xy', gapSize: 'default', gapResp: [],
      padAxis: 'none', padSize: 'default', padResp: [],
      cells: [],
      blockBreaks: [],
      blockCount: 8
    };

    // Pleasant default grid: 4 cells, 2-up on phone, 4-up on desktop.
    var bp0 = state.config.breakpoints[0].name;
    var bpWide = hasBp('desktop') ? 'desktop' : state.config.breakpoints[state.config.breakpoints.length - 1].name;
    for (var d = 0; d < 4; d++) {
      state.cells.push({ sizes: [{ bp: bp0, size: '6' }, { bp: bpWide, size: '3' }], offsetBp: bp0, offset: '' });
    }
    state.blockBreaks = [{ bp: bp0, n: 2 }, { bp: bpWide, n: 4 }];

    function hasBp(n) { return state.config.breakpoints.some(function (b) { return b.name === n; }); }
    function bpNames() { return state.config.breakpoints.map(function (b) { return b.name; }); }
    function gutNames() { return state.config.gutters.map(function (g) { return g.name; }); }
    function cols() { return state.config.columns; }

    // ---- tiny DOM helpers ----
    function el(tag, attrs, kids) {
      var n = document.createElement(tag);
      attrs = attrs || {};
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') n.className = attrs[k];
        else if (k === 'text') n.textContent = attrs[k];
        else if (k === 'html') n.innerHTML = attrs[k];
        else n.setAttribute(k, attrs[k]);
      });
      (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
      return n;
    }
    function option(v, label, sel) { var o = el('option', { value: v, text: label }); o.selected = sel; return o; }
    function select(value, items, onChange) {
      var s = el('select');
      items.forEach(function (it) { s.appendChild(option(it[0], it[1], it[0] === value)); });
      s.addEventListener('change', function () { onChange(s.value); });
      return s;
    }
    function number(value, min, max, ph, onInput, evt) {
      var n = el('input', { type: 'number', min: String(min), max: String(max), value: value, placeholder: ph || '' });
      n.addEventListener(evt || 'input', function () { onInput(n.value); });
      return n;
    }
    function text(value, ph, onInput, evt) {
      var n = el('input', { type: 'text', value: value, placeholder: ph || '' });
      n.addEventListener(evt || 'input', function () { onInput(n.value); });
      return n;
    }
    function field(label, control) {
      return el('div', { class: 'gx-builder__field' }, [el('label', { text: label }), control]);
    }
    function iconBtn(label, ttl, onClick) {
      var b = el('button', { class: 'gx-builder__btn gx-builder__btn--icon', type: 'button', 'aria-label': ttl || label, title: ttl || '' }, [el('span', { text: label })]);
      b.addEventListener('click', onClick);
      return b;
    }
    function addBtn(label, onClick) {
      var b = el('button', { class: 'gx-builder__btn gx-builder__btn--add', type: 'button' }, [el('span', { class: 'gx-builder__add-plus', text: '+' }), el('span', { text: label })]);
      b.addEventListener('click', onClick);
      return b;
    }
    function group(label, kids, collapsible) {
      if (collapsible) {
        var d = el('details', { class: 'gx-builder__group' }); d.open = true;
        d.appendChild(el('summary', { class: 'gx-builder__group-head' }, [el('span', { text: label })]));
        (kids || []).forEach(function (k) { if (k) d.appendChild(k); });
        return d;
      }
      return el('section', { class: 'gx-builder__group' }, [el('div', { class: 'gx-builder__group-head' }, [el('span', { text: label })])].concat(kids || []));
    }

    // ---- value helpers ----
    function unit(v) {
      v = String(v == null ? '' : v).trim();
      if (v === '' ) return '0';
      if (v === '0') return '0';
      return /^-?[0-9.]+$/.test(v) ? v + 'px' : v;
    }
    function sfx(s) { return s && s !== 'default' ? '-' + s : ''; }
    function pct(n, total) { return +(((n / total) * 100).toFixed(4)) + '%'; }
    function coef(n, total) { return +((1 - n / total).toFixed(6)); }

    // ---- markup model ----
    function gridClasses() {
      var c = [state.direction];
      if (state.gapAxis !== 'none') {
        c.push('flex-gap' + sfx(state.gapSize) + '-' + state.gapAxis);
        state.gapResp.forEach(function (r) { if (r.bp) c.push(r.bp + '-flex-gap' + sfx(r.size) + '-' + state.gapAxis); });
      }
      if (state.padAxis !== 'none') {
        c.push('flex-padding' + sfx(state.padSize) + '-' + state.padAxis);
        state.padResp.forEach(function (r) { if (r.bp) c.push(r.bp + '-flex-padding' + sfx(r.size) + '-' + state.padAxis); });
      }
      if (state.mode === 'block') {
        state.blockBreaks.forEach(function (b) { if (b.bp) c.push(b.bp + '-up-' + b.n); });
      }
      if (state.alignX) c.push('align-' + state.alignX);
      if (state.alignY) c.push('align-' + state.alignY);
      return c.join(' ');
    }
    function cellClasses(cell) {
      var c = ['cell'];
      cell.sizes.forEach(function (s) { if (s.bp && s.size) c.push(s.bp + '-' + s.size); });
      if (cell.offset && cell.offsetBp) c.push(cell.offsetBp + '-offset-' + cell.offset);
      return c.join(' ');
    }
    function cellLines() {
      var lines = [];
      if (state.mode === 'block') {
        for (var b = 0; b < state.blockCount; b++) lines.push('  <div class="cell">Cell ' + (b + 1) + '</div>');
      } else {
        state.cells.forEach(function (cell, idx) {
          lines.push('  <div class="' + cellClasses(cell) + '">Cell ' + (idx + 1) + '</div>');
        });
      }
      return lines;
    }
    function buildMarkup() {
      var lines = ['<div class="' + gridClasses() + '">'];
      lines = lines.concat(cellLines());
      lines.push('</div>');
      var html = lines.join('\n');
      if (state.container) {
        html = '<div class="' + state.container + '">\n' +
          html.split('\n').map(function (l) { return '  ' + l; }).join('\n') + '\n</div>';
      }
      return html;
    }

    // ---- generated config file ----
    function configScss() {
      var cfg = state.config;
      var bpLines = cfg.breakpoints.map(function (b) {
        return "    '" + b.name + "': " + (Number(b.value) === 0 ? '0' : unit(b.value)) + ',';
      }).join('\n');
      var classes = bpNames().join(' ');
      var gutLines = cfg.gutters.map(function (g) { return "    '" + g.name + "': " + unit(g.value) + ','; }).join('\n');
      var def = cfg.gutters.filter(function (g) { return g.name === 'default'; })[0];
      return [
        '// _gridaflex-settings.scss, généré par le Constructeur de grille Gridaflex',
        '// 1) Réglez vos variables ci-dessous, 2) émettez les classes.',
        '// Importez CE fichier (et lui seul) depuis votre bundle : @use \'gridaflex-settings\';',
        '',
        "@use 'gridaflex/src/settings' with (",
        '  $flex-columns: ' + cfg.columns + ',',
        '  $flex-container: ' + unit(cfg.container) + ',',
        '  $breakpoints: (',
        bpLines,
        '  ),',
        '  $breakpoint-classes: (' + classes + '),',
        '  $flex-margin-gutters: ' + unit(def ? def.value : '16px') + ',',
        '  $gutters: (',
        gutLines,
        '  ),',
        ');',
        "@use 'gridaflex/src/classes';",
        ''
      ].join('\n');
    }

    // ---- preview CSS generated from the config (faithful to the mixins) ----
    function buildPreviewCss() {
      var cfg = state.config, total = cfg.columns;
      var bps = cfg.breakpoints.slice().sort(function (a, b) { return Number(a.value) - Number(b.value); });
      var defGut = cfg.gutters.filter(function (g) { return g.name === 'default'; })[0];
      var s = [];
      s.push('*{box-sizing:border-box}');
      s.push('.flex-x{display:flex;flex-flow:row wrap}');
      s.push('.flex-y{display:flex;flex-flow:column wrap;min-height:300px}');
      s.push('.cell{flex:0 0 auto;min-width:0;width:100%}');
      s.push('.auto{flex:1 1 0;width:auto}.shrink{flex:0 0 auto;width:auto}');
      s.push('.flex-container{max-width:' + unit(cfg.container) + ';margin-inline:auto;padding-inline:calc(' + unit(defGut ? defGut.value : '16px') + '/2)}');
      s.push('.flex-container.fluid{max-width:none}.flex-container.full{max-width:none;padding-inline:0}');
      // gutters (gap + padding), default applies at every viewport
      cfg.gutters.forEach(function (g) {
        var x = sfx(g.name), v = unit(g.value);
        s.push('.flex-gap' + x + '-x{--flex-gap-x:' + v + ';column-gap:var(--flex-gap-x)}');
        s.push('.flex-gap' + x + '-y{--flex-gap-y:' + v + ';row-gap:var(--flex-gap-y)}');
        s.push('.flex-gap' + x + ',.flex-gap' + x + '-xy{--flex-gap-x:' + v + ';--flex-gap-y:' + v + ';column-gap:var(--flex-gap-x);row-gap:var(--flex-gap-y)}');
        s.push('.flex-padding' + x + '-x{--flex-pad:' + v + '}.flex-padding' + x + '-x>.cell{padding-inline:calc(var(--flex-pad,0px)/2)}');
        s.push('.flex-padding' + x + '-y{--flex-pad:' + v + '}.flex-padding' + x + '-y>.cell{padding-block:calc(var(--flex-pad,0px)/2)}');
        s.push('.flex-padding' + x + '-xy{--flex-pad:' + v + '}.flex-padding' + x + '-xy>.cell{padding:calc(var(--flex-pad,0px)/2)}');
      });
      s.push('.align-left{justify-content:flex-start}.align-right{justify-content:flex-end}.align-center{justify-content:center}.align-justify{justify-content:space-between}.align-spaced{justify-content:space-around}');
      s.push('.align-top{align-items:flex-start}.align-middle{align-items:center}.align-bottom{align-items:flex-end}.align-stretch{align-items:stretch}');
      bps.forEach(function (bp) {
        var b = [], n;
        b.push('.' + bp.name + '-auto{flex:1 1 0;width:auto}.' + bp.name + '-shrink{flex:0 0 auto;width:auto}');
        for (n = 1; n <= total; n++) {
          b.push('.' + bp.name + '-' + n + '{width:calc(' + pct(n, total) + ' - ' + coef(n, total) + ' * var(--flex-gap-x,0px))}');
          b.push('.flex-y>.' + bp.name + '-' + n + '{height:calc(' + pct(n, total) + ' - ' + coef(n, total) + ' * var(--flex-gap-y,0px));width:auto}');
        }
        for (n = 1; n < total; n++) {
          b.push('.' + bp.name + '-offset-' + n + '{margin-left:calc(' + pct(n, total) + ' + ' + (+((n / total).toFixed(6))) + ' * var(--flex-gap-x,0px))}');
        }
        for (n = 1; n <= 8; n++) {
          b.push('.' + bp.name + '-up-' + n + '>.cell{flex:0 0 auto;width:calc(' + pct(1, n) + ' - ' + coef(1, n) + ' * var(--flex-gap-x,0px))}');
        }
        cfg.gutters.forEach(function (g) {
          var x = sfx(g.name), v = unit(g.value);
          b.push('.' + bp.name + '-flex-gap' + x + '-x{--flex-gap-x:' + v + ';column-gap:var(--flex-gap-x)}');
          b.push('.' + bp.name + '-flex-gap' + x + '-y{--flex-gap-y:' + v + ';row-gap:var(--flex-gap-y)}');
          b.push('.' + bp.name + '-flex-gap' + x + ',.' + bp.name + '-flex-gap' + x + '-xy{--flex-gap-x:' + v + ';--flex-gap-y:' + v + ';column-gap:var(--flex-gap-x);row-gap:var(--flex-gap-y)}');
          b.push('.' + bp.name + '-flex-padding' + x + '-x{--flex-pad:' + v + '}.' + bp.name + '-flex-padding' + x + '-x>.cell{padding-inline:calc(var(--flex-pad,0px)/2)}');
          b.push('.' + bp.name + '-flex-padding' + x + '-y{--flex-pad:' + v + '}.' + bp.name + '-flex-padding' + x + '-y>.cell{padding-block:calc(var(--flex-pad,0px)/2)}');
          b.push('.' + bp.name + '-flex-padding' + x + '-xy{--flex-pad:' + v + '}.' + bp.name + '-flex-padding' + x + '-xy>.cell{padding:calc(var(--flex-pad,0px)/2)}');
        });
        if (Number(bp.value) > 0) s.push('@media (min-width:' + unit(bp.value) + '){' + b.join('') + '}');
        else s.push(b.join(''));
      });
      return s.join('\n');
    }

    // ---- live preview (iframe with its own viewport for real media queries) ----
    function scheme() {
      var n = document.querySelector('[data-md-color-scheme]');
      return (n && n.getAttribute('data-md-color-scheme')) || 'default';
    }
    var FRAME_STYLE = '<style>' +
      'html,body{margin:0}' +
      'body{padding:.85rem;font:.78rem/1.4 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
      'color:#3a3f7a;background-color:#fbfcff;' +
      'background-image:radial-gradient(circle,var(--gx-dot,rgba(91,108,255,.22)) 1.1px,transparent 1.4px);' +
      'background-size:16px 16px;background-position:-8px -8px}' +
      '.cell{background:var(--gx-cell,#eef1ff);box-shadow:inset 0 0 0 1px var(--gx-cell-bd,#c7cfff);' +
      'border-radius:8px;color:var(--gx-cell-fg,#2b3590);min-height:3rem;display:grid;place-items:center;' +
      'text-align:center;font-weight:600;font-size:.74rem}' +
      '.cell:nth-child(even){background:var(--gx-cell-alt,#5b6cff);color:#fff;box-shadow:inset 0 0 0 1px var(--gx-cell-alt,#5b6cff)}' +
      '[data-scheme="slate"] body{color:#c7ccff;background-color:#0f111a;--gx-dot:rgba(140,150,235,.20)}' +
      '[data-scheme="slate"] .cell{--gx-cell:#262a47;--gx-cell-bd:#454f95;--gx-cell-fg:#cdd2ff}' +
      '[data-scheme="slate"] .cell:nth-child(even){--gx-cell-alt:#5b6cff}' +
      '</style><style id="gx-gen"></style>';

    var previewFrame = el('iframe', { class: 'gx-builder__frame', title: 'Aperçu' });
    var previewWrap = el('div', { class: 'gx-builder__preview-wrap' }, [previewFrame]);
    var frameReady = false;
    previewFrame.addEventListener('load', function () { frameReady = true; writeFrame(); });
    previewFrame.srcdoc = '<!doctype html><html data-scheme="' + scheme() + '"><head><meta charset="utf-8">' +
      FRAME_STYLE + '</head><body></body></html>';
    function writeFrame() {
      if (!frameReady) return;
      var doc = previewFrame.contentDocument;
      if (!doc || !doc.body) return;
      doc.documentElement.setAttribute('data-scheme', scheme());
      var g = doc.getElementById('gx-gen');
      if (g) g.textContent = buildPreviewCss();
      doc.body.innerHTML = buildMarkup();
    }

    // Viewport options derive from the configured breakpoints, so the preview
    // can be checked exactly at each threshold of YOUR config.
    var viewportHost = el('span', { class: 'gx-builder__viewport-host' });
    var viewportSelect;
    function mountViewport() {
      var prev = viewportSelect ? viewportSelect.value : '100%';
      var opts = [['100%', '100%, Fluide']];
      state.config.breakpoints.slice()
        .sort(function (a, b) { return Number(a.value) - Number(b.value); })
        .forEach(function (b) {
          var w = Number(b.value) > 0 ? Number(b.value) : 360; // base bp → representative mobile width
          opts.push([w + 'px', b.name + ' · ' + w + 'px']);
        });
      var keep = opts.some(function (o) { return o[0] === prev; }) ? prev : '100%';
      viewportSelect = select(keep, opts, function () { updateScale(); });
      viewportSelect.className = 'gx-builder__viewport-select';
      viewportHost.innerHTML = '';
      viewportHost.appendChild(viewportSelect);
      updateScale();
    }

    function updateScale() {
      if (!viewportSelect) return;
      var v = viewportSelect.value;
      if (v === '100%') {
        previewFrame.style.width = '100%'; previewFrame.style.minWidth = '';
        previewFrame.style.transform = 'none'; previewFrame.style.height = '340px';
        return;
      }
      var targetWidth = parseInt(v, 10), containerWidth = previewWrap.clientWidth;
      previewFrame.style.width = v; previewFrame.style.minWidth = v;
      if (targetWidth > containerWidth && containerWidth > 0) {
        var sc = containerWidth / targetWidth;
        previewFrame.style.transform = 'scale(' + sc + ')';
        previewFrame.style.height = (340 / sc) + 'px';
      } else {
        previewFrame.style.transform = 'none'; previewFrame.style.height = '340px';
      }
    }
    if (window.ResizeObserver) new ResizeObserver(function () { updateScale(); }).observe(previewWrap);

    // Re-render preview when the docs theme switches light/dark.
    var schemeNode = document.querySelector('[data-md-color-scheme]') || document.body;
    if (window.MutationObserver) {
      new MutationObserver(function () { writeFrame(); }).observe(schemeNode, { attributes: true, attributeFilter: ['data-md-color-scheme'] });
    }

    // ---- generated HTML + config outputs (persistent in the main column) ----
    // Robust copy: clipboard API can reject silently (e.g. when focus is inside
    // the preview iframe → "Document is not focused"), so we fall back to a
    // hidden <textarea> + execCommand, and always give visible feedback.
    function flashBtn(btn, msg) {
      if (!btn.dataset.label) btn.dataset.label = btn.textContent;
      btn.textContent = msg;
      clearTimeout(btn._flash);
      btn._flash = setTimeout(function () { btn.textContent = btn.dataset.label; }, 1400);
    }
    function legacyCopy(text) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '0'; ta.style.left = '0'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try { ta.setSelectionRange(0, text.length); } catch (e) {}
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      } catch (e) { return false; }
    }
    function copyToClipboard(text, btn) {
      var ok = function () { flashBtn(btn, 'Copié ✓'); };
      var ko = function () { flashBtn(btn, 'Échec — Ctrl/Cmd+C'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok, function () { legacyCopy(text) ? ok() : ko(); });
      } else {
        legacyCopy(text) ? ok() : ko();
      }
    }

    var codeEl = el('code', { class: 'language-html' });
    var copyBtn = el('button', { class: 'gx-builder__btn gx-builder__btn--ghost gx-builder__btn--sm', type: 'button', text: 'Copier' });
    copyBtn.addEventListener('click', function () { copyToClipboard(buildMarkup(), copyBtn); });

    var configCodeEl = el('code', { class: 'language-scss' });
    var copyCfgBtn = el('button', { class: 'gx-builder__btn gx-builder__btn--ghost gx-builder__btn--sm', type: 'button', text: 'Copier' });
    copyCfgBtn.addEventListener('click', function () { copyToClipboard(configScss(), copyCfgBtn); });

    var downloadBtn = el('button', { class: 'gx-builder__btn gx-builder__btn--sm', type: 'button', text: '↓ Télécharger' });
    downloadBtn.addEventListener('click', function () {
      try {
        var blob = new Blob([configScss()], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = el('a', { href: url, download: '_gridaflex-settings.scss', rel: 'noopener' });
        document.body.appendChild(a); a.click();
        setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1500);
      } catch (e) {
        copyToClipboard(configScss(), downloadBtn); // dernier recours : on copie
      }
    });

    function render() {
      writeFrame();
      codeEl.textContent = buildMarkup();
      configCodeEl.textContent = configScss();
    }

    // ---- keep selections valid after a config change ----
    function sanitize() {
      var names = bpNames(), guts = gutNames(), c = cols();
      function fixBp(o, key) { if (names.indexOf(o[key]) === -1) o[key] = names[0]; }
      function fixSize(o) {
        if (o.size === 'auto' || o.size === 'shrink') return;
        var n = parseInt(o.size, 10);
        if (isNaN(n)) return;
        if (n > c) o.size = String(c);
      }
      state.cells.forEach(function (cell) {
        cell.sizes.forEach(function (s) { fixBp(s, 'bp'); fixSize(s); });
        fixBp(cell, 'offsetBp');
        if (cell.offset && parseInt(cell.offset, 10) > c - 1) cell.offset = String(c - 1);
      });
      state.blockBreaks.forEach(function (b) { fixBp(b, 'bp'); });
      state.gapResp.forEach(function (r) { fixBp(r, 'bp'); if (guts.indexOf(r.size) === -1) r.size = 'default'; });
      state.padResp.forEach(function (r) { fixBp(r, 'bp'); if (guts.indexOf(r.size) === -1) r.size = 'default'; });
      if (guts.indexOf(state.gapSize) === -1) state.gapSize = 'default';
      if (guts.indexOf(state.padSize) === -1) state.padSize = 'default';
    }

    // ---- panel (rebuilt on structural config changes) ----
    var panelHost = el('div', { class: 'gx-builder__panel-host' });
    function refresh() { sanitize(); mountConfig(); mountPanel(); mountViewport(); render(); }

    function mountPanel() {
      var bpItems = state.config.breakpoints.map(function (b) { return [b.name, b.name]; });
      var gutItems = state.config.gutters.map(function (g) { return [g.name, g.name]; });
      var axisItems = [['none', '—'], ['x', 'x'], ['y', 'y'], ['xy', 'xy']];
      var cellSizeItems = [['auto', 'auto'], ['shrink', 'shrink']];
      for (var i = 1; i <= cols(); i++) cellSizeItems.push([String(i), String(i)]);
      var nItems = []; for (var k = 1; k <= 8; k++) nItems.push([String(k), String(k)]);

      // --- Disposition group (mode + direction + container class) ---
      var toggle = el('div', { class: 'gx-builder__toggle' });
      [['classic', 'Classique'], ['block', 'Block grid']].forEach(function (m, i) {
        var b = el('button', { class: 'gx-builder__toggle-btn' + (state.mode === m[0] ? ' is-active' : ''), type: 'button', text: m[1] });
        b.addEventListener('click', function () {
          if (state.mode === m[0]) return;
          state.mode = m[0]; mountPanel(); render();
        });
        toggle.appendChild(b);
      });
      var dispoGroup = group('Disposition', [
        toggle,
        el('div', { class: 'gx-builder__grid2' }, [
          field('Direction', select(state.direction, [['flex-x', 'flex-x (horizontal)'], ['flex-y', 'flex-y (vertical)']], function (v) { state.direction = v; render(); })),
          field('Conteneur', select(state.container, [['', 'aucun'], ['flex-container', 'container'], ['flex-container fluid', 'fluid'], ['flex-container full', 'full']], function (v) { state.container = v; render(); }))
        ])
      ]);

      // --- Gutters group ---
      var gapRespBox = el('div', { class: 'gx-builder__repeat' });
      var padRespBox = el('div', { class: 'gx-builder__repeat' });
      function renderResp(box, list) {
        box.innerHTML = '';
        list.forEach(function (row, idx) {
          box.appendChild(el('div', { class: 'gx-builder__chip-row' }, [
            select(row.bp, bpItems, function (v) { row.bp = v; render(); }),
            select(row.size, gutItems, function (v) { row.size = v; render(); }),
            iconBtn('×', 'Retirer', function () { list.splice(idx, 1); renderResp(box, list); render(); })
          ]));
        });
      }
      renderResp(gapRespBox, state.gapResp);
      renderResp(padRespBox, state.padResp);
      var gutterGroup = group('Gouttières', [
        el('div', { class: 'gx-builder__subhead' }, [el('span', { text: 'Gap' })]),
        el('div', { class: 'gx-builder__grid2' }, [
          field('Axe', select(state.gapAxis, axisItems, function (v) { state.gapAxis = v; render(); })),
          field('Taille', select(state.gapSize, gutItems, function (v) { state.gapSize = v; render(); }))
        ]),
        gapRespBox,
        addBtn('Palier de gap responsive', function () {
          state.gapResp.push({ bp: bpWideName(), size: lastGut() }); renderResp(gapRespBox, state.gapResp); render();
        }),
        el('div', { class: 'gx-builder__subhead' }, [el('span', { text: 'Padding' })]),
        el('div', { class: 'gx-builder__grid2' }, [
          field('Axe', select(state.padAxis, axisItems, function (v) { state.padAxis = v; render(); })),
          field('Taille', select(state.padSize, gutItems, function (v) { state.padSize = v; render(); }))
        ]),
        padRespBox,
        addBtn('Palier de padding responsive', function () {
          state.padResp.push({ bp: bpWideName(), size: lastGut() }); renderResp(padRespBox, state.padResp); render();
        })
      ]);
      function bpWideName() { return hasBp('desktop') ? 'desktop' : bpNames()[bpNames().length - 1]; }
      function lastGut() { var g = gutNames(); return g[g.length - 1]; }

      // --- Alignment group ---
      var alignGroup = group('Alignement', [
        el('div', { class: 'gx-builder__grid2' }, [
          field('Horizontal', select(state.alignX, [['', '—'], ['left', 'left'], ['right', 'right'], ['center', 'center'], ['justify', 'justify'], ['spaced', 'spaced']], function (v) { state.alignX = v; render(); })),
          field('Vertical', select(state.alignY, [['', '—'], ['top', 'top'], ['middle', 'middle'], ['bottom', 'bottom'], ['stretch', 'stretch']], function (v) { state.alignY = v; render(); }))
        ])
      ]);

      // --- Cells / Block editor group ---
      var editorKids = [];
      if (state.mode === 'block') {
        var blockBox = el('div', { class: 'gx-builder__repeat' });
        function renderBlock() {
          blockBox.innerHTML = '';
          state.blockBreaks.forEach(function (b, idx) {
            blockBox.appendChild(el('div', { class: 'gx-builder__chip-row' }, [
              select(b.bp, bpItems, function (v) { b.bp = v; render(); }),
              select(String(b.n), nItems, function (v) { b.n = parseInt(v, 10); render(); }),
              iconBtn('×', 'Retirer', function () { if (state.blockBreaks.length > 1) { state.blockBreaks.splice(idx, 1); renderBlock(); render(); } })
            ]));
          });
        }
        renderBlock();
        editorKids = [
          el('p', { class: 'gx-builder__hint', text: 'Nombre de cellules par ligne, par breakpoint.' }),
          blockBox,
          addBtn('Palier (breakpoint)', function () { state.blockBreaks.push({ bp: bpWideName(), n: 3 }); renderBlock(); render(); }),
          field('Nombre de cellules', number(String(state.blockCount), 1, 24, '8', function (v) { state.blockCount = parseInt(v || '1', 10); render(); }))
        ];
      } else {
        var cellsBox = el('div', { class: 'gx-builder__cells' });
        function renderClassicCells() {
          cellsBox.innerHTML = '';
          state.cells.forEach(function (cell, idx) {
            var sizesBox = el('div', { class: 'gx-builder__repeat' });
            cell.sizes.forEach(function (sz, si) {
              sizesBox.appendChild(el('div', { class: 'gx-builder__chip-row' }, [
                select(sz.bp, bpItems, function (v) { sz.bp = v; render(); }),
                select(sz.size, cellSizeItems, function (v) { sz.size = v; render(); }),
                iconBtn('×', 'Retirer ce palier', function () { if (cell.sizes.length > 1) { cell.sizes.splice(si, 1); renderClassicCells(); render(); } })
              ]));
            });
            var head = el('div', { class: 'gx-builder__cell-head' }, [
              el('span', { class: 'gx-builder__cell-name', text: 'Cellule ' + (idx + 1) }),
              iconBtn('×', 'Supprimer la cellule', function () { if (state.cells.length > 1) { state.cells.splice(idx, 1); renderClassicCells(); render(); } })
            ]);
            var offset = el('div', { class: 'gx-builder__grid2' }, [
              field('Offset bp', select(cell.offsetBp, bpItems, function (v) { cell.offsetBp = v; render(); })),
              field('Offset', number(cell.offset, 0, cols() - 1, '0', function (v) { cell.offset = v; render(); }))
            ]);
            cellsBox.appendChild(el('div', { class: 'gx-builder__cell' }, [
              head, sizesBox,
              addBtn('Palier (breakpoint)', function () { cell.sizes.push({ bp: bpNames()[0], size: '6' }); renderClassicCells(); render(); }),
              offset
            ]));
          });
        }
        renderClassicCells();
        editorKids = [
          cellsBox,
          addBtn('Ajouter une cellule', function () { state.cells.push({ sizes: [{ bp: bpNames()[0], size: '6' }], offsetBp: bpNames()[0], offset: '' }); renderClassicCells(); render(); })
        ];
      }
      var editorGroup = group(state.mode === 'block' ? 'Block grid' : 'Cellules', editorKids);

      panelHost.innerHTML = '';
      panelHost.appendChild(el('aside', { class: 'gx-builder__panel' }, [dispoGroup, gutterGroup, alignGroup, editorGroup]));
    }

    // ---- main column ----
    var main = el('div', { class: 'gx-builder__main' }, [
      el('div', { class: 'gx-builder__pane-title' }, [
        el('span', { text: 'Aperçu en direct' }),
        el('div', { class: 'gx-builder__viewport-controls' }, [el('span', { text: 'Viewport :' }), viewportHost])
      ]),
      previewWrap,
      el('div', { class: 'gx-builder__pane-title' }, [el('span', { text: 'HTML généré' }), copyBtn]),
      el('div', { class: 'gx-builder__code' }, [el('pre', {}, [codeEl])])
    ]);

    // --- Configuration: collapsible section, outside the side panel ---
    var configFieldsHost = el('div', { class: 'gx-builder__config-fields' });
    var configSection = el('details', { class: 'gx-builder__group gx-builder__config' });
    configSection.appendChild(el('summary', { class: 'gx-builder__group-head' }, [
      el('span', { text: 'Configuration' }),
      el('span', { class: 'gx-builder__config-sub', text: 'colonnes · breakpoints · gouttières → _gridaflex-settings.scss' })
    ]));
    configSection.appendChild(el('div', { class: 'gx-builder__config-grid' }, [
      configFieldsHost,
      el('div', { class: 'gx-builder__config-out' }, [
        el('div', { class: 'gx-builder__pane-title' }, [
          el('span', { text: '_gridaflex-settings.scss' }),
          el('div', { class: 'gx-builder__pane-actions' }, [copyCfgBtn, downloadBtn])
        ]),
        el('div', { class: 'gx-builder__code' }, [el('pre', {}, [configCodeEl])])
      ])
    ]));

    function mountConfig() {
      configFieldsHost.innerHTML = '';
      configFieldsHost.appendChild(el('div', { class: 'gx-builder__grid2' }, [
        field('Colonnes', number(String(cols()), 1, 48, '12', function (v) {
          state.config.columns = Math.max(1, Math.min(48, parseInt(v || '12', 10))); refresh();
        }, 'change')),
        field('Conteneur (max-width)', text(state.config.container, '1200px', function (v) { state.config.container = v.trim() || '1200px'; render(); }, 'input'))
      ]));

      var bpRows = el('div', { class: 'gx-builder__repeat' });
      state.config.breakpoints.forEach(function (b, idx) {
        bpRows.appendChild(el('div', { class: 'gx-builder__chip-row gx-builder__chip-row--bp' }, [
          text(b.name, 'nom', function (v) { b.name = v.trim() || b.name; }, 'change'),
          number(String(b.value), 0, 5000, 'px', function (v) { b.value = parseInt(v || '0', 10); render(); }, 'input'),
          iconBtn('×', 'Retirer ce breakpoint', function () {
            if (state.config.breakpoints.length > 1) { state.config.breakpoints.splice(idx, 1); refresh(); }
          })
        ]));
      });
      bpRows.addEventListener('change', function (e) { if (e.target.type === 'text') refresh(); });

      var gutRows = el('div', { class: 'gx-builder__repeat' });
      state.config.gutters.forEach(function (g, idx) {
        var locked = g.name === 'default';
        gutRows.appendChild(el('div', { class: 'gx-builder__chip-row gx-builder__chip-row--bp' }, [
          locked ? el('input', { type: 'text', value: 'default', disabled: 'disabled' }) : text(g.name, 'nom', function (v) { g.name = v.trim() || g.name; }, 'change'),
          number(String(parseFloat(g.value) || 0), 0, 200, 'px', function (v) { g.value = (v || '0') + 'px'; render(); }, 'input'),
          locked ? el('span', { class: 'gx-builder__icon-spacer' }) : iconBtn('×', 'Retirer cette taille', function () {
            state.config.gutters.splice(idx, 1); refresh();
          })
        ]));
      });
      gutRows.addEventListener('change', function (e) { if (e.target.type === 'text' && !e.target.disabled) refresh(); });

      configFieldsHost.appendChild(el('div', { class: 'gx-builder__subhead' }, [el('span', { text: 'Breakpoints' }), el('span', { class: 'gx-builder__subhead-hint', text: 'nom · seuil px' })]));
      configFieldsHost.appendChild(bpRows);
      configFieldsHost.appendChild(addBtn('Ajouter un breakpoint', function () { state.config.breakpoints.push({ name: 'bp' + (state.config.breakpoints.length + 1), value: 1000 }); refresh(); }));
      configFieldsHost.appendChild(el('div', { class: 'gx-builder__subhead' }, [el('span', { text: 'Tailles de gouttières' }), el('span', { class: 'gx-builder__subhead-hint', text: 'nom · valeur px' })]));
      configFieldsHost.appendChild(gutRows);
      configFieldsHost.appendChild(addBtn('Ajouter une taille', function () { state.config.gutters.push({ name: 'taille' + (state.config.gutters.length), value: '24px' }); refresh(); }));
    }

    root.appendChild(el('div', { class: 'gx-builder__root' }, [
      configSection,
      el('div', { class: 'gx-builder__layout' }, [panelHost, main])
    ]));
    mountConfig();
    mountPanel();
    mountViewport();
    render();
  }

  function boot() { document.querySelectorAll('#gx-builder').forEach(init); }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
  if (window.document$ && typeof window.document$.subscribe === 'function') window.document$.subscribe(boot);
})();
