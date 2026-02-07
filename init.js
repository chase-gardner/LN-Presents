/**
 * Presenter init
 * - placeholder binding
 * - term chips
 * - plan rendering
 * - PDF export
 *
 * Includes: Presenter-side RTE cleanup pipeline
 * Preserves: bold/italic/underline/color/bullets/links
 * Fixes: giant spacing, empty blocks, excessive <br>, messy pasted divs/spans
 */

(function () {
  const cfg = window.APP_CONFIG || {};

  // --- Helpers ---
  const get = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);

  function safeParseJSON(str, fallback) {
    try {
      const v = JSON.parse(str);
      return v && typeof v === "object" ? v : fallback;
    } catch {
      return fallback;
    }
  }

  function getStoredFormVars() {
    // Presenter must not assume builder globals exist
    try {
      return safeParseJSON(localStorage.getItem("clgFormVars") || "{}", {});
    } catch {
      return {};
    }
  }

  // Replace all {{dot.path}} placeholders across the document (safe for <head> as well)
  function replacePlaceholders(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const parts = [];
    while (walker.nextNode()) parts.push(walker.currentNode);

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

    if (terms.length > 3) root.classList.add('termRadios--twoRows');
    else root.classList.remove('termRadios--twoRows');

    root.innerHTML = terms.map((t, idx) => {
      const id = `term-${idx}`;
      const checked = idx === 0 ? 'checked' : '';
      return `
        <label class="radio-chip" for="${id}">
          <input type="radio" name="term" id="${id}" value="${t.value ?? (idx + 1)}" ${checked} aria-label="${escapeHtml(t.label)}"/>
          <span>${escapeHtml(t.label)}</span>
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
        // If the template used <ul>/<ol>, swap it to <div> so freeform HTML doesn't inherit bullets incorrectly
        if (/^(UL|OL)$/i.test(featuresEl.tagName)) {
          const div = document.createElement('div');
          div.className = featuresEl.className;
          featuresEl.replaceWith(div);
          featuresEl = div;
        }
        featuresEl.classList.add('rte-html');

        const htmlIn = (p.bodyHtml ?? p.contentsHtml ?? '');
        if (htmlIn && String(htmlIn).trim() !== '') {
          featuresEl.innerHTML = sanitizeAndNormalizePlanHtml(String(htmlIn));
        } else if (Array.isArray(p.features) && p.features.length) {
          featuresEl.innerHTML = p.features.map(t => `<p>${escapeHtml(t)}</p>`).join('');
        } else {
          featuresEl.innerHTML = '';
        }
      }

      const ctaEl = frag.querySelector('.plan-card__cta');
      if (ctaEl) {
        const ctaUrl = (p.ctaUrl || '').trim();
        const fallbackLabel = 'This Month Only';
        const ctaLabel = (p.ctaLabel || p.cta || '').trim() || fallbackLabel;
        ctaEl.textContent = ctaLabel;
        if (ctaUrl) {
          ctaEl.setAttribute('href', ctaUrl);
          ctaEl.setAttribute('aria-label', `${ctaEl.textContent} (opens in a new tab)`);
          ctaEl.setAttribute('target', '_blank');
          ctaEl.setAttribute('rel', 'noopener noreferrer');
          ctaEl.removeAttribute('aria-disabled');
        } else {
          ctaEl.removeAttribute('href');
          ctaEl.removeAttribute('aria-label');
          ctaEl.removeAttribute('target');
          ctaEl.removeAttribute('rel');
          ctaEl.setAttribute('aria-disabled', 'true');
        }
      }

      const termsWrap = frag.querySelector('.plan-card__terms');
      const termsList = frag.querySelector('.plan-card__terms-list');
      if (termsWrap && termsList) {
        const terms = Array.isArray(p.terms) ? p.terms : [];
        if (terms.length) {
          termsList.innerHTML = terms.map(term => `<li>${escapeHtml(term.label)}</li>`).join('');
          termsWrap.hidden = false;
        } else {
          termsList.innerHTML = '';
          termsWrap.hidden = true;
        }
      }

      container.appendChild(frag);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // =========================
  // Presenter-side Cleanup Pipeline
  // =========================

  function sanitizeAndNormalizePlanHtml(rawHtml) {
    // 1) sanitize (allowed tags/attrs/styles)
    const sanitized = sanitizePlanHtml(rawHtml);

    // 2) normalize structure/spacing (Presenter safety net)
    return normalizePlanHtml(sanitized);
  }

  function sanitizePlanHtml(rawHtml) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = rawHtml;

    const allowedTags = new Set(['B','STRONG','I','EM','U','BR','SPAN','DIV','P','UL','OL','LI','A']);
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

        // Strip disallowed elements but keep children
        if (!allowedTags.has(tag)) {
          const parent = node.parentNode;
          while (node.firstChild) parent.insertBefore(node.firstChild, node);
          parent.removeChild(node);
          return;
        }

        // Attributes: keep href on <a>, keep style, keep class (only our size classes)
        const toRemove = [];
        for (const a of Array.from(node.attributes)) {
          const name = a.name.toLowerCase();
          if (name === 'href' && tag === 'A') continue;
          if (name === 'style') continue;
          if (name === 'class') continue;
          toRemove.push(name);
        }
        toRemove.forEach(n => node.removeAttribute(n));

        // Filter class → keep ONLY our rte-size-* classes
        if (node.hasAttribute('class')) {
          const kept = Array.from(node.classList).filter(c => allowedSizeClasses.has(c));
          if (kept.length) node.className = kept.join(' ');
          else node.removeAttribute('class');
        }

        // Filter style → keep only allowed styles (removes margin/padding/line-height/font-size/font-family/background/etc.)
        if (node.hasAttribute('style')) {
          const parts = node
            .getAttribute('style')
            .split(';')
            .map(s => s.trim())
            .filter(Boolean);

          const kept = [];
          for (const part of parts) {
            const idx = part.indexOf(':');
            if (idx === -1) continue;
            const prop = part.slice(0, idx).trim().toLowerCase();
            const val  = part.slice(idx + 1).trim();
            if (!prop || !val) continue;
            if (allowedStyles.has(prop)) kept.push(`${prop}:${val}`);
          }

          if (kept.length) node.setAttribute('style', kept.join(';'));
          else node.removeAttribute('style');
        }

        // Harden links
        if (tag === 'A') {
          node.target = '_blank';
          node.rel = 'noopener noreferrer';
        }
      }

      Array.from(node.childNodes).forEach(cleanNode);
    }

    Array.from(wrapper.childNodes).forEach(cleanNode);
    return wrapper.innerHTML;
  }

  function normalizePlanHtml(html) {
    const root = document.createElement('div');
    root.innerHTML = html;

    // A) repair lists: if UL/OL contains text nodes directly, wrap them as LI
    root.querySelectorAll('ul,ol').forEach(list => {
      const kids = Array.from(list.childNodes);
      kids.forEach(n => {
        if (n.nodeType === Node.TEXT_NODE) {
          const txt = (n.nodeValue || '').replace(/\u00a0/g, ' ').trim();
          if (!txt) {
            n.remove();
            return;
          }
          const li = document.createElement('li');
          li.textContent = txt;
          list.insertBefore(li, n);
          n.remove();
        }
      });
    });

    // B) convert "div-only paragraphs" into <p> when safe (reduces weird spacing)
    // Only convert DIVs that do not contain block children other than BR.
    root.querySelectorAll('div').forEach(div => {
      if (div.closest('ul,ol,li')) return;

      const hasBlockChild = Array.from(div.children).some(ch => {
        const t = ch.tagName ? ch.tagName.toUpperCase() : '';
        return ['P','DIV','UL','OL','LI','H1','H2','H3','H4','H5','H6','TABLE','BLOCKQUOTE'].includes(t);
      });

      if (hasBlockChild) return;

      // If it's basically inline content and/or brs, prefer <p>
      const p = document.createElement('p');
      p.innerHTML = div.innerHTML;
      div.replaceWith(p);
    });

    // C) collapse excessive <br> runs (max 2)
    collapseBrRuns(root, 2);

    // D) remove empty blocks (p/div/li) that are whitespace/nbsp-only (but keep non-empty list items)
    removeEmptyBlocks(root);

    // E) unwrap redundant spans with no attrs (Presenter cleanup)
    unwrapRedundantSpans(root);

    return root.innerHTML.trim();
  }

  function collapseBrRuns(root, maxRun) {
    const brs = Array.from(root.querySelectorAll('br'));
    brs.forEach(br => {
      // Only handle runs where this BR is the first in a sequence
      const prev = previousMeaningfulSibling(br);
      if (prev && prev.nodeType === 1 && prev.tagName && prev.tagName.toUpperCase() === 'BR') return;

      // Count run length
      let count = 1;
      let cur = nextMeaningfulSibling(br);
      while (cur && cur.nodeType === 1 && cur.tagName && cur.tagName.toUpperCase() === 'BR') {
        count++;
        cur = nextMeaningfulSibling(cur);
      }

      // Remove extras beyond maxRun
      if (count > maxRun) {
        let removeCount = count - maxRun;
        let node = nextMeaningfulSibling(br);
        while (node && removeCount > 0) {
          if (node.nodeType === 1 && node.tagName.toUpperCase() === 'BR') {
            const toRemove = node;
            node = nextMeaningfulSibling(node);
            toRemove.remove();
            removeCount--;
          } else {
            break;
          }
        }
      }
    });
  }

  function previousMeaningfulSibling(node) {
    let n = node.previousSibling;
    while (n && n.nodeType === 3 && (n.nodeValue || '').trim() === '') n = n.previousSibling;
    return n;
  }

  function nextMeaningfulSibling(node) {
    let n = node.nextSibling;
    while (n && n.nodeType === 3 && (n.nodeValue || '').trim() === '') n = n.nextSibling;
    return n;
  }

  function removeEmptyBlocks(root) {
    const candidates = root.querySelectorAll('p, div, li');
    candidates.forEach(el => {
      // Do not remove list items that contain nested lists
      if (el.tagName.toUpperCase() === 'LI' && el.querySelector('ul,ol')) return;

      const text = (el.textContent || '').replace(/\u00a0/g, ' ').trim();
      const hasMedia = el.querySelector('img,video,svg');
      const hasNonBrChild = Array.from(el.childNodes).some(n => {
        if (n.nodeType === 1) {
          const t = n.tagName.toUpperCase();
          return t !== 'BR';
        }
        if (n.nodeType === 3) return (n.nodeValue || '').trim() !== '';
        return false;
      });

      // If it's empty or only BRs, remove it
      if (!hasMedia && !hasNonBrChild && text === '') {
        el.remove();
      }
    });
  }

  function unwrapRedundantSpans(root) {
    root.querySelectorAll('span').forEach(span => {
      if (span.attributes.length === 0) {
        // no style/class/href etc.
        const parent = span.parentNode;
        while (span.firstChild) parent.insertBefore(span.firstChild, span);
        parent.removeChild(span);
      }
    });
  }

  // =========================
  // PDF filename
  // =========================

  function buildPdfFilename() {
    let firm = '';

    if (cfg.ui && cfg.ui.drawerCta) {
      firm = cfg.ui.drawerCta;
    } else {
      const stored = getStoredFormVars();
      firm = stored.clgFirmName || '';
    }

    if (!firm) firm = 'Firm';

    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${mm}-${dd}-${yyyy}`;

    const safeFirm = firm.replace(/[\/\\:*?"<>|]/g, '-');
    return `${safeFirm} - Proposals - ${dateStr}.pdf`;
  }

  /**
   * Create a clean clone of the presenter node for PDF:
   * - Injects a PDF-only header
   * - Strips all <img> tags
   * - Removes any CSS background-image:url(...) (keeps gradients)
   * - Simplifies selector layout so it renders cleanly in PDF (esp. on Windows)
   * - Removes export buttons
   */
  function makePrintNode(node) {
    const clone = node.cloneNode(true);

    clone.querySelectorAll('#exportPdfBtn, .btn-export, #btnExportPDF, .export-pdf, [data-print-hidden]')
      .forEach(el => el.remove());

    // Force headline to black in PDF if it matches your hero headline
    try {
      const headlineCandidate = Array.from(
        clone.querySelectorAll('h1, h2, h3, .hero-title, .presenter-heading, .page-title, div, span')
      ).find(
        el =>
          el.textContent &&
          el.textContent.trim().toLowerCase() === 'plans built just for you'
      );
      if (headlineCandidate) headlineCandidate.style.color = '#000000';
    } catch (e) {}

    // Simplify selector layout for PDF
    try {
      const selectorWrapper = clone.querySelector('.selector');
      if (selectorWrapper) {
        selectorWrapper.style.display = 'block';
        selectorWrapper.style.textAlign = 'center';
        selectorWrapper.style.placeItems = 'initial';
      }

      const selectorLabels = clone.querySelectorAll('.selector-label');
      selectorLabels.forEach(el => {
        el.style.display = 'block';
        el.style.width = '100%';
        el.style.margin = '0 0 6px 0';
        el.style.color = '#000000';
        el.style.background = 'transparent';
        el.style.letterSpacing = '0';
        el.style.wordSpacing = '0';
        el.style.whiteSpace = 'normal';
        el.style.lineHeight = '1.3';
        el.style.fontWeight = '700';
        el.style.textTransform = 'none';
        el.style.textShadow = 'none';
      });

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
    } catch (e) {}

    // PDF-only header
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

    const confidentialBadge = document.createElement('div');
    confidentialBadge.textContent = 'LexisNexis Confidential';
    confidentialBadge.style.marginLeft = 'auto';
    confidentialBadge.style.padding = '4px 10px';
    confidentialBadge.style.borderRadius = '999px';
    confidentialBadge.style.backgroundColor = '#111827';
    confidentialBadge.style.fontSize = '12px';
    confidentialBadge.style.fontWeight = '600';
    confidentialBadge.style.letterSpacing = '.16em';
    confidentialBadge.style.textTransform = 'uppercase';
    confidentialBadge.style.color = '#ffffff';
    confidentialBadge.style.border = '1px solid #1f2937';
    confidentialBadge.style.boxShadow = '0 0 0.5px rgba(0,0,0,.4)';

    headerRow.appendChild(title);
    headerRow.appendChild(confidentialBadge);
    pdfHeader.appendChild(eyebrow);
    pdfHeader.appendChild(headerRow);

    clone.insertBefore(pdfHeader, clone.firstChild);

    // Attach clone offscreen so we can read computed styles
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '-9999px';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Strip images
    wrapper.querySelectorAll('img').forEach(img => img.remove());

    // Remove background images with url(...) but keep gradients
    wrapper.querySelectorAll('*').forEach(el => {
      const cs = window.getComputedStyle(el);
      const bgImg = cs && cs.backgroundImage;
      if (bgImg && bgImg.includes('url(')) el.style.backgroundImage = 'none';
    });

    document.body.removeChild(wrapper);
    return clone;
  }

  async function exportPresenter({
    selector = '#presenter',
    filename,
    page = { format: 'a3', orientation: 'landscape' },
    margin = [5, 5, 0, 10],
    scale = 2
  } = {}) {
    const root = document.querySelector(selector);
    if (!root) {
      alert('Export failed: presenter root not found.');
      return;
    }

    if (!filename) filename = buildPdfFilename();

    const printNode = makePrintNode(root);

    const opt = {
      margin,
      filename,
      enableLinks: true,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale,
        useCORS: false,
        allowTaint: false,
        logging: false,
        onclone: (clonedDoc) => {
  // Add export class so CSS overrides apply in the capture clone
  const capRoot = clonedDoc.querySelector('#presenter');
  if (capRoot) capRoot.classList.add('pdf-export');

  // (optional but helpful) force CTA to avoid flex/gap in clone even if CSS misses
  clonedDoc.querySelectorAll('.plan-card__cta').forEach(cta => {
    cta.style.display = 'inline-block';
    cta.style.gap = '0';              // flex-gap can still be read; neutralize anyway
    cta.style.whiteSpace = 'nowrap';
    cta.style.transition = 'none';
    cta.style.transform = 'none';
    cta.style.filter = 'none';
  });

  // ...keep the rest of your onclone logic (strip imgs, remove url() bgs, etc.)
}
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

  function setupExportButton() {
    const btn = document.getElementById('exportPdfBtn');
    if (!btn) return;

    if (btn.dataset.exportBound === 'true') return;
    btn.dataset.exportBound = 'true';

    btn.addEventListener('click', async (evt) => {
      evt.preventDefault();

      if (window.__lnpPdfExporting) return;
      window.__lnpPdfExporting = true;

      try {
        if (typeof html2pdf === 'undefined') {
          alert('PDF export is unavailable because html2pdf did not load.');
          console.error('html2pdf is undefined – check script order/URL.');
          return;
        }

        await exportPresenter({ selector: '#presenter' });
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
