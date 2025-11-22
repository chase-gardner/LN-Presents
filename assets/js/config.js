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
  return new Date(iso + "T00:00:00").toLocaleDateString();
}


// we mirror the form’s term definitions so we can rebuild labels
const topTermDefs = {
  numAttorneys: {
    key: "numAttorneys",
    label: "Number of Attorneys",
    dataKey: "clgNumAttorneys",
    type: "text"
  },
  yoyIncrease: {
    key: "yoyIncrease",
    label: "Year over Year increase",
    dataKey: "clgYoyIncrease",
    type: "text"
  }
};

// these ones match what you had in the form’s retention block
const retentionTermDefs = {
  currentSpend: {
    key: "currentSpend",
    label: "Current Spend",
    dataKey: "clgCurrentSpend",
    type: "text"
  },
  effectiveDate: {
    key: "effectiveDate",
    label: "Effective Date",
    dataKey: "clgEffectiveDate",
    type: "date"
  },
  currentTermEnd: {
    key: "currentTermEnd",
    label: "Current Term End",
    dataKey: "clgCurrentTermEnd",
    type: "date"
  },
  extensionTermEnd: {
    key: "extensionTermEnd",
    label: "Extension Term End",
    dataKey: "clgExtensionTermEnd",
    type: "date"
  },
  extensionTerm: {
    key: "extensionTerm",
    label: "Term Extension",
    dataKey: "clgExtensionTerm",
    type: "select"
  }
};

// and the new biz block
const newBizTermDefs = {
  introPrice: {
    key: "introPrice",
    label: "Promotional Price",
    dataKey: "clgIntroPrice",
    type: "text"
  },
  termStartDate: {
    key: "termStartDate",
    label: "Promotion End Date",
    dataKey: "clgTermStartDate",
    type: "date"
  },
  nbExtensionTerm: {
    key: "nbExtensionTerm",
    label: "Term Length",
    dataKey: "clgnbExtensionTerm",
    type: "select"
  },
  termEndDate: {
    key: "termEndDate",
    label: "Term End Date",
    dataKey: "clgTermEndDate",
    type: "date"
  },
   ActivationDate: {
    key: "Activation",
    label: "Activation Date",
    dataKey: "clgActivationDate",
    type: "date"
  }
};

// one lookup for all of them
const allTermDefs = {
  ...topTermDefs,
  ...retentionTermDefs,
  ...newBizTermDefs
};

function buildUiTerms() {
  const selectedKeys = Array.isArray(stored.clgSelectedTerms)
    ? stored.clgSelectedTerms
    : [];

  // if we have selected terms, only show those (up to 6)
  if (selectedKeys.length) {
    return selectedKeys.slice(0, 6).map((key, idx) => {
      const def = allTermDefs[key];
      if (!def) {
        return { value: idx + 1, label: key };
      }

      const raw = stored[def.dataKey];
      let label = def.label;

      if (def.type === "date" && raw) {
        label = `${def.label}: ${formatIsoToShort(raw)}`;
      } else if (raw) {
        // text/select
        const needsColon = !def.label.endsWith(":");
        label = `${def.label}${needsColon ? ":" : ""} ${raw}`;
      }

      return {
        value: idx + 1,
        label
      };
    });
  }
  return [];
}

function buildUiPlans() {
  const clgPlans = Array.isArray(clgFormVars.clgPlans)
    ? clgFormVars.clgPlans.slice(0, 4)
    : [];

  if (clgPlans.length) {
    return clgPlans.map((p, i) => ({
      tier: p.clgPlatform || `Plan ${i + 1}`,
      description: p.clgPrice || "Contact for pricing",
      // 👇 the actual styled HTML from the form
      bodyHtml: p.clgContents || "",
      // keep this as a fallback
      features: [],
      cta: "This Month Only"
    }));
  }
  // BEFORE (example of what to remove)
// featuresEl.innerHTML = `<ul>${plainText.split(/\n|<br\s*\/?>/).map(t=>`<li>${escape(t)}</li>`).join('')}</ul>`;

// AFTER: only inject what the builder saved
featuresEl.innerHTML = renderPlanContents(plan.contentsHtml || '');

function renderPlanContents(html) {
  if (!html) return '';
  // If the user already used real lists, leave them
  if (/<\s*(ul|ol|li)\b/i.test(html)) return html;

  // Otherwise, leave paragraphs alone (no auto bullets)
  return html;
}


  // FALLBACK: your original hardcoded plans
  return [
    {
      tier: "Current Plan",
      description: "Contact for Pricing",
      features: ["Primary Enhanced","Automated Templates","Practical Guidance"],
      cta: "This Month Only"
    },
    {
      tier: "Enhanced & AI",
      description: "Contact for Pricing",
      features: ["Practice notes & checklists", "Standard clauses", "Form documents"],
      cta: "This Month Only"
    },
    {
      tier: "Professional & AI",
      description: "Contact for Pricing",
      features: ["Public Records", "Verdicts & Settlements", "Automated Templates"],
      cta: "This Month Only"
    }
  ];
}


window.APP_CONFIG = {
  page: {
    title: "LNPresents - Presenter",
    description: "This tool is designed to be an efficient and professional way to present pricing to clients"
  },
  assets: {
    logo: "ln_header.jpg"
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
