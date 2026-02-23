import { loadScript } from '../shared/loadScript';

function createLegacyTracker() {
  const listeners = [];
  const intervals = new Set();
  const timeouts = new Set();

  const originalAdd = EventTarget.prototype.addEventListener;
  const originalSetInterval = window.setInterval;
  const originalSetTimeout = window.setTimeout;

  EventTarget.prototype.addEventListener = function patchedAdd(type, listener, options) {
    listeners.push({ target: this, type, listener, options });
    return originalAdd.call(this, type, listener, options);
  };

  window.setInterval = function patchedSetInterval(...args) {
    const id = originalSetInterval(...args);
    intervals.add(id);
    return id;
  };

  window.setTimeout = function patchedSetTimeout(...args) {
    const id = originalSetTimeout(...args);
    timeouts.add(id);
    return id;
  };

  return () => {
    EventTarget.prototype.addEventListener = originalAdd;
    window.setInterval = originalSetInterval;
    window.setTimeout = originalSetTimeout;

    listeners.forEach(({ target, type, listener, options }) => {
      try { target.removeEventListener(type, listener, options); } catch (e) {}
    });
    intervals.forEach((id) => clearInterval(id));
    timeouts.forEach((id) => clearTimeout(id));
  };
}

async function runBuilderScript({ navigate }) {
  await loadScript('https://cdn.jsdelivr.net/npm/dompurify@3.1.7/dist/purify.min.js', { attrs: { crossorigin: 'anonymous' } });

  const PRESENTER_ROUTE = '/presenter';
  const btn = document.getElementById('openPresenterBtn');
  if (btn && !btn.dataset.reactNavBound) {
    btn.dataset.reactNavBound = 'true';
    btn.addEventListener('click', () => {
      if (navigate) navigate(PRESENTER_ROUTE);
      else window.location.href = PRESENTER_ROUTE;
    });
  }

  await loadScript('/builder-init.js');

  const currentBtn = document.getElementById('openPresenterBtn');
  if (currentBtn) {
    const cleanBtn = currentBtn.cloneNode(true);
    currentBtn.replaceWith(cleanBtn);
    cleanBtn.addEventListener('click', () => {
      if (navigate) navigate(PRESENTER_ROUTE);
      else window.location.href = PRESENTER_ROUTE;
    });
  }
}

export function mountBuilder({ root, navigate }) {
  if (!root) throw new Error('mountBuilder requires a root element.');

  const teardownTracker = createLegacyTracker();
  runBuilderScript({ navigate });

  return function unmount() {
    teardownTracker();
    root.innerHTML = '';
  };
}
