import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import builderMarkup from '../legacy/builder/builderMarkup';
import '../legacy/builder/builder.css';
import { mountBuilder } from '../legacy/builder/initBuilder';

export default function BuilderRoute() {
  const rootRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return () => {};

    window.APP_CONFIG = window.APP_CONFIG || {};
    root.innerHTML = builderMarkup;

    const unmount = mountBuilder({ root, navigate });
    return () => unmount?.();
  }, [navigate]);

  return <div id="lnp-root" ref={rootRef} />;
}
