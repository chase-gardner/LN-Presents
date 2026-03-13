import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mountBuilder } from '../legacy/builder/initBuilder';
import '../legacy/builder/builder.css';

export default function BuilderRoute() {
  const rootRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.APP_CONFIG = window.APP_CONFIG || {};

    let cleanup = () => {};
    mountBuilder({ root: rootRef.current, navigate }).then((fn) => {
      cleanup = typeof fn === 'function' ? fn : () => {};
    });

    return () => cleanup();
  }, [navigate]);

  return <div id="lnp-root" ref={rootRef} />;
}
