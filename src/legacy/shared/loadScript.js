const loadedScripts = new Map();

export function loadScript(src, attrs = {}) {
  if (loadedScripts.has(src)) return loadedScripts.get(src);

  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    const ready = Promise.resolve(existing);
    loadedScripts.set(src, ready);
    return ready;
  }

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === true) script.setAttribute(key, '');
      else if (value !== false && value != null) script.setAttribute(key, String(value));
    });
    script.onload = () => resolve(script);
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });

  loadedScripts.set(src, promise);
  return promise;
}
