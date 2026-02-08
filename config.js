// config.js

function safeParseJSON(str, fallback) {
  try {
    const v = JSON.parse(str);
    return v && typeof v === "object" ? v : fallback;
  } catch {
    return fallback;
  }
}

// Single source of truth for Presenter config inputs
const stored =
  safeParseJSON(localStorage.getItem("clgFormVars") || "{}", {}) ||
  (typeof window !== "undefined" ? (window.formVars || {}) : {});

// helper to format dates for legacy fields
function formatIsoToShort(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}

function formatCurrencyValue(value) {
  if (value == null) return "";
  const raw = String(value).trim();
  if (!raw) return "";

  const match = raw.match(/-?\d[\d,]*(?:\.\d+)?/);
  if (!match) return raw;

  const prefix = raw.slice(0, match.index).trim();
  if (prefix && /[a-z]/i.test(prefix)) return raw;

  const suffix = raw.slice(match.index + match[0].length).trim();
  const normalized = match[0].replace(/,/g, "");
  const num = Number(normalized);
  if (Number.isNaN(num)) return raw;

  const decimalPart = normalized.split(".")[1];
  const decimals = decimalPart ? decimalPart.length : 0;
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  const formatted = `$${formatter.format(num)}`;
  const suffixText = suffix ? ` ${suffix}` : "";
  const prefixText = prefix && prefix !== "$" ? `${prefix} ` : "";
  return `${prefixText}${formatted}${suffixText}`;
}

function formatPercentValue(value) {
  if (value == null) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  if (/%/.test(raw)) return raw;

  const match = raw.match(/-?\d[\d,]*(?:\.\d+)?/);
  if (!match) return raw;

  const prefix = raw.slice(0, match.index).trim();
  if (prefix && /[a-z]/i.test(prefix)) return raw;

  const suffix = raw.slice(match.index + match[0].length).trim();
  const normalized = match[0].replace(/,/g, "");
  const num = Number(normalized);
  if (Number.isNaN(num)) return raw;

  const decimalPart = normalized.split(".")[1];
  const decimals = decimalPart ? decimalPart.length : 0;
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  const formatted = `${formatter.format(num)}%`;
  const suffixText = suffix ? ` ${suffix}` : "";
  const prefixText = prefix ? `${prefix} ` : "";
  return `${prefixText}${formatted}${suffixText}`;
}

function normalizeTermValue(termKey, value) {
  if (value == null) return "";
  const currencyKeys = new Set(["currentSpend", "introPrice"]);
  const percentKeys = new Set(["yoyIncrease"]);

  if (currencyKeys.has(termKey)) return formatCurrencyValue(value);
  if (percentKeys.has(termKey)) return formatPercentValue(value);
  return value;
}

// Build terms array using current saved config (max 6, honoring selection)
function buildUiTerms() {
  const termsTilesState = stored.lnpTermsTiles && typeof stored.lnpTermsTiles === "object"
    ? stored.lnpTermsTiles
    : null;

  const tileTermsCatalog = {
    retention: [
      { id: "effectiveDate", label: "Effective Date", input: { type: "date", dataKey: "clgEffectiveDate" } },
      { id: "extensionTermEnd", label: "Extension Term End", input: { type: "date", dataKey: "clgExtensionTermEnd" } },
      { id: "extensionTerm", label: "Term Extension", input: { type: "select", dataKey: "clgExtensionTerm" } },
      { id: "yoyIncrease", label: "Year over Year Increase", input: { type: "text", dataKey: "clgYoyIncrease" } }
    ],
    newbiz: [
      { id: "activationDate", label: "Activation Date", input: { type: "date", dataKey: "clgActivationDate" } },
      { id: "introPrice", label: "Promo Price", input: { type: "text", dataKey: "clgIntroPrice" } },
      { id: "termStartDate", label: "Promo End Date", input: { type: "date", dataKey: "clgTermStartDate" } },
      { id: "termEndDate", label: "Term End Date", input: { type: "date", dataKey: "clgTermEndDate" } },
      { id: "nbExtensionTerm", label: "Term Length", input: { type: "select", dataKey: "clgnbExtensionTerm" } }
    ]
  };

  const tileTermById = (() => {
    const map = {};
    Object.keys(tileTermsCatalog).forEach(group => {
      tileTermsCatalog[group].forEach(t => { map[t.id] = { ...t, group }; });
    });
    return map;
  })();

  function formatLabel(base, value, type) {
    if (type === "date" && value) return `${base}: ${formatIsoToShort(value)}`;
    if (value) {
      const needsColon = !base.endsWith(":");
      return `${base}${needsColon ? ": " : " "}${value}`;
    }
    return base;
  }

  if (termsTilesState) {
    const deliveredRegular = [];
    const ctSel = termsTilesState.classicTermsSelected || {};
    const ctVal = termsTilesState.classicTermsValues || {};

    function pushRegular(key, label, rawVal, type) {
      if (!label) return;
      const normalizedValue = normalizeTermValue(key, rawVal);
      const finalLabel = formatLabel(label, normalizedValue, type);
      deliveredRegular.push({ key, label: finalLabel });
    }

    if (ctSel.attorneyCount) pushRegular("attorneyCount", "Attorney Count", ctVal.attorneyCount, "text");
    if (ctSel.currentSpend) pushRegular("currentSpend", "Current Spend", ctVal.currentSpend, "text");
    if (ctSel.currentTermEnd) pushRegular("currentTermEnd", "Current Term End", ctVal.currentTermEnd, "date");

    const ttState = termsTilesState.tileTermsState || {};
    const activeOrders = termsTilesState.activeTileTermsOrder || { retention: [], newbiz: [] };

    function maybePushTileRegular(termId) {
      const def = tileTermById[termId];
      if (!def) return;
      const st = ttState[termId];
      if (!st || !st.active || !st.appliesToAll) return;
      const val = st.globalValue || (def.input?.dataKey ? (stored[def.input.dataKey] || "") : "");
      pushRegular(termId, def.label, val, def.input?.type === "date" ? "date" : "text");
    }

    activeOrders.retention.forEach(maybePushTileRegular);
    activeOrders.newbiz.forEach(maybePushTileRegular);

    return deliveredRegular.slice(0, 6);
  }

  const selectedKeys = Array.isArray(stored.clgSelectedTerms)
    ? stored.clgSelectedTerms
    : [];

  const termDefs = [
    { key: "numAttorneys", labelBase: "Number of Attorneys", value: stored.clgNumAttorneys || "", type: "text" },
    { key: "yoyIncrease", labelBase: "Year over Year increase", value: stored.clgYoyIncrease || "", type: "text" },
    { key: "currentSpend", labelBase: "Current Spend", value: stored.clgCurrentSpend || "", type: "text" },
    { key: "effectiveDate", labelBase: "Effective Date", value: stored.clgEffectiveDate || "", type: "date" },
    { key: "currentTermEnd", labelBase: "Current Term End", value: stored.clgCurrentTermEnd || "", type: "date" },
    { key: "extensionTermEnd", labelBase: "Extension Term End", value: stored.clgExtensionTermEnd || "", type: "date" },
    { key: "extensionTerm", labelBase: "Term Extension", value: stored.clgExtensionTerm || "", type: "text" },
    { key: "ActivationDate", labelBase: "Activation Date", value: stored.clgActivationDate || "", type: "date" },
    { key: "introPrice", labelBase: "Promo Price", value: stored.clgIntroPrice || "", type: "text" },
    { key: "termStartDate", labelBase: "Promo End Date", value: stored.clgTermStartDate || "", type: "date" },
    { key: "termEndDate", labelBase: "Term End Date", value: stored.clgTermEndDate || "", type: "date" },
    { key: "nbExtensionTerm", labelBase: "Term Length", value: stored.clgnbExtensionTerm || "", type: "text" }
  ];

  const picked = [];
  for (const key of selectedKeys) {
    const def = termDefs.find(t => t.key === key);
    if (!def) continue;

    const normalizedValue = normalizeTermValue(def.key, def.value);
    const label = formatLabel(def.labelBase, normalizedValue, def.type);
    picked.push({ key: def.key, label });
    if (picked.length >= 6) break;
  }

  return picked;
}

// Build plans from stored.clgPlans; fall back if nothing is present
function buildUiPlans() {
  const rawPlans = Array.isArray(stored.clgPlans) ? stored.clgPlans : [];
  if (!rawPlans.length) {
    return [
      {
        id: 1,
        tier: "Lexis+ Core",
        description: "Signature primary research package",
        bodyHtml:
          "<p>Core primary law collection for your jurisdiction.</p><p>Includes citator and Shepardizing.</p>",
        features: [],
        cta: "This Month Only",
        ctaLabel: "This Month Only",
        ctaUrl: "",
        terms: []
      }
    ];
  }

  const termsTilesState = stored.lnpTermsTiles && typeof stored.lnpTermsTiles === "object"
    ? stored.lnpTermsTiles
    : null;

  const tileTermsCatalog = {
    retention: [
      { id: "effectiveDate", label: "Effective Date", input: { type: "date" } },
      { id: "extensionTermEnd", label: "Extension Term End", input: { type: "date" } },
      { id: "extensionTerm", label: "Term Extension", input: { type: "select" } },
      { id: "yoyIncrease", label: "Year over Year Increase", input: { type: "text" } }
    ],
    newbiz: [
      { id: "activationDate", label: "Activation Date", input: { type: "date" } },
      { id: "introPrice", label: "Promo Price", input: { type: "text" } },
      { id: "termStartDate", label: "Promo End Date", input: { type: "date" } },
      { id: "termEndDate", label: "Term End Date", input: { type: "date" } },
      { id: "nbExtensionTerm", label: "Term Length", input: { type: "select" } }
    ]
  };

  const tileTermById = (() => {
    const map = {};
    Object.keys(tileTermsCatalog).forEach(group => {
      tileTermsCatalog[group].forEach(t => { map[t.id] = { ...t, group }; });
    });
    return map;
  })();

  function formatPlanTermLabel(label, value, type, key) {
    if (value && String(value).trim() !== "") {
      if (type === "date") return `${label}: ${formatIsoToShort(value)}`;
      const normalizedValue = normalizeTermValue(key, value);
      return `${label}: ${normalizedValue}`;
    }
    return label;
  }

  const ttState = termsTilesState?.tileTermsState || {};
  const activeOrders = termsTilesState?.activeTileTermsOrder || { retention: [], newbiz: [] };

  return rawPlans.map((p, idx) => {
    const planTerms = [];
    const planId = p.__id;

    if (termsTilesState) {
      function maybePushPlanTerm(termId) {
        const def = tileTermById[termId];
        if (!def) return;
        const st = ttState[termId];
        if (!st || !st.active || st.appliesToAll) return;

        let rawVal = "";
        if (st.perPlanValues && planId && planId in st.perPlanValues) {
          rawVal = st.perPlanValues[planId] || "";
        }
        if (!rawVal) rawVal = st.globalValue || "";

        planTerms.push({
          key: termId,
          label: formatPlanTermLabel(def.label, rawVal, def.input?.type, termId)
        });
      }

      activeOrders.retention.forEach(maybePushPlanTerm);
      activeOrders.newbiz.forEach(maybePushPlanTerm);
    }

    return {
      id: idx + 1,
      tier: p.clgPlatform || `Plan ${idx + 1}`,
      description: formatCurrencyValue(p.clgPrice) || "Contact for pricing",
      bodyHtml: p.clgContents || "",
      features: [],
      cta: "This Month Only",
      ctaLabel: p.clgCtaLabel || "",
      ctaUrl: p.clgCtaUrl || "",
      terms: planTerms
    };
  });
}

// Expose a single APP_CONFIG the presenter uses
window.APP_CONFIG = {
  page: {
    title: "LNPresents - Presenter",
    description:
      "This tool is designed to be an efficient and professional way to present pricing to clients"
  },
  assets: {
    logo: "Headers/ln_header.jpg"
  },
  ui: {
    companyName: "LexisNexis",
    drawerCta: stored.clgFirmName || "Law Office of LexisNexis",
    headline: "Plans built just for you",
    subhead: stored.clgIncentive || "Customers get more value than ever",
    selectorLabel: "Your Proposal Details:",
    terms: buildUiTerms(),
    plans: buildUiPlans()
  }
};
