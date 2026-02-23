import { useEffect, useRef } from 'react';
import presenterMarkup from '../legacy/presenter/presenterMarkup';
import '../legacy/presenter/presenter.css';
import { mountPresenter } from '../legacy/presenter/initPresenter';

export default function PresenterRoute() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return () => {};

    window.APP_CONFIG = window.APP_CONFIG || {};
    root.innerHTML = presenterMarkup;

    let cleanup = () => {};
    mountPresenter({ root }).then((fn) => { cleanup = fn || (() => {}); });
    return () => cleanup();
  }, []);

  return <div id="lnp-root" ref={rootRef} />;
}
