// config.js

// try to read what the form saved

const stored =
  JSON.parse(localStorage.getItem("clgFormVars") || "{}") ||
  (typeof window !== "undefined" ? window.formVars || {} : {});

const clgFormVars =
  JSON.parse(localStorage.getItem("clgFormVars") || "{}") ||
  (typeof window !== "undefined" ? window.formVars || {} : {});


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

// Build terms array using current saved config (max 6, honoring selection)
function buildUiTerms() {
  const selectedKeys = Array.isArray(stored.clgSelectedTerms)
    ? stored.clgSelectedTerms
    : [];

  const termDefs = [
    {
      key: "numAttorneys",
      labelBase: "Number of Attorneys",
      value: stored.clgNumAttorneys || "",
      type: "text"
    },
    {
      key: "yoyIncrease",
      labelBase: "Year over Year increase",
      value: stored.clgYoyIncrease || "",
      type: "text"
    },
    {
      key: "currentSpend",
      labelBase: "Current Spend",
      value: stored.clgCurrentSpend || "",
      type: "text"
    },
    {
      key: "effectiveDate",
      labelBase: "Effective Date",
      value: stored.clgEffectiveDate || "",
      type: "date"
    },
    {
      key: "currentTermEnd",
      labelBase: "Current Term End",
      value: stored.clgCurrentTermEnd || "",
      type: "date"
    },
    {
      key: "extensionTermEnd",
      labelBase: "Extension Term End",
      value: stored.clgExtensionTermEnd || "",
      type: "date"
    },
    {
      key: "extensionTerm",
      labelBase: "Term Extension",
      value: stored.clgExtensionTerm || "",
      type: "text"
    },
    {
      key: "ActivationDate",
      labelBase: "Activation Date",
      value: stored.clgActivationDate || "",
      type: "date"
    },
    {
      key: "introPrice",
      labelBase: "Promo Price",
      value: stored.clgIntroPrice || "",
      type: "text"
    },
    {
      key: "termStartDate",
      labelBase: "Promo End Date",
      value: stored.clgTermStartDate || "",
      type: "date"
    },
    {
      key: "termEndDate",
      labelBase: "Term End Date",
      value: stored.clgTermEndDate || "",
      type: "date"
    },
    {
      key: "nbExtensionTerm",
      labelBase: "Term Length",
      value: stored.clgnbExtensionTerm || "",
      type: "text"
    }
  ];

  const picked = [];
  for (const key of selectedKeys) {
    const def = termDefs.find(t => t.key === key);
    if (!def) continue;

    let label = def.labelBase;
    if (def.type === "date" && def.value) {
      label = `${def.labelBase}: ${formatIsoToShort(def.value)}`;
    } else if (def.value) {
      const needsColon = !def.labelBase.endsWith(":");
      label = `${def.labelBase}${needsColon ? ": " : " "}${def.value}`;
    }

    picked.push({ key: def.key, label });
    if (picked.length >= 6) break;
  }

  return picked;
}

// Build plans from stored.clgPlans; fall back if nothing is present
function buildUiPlans() {
  const rawPlans = Array.isArray(stored.clgPlans) ? stored.clgPlans : [];
  if (!rawPlans.length) {
    // fallback single demo plan
    return [
      {
        id: 1,
        tier: "Lexis+ Core",
        description: "Signature primary research package",
        bodyHtml:
          "<p>Core primary law collection for your jurisdiction.</p><p>Includes citator and Shepardizing.</p>",
        features: [],
        cta: "This Month Only"
      }
    ];
  }

  return rawPlans.map((p, idx) => ({
    id: idx + 1,
    tier: p.clgPlatform || `Plan ${idx + 1}`,
    description: p.clgPrice || "Contact for pricing",
    // 👇 the actual styled HTML from the form
    bodyHtml: p.clgContents || "",
    // keep this as a fallback
    features: [],
    cta: "This Month Only"
  }));
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