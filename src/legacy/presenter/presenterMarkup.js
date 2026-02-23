const presenterMarkup = `
<section id="presenter" class="presenter-root">
  <!-- Header -->
  <header class="ln-header">
    <!-- Left: header image -->
    <div class="ln-header-left">
      <img
        id="repHeaderImg"
        src=""
        class="ln-header-image"
        alt=""
        style="display:none;"
      />
    </div>
    

    <!-- Center: drawer + export PDF button -->
    <div class="ln-header-center"></div>

    <!-- Right: existing LN logo -->
    <div class="ln-header-right">
      <a class="ln-logo-company">
        <img
          src="./ln-logo.png"
          alt="LexisNexis"
          width="200"
          height="70"
          onerror="this.style.display='none';"
        />
      </a>
    </div>
  </header>

  <div class="drawer">
    <button class="drawer-button" id="drawerCta">
      <span data-key="ui.drawerCta"></span>
    </button>
  </div>

  <button type="button" id="exportPdfBtn" class="exportPdfBtn">
    Export PDF
  </button>

  <main>
    <!-- Hero / Title -->
    <section class="hero">
      <h1 data-key="ui.headline"></h1>
      <p data-key="ui.subhead" class="subhead"></p>
    </section>

    <!-- Term selector -->
    <section class="selector">
      <label class="selector-label" data-key="ui.selectorLabel" id="proposalTitle"></label>
      <div id="termRadios"></div>
    </section>

    <!-- Plans -->
    <section class="plans">
      <div id="plans" class="plans-grid"></div>

      <!-- Card template -->
      <template id="planCardTpl">
        <article class="plan-card">
          <header class="plan-card__header">
            <h3 class="plan-card__title"></h3>
            <p class="plan-card__desc"></p>
          </header>
          <ul class="plan-card__features rte-html"></ul>
          <div class="plan-card__terms" hidden>
            <div class="plan-card__terms-title">Plan Terms</div>
            <ul class="plan-card__terms-list"></ul>
          </div>
          <footer class="plan-card__footer">
            <a class="btn-primary plan-card__cta" rel="noopener noreferrer" target="_blank"></a>
          </footer>
        </article>
      </template>
    </section>
  </main>

  <footer class="site-footer">
    <small>&copy; <span data-key="ui.companyName"></span></small>
  </footer>
</section>

<!-- libs first -->


<!-- your app scripts -->


`;
export default presenterMarkup;
