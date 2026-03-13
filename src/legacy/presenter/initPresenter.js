import { loadScript } from '../shared/loadScript';

function trackGlobalBindings() {
  const listeners = [];
  const originalWindowAdd = window.addEventListener;
  const originalDocumentAdd = document.addEventListener;

  window.addEventListener = function patched(type, handler, options) {
    listeners.push({ target: window, type, handler, options });
    return originalWindowAdd.call(window, type, handler, options);
  };

  document.addEventListener = function patched(type, handler, options) {
    listeners.push({ target: document, type, handler, options });
    return originalDocumentAdd.call(document, type, handler, options);
  };

  return () => {
    window.addEventListener = originalWindowAdd;
    document.addEventListener = originalDocumentAdd;
    listeners.forEach(({ target, type, handler, options }) => target.removeEventListener(type, handler, options));
  };
}

async function initUploadedHeader() {
  const UPLOADED_HEADER_DATAURL_KEY = 'LNP_UPLOADED_HEADER_DATAURL_V1';
  const LNP_IDB_NAME = 'LNPresentsDB';
  const LNP_IDB_VERSION = 1;
  const LNP_IDB_STORE = 'kv';
  const LNP_IDB_KEY = 'uploadedHeaderV1';

  const img = document.getElementById('repHeaderImg');
  if (!img) return;

  img.style.display = 'none';
  img.onerror = function onError() { this.style.display = 'none'; };
  img.onload = function onLoad() { this.style.display = ''; };

  function openLnpDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(LNP_IDB_NAME, LNP_IDB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(LNP_IDB_STORE)) db.createObjectStore(LNP_IDB_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbGet(key) {
    const db = await openLnpDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(LNP_IDB_STORE, 'readonly');
      const req = tx.objectStore(LNP_IDB_STORE).get(key);
      req.onsuccess = () => { try { db.close(); } catch (_) {} resolve(req.result); };
      req.onerror = () => { try { db.close(); } catch (_) {} reject(req.error); };
    });
  }

  try {
    const obj = await idbGet(LNP_IDB_KEY);
    if (obj && obj.dataUrl) {
      img.src = String(obj.dataUrl);
      return;
    }
  } catch (_) {}

  try {
    const dataUrl = localStorage.getItem(UPLOADED_HEADER_DATAURL_KEY) || '';
    if (dataUrl) img.src = String(dataUrl);
  } catch (_) {}
}

export async function mountPresenter({ root }) {
  if (!root) return () => {};

  const restoreTracked = trackGlobalBindings();

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
  await loadScript('https://www.googletagmanager.com/gtag/js?id=G-N7EP6C4NDE', { async: true });
  window.gtag('js', new Date());
  window.gtag('config', 'G-N7EP6C4NDE');

  try {
    const mod = await import('html2pdf.js');
    window.html2pdf = mod.default || mod;
  } catch (_) {
    await loadScript('https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js', { crossorigin: 'anonymous' });
  }

  const [configText, initText] = await Promise.all([
    fetch('/config.js').then((r) => r.text()),
    fetch('/init.js').then((r) => r.text())
  ]);

  // eslint-disable-next-line no-new-func
  new Function(configText)();
  // eslint-disable-next-line no-new-func
  new Function(initText)();

  await initUploadedHeader();

  return () => {
    restoreTracked();
    delete window.__lnpPdfExporting;
  };
}
