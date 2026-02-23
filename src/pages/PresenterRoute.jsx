import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mountPresenter } from '../legacy/presenter/initPresenter';
import '../legacy/presenter/presenter.css';

export default function PresenterRoute() {
  const rootRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.APP_CONFIG = window.APP_CONFIG || {};

    let cleanup = () => {};
    mountPresenter({ root: rootRef.current, navigate }).then((fn) => {
      cleanup = typeof fn === 'function' ? fn : () => {};
    });

    return () => cleanup();
  }, [navigate]);

  return (
    <section id="presenter" className="presenter-root" ref={rootRef}>
      <header className="ln-header">
        <div className="ln-header-left">
          <img id="repHeaderImg" src="" className="ln-header-image" alt="" style={{ display: 'none' }} />
        </div>
        <div className="ln-header-center" />
        <div className="ln-header-right">
          <a className="ln-logo-company">
            <img src="./ln-logo.png" alt="LexisNexis" width="200" height="70" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </a>
        </div>
      </header>

      <div className="drawer">
        <button className="drawer-button" id="drawerCta">
          <span data-key="ui.drawerCta" />
        </button>
      </div>

      <button type="button" id="exportPdfBtn" className="exportPdfBtn">Export PDF</button>

      <main>
        <section className="hero">
          <h1 data-key="ui.headline" />
          <p data-key="ui.subhead" className="subhead" />
        </section>

        <section className="selector">
          <label className="selector-label" data-key="ui.selectorLabel" id="proposalTitle" />
          <div id="termRadios" />
        </section>

        <section className="plans">
          <div id="plans" className="plans-grid" />

          <template id="planCardTpl">
            <article className="plan-card">
              <header className="plan-card__header">
                <h3 className="plan-card__title" />
                <p className="plan-card__desc" />
              </header>
              <ul className="plan-card__features rte-html" />
              <div className="plan-card__terms" hidden>
                <div className="plan-card__terms-title">Plan Terms</div>
                <ul className="plan-card__terms-list" />
              </div>
              <footer className="plan-card__footer">
                <a className="btn-primary plan-card__cta" rel="noopener noreferrer" target="_blank" />
              </footer>
            </article>
          </template>
        </section>
      </main>

      <footer className="site-footer">
        <small>&copy; <span data-key="ui.companyName" /></small>
      </footer>
    </section>
  );
}
