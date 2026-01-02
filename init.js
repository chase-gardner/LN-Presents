/**
 * Very small "templating" layer:
 * - Replaces {{dot.path}} placeholders in HEAD/HTML with values in APP_CONFIG.
 * - Binds any [data-key="dot.path"] elements' textContent.
 * - Generates radio chips & plan cards from config arrays.
 *
 * Updated to:
 * - support dynamic term details from the form (up to 6, from cfg.ui.terms)
 * - support plans that carry HTML body (color/styling) from the form
 */

(function () {
  const cfg = window.APP_CONFIG || {};

  // --- Helpers ---
  const get = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
  const setText = (selectorOrEl, value) => {
    const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
    if (el && value != null) el.textContent = value;
  };

  // Replace all {{dot.path}} placeholders across the document (safe for <head> as well)
  function replacePlaceholders(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const parts = [];
    while (walker.nextNode()) {
      parts.push(walker.currentNode);
    }
    parts.forEach(node => {
      const txt = node.nodeValue;
      if (txt && txt.includes('{{')) {
        node.nodeValue = txt.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, key) => {
          const v = get(cfg, key.trim());
          return v == null ? '' : String(v);
        });
      }
    });
  }

  // Bind data-key elements
  function bindDataKeys() {
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      const v = get(cfg, key);
      if (v != null) el.textContent = v;
    });
  }

  function renderTerms() {
    const root = document.getElementById('termRadios');
    if (!root) return;

    const terms = (cfg.ui && cfg.ui.terms ? cfg.ui.terms : []).slice(0, 6);

    // if 3 or fewer → keep your current single-row behavior
    if (terms.length > 3) {
      root.classList.add('termRadios--twoRows');
    } else {
      root.classList.remove('termRadios--twoRows');
    }

    root.innerHTML = terms.map((t, idx) => {
      const id = `term-${idx}`;
      const checked = idx === 0 ? 'checked' : '';
      return `
        <label class="radio-chip" for="${id}">
          <input type="radio" name="term" id="${id}" value="${t.value ?? (idx + 1)}" ${checked} aria-label="${t.label}"/>
          <span>${t.label}</span>
        </label>
      `;
    }).join('');
  }

  function renderPlans() {
    const container = document.getElementById('plans');
    const tpl = document.getElementById('planCardTpl');
    if (!container || !tpl) return;
    container.innerHTML = '';

    const plans = (cfg.ui && cfg.ui.plans) || [];

    plans.forEach(p => {
      const frag = tpl.content.cloneNode(true);

      const titleEl = frag.querySelector('.plan-card__title');
      const descEl  = frag.querySelector('.plan-card__desc');
      if (titleEl) titleEl.textContent = p.tier || '';
      if (descEl)  descEl.textContent  = p.description || '';

      // NOTE: allow re-assignment because we might replace UL/OL with DIV
      let featuresEl = frag.querySelector('.plan-card__features');
      if (featuresEl) {
        // If the template used <ul>/<ol>, swap it to <div> so freeform HTML doesn't inherit bullets
        if (/^(UL|OL)$/i.test(featuresEl.tagName)) {
          const div = document.createElement('div');
          div.className = featuresEl.className;
          featuresEl.replaceWith(div);
          featuresEl = div;
        }
        featuresEl.classList.add('rte-html');

        const htmlIn = (p.bodyHtml ?? p.contentsHtml ?? '');
        if (htmlIn && String(htmlIn).trim() !== '') {
          featuresEl.innerHTML = sanitizePlanHtml(htmlIn);
        } else if (Array.isArray(p.features) && p.features.length) {
          featuresEl.innerHTML = p.features.map(t => `<p>${escapeHtml(t)}</p>`).join('');
        } else {
          featuresEl.innerHTML = '';
        }
      }

      const ctaEl = frag.querySelector('.plan-card__cta');
      if (ctaEl) ctaEl.textContent = p.cta || 'Select plan';

      container.appendChild(frag);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function renderPlanContents(rawHtml, targetEl) {
    const hasList =
      rawHtml.includes('<ul') ||
      rawHtml.includes('<ol') ||
      rawHtml.includes('<li');

    // keep blank lines
    targetEl.style.whiteSpace = 'pre-wrap';

    // we’re no longer auto-building <ul><li> – just show what the user gave us
    targetEl.innerHTML = rawHtml;
  }

  function bulletsFromHtmlPreserveBlanks(cleanHtml, ulEl) {
    // split on <br>, <br/>, or real newlines
    const parts = cleanHtml.split(/<br\s*\/?>|\r?\n/gi);

    ulEl.innerHTML = '';

    parts.forEach(segment => {
      const li = document.createElement('li');

      // empty or whitespace-only line → keep as spacer
      if (!segment || segment.trim() === '') {
        li.innerHTML = '&nbsp;';
        li.style.listStyleType = 'disc';   // still a bullet
        li.style.minHeight = '0.5rem';
      } else {
        // keep inline HTML that survived the sanitizer
        li.innerHTML = segment.trim();
      }

      ulEl.appendChild(li);
    });
  }

  // === build PDF filename from firm name + today's date ===
  function buildPdfFilename() {
    let firm = '';

    // 1) try common config paths
    if (cfg.ui && cfg.ui.firmName) {
      firm = cfg.ui.firmName;
    } else if (cfg.details && cfg.details.firmName) {
      firm = cfg.details.firmName;
    } else if (cfg.client && cfg.client.firmName) {
      firm = cfg.client.firmName;
    } else if (cfg.firmName) {
      firm = cfg.firmName;
    }

    // 2) fallback: scrape from whatever element is already showing firm name
    if (!firm) {
      const el =
        document.querySelector('[data-key$="firmName"]') ||
        document.querySelector('[data-key*="Firm Name"]') ||
        document.querySelector('[data-key*="firm"]');
      if (el) firm = el.textContent.trim();
    }

    if (!firm) firm = 'Firm';

    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const safeFirm = firm.replace(/[\/\\:*?"<>|]/g, '-'); // windows-safe

    return `${safeFirm} - Proposals - ${dateStr}.pdf`;
  }

  /**
   * Create a clean clone of the presenter node for PDF:
   * - Injects a PDF-only "LexisNexis Proposals" header
   * - Strips all <img> tags
   * - Removes any CSS background-image:url(...) (keeps gradients)
   * - Forces "Plans built just for you" to render black in PDF
   * - Simplifies the selector layout (label + chips) so it renders cleanly in PDF (esp. on Windows)
   * - Normalizes plan CTA text so lettering alignment is consistent in PDF
   * - Removes export buttons / print-hidden controls from the PDF
   * - Normalizes drawer layout so it sits below header and is left-aligned with 20px padding
   */
  function makePrintNode(node) {
    const clone = node.cloneNode(true);

    // --- Remove export controls so they never appear in the PDF ---
    clone.querySelectorAll('#exportPdfBtn, .btn-export, #btnExportPDF, .export-pdf, [data-print-hidden]')
      .forEach(el => el.remove());

    // --- 0) PDF-only tweaks to existing presenter content ---

    // 0a) Force the "Plans built just for you" headline to render black in the PDF
    try {
      const headlineCandidate = Array.from(
        clone.querySelectorAll(
          'h1, h2, h3, .hero-title, .presenter-heading, .page-title, div, span'
        )
      ).find(
        el =>
          el.textContent &&
          el.textContent.trim().toLowerCase() === 'plans built just for you'
      );
      if (headlineCandidate) {
        headlineCandidate.style.color = '#000000';
      }
    } catch (e) {
      console.warn('PDF headline color tweak skipped:', e);
    }

    // 0b) Simplify selector layout for PDF so the label and terms don't crowd/stack
    try {
      // Wrapper around label + term chips
      const selectorWrapper = clone.querySelector('.selector');
      if (selectorWrapper) {
        // Kill grid complexity in the PDF clone — simpler = fewer html2canvas bugs
        selectorWrapper.style.display = 'block';
        selectorWrapper.style.textAlign = 'center';
        selectorWrapper.style.placeItems = 'initial';
        selectorWrapper.style.alignItems = 'stretch';
        selectorWrapper.style.justifyContent = 'center';
      }

      // Actual label element
      const selectorLabels = clone.querySelectorAll('.selector-label');
      selectorLabels.forEach(el => {
        // Put label on its own line above the chips
        el.style.display = 'block';
        el.style.width = '100%';
        el.style.margin = '0 0 6px 0';

        // Text styling tuned for PDF (Windows friendly)
        el.style.color = '#000000';
        el.style.background = 'transparent';
        el.style.letterSpacing = '0';
        el.style.wordSpacing = '0';
        el.style.whiteSpace = 'normal';
        el.style.lineHeight = '1.3';
        el.style.fontWeight = '700';
        el.style.textTransform = 'none';  // avoid text-transform bugs
        el.style.textShadow = 'none';
      });

      // If, for some reason, markup changed and .selector-label isn't present,
      // fall back to searching for the common text.
      if (!selectorLabels.length) {
        const fallback = Array.from(
          clone.querySelectorAll('h2, h3, span, div')
        ).find(el => {
          const txt = (el.textContent || '').trim().toLowerCase();
          return txt === 'your proposal details' ||
                 txt === 'your proposal details:' ||
                 txt === 'your proposal options' ||
                 txt === 'your proposal options:';
        });

        if (fallback) {
          fallback.style.display = 'block';
          fallback.style.width = '100%';
          fallback.style.margin = '0 0 6px 0';
          fallback.style.color = '#000000';
          fallback.style.background = 'transparent';
          fallback.style.letterSpacing = '0';
          fallback.style.wordSpacing = '0';
          fallback.style.whiteSpace = 'normal';
          fallback.style.lineHeight = '1.3';
          fallback.style.fontWeight = '700';
          fallback.style.textTransform = 'none';
          fallback.style.textShadow = 'none';
        }
      }

      // Term chips container — force a clean flex row under the label
      const termRadios = clone.querySelector('#termRadios');
      if (termRadios) {
        termRadios.style.display = 'flex';
        termRadios.style.flexWrap = 'wrap';
        termRadios.style.justifyContent = 'center';
        termRadios.style.alignItems = 'center';
        termRadios.style.gap = '8px 10px';
        termRadios.style.marginTop = '4px';
        termRadios.style.width = '100%';
      }
    } catch (e) {
      console.warn('PDF selector layout tweak skipped:', e);
    }

    // 0c) Drawer container: ensure it participates in normal flow (no overlap)
    //     and is left-aligned with 20px padding in the PDF.
    try {
      // Try to match common drawer container selectors.
      // If your actual class is different, just add it here.
      const drawerContainer = clone.querySelector(
        '.drawer-container, .drawer, .drawer-row, .drawer-shell, [data-role="drawer"]'
      );

      if (drawerContainer) {
        const parent = drawerContainer.parentElement;

        // Make sure neither the parent nor the drawer are absolutely positioned
        if (parent) {
          parent.style.position = 'static';
          parent.style.display = 'block';
          parent.style.textAlign = 'left';
          parent.style.paddingLeft = '20px';   // 20px left pad for the row
        }

        drawerContainer.style.position = 'static';
        drawerContainer.style.transform = 'none';
        drawerContainer.style.left = 'auto';
        drawerContainer.style.right = 'auto';
        drawerContainer.style.top = 'auto';
        drawerContainer.style.bottom = 'auto';
        drawerContainer.style.margin = '12px 0 0 0'; // push it below head/subhead
        drawerContainer.style.marginLeft = '0';
        drawerContainer.style.marginRight = 'auto';
        drawerContainer.style.alignSelf = 'flex-start';
      }
    } catch (e) {
      console.warn('PDF drawer layout normalization skipped:', e);
    }

    // --- 1) Inject PDF-only page header at the very top ---
    const pdfHeader = document.createElement('div');
    pdfHeader.style.display = 'flex';
    pdfHeader.style.flexDirection = 'column';
    pdfHeader.style.alignItems = 'flex-start';
    pdfHeader.style.marginBottom = '12px';
    pdfHeader.style.paddingBottom = '8px';
    pdfHeader.style.borderBottom = '1px solid rgba(148,163,184,.6)';

    const eyebrow = document.createElement('div');
    eyebrow.textContent = 'LexisNexis\u00AE';
    eyebrow.style.fontSize = '10px';
    eyebrow.style.letterSpacing = '.14em';
    eyebrow.style.textTransform = 'uppercase';
    eyebrow.style.color = 'rgba(148,163,184,.9)';
    eyebrow.style.marginBottom = '4px';

    // Row that holds "Proposals" and the Confidential badge inline
    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.alignItems = 'center';
    headerRow.style.width = '100%';

    const title = document.createElement('div');
    title.textContent = 'Proposal';
    title.style.fontSize = '16px';
    title.style.fontWeight = '700';
    title.style.letterSpacing = '.12em';
    title.style.textTransform = 'uppercase';
    title.style.color = '#0f172a';

    // --- LexisNexis Confidential badge (darker gray pill, bold lettering) ---
    const confidentialBadge = document.createElement('div');
    confidentialBadge.textContent = 'LexisNexis Confidential';
    confidentialBadge.style.marginLeft = 'auto';              // push to right
    confidentialBadge.style.padding = '4px 10px';
    confidentialBadge.style.borderRadius = '999px';
    confidentialBadge.style.backgroundColor = '#111827';      // dark gray pill
    confidentialBadge.style.fontSize = '12px';
    confidentialBadge.style.fontWeight = '600';               // bold
    confidentialBadge.style.letterSpacing = '.16em';
    confidentialBadge.style.textTransform = 'uppercase';
    confidentialBadge.style.color = '#ffffff';
    confidentialBadge.style.border = '1px solid #1f2937';      // subtle edge
    confidentialBadge.style.boxShadow = '0 0 0.5px rgba(0,0,0,.4)';

    headerRow.appendChild(title);
    headerRow.appendChild(confidentialBadge);

    pdfHeader.appendChild(eyebrow);
    pdfHeader.appendChild(headerRow);

    // Put header at top of presenter clone
    clone.insertBefore(pdfHeader, clone.firstChild);

    // --- 2) Attach clone offscreen so we can use computed styles ---
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '-9999px';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // --- 3) Strip out all <img> tags (no local images in PDF) ---
    wrapper.querySelectorAll('img').forEach(img => img.remove());

    // --- 4) Remove any CSS background-images that use url(...) (but keep gradients) ---
    wrapper.querySelectorAll('*').forEach(el => {
      const cs = window.getComputedStyle(el);
      const bgImg = cs && cs.backgroundImage;
      if (bgImg && bgImg.includes('url(')) {
        el.style.backgroundImage = 'none';
      }
    });

    // --- 5) Normalize CTA text rendering for PDF (lettering alignment) ---
    wrapper.querySelectorAll('.plan-card__cta').forEach(cta => {
      cta.style.display = 'inline-block';
      cta.style.textAlign = 'center';
      cta.style.letterSpacing = '0';
      cta.style.textTransform = 'none';
      cta.style.lineHeight = '1.2';
    });

    // Detach from DOM and return clean clone
    document.body.removeChild(wrapper);
    return clone;
  }

  /** Main export: uses makePrintNode (no fetch, no images) */
  async function exportPresenter({
    selector = '#presenter',            // presenter root
    filename,
    page = { format: 'a3', orientation: 'landscape' }, // A3 landscape
    margin = [5, 5, 0, 10],          // mm — tweak if you need more room
    scale = 2
  } = {}) {
    const root = document.querySelector(selector);
    if (!root) {
      alert('Export failed: presenter root not found.');
      return;
    }

    // build default filename if one wasn’t provided
    if (!filename) {
      if (typeof buildPdfFilename === 'function') {
        filename = buildPdfFilename();
      } else {
        filename = 'LexisNexis Proposals.pdf';
      }
    }

    // Prepare a clean clone for PDF (no images / file-based backgrounds + PDF header)
    const printNode = makePrintNode(root);

    const opt = {
      margin,
      filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale,
        useCORS: false,    // not loading external images anymore
        allowTaint: false, // safer with no external images
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: page.format,
        orientation: page.orientation,
        compress: true
      },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    try {
      await html2pdf().set(opt).from(printNode).save();
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Export failed (browser security). If it persists, try a different browser.');
    }
  }

  function sanitizePlanHtml(rawHtml) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = rawHtml;

    // Allowed tags/attributes
    const allowedTags = new Set(['B','STRONG','I','EM','U','BR','SPAN','DIV','P','UL','OL','LI','A']);
    // Only keep these inline styles (no background, no font-family/size)
    const allowedStyles = new Set(['color','font-weight','font-style','text-decoration']);
    const allowedSizeClasses = new Set(['rte-size-body','rte-size-subhead','rte-size-head']);

    // Convert <font color="..."> → <span style="color:...">
    wrapper.querySelectorAll('font[color]').forEach(font => {
      const span = document.createElement('span');
      span.setAttribute('style', 'color:' + font.getAttribute('color'));
      span.innerHTML = font.innerHTML;
      font.replaceWith(span);
    });

    function cleanNode(node) {
      if (node.nodeType === Node.TEXT_NODE) return;

      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toUpperCase();

        // Strip disallowed elements but keep their children
        if (!allowedTags.has(tag)) {
          const parent = node.parentNode;
          while (node.firstChild) parent.insertBefore(node.firstChild, node);
          parent.removeChild(node);
          return;
        }

        // Attributes: keep href on <a>, keep style, and keep class (only our size classes)
        const toRemove = [];
        for (const a of node.attributes) {
          const name = a.name.toLowerCase();
          if (name === 'href' && tag === 'A') continue;
          if (name === 'style') continue;
          if (name === 'class') continue; // we will filter next
          // drop everything else (id, onclick, data-*, etc.)
          toRemove.push(name);
        }
        toRemove.forEach(n => node.removeAttribute(n));

        // Filter class → keep ONLY our rte-size-* classes
        if (node.hasAttribute('class')) {
          const kept = Array.from(node.classList).filter(c => allowedSizeClasses.has(c));
          if (kept.length) {
            node.className = kept.join(' ');
          } else {
            node.removeAttribute('class');
          }
        }

        // Filter style → keep only allowed styles; background/font-family/size are removed
        if (node.hasAttribute('style')) {
          const parts = node
            .getAttribute('style')
            .split(';')
            .map(s => s.trim())
            .filter(Boolean);

          const kept = [];
          for (const part of parts) {
            const [propRaw, valRaw] = part.split(':');
            if (!propRaw || !valRaw) continue;
            const prop = propRaw.trim().toLowerCase();
            const val  = valRaw.trim();

            if (allowedStyles.has(prop)) kept.push(`${prop}:${val}`);
          }

          if (kept.length) node.setAttribute('style', kept.join(';'));
          else node.removeAttribute('style');
        }

        // Harden links (open new tab, safe rel)
        if (tag === 'A') {
          node.target = '_blank';
          node.rel = 'noopener noreferrer';
        }
      }

      // Recurse
      [...node.childNodes].forEach(cleanNode);
    }
    [...wrapper.childNodes].forEach(cleanNode);
    return wrapper.innerHTML;
  }

  // === Wire the Export button once DOM is ready ===
  function setupExportButton() {
    const btn = document.getElementById('exportPdfBtn');
    if (!btn) {
      console.warn('Export button #exportPdfBtn not found in DOM.');
      return;
    }

    // Prevent double-binding if this script is included twice
    if (btn.dataset.exportBound === 'true') {
      return;
    }
    btn.dataset.exportBound = 'true';

    btn.addEventListener('click', async (evt) => {
      evt.preventDefault();

      // Global re-entry guard so one click only ever triggers a single export
      if (window.__lnpPdfExporting) {
        console.warn('PDF export already in progress; ignoring extra click.');
        return;
      }
      window.__lnpPdfExporting = true;

      try {
        if (typeof html2pdf === 'undefined') {
          alert('PDF export is unavailable because html2pdf did not load.');
          console.error('html2pdf is undefined – check script order/URL.');
          return;
        }

        const selector = '#presenter';
        const root = document.querySelector(selector);
        if (!root) {
          alert('Export failed: presenter root not found.');
          console.error('No element matches selector', selector);
          return;
        }

        await exportPresenter({ selector });
      } catch (err) {
        console.error('Error during PDF export:', err);
        alert('Export failed. Open the browser console for details.');
      } finally {
        window.__lnpPdfExporting = false;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupExportButton);
  } else {
    setupExportButton();
  }

  // Run initial UI render
  replacePlaceholders(document);
  bindDataKeys();
  renderTerms();
  renderPlans();
})();