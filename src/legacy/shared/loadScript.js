const loadedScripts = new Map();

export function loadScript(src, { async = true, attrs = {} } = {}) {
  if (loadedScripts.has(src)) return loadedScripts.get(src);

  const promise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-legacy-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve(existing);
      existing.addEventListener('load', () => resolve(existing), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.dataset.legacySrc = src;
    Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve(script);
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.appendChild(script);
  });

  loadedScripts.set(src, promise);
  return promise;
}
