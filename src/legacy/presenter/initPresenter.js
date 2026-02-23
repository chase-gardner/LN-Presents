import html2pdf from 'html2pdf.js';
import { loadScript } from '../shared/loadScript';
import { applyPresenterConfig } from './configPresenter';
import { initPresenterCore } from './presenterCore';

function initHeaderImageSync() {
  const UPLOADED_HEADER_DATAURL_KEY = 'LNP_UPLOADED_HEADER_DATAURL_V1';
  const LNP_IDB_NAME = 'LNPresentsDB';
  const LNP_IDB_VERSION = 1;
  const LNP_IDB_STORE = 'kv';
  const LNP_IDB_KEY = 'uploadedHeaderV1';

  const img = document.getElementById('repHeaderImg');
  if (!img) return;

  img.style.display = 'none';
  img.onerror = function onErr() { this.style.display = 'none'; };
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
      req.onsuccess = () => { try { db.close(); } catch (e) {} resolve(req.result); };
      req.onerror = () => { try { db.close(); } catch (e) {} reject(req.error); };
    });
  }

  (async () => {
    try {
      const obj = await idbGet(LNP_IDB_KEY);
      if (obj && obj.dataUrl) { img.src = String(obj.dataUrl); return; }
    } catch (e) {}

    const dataUrl = localStorage.getItem(UPLOADED_HEADER_DATAURL_KEY) || '';
    if (dataUrl) img.src = String(dataUrl);
  })();
}

export async function mountPresenter({ root }) {
  if (!root) throw new Error('mountPresenter requires a root element.');

  window.html2pdf = window.html2pdf || html2pdf;
  await loadScript('https://www.googletagmanager.com/gtag/js?id=G-N7EP6C4NDE', { async: true });

  window.APP_CONFIG = window.APP_CONFIG || {};
  applyPresenterConfig();
  initHeaderImageSync();
  initPresenterCore();

  return function unmount() {
    root.innerHTML = '';
  };
}
