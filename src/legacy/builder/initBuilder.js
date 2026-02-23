function trackGlobalBindings() {
  const listeners = [];
  const timers = [];

  const originalWindowAdd = window.addEventListener;
  const originalDocumentAdd = document.addEventListener;
  const originalSetInterval = window.setInterval;
  const originalSetTimeout = window.setTimeout;

  window.addEventListener = function patched(type, handler, options) {
    listeners.push({ target: window, type, handler, options });
    return originalWindowAdd.call(window, type, handler, options);
  };

  document.addEventListener = function patched(type, handler, options) {
    listeners.push({ target: document, type, handler, options });
    return originalDocumentAdd.call(document, type, handler, options);
  };

  window.setInterval = function patched(handler, timeout, ...args) {
    const id = originalSetInterval.call(window, handler, timeout, ...args);
    timers.push({ kind: 'interval', id });
    return id;
  };

  window.setTimeout = function patched(handler, timeout, ...args) {
    const id = originalSetTimeout.call(window, handler, timeout, ...args);
    timers.push({ kind: 'timeout', id });
    return id;
  };

  return () => {
    window.addEventListener = originalWindowAdd;
    document.addEventListener = originalDocumentAdd;
    window.setInterval = originalSetInterval;
    window.setTimeout = originalSetTimeout;

    listeners.forEach(({ target, type, handler, options }) => target.removeEventListener(type, handler, options));
    timers.forEach(({ kind, id }) => {
      if (kind === 'interval') clearInterval(id);
      else clearTimeout(id);
    });
  };
}

export async function mountBuilder({ root, navigate }) {
  if (!root) return () => {};

  const cssId = 'lnp-builder-style';
  if (!document.getElementById(cssId)) {
    const link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.href = '/src/legacy/builder/builder.css';
    document.head.appendChild(link);
  }

  const html = await fetch('/LNPresents-Builder.html').then((r) => r.text());

  const headClose = html.indexOf('</head>');
  const afterHead = headClose >= 0 ? html.slice(headClose + 7) : html;
  const scripts = [];
  const markup = afterHead
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (_, code) => {
      scripts.push(code);
      return '';
    })
    .replace(/<\/?body[^>]*>/gi, '')
    .replace(/<\/?html[^>]*>/gi, '');

  root.innerHTML = markup;

  const restoreTracked = trackGlobalBindings();
  const originalOpen = window.open;
  window.open = function patchedOpen(url, target, features) {
    if (typeof url === 'string' && /LNPresents-Presenter\.html/.test(url)) {
      navigate('/presenter');
      return window;
    }
    return originalOpen.call(window, url, target, features);
  };

  window.__LNP_REACT_NAVIGATE__ = navigate;

  scripts.forEach((code) => {
    const patched = code
      .replace(/\.\/LNPresents-Presenter\.html/g, '/presenter')
      .replace(/location\.href\s*=\s*PRESENTER_URL/g, "window.__LNP_REACT_NAVIGATE__('/presenter')");
    // eslint-disable-next-line no-new-func
    new Function(patched)();
  });

  return () => {
    restoreTracked();
    window.open = originalOpen;
    delete window.__LNP_REACT_NAVIGATE__;
    root.innerHTML = '';
  };
}
