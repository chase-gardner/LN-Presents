/* ===== Inline script 1 from LNPresents-Builder.html ===== */
  function trackAnalyticsEvent(eventName, params) {
    if (typeof window.gtag !== "function") return;
    try {
      window.gtag("event", eventName, params || {});
    } catch (err) {
      console.warn("Analytics event failed:", eventName, err);
    }
  }
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-N7EP6C4NDE');

/* ===== Inline script 2 from LNPresents-Builder.html ===== */
(function(){
  // CHANGE THIS:
  const PASSCODE = "workflows";

  const gate = document.getElementById("gate");
  const input = document.getElementById("gateCode");
  const btn = document.getElementById("gateBtn");
  const err = document.getElementById("gateErr");
  const remember = document.getElementById("gateRemember");

  function signalUnlocked(){
    try{ window.dispatchEvent(new Event("lnp:unlocked")); } catch(e){}
  }

  // if remembered, skip gate
  try{
    if (localStorage.getItem("LNP_BUILDER_UNLOCKED") === "1") {
      gate.remove();
      signalUnlocked();
      return;
    }
  } catch(e){}

  function unlock(){
    if (input.value === PASSCODE) {
      err.style.display = "none";
      if (remember.checked) {
        try{ localStorage.setItem("LNP_BUILDER_UNLOCKED", "1"); } catch(e){}
      }
      gate.remove();
      signalUnlocked();
    } else {
      err.style.display = "block";
      input.select();
    }
  }

  btn.addEventListener("click", unlock);
  input.addEventListener("keydown", (e)=>{ if(e.key==="Enter") unlock(); });

  // autofocus
  setTimeout(()=>input.focus(), 50);
})();

/* ===== Inline script 3 from LNPresents-Builder.html ===== */
      const PRESENTER_URL  = './LNPresents-Presenter.html';
      const PRESENTER_NAME = 'lnp_presenter_tab';
      let presenterWin = null;

      function openPresenter() {
        presenterWin = window.open(PRESENTER_URL, PRESENTER_NAME);
        if (presenterWin) {
          try { presenterWin.focus(); } catch (e) {}
        } else {
          location.href = PRESENTER_URL;
        }
      }

      document.getElementById('openPresenterBtn')
        .addEventListener('click', openPresenter);
    

/* ===== Inline script 4 from LNPresents-Builder.html ===== */
  document.addEventListener("DOMContentLoaded", function () {

    /* =========================
     * 0) FIRST-TIME DEMO OVERVIEW (shown once)
     * ========================= */
    const DEMO_SEEN_KEY = "LNP_BUILDER_DEMO_SEEN";
    const demoOverlay = document.getElementById("demoOverlay");
    const demoBtn = document.getElementById("demoBtn");

    function setDemoSeen(){
      try{ localStorage.setItem(DEMO_SEEN_KEY, "1"); } catch(e){}
    }
    function hasSeenDemo(){
      try{ return localStorage.getItem(DEMO_SEEN_KEY) === "1"; } catch(e){ return false; }
    }

    function closeDemo({ markSeen = true } = {}){
      if (!demoOverlay) return;
      demoOverlay.classList.remove("is-open");
      demoOverlay.setAttribute("aria-hidden","true");
      demoOverlay.innerHTML = "";
      document.body.style.overflow = "";
      if (markSeen) setDemoSeen();
    }

    function openDemo({ markSeenOnClose = true } = {}){
      if (!demoOverlay) return;

      // Build content (easy to edit later)
      demoOverlay.innerHTML = `
        <div class="demo-modal" role="dialog" aria-modal="true" aria-label="LNPresents Builder Info Page">
          <div class="demo-head">
            <div>
              <h2>Welcome to LNPresents Builder</h2>
              <p>
                This Builder creates the proposal content that your Presenter displays. Fill in firm details, choose your classic/top terms, activate plan terms,
                build up to 4 plans, then click <b>Open Presenter</b> to view the live output.
              </p>
            </div>
            <button type="button" class="demo-close" aria-label="Close demo">✕</button>
          </div>

          <div class="demo-body">
            <div class="demo-grid">
              <div class="demo-card">
                <h3>Builder Breakdown</h3>
                <ol class="demo-steps">
                  <li><b>Firm Details</b>: Enter the Firm Name + Incentive (Personalized Proposal Message).</li>
                  <li><b>Plans</b>: Add up to <b>4</b> plans with Platform, Price, and Contents displayed in a clean and direct format.</li>
                  <li><b>Presets</b>: Drag a preset into a plan’s Contents area to start from a personalized template.</li>
                  <li><b>Terms</b>: Click or drag tiles from the Term Library into Active. Expand each active term and enter per-plan values or choose <b>Applies to All</b>.</li>
                  <li><b>Save Details</b>: Save details in an easy and secure way by exporting your Plan Profile found in the side menu.</li>
                  <li><b>Open Presenter</b>: Once you've saved your details, Open the Presenter. You will be taken to another page with your presentation and the PDF export.</li>
                </ol>

                <div class="demo-actions">
                  <button type="button" class="pill primary" data-demo-action="gotit">Got it — start building</button>
                </div>

                <div class="demo-footnote">
                  <b>Note:</b> You can always reopen this using the <b>Info</b> button in the top-right.
                </div>
              </div>

              <div class="demo-card">
                <h3>Key features you’ll use most</h3>
                <div class="demo-kv">
                  <div class="kv">
                    <b>Plan Presets</b>
                    <span>Start building your plan with personalized presets designed to make professional and personalized plans quickly. </span>
                  </div>
                  <div class="kv">
                    <b>Profiles (Download / Load)</b>
                    <span>Import and export proposal Profiles as a .json file. This allows you to switch between proposals quickly and share proposals with coworkers and managers for feedback.</span>
                  </div>
                  <div class="kv">
                    <b>Personalized Headers</b>
                    <span>If you choose, you may submit your Header for your use on presentations. This is a great way to personalize your proposals.</span>
                  </div>
                  <div class="kv">
                    <b>Hyperlinked PDFs</b>
                    <span>Full hyperlink support allows you to add Seismic Digital Sales Room Links to your exported Proposal PDFs.</span>
                  </div>
                  <div class="kv">
                    <b>Privacy and Security</b>
                    <span>All information entered on this site is stored locally in your browser cache. At no time is customer or usage data stored or tracked by LNPresents.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      demoOverlay.classList.add("is-open");
      demoOverlay.setAttribute("aria-hidden","false");
      document.body.style.overflow = "hidden";

      // Close handlers
      const closeBtn = demoOverlay.querySelector(".demo-close");
      closeBtn?.addEventListener("click", () => closeDemo({ markSeen: markSeenOnClose }));

      demoOverlay.addEventListener("click", (e) => {
        // click outside modal closes
        const modal = demoOverlay.querySelector(".demo-modal");
        if (modal && !modal.contains(e.target)) closeDemo({ markSeen: markSeenOnClose });
      });

      document.addEventListener("keydown", function escClose(ev){
        if (!demoOverlay.classList.contains("is-open")) return;
        if (ev.key === "Escape") {
          closeDemo({ markSeen: markSeenOnClose });
        }
      }, { passive: true, once: true });

      // Action shortcuts
      demoOverlay.querySelectorAll("[data-demo-action]").forEach(btn => {
        btn.addEventListener("click", () => {
          const action = btn.getAttribute("data-demo-action");

          if (action === "gotit") {
            closeDemo({ markSeen: markSeenOnClose });
            return;
          }

          if (action === "scrollToPlans") {
            closeDemo({ markSeen: markSeenOnClose });
            const el = document.getElementById("plansSection");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }

          if (action === "scrollToHeader") {
            closeDemo({ markSeen: markSeenOnClose });
            const el = document.getElementById("repHeaderCard");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }
        });
      });
    }

    // Allow users to reopen demo any time (does not need to “un-see”)
    if (demoBtn) {
      demoBtn.addEventListener("click", () => openDemo({ markSeenOnClose: true }));
    }

    // Only show automatically once, and only after passcode gate is gone
    function tryAutoShowDemo(){
      if (document.getElementById("gate")) return; // still locked
      if (!hasSeenDemo()) openDemo({ markSeenOnClose: true });
    }

    // Run now, and also after unlock signal
    tryAutoShowDemo();
    window.addEventListener("lnp:unlocked", tryAutoShowDemo, { once: true });

    /* =========================
     * A) DOM REFERENCES
     * ========================= */
    const form = document.getElementById("clgForm");
    const allTermsLibraryHost = document.getElementById("allTermsLibrary");
    const plansContainer = document.getElementById("plansContainer");
    const planTabs = document.getElementById("planTabs");
    const addPlanBtn = document.getElementById("addPlanBtn");
    const clearPlansBtn = document.getElementById("clearPlansBtn");
    const saveBtn = document.getElementById("saveBtn");
    const clearBtn = document.getElementById("clearBtn");
    const exportBtn = document.getElementById('exportEmailBtn');
    const emailProposalBtn = document.getElementById("emailProposalBtn");
    const copyProposalBtn = document.getElementById("copyProposalBtn");

    // NEW: profile save/load controls
    const downloadProfileBtn = document.getElementById("downloadProfileBtn");
    const uploadProfileInput = document.getElementById("uploadProfileInput");

    // Header selection controls (LN_Rep) — actual IDs used in your HTML
    const repHeaderSearch = document.getElementById("repHeaderSearch");
    const repHeaderList   = document.getElementById("repHeaderList");
    const submitHeaderBtn = document.getElementById("submitHeaderBtn");
    // NEW: uploaded header controls
const headerUploadInput       = document.getElementById("headerUploadInput");
const headerPreviewImg        = document.getElementById("headerPreviewImg");
const headerPreviewStatus     = document.getElementById("headerPreviewStatus");
const headerPreviewInfo       = document.getElementById("headerPreviewInfo");
const clearUploadedHeaderBtn  = document.getElementById("clearUploadedHeaderBtn");



    /* =========================
     * B) CONSTANTS & FORMATTERS
     * ========================= */
    const MAX_PLANS = 4;
    const MAX_TERM_SELECTIONS = 6;
    const currencyFmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });
    let activePlanId = null;
    const SHARED_TERMS_GROUP = "all";

    /* =========================
     * B.1) LN REP (HEADER) STATE
     * ========================= */
    /* =========================
     * HEADER DROPDOWN (from repo /Header or /Headers)
     * Store RAW filename for reliable lookups, display friendly label
     * ========================= */

    // Keys:
    // - LN_REP_FILE_STORAGE_KEY: raw filename (e.g., "Gardner, Chase.png")
    // - LN_REP_LABEL_STORAGE_KEY: friendly label
    // - LN_REP_STORAGE_KEY: backward-compat "LN_Rep" value (we set this to RAW filename)
    let LN_RepFile = "";
    let LN_RepLabel = "";

    const LN_REP_STORAGE_KEY       = "LNP_LN_REP";        // legacy / compat
    const LN_REP_FILE_STORAGE_KEY  = "LNP_LN_REP_FILE";   // raw filename
    const LN_REP_LABEL_STORAGE_KEY = "LNP_LN_REP_LABEL";  // friendly display label

    // Repo + folder settings
    const HEADERS_REPO_OWNER = "chase-gardner";
    const HEADERS_REPO_NAME  = "LN-Presents";
    const HEADERS_BRANCH     = "main";
    const HEADERS_FOLDERS_TO_TRY = ["Header", "Headers", "headers", "header"];

    // In-memory options so we can map label <-> raw
    let headerOptions = []; // [{ raw, label }]

    function setLnRepSelection({ raw, label }) {
      LN_RepFile  = (raw || "").trim();
      LN_RepLabel = (label || "").trim();

      // Persist
      try {
        if (LN_RepFile)  localStorage.setItem(LN_REP_FILE_STORAGE_KEY, LN_RepFile);
        else             localStorage.removeItem(LN_REP_FILE_STORAGE_KEY);

        if (LN_RepLabel) localStorage.setItem(LN_REP_LABEL_STORAGE_KEY, LN_RepLabel);
        else             localStorage.removeItem(LN_REP_LABEL_STORAGE_KEY);

        // Backward compatibility: keep LN_Rep as RAW filename for reliable Presenter lookup
        if (LN_RepFile)  localStorage.setItem(LN_REP_STORAGE_KEY, LN_RepFile);
        else             localStorage.removeItem(LN_REP_STORAGE_KEY);
      } catch (e) {}

      // Display friendly label in the input
      if (repHeaderSearch && repHeaderSearch.value !== LN_RepLabel) {
        repHeaderSearch.value = LN_RepLabel;
      }
    }

    function displayNameFromFilename(filename) {
      const base = String(filename || "").replace(/\.[^.]+$/, "");
      const parts = base.split(",").map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) return `${parts[1]}, ${parts[0]}`; // "First, Last" if filename is "Last, First"
      return base.replace(/[_-]+/g, " ").trim() || filename;
    }

    function findOptionByLabel(label) {
      const v = (label || "").trim();
      return headerOptions.find(o => o.label === v) || null;
    }

    function findOptionByRaw(raw) {
      const v = (raw || "").trim();
      return headerOptions.find(o => o.raw === v) || null;
    }

    async function fetchFolderListing(folderName) {
      const url =
        `https://api.github.com/repos/${encodeURIComponent(HEADERS_REPO_OWNER)}/${encodeURIComponent(HEADERS_REPO_NAME)}` +
        `/contents/${encodeURIComponent(folderName)}?ref=${encodeURIComponent(HEADERS_BRANCH)}`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`GitHub API ${res.status} for ${folderName}`);
      return res.json();
    }

    async function loadHeaderFolderOptions() {
      if (!repHeaderList) return;

      // show loading
      repHeaderList.innerHTML = "";
      repHeaderList.appendChild(Object.assign(document.createElement("option"), { value: "Loading…" }));

      let items = null;
      let lastErr = null;

      for (const folder of HEADERS_FOLDERS_TO_TRY) {
        try {
          const data = await fetchFolderListing(folder);
          if (Array.isArray(data)) { items = data; break; }
        } catch (e) {
          lastErr = e;
        }
      }

      repHeaderList.innerHTML = "";
      headerOptions = [];

      if (!items) {
        console.error("Header list load failed:", lastErr);
        repHeaderList.appendChild(Object.assign(document.createElement("option"), { value: "Could not load headers" }));
        return;
      }

      headerOptions = items
        .filter(x => x && x.type === "file" && typeof x.name === "string" && /\.(jpe?g|png)$/i.test(x.name))
        .map(x => ({ raw: x.name, label: displayNameFromFilename(x.name) }))
        .sort((a, b) => a.label.localeCompare(b.label));

      if (!headerOptions.length) {
        repHeaderList.appendChild(Object.assign(document.createElement("option"), { value: "No headers found" }));
        return;
      }

      // Populate datalist with FRIENDLY labels only (so the input shows label)
      headerOptions.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt.label;
        repHeaderList.appendChild(o);
      });

      // After options load, restore any saved selection into the input (label),
      // while keeping raw available in storage.
      try {
        const savedLabel = localStorage.getItem(LN_REP_LABEL_STORAGE_KEY) || "";
        const savedRaw   = localStorage.getItem(LN_REP_FILE_STORAGE_KEY) || localStorage.getItem(LN_REP_STORAGE_KEY) || "";

        // Prefer saved label if it still matches an option
        if (savedLabel) {
          const match = findOptionByLabel(savedLabel);
          if (match) {
            setLnRepSelection(match);
            return;
          }
        }

        // Otherwise, if we have a raw filename, derive label from it and restore if possible
        if (savedRaw) {
          const matchByRaw = findOptionByRaw(savedRaw);
          if (matchByRaw) {
            setLnRepSelection(matchByRaw);
            return;
          }

          // Fallback: show derived label even if not in list (rare)
          const derivedLabel = displayNameFromFilename(savedRaw);
          setLnRepSelection({ raw: savedRaw, label: derivedLabel });
        }
      } catch (e) {}
    }

    // When user selects a real option (label), store BOTH label + raw
    function commitFromInputIfValid() {
      const val = (repHeaderSearch?.value || "").trim();
      if (!val) return;

      const match = findOptionByLabel(val);
      if (!match) return; // don’t persist arbitrary typing
      setLnRepSelection(match);
    }
    /* =========================
 * HEADER UPLOAD (IndexedDB + localStorage fallback)
 * ========================= */

// Storage keys (schema-versioned)
const UPLOADED_HEADER_SCHEMA = 1;
const UPLOADED_HEADER_META_KEY = "LNP_UPLOADED_HEADER_META_V1";
const UPLOADED_HEADER_DATAURL_KEY = "LNP_UPLOADED_HEADER_DATAURL_V1"; // fallback only (may be removed if too big)

// IndexedDB settings
const LNP_IDB_NAME = "LNPresentsDB";
const LNP_IDB_VERSION = 1;
const LNP_IDB_STORE = "kv";
const LNP_IDB_KEY = "uploadedHeaderV1";

function openLnpDb(){
  return new Promise((resolve, reject) => {
    try{
      const req = indexedDB.open(LNP_IDB_NAME, LNP_IDB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(LNP_IDB_STORE)) db.createObjectStore(LNP_IDB_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e){
      reject(e);
    }
  });
}

async function idbSet(key, value){
  const db = await openLnpDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LNP_IDB_STORE, "readwrite");
    tx.objectStore(LNP_IDB_STORE).put(value, key);
    tx.oncomplete = () => { try{ db.close(); } catch(e){} resolve(true); };
    tx.onerror = () => { try{ db.close(); } catch(e){} reject(tx.error); };
  });
}

async function idbGet(key){
  const db = await openLnpDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LNP_IDB_STORE, "readonly");
    const req = tx.objectStore(LNP_IDB_STORE).get(key);
    req.onsuccess = () => { try{ db.close(); } catch(e){} resolve(req.result); };
    req.onerror = () => { try{ db.close(); } catch(e){} reject(req.error); };
  });
}

async function idbDel(key){
  const db = await openLnpDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LNP_IDB_STORE, "readwrite");
    tx.objectStore(LNP_IDB_STORE).delete(key);
    tx.oncomplete = () => { try{ db.close(); } catch(e){} resolve(true); };
    tx.onerror = () => { try{ db.close(); } catch(e){} reject(tx.error); };
  });
}

function fileToDataUrl(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function bytesToNice(n){
  if (!Number.isFinite(n) || n <= 0) return "";
  const kb = n / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb/1024).toFixed(2)} MB`;
}

// Best-effort: store in IDB; fallback to localStorage only if modest size
async function storeUploadedHeader({ dataUrl, type, name, size }){
  const meta = {
    __schema: UPLOADED_HEADER_SCHEMA,
    storedAt: new Date().toISOString(),
    type: type || "",
    name: name || "",
    size: size || 0
  };

  // 1) Try IndexedDB first (best retention)
  try{
    await idbSet(LNP_IDB_KEY, { meta, dataUrl });
    // Keep a small meta marker in localStorage so Presenter can know it's available
    try{ localStorage.setItem(UPLOADED_HEADER_META_KEY, JSON.stringify(meta)); } catch(e){}
    // Optional fallback dataURL (keep only if not huge)
    try{
      // Many browsers allow ~5MB in localStorage; keep a conservative limit.
      if (dataUrl.length < 1_500_000) localStorage.setItem(UPLOADED_HEADER_DATAURL_KEY, dataUrl);
      else localStorage.removeItem(UPLOADED_HEADER_DATAURL_KEY);
    } catch(e){}
    return true;
  } catch (e){
    console.warn("IndexedDB store failed; falling back to localStorage if possible:", e);
  }

  // 2) Fallback: localStorage dataURL (may fail if large)
  try{
    localStorage.setItem(UPLOADED_HEADER_META_KEY, JSON.stringify(meta));
    localStorage.setItem(UPLOADED_HEADER_DATAURL_KEY, dataUrl);
    return true;
  } catch (e){
    console.error("localStorage fallback failed (image likely too large):", e);
    return false;
  }
}

async function loadUploadedHeader(){
  // 1) Try IndexedDB
  try{
    const obj = await idbGet(LNP_IDB_KEY);
    if (obj && obj.dataUrl) return obj;
  } catch(e){}

  // 2) Try localStorage fallback
  try{
    const metaStr = localStorage.getItem(UPLOADED_HEADER_META_KEY);
    const dataUrl = localStorage.getItem(UPLOADED_HEADER_DATAURL_KEY);
    if (dataUrl) {
      const meta = metaStr ? JSON.parse(metaStr) : { __schema: UPLOADED_HEADER_SCHEMA };
      return { meta, dataUrl };
    }
  } catch(e){}

  return null;
}

async function clearUploadedHeader(){
  try{ await idbDel(LNP_IDB_KEY); } catch(e){}
  try{ localStorage.removeItem(UPLOADED_HEADER_META_KEY); } catch(e){}
  try{ localStorage.removeItem(UPLOADED_HEADER_DATAURL_KEY); } catch(e){}
}

function setHeaderPreview({ dataUrl, meta }){
  if (!headerPreviewImg || !headerPreviewStatus) return;

  if (!dataUrl) {
    headerPreviewImg.style.display = "none";
    headerPreviewImg.src = "";
    headerPreviewStatus.textContent = "No uploaded header yet.";
    if (headerPreviewInfo) headerPreviewInfo.textContent = "";
    return;
  }

  headerPreviewImg.src = dataUrl;
  headerPreviewImg.style.display = "block";

  const name = meta?.name ? ` • ${meta.name}` : "";
  const size = meta?.size ? ` • ${bytesToNice(meta.size)}` : "";
  headerPreviewStatus.textContent = "Uploaded header will be used in Presenter.";
}

async function initHeaderUploadUi(){
  const existing = await loadUploadedHeader();
  setHeaderPreview({ dataUrl: existing?.dataUrl || "", meta: existing?.meta });

  if (headerUploadInput) {
    headerUploadInput.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const isOk = /image\/(png|jpeg)/i.test(file.type) || /\.(png|jpe?g)$/i.test(file.name);
      if (!isOk) {
        alert("Please upload a JPG or PNG file.");
        e.target.value = "";
        return;
      }

      // Optional guardrail: huge images bloat storage; still try, but warn
      if (file.size > 6 * 1024 * 1024) {
        const ok = confirm("That image is larger than 6MB. It may not persist reliably in browser storage. Continue?");
        if (!ok) { e.target.value = ""; return; }
      }

      try{
        const dataUrl = await fileToDataUrl(file);
        const ok = await storeUploadedHeader({
          dataUrl,
          type: file.type,
          name: file.name,
          size: file.size
        });

        if (!ok) {
          alert("Could not store this header (likely too large). Try a smaller image.");
          e.target.value = "";
          return;
        }

        // IMPORTANT: uploaded header should take precedence over repo selection in Presenter
        // We'll keep the dropdown selection intact, but Presenter will prefer uploaded dataUrl.
        setHeaderPreview({
          dataUrl,
          meta: { name: file.name, size: file.size, type: file.type }
        });

        // Rebuild config so Presenter has it immediately
        buildAppConfigFromState(state);
        persistNow();
        alert("Header uploaded and saved for Presenter on this device.");
      } catch(err){
        console.error(err);
        alert("Upload failed. Please try again.");
      } finally {
        e.target.value = "";
      }
    });
  }

  if (clearUploadedHeaderBtn) {
    clearUploadedHeaderBtn.addEventListener("click", async () => {
      const ok = confirm("Clear the uploaded header from this device/browser?");
      if (!ok) return;
      await clearUploadedHeader();
      setHeaderPreview({ dataUrl: "", meta: null });
      buildAppConfigFromState(state);
      persistNow();
    });
  }
}

// boot it
initHeaderUploadUi();

    if (repHeaderSearch) {
      repHeaderSearch.addEventListener("change", commitFromInputIfValid);
      repHeaderSearch.addEventListener("input", commitFromInputIfValid); // Safari-friendly
    }

    // Submit header email button (unchanged)
    if (submitHeaderBtn) {
      submitHeaderBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const to = "chase.lawarregardner@lexisnexis.com";
        const subject = "LNPresents Header Submission";
        const body =
`Hello,

You have opted to submit your header to be displayed on LNPresents. This is a great way to personalize your presentations and maintain a consistent image across communication channels. To submit your header please:

• Ensure your header is in JPG or PNG format.
• Don’t worry about the file name; it will be renamed upon submission.
• Attach your header to this email.

Thanks,
LNPresents Support`;

        const mailto =
          `mailto:${encodeURIComponent(to)}` +
          `?subject=${encodeURIComponent(subject)}` +
          `&body=${encodeURIComponent(body)}`;

        window.location.assign(mailto);
      });
    }

    // Load headers on boot
    loadHeaderFolderOptions();

    /* =========================
     * C) TERM DEFINITIONS
     * ========================= */
    const retentionTerms = [
      { key: "currentSpend",     label: "Current Spend",     input: { type: "text", dataKey: "clgCurrentSpend",    placeholder: "$0.00" }, defaultSelected: false },
      { key: "effectiveDate",    label: "Effective Date",    input: { type: "date", dataKey: "clgEffectiveDate" },  defaultSelected: false },
      { key: "currentTermEnd",   label: "Current Term End",  input: { type: "date", dataKey: "clgCurrentTermEnd" }, defaultSelected: false },
      { key: "extensionTermEnd", label: "Extension Term End",input: { type: "date", dataKey: "clgExtensionTermEnd"}, defaultSelected: false },
      { key: "extensionTerm",    label: "Term Extension",    input: { type: "select", dataKey: "clgExtensionTerm", options: ["", "1 year", "2 years", "3 years", "4 years", "5 years"] }, defaultSelected: false }
    ];

    const newBizTerms = [
      { key: "ActivationDate", label: "Activation Date", input: { type: "date", dataKey: "clgActivationDate" }, defaultSelected: false },
      { key: "introPrice",     label: "Promo Price",     input: { type: "text", dataKey: "clgIntroPrice", placeholder: "$0.00" }, defaultSelected: false },
      { key: "termStartDate",  label: "Promo End Date",  input: { type: "date", dataKey: "clgTermStartDate" }, defaultSelected: false },
      { key: "termEndDate",    label: "Term End Date",   input: { type: "date", dataKey: "clgTermEndDate" }, defaultSelected: false },
      { key: "nbExtensionTerm",label: "Term Length",     input: { type: "select", dataKey: "clgnbExtensionTerm", options: ["", "1 year", "2 years", "3 years", "4 years", "5 years"] }, defaultSelected: false }
    ];
    /* =========================
     * C.1) TERMS V4 (Tiles + per-term Applies-to-All)
     * - Classic terms: checkbox + single global value
     * - Tile terms: drag to activate, per-plan by default, optional Applies-to-All
     * ========================= */
    const TERMS_TILES_STORAGE_KEY = "LNP_STATE_V4_TERMS_TILES";
    const TERMS_TILES_SCHEMA = 4;
    const TERMS_TILE_GROUPS = [
      { id: "retention", label: "Retention" },
      { id: "newbiz", label: "New Business" },
      { id: "datesTimes", label: "Dates/Times" },
      { id: "pricingPromos", label: "Pricing/Promos" }
    ];

    const classicTermsDefs = [
      { id: "attorneyCount", label: "Attorney Count", type: "select", dataKey: "clgNumAttorneys", options: Array.from({ length: 10 }, (_, idx) => String(idx + 1)) },
      { id: "currentSpend",  label: "Current Spend",  type: "text", dataKey: "clgCurrentSpend", placeholder: "$0.00" },
      { id: "currentTermEnd",label: "Current Term End",type: "date", dataKey: "clgCurrentTermEnd" }
    ];

    const tileTermDefinitions = {
      effectiveDate:     { id: "effectiveDate", label: "Effective Date", input: { type: "date", dataKey: "clgEffectiveDate" } },
      extensionTermEnd:  { id: "extensionTermEnd", label: "Extension Term End", input: { type: "date", dataKey: "clgExtensionTermEnd" } },
      extensionTerm:     { id: "extensionTerm", label: "Term Extension", input: { type: "select", dataKey: "clgExtensionTerm", options: ["", "1 year", "2 years", "3 years", "4 years", "5 years"] } },
      yoyIncrease:       { id: "yoyIncrease", label: "Year over Year Increase", input: { type: "text", dataKey: "clgYoyIncrease", placeholder: "3%" } },
      activationDate:    { id: "activationDate", label: "Activation Date", input: { type: "date", dataKey: "clgActivationDate" } },
      introPrice:        { id: "introPrice", label: "Promotion Price", input: { type: "text", dataKey: "clgIntroPrice", placeholder: "$0.00" } },
      termStartDate:     { id: "termStartDate", label: "Promotion End Date", input: { type: "date", dataKey: "clgTermStartDate" } },
      termEndDate:       { id: "termEndDate", label: "Term End Date", input: { type: "date", dataKey: "clgTermEndDate" } },
      nbExtensionTerm:   { id: "nbExtensionTerm", label: "Term Length", input: { type: "select", dataKey: "clgnbExtensionTerm", options: ["", "1 year", "2 years", "3 years", "4 years", "5 years"] } },
      promotion:         { id: "promotion", label: "Promotion", input: { type: "text", dataKey: "clgPromotion", placeholder: "Describe the promotion" } },
      freeTimeAvailable: { id: "freeTimeAvailable", label: "Free Time Available", input: { type: "range", dataKey: "clgFreeTimeAvailable", min: 1, max: 59, step: 1, suffix: "days" } },
      costPerAttorney:   { id: "costPerAttorney", label: "Cost Per Attorney", input: { type: "text", dataKey: "clgCostPerAttorney", placeholder: "$0.00" } }
    };

    const tileTermsCatalog = {
      retention: [
        tileTermDefinitions.effectiveDate,
        tileTermDefinitions.extensionTerm,
        tileTermDefinitions.extensionTermEnd,
        tileTermDefinitions.yoyIncrease
      ],
      newbiz: [
        tileTermDefinitions.activationDate,
        tileTermDefinitions.introPrice,
        tileTermDefinitions.termStartDate,
        tileTermDefinitions.termEndDate,
        tileTermDefinitions.nbExtensionTerm
      ],
      datesTimes: [
        tileTermDefinitions.activationDate,
        tileTermDefinitions.effectiveDate,
        tileTermDefinitions.extensionTermEnd,
        tileTermDefinitions.termStartDate,
        tileTermDefinitions.termEndDate
      ],
      pricingPromos: [
        tileTermDefinitions.introPrice,
        tileTermDefinitions.promotion,
        tileTermDefinitions.freeTimeAvailable,
        tileTermDefinitions.costPerAttorney
      ]
    };

    const tileTermById = (() => {
      const map = {};
      Object.keys(tileTermsCatalog).forEach(g => {
        tileTermsCatalog[g].forEach(t => { map[t.id] = { ...t, group: g }; });
      });
      return map;
    })();

    const saved = JSON.parse(localStorage.getItem("clgFormVars") || "{}");

    function defaultTermsTilesState() {
      const classicSel = {};
      const classicVals = {};
      classicTermsDefs.forEach(d => { classicSel[d.id] = false; classicVals[d.id] = ""; });
      const emptyOrders = TERMS_TILE_GROUPS.reduce((acc, group) => {
        acc[group.id] = [];
        return acc;
      }, {});
      emptyOrders[SHARED_TERMS_GROUP] = [];
      return {
        __schema: TERMS_TILES_SCHEMA,
        classicTermsSelected: classicSel,
        classicTermsValues: classicVals,
        activeTileTermsOrder: emptyOrders,
        tileTermsState: {}
      };
    }

    function loadTermsTilesState() {
      let raw = null;
      try { raw = JSON.parse(localStorage.getItem(TERMS_TILES_STORAGE_KEY) || "null"); } catch (e) { raw = null; }
      if (raw && raw.__schema === TERMS_TILES_SCHEMA) return raw;

      // Best-effort migration from legacy selection model (clgSelectedTerms + single values)
      const migrated = defaultTermsTilesState();

      const legacySelected = Array.isArray(saved.clgSelectedTerms) ? saved.clgSelectedTerms : [];
      // Classic terms
      migrated.classicTermsSelected.attorneyCount = legacySelected.includes("numAttorneys");
      migrated.classicTermsSelected.currentSpend  = legacySelected.includes("currentSpend");
      migrated.classicTermsSelected.currentTermEnd= legacySelected.includes("currentTermEnd");

      migrated.classicTermsValues.attorneyCount = saved.clgNumAttorneys || "";
      migrated.classicTermsValues.currentSpend  = saved.clgCurrentSpend || "";
      migrated.classicTermsValues.currentTermEnd= saved.clgCurrentTermEnd || "";

      // Tile terms (previously global-only -> migrate as Applies-to-All ON)
      function migrateTile(termId, dataKey, group) {
        const isSel = legacySelected.includes(termId);
        const hasVal = !!(saved[dataKey] != null && String(saved[dataKey]).trim() !== "");
        if (!isSel && !hasVal) return;
        if (!migrated.tileTermsState[termId]) {
          migrated.tileTermsState[termId] = { active: false, appliesToAll: true, globalValue: "", perPlanValues: {} };
        }
        migrated.tileTermsState[termId].active = true;
        migrated.tileTermsState[termId].appliesToAll = true;
        migrated.tileTermsState[termId].globalValue = saved[dataKey] || "";
        if (!migrated.activeTileTermsOrder[group].includes(termId)) migrated.activeTileTermsOrder[group].push(termId);
      }

      migrateTile("effectiveDate", "clgEffectiveDate", "retention");
      migrateTile("extensionTermEnd", "clgExtensionTermEnd", "retention");
      migrateTile("extensionTerm", "clgExtensionTerm", "retention");
      migrateTile("yoyIncrease", "clgYoyIncrease", "retention");

      migrateTile("activationDate", "clgActivationDate", "newbiz");
      migrateTile("introPrice", "clgIntroPrice", "newbiz");
      migrateTile("termStartDate", "clgTermStartDate", "newbiz");
      migrateTile("termEndDate", "clgTermEndDate", "newbiz");
      migrateTile("nbExtensionTerm", "clgnbExtensionTerm", "newbiz");

      // Persist migrated state (do NOT delete legacy storage)
      try { localStorage.setItem(TERMS_TILES_STORAGE_KEY, JSON.stringify(migrated)); } catch (e) {}
      return migrated;
    }

    let termsTilesState = loadTermsTilesState();
    let termsTilesExpandedByGroup = TERMS_TILE_GROUPS.reduce((acc, group) => {
      acc[group.id] = new Set();
      return acc;
    }, {});
    termsTilesExpandedByGroup[SHARED_TERMS_GROUP] = new Set();

    function persistTermsTiles() {
      try {
        termsTilesState.__schema = TERMS_TILES_SCHEMA;
        localStorage.setItem(TERMS_TILES_STORAGE_KEY, JSON.stringify(termsTilesState));
      } catch (e) {}
    }

    function ensureTileTerm(termId) {
      if (!termsTilesState.tileTermsState[termId]) {
        termsTilesState.tileTermsState[termId] = { active: false, appliesToAll: false, globalValue: "", perPlanValues: {} };
      }
      return termsTilesState.tileTermsState[termId];
    }

    function currentPlanIds() {
      return (state.clgPlans || []).map(p => p.__id).filter(Boolean);
    }

    function syncTileTermPlanSlots() {
      const ids = new Set(currentPlanIds());
      Object.keys(termsTilesState.tileTermsState || {}).forEach(termId => {
        const st = ensureTileTerm(termId);
        if (!st.perPlanValues || typeof st.perPlanValues !== "object") st.perPlanValues = {};
        // Remove deleted plans
        Object.keys(st.perPlanValues).forEach(pid => { if (!ids.has(pid)) delete st.perPlanValues[pid]; });
        // Add new plans
        ids.forEach(pid => { if (!(pid in st.perPlanValues)) st.perPlanValues[pid] = ""; });
      });
      persistTermsTiles();
    }


    /* =========================
     * D) PERSISTED & STATE
     * ========================= */

    function makeEmptyPlan() {
      return {
        __id: "plan_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8),
        clgPlatform: "",
        clgPriceCents: null,
        clgPrice: "",
        clgContents: "",
        clgCtaLabel: "",
        clgCtaUrl: ""
      };
    }

    const state = {
      clgFirmName: saved.clgFirmName || "",
      clgNumAttorneys: saved.clgNumAttorneys || "",
      clgYoyIncrease: saved.clgYoyIncrease || "",
      clgIncentive: saved.clgIncentive || "",
      clgCurrentSpend: saved.clgCurrentSpend || "",
      clgEffectiveDate: saved.clgEffectiveDate || "",
      clgActivationDate: saved.clgActivationDate || "",
      clgCurrentTermEnd: saved.clgCurrentTermEnd || "",
      clgTermEndDate: saved.clgTermEndDate || "",
      clgExtensionTermEnd: saved.clgExtensionTermEnd || "",
      clgExtensionTerm: saved.clgExtensionTerm || "",
      clgnbExtensionTerm: saved.clgnbExtensionTerm || "",
      clgIntroPrice: saved.clgIntroPrice || "",
      clgTermStartDate: saved.clgTermStartDate || "",
      clgPromotion: saved.clgPromotion || "",
      clgFreeTimeAvailable: saved.clgFreeTimeAvailable || "",
      clgCostPerAttorney: saved.clgCostPerAttorney || "",
      clgSelectedTerms: Array.isArray(saved.clgSelectedTerms) ? saved.clgSelectedTerms : [],
      clgPlans: Array.isArray(saved.clgPlans) && saved.clgPlans.length ? saved.clgPlans : [makeEmptyPlan()]
    };

    function ensurePlanIds() {
      if (!Array.isArray(state.clgPlans)) state.clgPlans = [makeEmptyPlan()];
      state.clgPlans = state.clgPlans.map(p => {
        if (!p || typeof p !== "object") p = {};
        if (!p.__id) p.__id = "plan_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
        if (p.clgCtaLabel == null) p.clgCtaLabel = "";
        if (p.clgCtaUrl == null) p.clgCtaUrl = "";
        return p;
      });
    }
    ensurePlanIds();

    // NEW: snapshot -> used by Save & profile download
    function buildProfilePayload() {
      return {
        clgFirmName: state.clgFirmName,
        clgNumAttorneys: state.clgNumAttorneys,
        clgYoyIncrease: state.clgYoyIncrease,
        clgIncentive: state.clgIncentive,
        clgSelectedTerms: state.clgSelectedTerms,
        clgCurrentSpend: state.clgCurrentSpend,
        clgEffectiveDate: state.clgEffectiveDate,
        clgActivationDate: state.clgActivationDate,
        clgCurrentTermEnd: state.clgCurrentTermEnd,
        clgTermEndDate: state.clgTermEndDate,
        clgExtensionTermEnd: state.clgExtensionTermEnd,
        clgExtensionTerm: state.clgExtensionTerm,
        clgnbExtensionTerm: state.clgnbExtensionTerm,
        clgIntroPrice: state.clgIntroPrice,
        clgTermStartDate: state.clgTermStartDate,
        clgPlans: state.clgPlans,
        lnpTermsTiles: termsTilesState
      };
    }

    // NEW: hydrate DOM from current state (top fields + term selections)
    function hydrateFormFromState() {
      form.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");
        if (!key) return;
        const value = state[key];
        el.value = value != null ? value : "";
      });

      form.querySelectorAll("[data-term-option]").forEach(cb => {
        const key = cb.getAttribute("data-term-option");
        if (!key) return;
        const selected = Array.isArray(state.clgSelectedTerms) && state.clgSelectedTerms.includes(key);
        cb.checked = selected;
      });
    }

    // NEW: apply profile JSON to state + DOM + storage
    function applyLoadedProfile(raw) {
      if (!raw || typeof raw !== "object") {
        alert("That file does not look like an LN Presents profile.");
        return;
      }

      const data = raw.data && typeof raw.data === "object" ? raw.data : raw;

      state.clgFirmName = data.clgFirmName || "";
      state.clgNumAttorneys = data.clgNumAttorneys || "";
      state.clgYoyIncrease = data.clgYoyIncrease || "";
      state.clgIncentive = data.clgIncentive || "";
      state.clgSelectedTerms = Array.isArray(data.clgSelectedTerms) ? data.clgSelectedTerms : [];
      state.clgCurrentSpend = data.clgCurrentSpend || "";
      state.clgEffectiveDate = data.clgEffectiveDate || "";
      state.clgActivationDate = data.clgActivationDate || "";
      state.clgCurrentTermEnd = data.clgCurrentTermEnd || "";
      state.clgTermEndDate = data.clgTermEndDate || "";
      state.clgExtensionTermEnd = data.clgExtensionTermEnd || "";
      state.clgExtensionTerm = data.clgExtensionTerm || "";
      state.clgnbExtensionTerm = data.clgnbExtensionTerm || "";
      state.clgIntroPrice = data.clgIntroPrice || "";
      state.clgTermStartDate = data.clgTermStartDate || "";
      state.clgPlans = Array.isArray(data.clgPlans) && data.clgPlans.length ? data.clgPlans : [makeEmptyPlan()];

      ensurePlanIds();
      if (data.lnpTermsTiles && typeof data.lnpTermsTiles === "object") {
        termsTilesState = data.lnpTermsTiles;
        // normalize / defaults
        if (!termsTilesState || typeof termsTilesState !== "object") termsTilesState = defaultTermsTilesState();
      if (!termsTilesState.activeTileTermsOrder) termsTilesState.activeTileTermsOrder = {};
      TERMS_TILE_GROUPS.forEach(group => {
        if (!Array.isArray(termsTilesState.activeTileTermsOrder[group.id])) {
          termsTilesState.activeTileTermsOrder[group.id] = [];
        }
      });
      if (!Array.isArray(termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP])) {
        termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP] = [];
      }
      if (!termsTilesState.tileTermsState) termsTilesState.tileTermsState = {};
      if (!termsTilesState.classicTermsSelected) termsTilesState.classicTermsSelected = defaultTermsTilesState().classicTermsSelected;
      if (!termsTilesState.classicTermsValues) termsTilesState.classicTermsValues = defaultTermsTilesState().classicTermsValues;
        persistTermsTiles();
      }

      hydrateFormFromState();

      renderClassicTopTerms();
      renderAllTermsTiles();
      syncTileTermPlanSlots();
      renderPlans();
      persistNow();

      const toSave = buildProfilePayload();
      localStorage.setItem("clgFormVars", JSON.stringify(toSave));
      buildAppConfigFromState(state);
    }

    /* =========================
     * E) GENERIC HELPERS
     * ========================= */
    function escapeHtml(s) {
      return String(s ?? "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    function fmtDate(iso) {
      if (!iso) return "";
      try { return new Date(iso + "T00:00:00").toLocaleDateString(); }
      catch { return iso; }
    }

    // RTE Normalization helpers
    const SIZE_PRESET_CLASSES = ['rte-size-body','rte-size-subhead','rte-size-head'];
    const SIZE_PRESET_ORDER = ['body','subhead','head'];
    const SIZE_PRESETS = {
      body:{px:14, class:'rte-size-body'},
      subhead:{px:17, class:'rte-size-subhead'},
      head:{px:19, class:'rte-size-head'}
    };

    function closestPreset(px){
      let best = 'body', bestDiff = Infinity;
      for (const key of SIZE_PRESET_ORDER){
        const d = Math.abs(px - SIZE_PRESETS[key].px);
        if (d < bestDiff){ bestDiff = d; best = key; }
      }
      return best;
    }

    /* ===== NEW HELPERS FOR MORE OUTLOOK-FRIENDLY COPY ===== */
    function extractBodyHtmlFromEmail(fullHtml) {
      const match = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      return match ? match[1] : fullHtml;
    }

    async function copyEmailHtmlWithFallback(fullHtml) {
      const fragmentHtml = extractBodyHtmlFromEmail(fullHtml);
      let success = false;

      try {
        const temp = document.createElement('div');
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        temp.style.top = '0';
        temp.style.opacity = '0';
        temp.setAttribute('contenteditable', 'true');
        temp.innerHTML = fragmentHtml;

        document.body.appendChild(temp);

        const range = document.createRange();
        range.selectNodeContents(temp);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        success = document.execCommand('copy');

        sel.removeAllRanges();
        document.body.removeChild(temp);
      } catch (e) {
        console.warn('execCommand copy failed:', e);
      }

      if (success) return true;

      try {
        if (navigator.clipboard && window.ClipboardItem) {
          const blobHtml = new Blob([fragmentHtml], { type: 'text/html' });
          const blobText = new Blob([fragmentHtml.replace(/<[^>]+>/g, '')], { type: 'text/plain' });
          const item = new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText });
          await navigator.clipboard.write([item]);
          return true;
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(fragmentHtml);
          return true;
        }
      } catch (err) {
        console.error('Async clipboard failed:', err);
      }

      return false;
    }

    if (copyProposalBtn) {
      copyProposalBtn.addEventListener('click', async () => {
        const data = {
          clgFirmName:      state.clgFirmName,
          clgNumAttorneys:  state.clgNumAttorneys,
          clgYoyIncrease:   state.clgYoyIncrease,
          clgIncentive:     state.clgIncentive,
          clgSelectedTerms: state.clgSelectedTerms,
          clgCurrentSpend:  state.clgCurrentSpend,
          clgEffectiveDate: state.clgEffectiveDate,
          clgActivationDate: state.clgActivationDate,
          clgCurrentTermEnd: state.clgCurrentTermEnd,
          clgTermEndDate:    state.clgTermEndDate,
          clgExtensionTermEnd: state.clgExtensionTermEnd,
          clgExtensionTerm:    state.clgExtensionTerm,
          clgnbExtensionTerm:  state.clgnbExtensionTerm,
          clgIntroPrice:       state.clgIntroPrice,
          clgTermStartDate:    state.clgTermStartDate
        };

        const plans = (state.clgPlans || []).map((p, idx) => ({
          name:     p.clgPlatform || `Plan ${idx + 1}`,
          price:    p.clgPrice || "",
          term:     "",
          contents: p.clgContents || ""
        }));

        const fullHtml = buildEmailHtml(plans, data);

        const ok = await copyEmailHtmlWithFallback(fullHtml);
        if (ok) {
          alert("Proposal copied. In Outlook, click into the message body and paste.");
        } else {
          alert("Could not copy automatically. As a fallback, use the Export Email HTML option, open it in a browser, then copy & paste into Outlook.");
        }
      });
    }

    function applyTextPresetMapping(doc){
      const mapEl = (el) => {
        el.classList.remove(...SIZE_PRESET_CLASSES);
        const tag = el.tagName.toLowerCase();

        if (['h1','h2','h3'].includes(tag)) {
          el.classList.add(tag === 'h1' ? 'rte-size-head' : 'rte-size-subhead');
        }
        const style = el.getAttribute('style') || '';
        const m = /font-size\s*:\s*([0-9.]+)\s*(px|pt|rem|em)/i.exec(style);
        if (m) {
          const val = parseFloat(m[1]);
          const unit = (m[2] || 'px').toLowerCase();
          let px = val;
          if (unit === 'pt')  px = val * (96/72);
          if (unit === 'rem' || unit === 'em') px = val * 16;
          el.classList.add(SIZE_PRESETS[closestPreset(px)].class);
        }
        if (style) {
          const color = /color\s*:\s*[^;]+/i.exec(style);
          if (color) el.setAttribute('style', color[0]); else el.removeAttribute('style');
        }
      };
      doc.querySelectorAll('p, li, span, h1, h2, h3').forEach(mapEl);
    }

    function blockifyTopLevel(doc){
      [...doc.body.childNodes].forEach(node=>{
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
          const p = doc.createElement('p'); p.textContent = node.textContent; node.replaceWith(p);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toLowerCase();
          if (!['p','ul','ol'].includes(tag)) {
            const p = doc.createElement('p'); p.innerHTML = node.outerHTML; node.replaceWith(p);
          }
        }
      });
    }

    function normalizeForPaste(html){
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      applyTextPresetMapping(doc);

      doc.querySelectorAll('ul, ol').forEach(list => {
        const frag = doc.createDocumentFragment();
        list.querySelectorAll('li').forEach(li => {
          const p = doc.createElement('p');
          p.innerHTML = li.innerHTML;
          frag.appendChild(p);
        });
        list.replaceWith(frag);
      });

      blockifyTopLevel(doc);
      doc.querySelectorAll('h1,h2,h3').forEach(h => { if (!h.textContent.trim()) h.remove(); });
      return doc.body.innerHTML || '<p><br></p>';

      doc.querySelectorAll('p').forEach(p => {
      p.innerHTML = p.innerHTML.replace(/^[\s•\-–—]+/g, '• ');
      });

    }

    function normalizeForStorage(html){
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      applyTextPresetMapping(doc);
      blockifyTopLevel(doc);
      doc.querySelectorAll('h1,h2,h3').forEach(h => { if (!h.textContent.trim()) h.remove(); });
      return doc.body.innerHTML || '<p><br></p>';
    }

    function sanitizeAndReplaceIfChanged(editor){
      const before = editor.innerHTML;
      const cleaned = DOMPurify.sanitize(before, PLAN_RTE_ALLOWED);
      const normalized = normalizeForStorage(cleaned);

      if (normalized !== before) {
        const y = editor.scrollTop;
        const lockH = editor.clientHeight;
        editor.style.minHeight = lockH + 'px';
        editor.innerHTML = normalized;
        editor.scrollTop = y;
        requestAnimationFrame(()=> { editor.style.minHeight = ''; });
      }
    }

    function parseCurrencyToCents(str) {
      const normalized = String(str).replace(/[^0-9.]/g, "");
      if (!normalized) return null;
      const num = Number(normalized);
      if (Number.isNaN(num)) return null;
      return Math.round(num * 100);
    }

    function parsePercentToBps(str) {
      const normalized = String(str).replace(/[^0-9.\-]/g, "");
      if (!normalized) return null;
      const num = Number(normalized);
      if (Number.isNaN(num)) return null;
      const pct = num <= 1 ? num * 100 : num;
      return Math.round(pct * 100);
    }

    const INPUT_FORMAT_PATTERNS = {
      currency: /(spend|price|cost|amount|fee|charge)/i,
      percent: /(percent|percentage|increase|growth|yoy)/i,
      number: /(count|number|qty|quantity|attorney)/i
    };

    function inferInputFormat({ label, dataKey, type }) {
      if (type === "date" || type === "select") return null;
      const haystack = `${label || ""} ${dataKey || ""}`.trim();
      if (!haystack) return null;
      if (INPUT_FORMAT_PATTERNS.currency.test(haystack)) return "currency";
      if (INPUT_FORMAT_PATTERNS.percent.test(haystack)) return "percent";
      if (INPUT_FORMAT_PATTERNS.number.test(haystack)) return "number";
      return null;
    }

    function formatValueForInput(rawValue, format) {
      const raw = String(rawValue ?? "");
      if (!raw.trim()) return "";
      if (format === "currency") {
        const cents = parseCurrencyToCents(raw);
        return cents == null ? raw : currencyFmt.format(cents / 100);
      }
      if (format === "percent") {
        const bps = parsePercentToBps(raw);
        return bps == null ? raw : (bps / 100).toFixed(2).replace(/\.00$/, "") + "%";
      }
      if (format === "number") {
        const normalized = raw.replace(/[^0-9\-]/g, "");
        if (!normalized) return "";
        const num = Number(normalized);
        return Number.isNaN(num) ? raw : String(Math.trunc(num));
      }
      return raw;
    }

    function normalizePlan(raw) {
      if (!raw) return {};
      return {
        name: raw.clgPlatform || raw.name || raw.planName || 'Plan',
        price: raw.clgPrice || raw.price || raw.planPrice || '',
        contents: raw.clgContents || raw.contents || raw.planContents || '',
        term: raw.term || raw.selectedTerm || raw.selectedTerms || ''
      };
    }

    function getProposalData() {
      if (window.clgFormVars) return window.clgFormVars;
      const ls = localStorage.getItem('clgFormVars') || localStorage.getItem('lnpresentsFormVars');
      if (ls) { try { return JSON.parse(ls); } catch (e) { console.warn('Could not parse proposal from localStorage', e); } }
      return { plans: [] };
    }

    function downloadEmailHtml(content, filename) {
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    }

    function buildSelectedTermsHtml(data = {}) {
      const sel = Array.isArray(data.clgSelectedTerms) ? data.clgSelectedTerms : [];
      if (!sel.length) return "";
      const items = [];

      const add = (key, label, value, type) => {
        if (!sel.includes(key)) return;
        let out = label;
        if (value) out += ": " + (type === "date" ? fmtDate(value) : value);
        items.push(
          '<li style="margin:0 0 4px 0; font-size:12px; color:#374151;">' +
          escapeHtml(out) +
          '</li>'
        );
      };

      add("numAttorneys","Number of Attorneys",data.clgNumAttorneys);
      add("yoyIncrease","Year over Year increase",data.clgYoyIncrease);

      add("currentSpend","Current Spend",data.clgCurrentSpend);
      add("effectiveDate","Effective Date",data.clgEffectiveDate,"date");
      add("currentTermEnd","Current Term End",data.clgCurrentTermEnd,"date");
      add("extensionTermEnd","Extension Term End",data.clgExtensionTermEnd,"date");
      add("extensionTerm","Term Extension",data.clgExtensionTerm);

      add("ActivationDate","Activation Date",data.clgActivationDate,"date");
      add("introPrice","Promotion Price",data.clgIntroPrice);
      add("termStartDate","Promotion End Date",data.clgTermStartDate,"date");
      add("termEndDate","Term End Date",data.clgTermEndDate,"date");
      add("nbExtensionTerm","Term Length",data.clgnbExtensionTerm);

      return items.join("");
    }

    function buildEmailHtml(plans, data, opts = {}) {
      const firm = (data && (data.clgFirmName || data.firmName)) || "Firm Name";
      const incentive = data && data.clgIncentive ? data.clgIncentive : "";
      const termsListHtml = buildSelectedTermsHtml(data);

      const planRows = (plans && plans.length ? plans : []).reduce((rows, plan, idx) => {
        if (idx % 2 === 0) rows.push([plan]);
        else rows[rows.length - 1].push(plan);
        return rows;
      }, []);

      const planTableHtml = planRows.length
        ? planRows
          .map(rowPlans => `
          <tr>
            ${rowPlans
              .map(plan => `
                <td width="50%" valign="top" style="padding:12px 10px 14px 10px; border-bottom:1px solid #e5e7eb;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="font-size:14px; font-weight:600; color:#111827; font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; padding:0 0 4px 0;">
                        ${escapeHtml(plan.name || "Plan")}
                      </td>
                    </tr>
                    ${
                      plan.price
                        ? `<tr>
                             <td style="font-size:13px; color:#111827; font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; padding:0 0 2px 0;">
                               <strong>Price:</strong> ${escapeHtml(plan.price)}
                             </td>
                           </tr>`
                        : ""
                    }
                    ${
                      plan.term
                        ? `<tr>
                             <td style="font-size:12px; color:#4b5563; font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; padding:0 0 6px 0;">
                               <strong>Term:</strong> ${escapeHtml(plan.term)}
                             </td>
                           </tr>`
                        : ""
                    }
                    ${
                      plan.contents
                        ? `<tr>
                             <td style="font-size:12px; color:#374151; font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; line-height:1.5;">
                               ${plan.contents}
                             </td>
                           </tr>`
                        : ""
                    }
                  </table>
                </td>
              `)
              .join("")}
            ${
              rowPlans.length === 1
                ? `<td width="50%" valign="top" style="padding:12px 10px 14px 10px; border-bottom:1px solid #e5e7eb;">
                     &nbsp;
                   </td>`
                : ""
            }
          </tr>
        `)
        .join("")
        : "";

      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Proposal</title>
</head>
<body style="margin:0; padding:0; background:#ffffff;">
  <table width="600" align="left" cellpadding="0" cellspacing="0" border="0" style="width:600px; margin:16px 0 16px 16px;">
    <tr>
      <td align="left" valign="top" style="padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border-collapse:separate; border-radius:8px; border:1px solid #e5e7eb; background-color:#ffffff; overflow:hidden;">
          <tr>
            <td style="padding:16px 20px; background:linear-gradient(90deg,#191970,#4b0082); color:#ffffff; font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <div style="font-size:12px; text-transform:uppercase; letter-spacing:.1em; opacity:.9;">LexisNexis</div>
              <div style="margin-top:2px; font-size:18px; font-weight:700;">Proposal Summary</div>
              <div style="margin-top:4px; font-size:13px; opacity:.9;">${escapeHtml(firm)}</div>
              ${
                incentive
                  ? `<div style="margin-top:4px; font-size:12px; opacity:.9;">
                       <strong>Incentive:</strong> ${escapeHtml(incentive)}
                     </div>`
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td style="padding:14px 20px; border-bottom:1px solid #e5e7eb; font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <div style="font-size:13px; font-weight:600; color:#111827; margin-bottom:6px;">Proposal Details</div>
              ${
                termsListHtml
                  ? `<ul style="list-style:none; margin:0; padding:0;">${termsListHtml}</ul>`
                  : `<p style="margin:0; font-size:12px; color:#6b7280;">(No terms selected)</p>`
              }
            </td>
          </tr>

          ${
            planTableHtml
              ? `
                <tr>
                  <td style="padding:0 12px 8px 12px; font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                      ${planTableHtml}
                    </table>
                  </td>
                </tr>`
              : ""
          }

          <tr>
            <td style="padding:10px 20px 14px 20px; text-align:center; font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <p style="margin:0; font-size:11px; color:#9ca3af;">
                LexisNexis Confidential
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }

    /* =========================
     * F) RENDERERS
     * ========================= */
    function renderClassicTopTerms() {
      const host = document.getElementById("classicTopTerms");
      if (!host) return;

      host.innerHTML = `
        <div class="terms-classic-panel__head">
        <div class="terms-classic-grid" id="classicTermsGrid"></div>
      `;

      const grid = host.querySelector("#classicTermsGrid");
      classicTermsDefs.forEach(def => {
        const selected = !!termsTilesState.classicTermsSelected?.[def.id];
        const value = termsTilesState.classicTermsValues?.[def.id] ?? "";

        const row = document.createElement("div");
        row.className = "terms-classic-row";

        const check = document.createElement("div");
        check.className = "term-check";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = selected;
        cb.setAttribute("aria-label", "Select " + def.label);
        const box = document.createElement("span");
        box.className = "box";
        check.appendChild(cb);
        check.appendChild(box);

        const label = document.createElement("div");
        label.className = "term-label";
        label.textContent = def.label;

        const inputWrap = document.createElement("div");
        inputWrap.className = "term-input";
        let input;
        if (def.type === "select") {
          input = document.createElement("select");
          const blank = document.createElement("option");
          blank.value = "";
          blank.textContent = "Select";
          input.appendChild(blank);
          (def.options || []).forEach(optVal => {
            const opt = document.createElement("option");
            opt.value = String(optVal);
            opt.textContent = String(optVal);
            input.appendChild(opt);
          });
          input.value = value || "";
        } else {
          input = document.createElement("input");
          input.type = def.type;
          if (def.placeholder) input.placeholder = def.placeholder;
          input.value = value || "";
        }
        inputWrap.appendChild(input);

        row.appendChild(check);
        row.appendChild(label);
        row.appendChild(inputWrap);
        grid.appendChild(row);

        cb.addEventListener("change", () => {
          termsTilesState.classicTermsSelected[def.id] = !!cb.checked;
          // Keep legacy state mirrors (compat only)
          if (def.dataKey) {
            if (!state.clgSelectedTerms) state.clgSelectedTerms = [];
            const legacyKey = def.id === "attorneyCount" ? "numAttorneys" : def.id;
            const idx = state.clgSelectedTerms.indexOf(legacyKey);
            if (cb.checked && idx === -1) state.clgSelectedTerms.push(legacyKey);
            if (!cb.checked && idx !== -1) state.clgSelectedTerms.splice(idx, 1);
          }
          persistTermsTiles();
          persistNow();
        });

        input.addEventListener("input", () => {
          termsTilesState.classicTermsValues[def.id] = input.value;
          if (def.dataKey) state[def.dataKey] = input.value; // mirror for exports/compat
          persistTermsTiles();
          persistNow();
        });

        input.addEventListener("blur", () => {
          const format = inferInputFormat({ label: def.label, dataKey: def.dataKey, type: def.type });
          if (!format) return;
          const formatted = formatValueForInput(input.value, format);
          if (formatted !== input.value) input.value = formatted;
          termsTilesState.classicTermsValues[def.id] = formatted;
          if (def.dataKey) state[def.dataKey] = formatted;
          persistTermsTiles();
          persistNow();
        });
      });
    }

    function buildInputElForTile(termDef) {
      let inputEl;
      const t = termDef.input.type;
      if (t === "select") {
        inputEl = document.createElement("select");
        (termDef.input.options || []).forEach(opt => {
          const o = document.createElement("option");
          o.value = opt;
          o.textContent = opt === "" ? "-- choose --" : opt;
          inputEl.appendChild(o);
        });
      } else if (t === "range") {
        inputEl = document.createElement("input");
        inputEl.type = "range";
        if (termDef.input.min != null) inputEl.min = termDef.input.min;
        if (termDef.input.max != null) inputEl.max = termDef.input.max;
        if (termDef.input.step != null) inputEl.step = termDef.input.step;
      } else {
        inputEl = document.createElement("input");
        inputEl.type = t;
        if (termDef.input.placeholder) inputEl.placeholder = termDef.input.placeholder;
      }
      return inputEl;
    }

    function addRangeOutputIfNeeded(parent, inputEl, termDef) {
      if (termDef.input?.type !== "range") return null;
      const output = document.createElement("div");
      output.className = "term-range-output";
      const suffix = termDef.input?.suffix ? ` ${termDef.input.suffix}` : "";
      const update = () => {
        output.textContent = `${inputEl.value || ""}${suffix}`.trim();
      };
      inputEl.addEventListener("input", update);
      update();
      parent.appendChild(output);
      return output;
    }

    function getTermGroupLabel(groupId) {
      return TERMS_TILE_GROUPS.find(group => group.id === groupId)?.label || groupId;
    }

    function updateTermCategoryBadges() {
      TERMS_TILE_GROUPS.forEach(group => {
        const badge = document.querySelector(`.tab-count[data-group="${group.id}"]`);
        const btn = document.querySelector(`.tab-btn[data-group="${group.id}"]`);
        if (!badge || !btn) return;
        const activeOrder = (termsTilesState.activeTileTermsOrder[group.id] || []).filter(id => ensureTileTerm(id).active);
        const hasActiveTerms = activeOrder.length > 0;
        badge.textContent = "";
        btn.classList.toggle("has-count", hasActiveTerms);
        btn.setAttribute("aria-label", hasActiveTerms ? `${group.label} (terms active)` : group.label);
      });
    }

    function buildSharedActiveOrder() {
      const order = (termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP] || []).filter(id => ensureTileTerm(id).active);
      let didUpdate = false;
      TERMS_TILE_GROUPS.forEach(group => {
        (termsTilesState.activeTileTermsOrder[group.id] || []).forEach(id => {
          if (ensureTileTerm(id).active && !order.includes(id)) {
            order.push(id);
            didUpdate = true;
          }
        });
      });
      Object.keys(termsTilesState.tileTermsState || {}).forEach(id => {
        if (ensureTileTerm(id).active && !order.includes(id)) {
          order.push(id);
          didUpdate = true;
        }
      });
      if (didUpdate) {
        termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP] = order.slice();
        persistTermsTiles();
      }
      return order;
    }

    function addTermToOrders(termId, group) {
      if (!termsTilesState.activeTileTermsOrder[group]) termsTilesState.activeTileTermsOrder[group] = [];
      if (!termsTilesState.activeTileTermsOrder[group].includes(termId)) {
        termsTilesState.activeTileTermsOrder[group].push(termId);
      }
      if (!termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP].includes(termId)) {
        termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP].push(termId);
      }
    }

    function removeTermFromOrders(termId) {
      TERMS_TILE_GROUPS.forEach(group => {
        termsTilesState.activeTileTermsOrder[group] = (termsTilesState.activeTileTermsOrder[group] || []).filter(id => id !== termId);
      });
      termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP] =
        (termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP] || []).filter(id => id !== termId);
    }

    const MAX_ACTIVE_TILE_TERMS = 5;

    function getActiveTileTermCount() {
      return Object.entries(termsTilesState.tileTerms || {}).reduce((total, [id, termState]) => {
        if (!termState?.active) return total;
        if (!tileTermById[id]) return total;
        return total + 1;
      }, 0);
    }

    function canActivateAnotherTileTerm() {
      return getActiveTileTermCount() < MAX_ACTIVE_TILE_TERMS;
    }

    function updateTermsExpandToggle(order = buildSharedActiveOrder(), expandedSet = termsTilesExpandedByGroup[SHARED_TERMS_GROUP] || new Set()) {
      const btn = document.getElementById("termsExpandToggleBtn");
      if (!btn) return;
      const hasTerms = order.length > 0;
      btn.hidden = !hasTerms;
      btn.disabled = !hasTerms;
      if (!hasTerms) return;
      const allExpanded = order.every(termId => expandedSet.has(termId));
      const allCollapsed = order.every(termId => !expandedSet.has(termId));
      const shouldShowCollapse = allExpanded && !allCollapsed;
      const nextLabel = shouldShowCollapse ? "Collapse All" : "Expand All";
      btn.textContent = nextLabel;
      btn.setAttribute("aria-label", `${nextLabel} active terms`);
    }

    let draggingSharedTermId = null;

    function renderSharedActiveTerms() {
      const dropzone = document.getElementById("termsDropzone");
      const activeList = document.getElementById("termsActiveList");
      if (!dropzone || !activeList) return;
      activeList.innerHTML = "";

      const order = buildSharedActiveOrder();
      dropzone.classList.toggle("has-terms", order.length > 0);
      const expandedSet = termsTilesExpandedByGroup[SHARED_TERMS_GROUP] || new Set();
      updateTermsExpandToggle(order, expandedSet);

      order.forEach(termId => {
        const termDef = tileTermById[termId];
        if (!termDef) return;
        const st = ensureTileTerm(termId);
        const isExpanded = expandedSet.has(termId);

        const row = document.createElement("div");
        row.className = `term-active-row ${isExpanded ? "is-expanded" : "is-collapsed"}`;
        row.dataset.termId = termId;

        const head = document.createElement("div");
        head.className = "term-active-row__head";

        const title = document.createElement("div");
        title.className = "term-active-row__title";

        const handle = document.createElement("div");
        handle.className = "term-drag-handle";
        handle.textContent = "⋮⋮";
        handle.setAttribute("title", "Drag to reorder");
        handle.setAttribute("draggable", "true");

        const expandBtn = document.createElement("button");
        expandBtn.type = "button";
        expandBtn.className = "term-expand-toggle";
        expandBtn.setAttribute("aria-expanded", isExpanded ? "true" : "false");
        expandBtn.setAttribute("aria-label", isExpanded ? "Collapse term values" : "Expand term values");
        expandBtn.innerHTML = `<span class="term-expand-toggle__icon">▾</span>`;

        const toggleExpanded = () => {
          if (expandedSet.has(termId)) {
            expandedSet.delete(termId);
          } else {
            expandedSet.add(termId);
          }
          termsTilesExpandedByGroup[SHARED_TERMS_GROUP] = expandedSet;
          renderSharedActiveTerms();
        };

        expandBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          toggleExpanded();
        });

        const name = document.createElement("div");
        name.textContent = termDef.label;

        title.appendChild(handle);
        title.appendChild(expandBtn);
        title.appendChild(name);

        const actions = document.createElement("div");
        actions.className = "term-row-actions";

        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "applies-toggle";
        toggleBtn.innerHTML = `<span class="switch ${st.appliesToAll ? "is-on" : ""}"></span><span>One Value for All Plans</span>`;

        toggleBtn.addEventListener("click", () => {
          st.appliesToAll = !st.appliesToAll;
          if (st.appliesToAll && (!st.globalValue || String(st.globalValue).trim() === "")) {
            const ids = currentPlanIds();
            for (const pid of ids) {
              const v = st.perPlanValues?.[pid];
              if (v && String(v).trim() !== "") { st.globalValue = v; break; }
            }
          }
          persistTermsTiles();
          persistNow();
          renderSharedActiveTerms();
        });

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "term-remove";
        removeBtn.setAttribute("aria-label", "Remove term");
        removeBtn.title = "Remove term";
        removeBtn.innerHTML = `
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M9 3h6l1 2h4a1 1 0 1 1 0 2h-1l-1.1 12.4A3 3 0 0 1 14.9 22h-5.8a3 3 0 0 1-2.99-2.6L5 7H4a1 1 0 1 1 0-2h4l1-2zm2 0-.5 1h3L13 3h-2zM7 7l1.05 12.1a1 1 0 0 0 .99.9h5.8a1 1 0 0 0 .99-.9L17 7H7zM10 10a1 1 0 0 1 2 0v7a1 1 0 1 1-2 0v-7zm4 0a1 1 0 0 1 2 0v7a1 1 0 1 1-2 0v-7z"/>
          </svg>
        `;
        removeBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          st.active = false;
          removeTermFromOrders(termId);
          expandedSet.delete(termId);
          termsTilesExpandedByGroup[SHARED_TERMS_GROUP] = expandedSet;
          persistTermsTiles();
          persistNow();
          renderAllTermsTiles();
        });

        actions.appendChild(toggleBtn);
        actions.appendChild(removeBtn);

        head.appendChild(title);
        head.appendChild(actions);

        head.addEventListener("click", (event) => {
          if (event.target.closest("button, input, select, textarea, .term-drag-handle")) return;
          toggleExpanded();
        });

        const body = document.createElement("div");
        body.className = "term-active-row__body";

        if (st.appliesToAll) {
          const wrap = document.createElement("div");
          wrap.className = "term-shared-input";
          const inputEl = buildInputElForTile(termDef);
          const hasGlobal = st.globalValue != null && String(st.globalValue).trim() !== "";
          if (termDef.input?.type === "range") {
            const minVal = termDef.input?.min ?? 1;
            inputEl.value = hasGlobal ? st.globalValue : minVal;
          } else {
            inputEl.value = st.globalValue || "";
          }
          wrap.appendChild(inputEl);
          addRangeOutputIfNeeded(wrap, inputEl, termDef);
          body.appendChild(wrap);

          inputEl.addEventListener("input", () => {
            st.globalValue = inputEl.value;
            const dk = termDef.input?.dataKey;
            if (dk) state[dk] = inputEl.value;
            persistTermsTiles();
            persistNow();
          });

          if (termDef.input?.type === "select") {
            inputEl.addEventListener("change", () => {
              st.globalValue = inputEl.value;
              const dk = termDef.input?.dataKey;
              if (dk) state[dk] = inputEl.value;
              persistTermsTiles();
              persistNow();
            });
          } else {
            inputEl.addEventListener("blur", () => {
              const format = inferInputFormat({
                label: termDef.label,
                dataKey: termDef.input?.dataKey,
                type: termDef.input?.type
              });
              if (!format) return;
              const formatted = formatValueForInput(inputEl.value, format);
              if (formatted !== inputEl.value) inputEl.value = formatted;
              st.globalValue = formatted;
              const dk = termDef.input?.dataKey;
              if (dk) state[dk] = formatted;
              persistTermsTiles();
              persistNow();
            });
          }
        } else {
          syncTileTermPlanSlots();
          const grid = document.createElement("div");
          grid.className = "term-plan-grid";

          const planCount = state.clgPlans.length;
          for (let idx = 0; idx < planCount; idx += 1) {
            const plan = state.clgPlans[idx];
            const pid = plan?.__id || null;
            const planName = plan ? getPlanDisplayName(plan, idx) : `Plan ${idx + 1}`;

            const card = document.createElement("div");
            card.className = "term-plan-input";
            card.dataset.planIdx = idx;

            const chip = document.createElement("div");
            chip.className = "term-plan-chip";
            chip.dataset.planIdx = idx;
            chip.textContent = planName;

            const inputEl = buildInputElForTile(termDef);

            const perPlanValue = (st.perPlanValues && pid in st.perPlanValues) ? (st.perPlanValues[pid] || "") : "";
            if (termDef.input?.type === "range") {
              const minVal = termDef.input?.min ?? 1;
              inputEl.value = perPlanValue || minVal;
            } else {
              inputEl.value = perPlanValue;
            }

            card.appendChild(chip);
            card.appendChild(inputEl);
            addRangeOutputIfNeeded(card, inputEl, termDef);
            grid.appendChild(card);

            const onUpdate = () => {
              if (!st.perPlanValues || typeof st.perPlanValues !== "object") st.perPlanValues = {};
              st.perPlanValues[pid] = inputEl.value;
              persistTermsTiles();
              persistNow();
            };
            inputEl.addEventListener("input", onUpdate);
            if (termDef.input?.type === "select") {
              inputEl.addEventListener("change", onUpdate);
            } else {
              inputEl.addEventListener("blur", () => {
                const format = inferInputFormat({
                  label: termDef.label,
                  dataKey: termDef.input?.dataKey,
                  type: termDef.input?.type
                });
                if (!format) return;
                const formatted = formatValueForInput(inputEl.value, format);
                if (formatted !== inputEl.value) inputEl.value = formatted;
                if (!st.perPlanValues || typeof st.perPlanValues !== "object") st.perPlanValues = {};
                st.perPlanValues[pid] = formatted;
                persistTermsTiles();
                persistNow();
              });
            }
          }

          body.appendChild(grid);
        }

        row.appendChild(head);
        row.appendChild(body);
        activeList.appendChild(row);

        handle.addEventListener("dragstart", (e) => {
          row.classList.add("term-row--dragging");
          draggingSharedTermId = termId;
          e.dataTransfer.setData("application/x-lnp-term", termId);
          e.dataTransfer.setData("text/plain", termId);
          e.dataTransfer.effectAllowed = "move";
        });
        handle.addEventListener("dragend", () => {
          row.classList.remove("term-row--dragging");
          draggingSharedTermId = null;
        });
        row.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = "move";
        });
        row.addEventListener("drop", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const movingId = e.dataTransfer.getData("application/x-lnp-term") || e.dataTransfer.getData("text/plain") || draggingSharedTermId;
          if (!movingId || movingId === termId) return;
          const arr = (termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP] || []).slice();
          const from = arr.indexOf(movingId);
          const to = arr.indexOf(termId);
          if (from === -1 || to === -1) return;

          const rect = row.getBoundingClientRect();
          const before = (e.clientY - rect.top) < rect.height / 2;

          arr.splice(from, 1);
          const insertAt = before ? (to > from ? to - 1 : to) : (to > from ? to : to + 1);
          arr.splice(insertAt, 0, movingId);
          termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP] = arr;

          persistTermsTiles();
          persistNow();
          renderSharedActiveTerms();
        });
      });
    }

    function buildAllTermsCatalog() {
      const seen = new Set();
      const allTerms = [];
      TERMS_TILE_GROUPS.forEach(group => {
        (tileTermsCatalog[group.id] || []).forEach(term => {
          if (seen.has(term.id)) return;
          seen.add(term.id);
          allTerms.push({ ...term, group: group.id });
        });
      });
      return allTerms;
    }

    function renderAllTermsTiles() {
      renderTermsTilesPanel(buildAllTermsCatalog(), allTermsLibraryHost);
      renderSharedActiveTerms();
      updateTermCategoryBadges();
    }

    const sharedDropzone = document.getElementById("termsDropzone");
    const termsExpandToggleBtn = document.getElementById("termsExpandToggleBtn");
    if (termsExpandToggleBtn) {
      termsExpandToggleBtn.addEventListener("click", () => {
        const order = buildSharedActiveOrder();
        const expandedSet = termsTilesExpandedByGroup[SHARED_TERMS_GROUP] || new Set();
        const allExpanded = order.length > 0 && order.every(termId => expandedSet.has(termId));
        if (allExpanded) {
          expandedSet.clear();
        } else {
          order.forEach(termId => expandedSet.add(termId));
        }
        termsTilesExpandedByGroup[SHARED_TERMS_GROUP] = expandedSet;
        renderSharedActiveTerms();
      });
    }
    if (sharedDropzone) {
      sharedDropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        sharedDropzone.classList.add("is-over");
        e.dataTransfer.dropEffect = draggingSharedTermId ? "move" : "copy";
      });
      sharedDropzone.addEventListener("dragleave", () => sharedDropzone.classList.remove("is-over"));
      sharedDropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        sharedDropzone.classList.remove("is-over");
        if (e.target.closest(".term-active-row")) return;
        const termId = e.dataTransfer.getData("application/x-lnp-term") || e.dataTransfer.getData("text/plain") || draggingSharedTermId;
        if (!termId || !tileTermById[termId]) return;
        const termDef = tileTermById[termId];
        const s = ensureTileTerm(termId);
        if (s.active) {
          const arr = (termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP] || []).filter(id => id !== termId);
          arr.push(termId);
          termsTilesState.activeTileTermsOrder[SHARED_TERMS_GROUP] = arr;
          persistTermsTiles();
          persistNow();
          renderAllTermsTiles();
          return;
        }
        if (!canActivateAnotherTileTerm()) {
          alert(`You can select up to ${MAX_ACTIVE_TILE_TERMS} active terms from the dropzone.`);
          return;
        }
        s.active = true;
        if (typeof s.appliesToAll !== "boolean") s.appliesToAll = false;
        if (!s.globalValue) {
          const dk = termDef.input?.dataKey;
          if (dk && state[dk]) s.globalValue = state[dk];
        }
        syncTileTermPlanSlots();
        const group = termDef.group || TERMS_TILE_GROUPS[0]?.id || "";
        addTermToOrders(termId, group);
        persistTermsTiles();
        persistNow();
        renderAllTermsTiles();
      });
    }

    function renderTermsTilesPanel(catalog, host) {
      if (!host) return;

      host.innerHTML = `
        <div class="terms-tiles-block">
          <div class="terms-tiles-block__head">
            <h3>Terms Library — All Available Terms</h3>
            <button type="button" id="clearTermsBtn" class="notebook-tab tab-action-btn" aria-label="Clear terms">Clear Terms</button>
          </div>
          <div class="terms-tile-library" id="allTermsTileLibrary" aria-label="All available terms"></div>
        </div>
      `;

      const lib = host.querySelector("#allTermsTileLibrary");
      const clearTermsBtn = host.querySelector("#clearTermsBtn");
      if (clearTermsBtn) {
        clearTermsBtn.onclick = clearTermsOnly;
      }

      // Library tiles
      catalog.forEach(term => {
        const st = ensureTileTerm(term.id);
        const tile = document.createElement("div");
        tile.className = "term-tile" + (st.active ? " is-used" : "");
        tile.setAttribute("role", "button");
        tile.setAttribute("tabindex", "0");
        tile.setAttribute("draggable", st.active ? "false" : "true");
        tile.dataset.termId = term.id;
        tile.innerHTML = `<span class="dot"></span><span>${term.label}</span>`;

        function activateFromUI() {
          const s = ensureTileTerm(term.id);
          if (s.active) return;
          if (!canActivateAnotherTileTerm()) {
            alert(`You can select up to ${MAX_ACTIVE_TILE_TERMS} active terms from the dropzone.`);
            return;
          }
          if (!s.active) s.active = true;
          // default OFF (per-plan)
          if (typeof s.appliesToAll !== "boolean") s.appliesToAll = false;
          // inherit from any legacy global value if present
          if (!s.globalValue) {
            const dk = term.input?.dataKey;
            if (dk && state[dk]) s.globalValue = state[dk];
          }
          // seed per-plan keys
          syncTileTermPlanSlots();
          addTermToOrders(term.id, term.group || TERMS_TILE_GROUPS[0]?.id || "");
          persistTermsTiles();
          persistNow();
          renderAllTermsTiles();
        }

        tile.addEventListener("click", activateFromUI);
        tile.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activateFromUI(); }
        });

        tile.addEventListener("dragstart", (e) => {
          if (ensureTileTerm(term.id).active) { e.preventDefault(); return; }
          e.dataTransfer.setData("text/plain", term.id);
          e.dataTransfer.effectAllowed = "copy";
        });

        lib.appendChild(tile);
      });
    }


    function getPlanDisplayName(plan, idx) {
      const name = (plan?.clgPlatform || "").trim();
      return name || `Plan ${idx + 1}`;
    }

    function getActivePlanIndex() {
      if (!state.clgPlans.length) return -1;
      const idx = state.clgPlans.findIndex(p => p.__id === activePlanId);
      if (idx !== -1) return idx;
      activePlanId = state.clgPlans[0]?.__id || null;
      return 0;
    }

    function updatePlanTabLabel(idx) {
      if (!planTabs || !state.clgPlans[idx]) return;
      const plan = state.clgPlans[idx];
      const label = planTabs.querySelector(`.plan-tab[data-plan-id="${plan.__id}"] .plan-tab__name`);
      if (label) label.textContent = getPlanDisplayName(plan, idx);
    }

    function renderPlans() {
      plansContainer.innerHTML = "";
      if (planTabs) planTabs.innerHTML = "";

      // keep ids stable
      ensurePlanIds();

      const activeIdx = getActivePlanIndex();
      const activePlan = state.clgPlans[activeIdx] || null;

      if (planTabs) {
        state.clgPlans.forEach((plan, idx) => {
          const tab = document.createElement("button");
          tab.type = "button";
          tab.className = "plan-tab notebook-tab" + (idx === activeIdx ? " is-active" : "");
          tab.dataset.planId = plan.__id;
          tab.setAttribute("draggable", "true");
          tab.setAttribute("role", "tab");
          tab.setAttribute("aria-selected", idx === activeIdx ? "true" : "false");
          tab.innerHTML = `
            <span class="plan-tab__name">${escapeHtml(getPlanDisplayName(plan, idx))}</span>
          `;
          planTabs.appendChild(tab);
        });

        if (addPlanBtn) {
          planTabs.appendChild(addPlanBtn);
        }
        if (clearPlansBtn) {
          planTabs.appendChild(clearPlansBtn);
        }
      }

      if (activePlan) {
        const sheet = document.createElement("div");
        sheet.className = "plan-sheet";
        sheet.dataset.planId = activePlan.__id;
        sheet.dataset.planIdx = activeIdx;

        sheet.innerHTML = `
          <div class="plan-sheet__header">
            <div class="plan-sheet__meta">
              <div class="plan-card-title">Plan ${activeIdx + 1}</div>
              <button type="button" class="plan-remove" data-remove="${activeIdx}">Remove</button>
            </div>
            <label class="plan-sheet__contents-title">Plan Contents</label>
          </div>
          <div class="plan-sheet__left">
            <div class="plan-sheet__left-panel">
            <div class="field">
              <label>Plan Title</label>
              <input type="text" data-plan-idx="${activeIdx}" data-plan-field="clgPlatform" value="${escapeHtml(activePlan.clgPlatform || "")}">
            </div>
            <div class="field">
              <label>Plan Price</label>
              <input type="text" data-plan-idx="${activeIdx}" data-plan-field="clgPrice" value="${escapeHtml(activePlan.clgPrice || "")}" placeholder="$0.00">
            </div>
            <div class="plan-label-desc">
              <label>Click the button below to create a <b>Plan Label</b> where you can attach a link or a recommendation.</label>
            </div>
            <button type="button" class="ln-btn ln-btn--sm plan-cta-btn" data-plan-idx="${activeIdx}" data-cmd="createLink">Plan Label</button>

            <small class="muted-text" data-plan-cta-summary>
              ${formatPlanCtaSummary(activePlan)}
            </small>
            </div>
          </div>

          <div class="plan-sheet__right">
            <div class="field plan-sheet__contents">
              <div class="plan-toolbar" data-plan-idx="${activeIdx}" role="toolbar" aria-label="Formatting">
                <button type="button" data-cmd="bold" title="Bold (⌘/Ctrl+B)"><b>B</b></button>
                <button type="button" data-cmd="italic" title="Italic (⌘/Ctrl+I)"><i>I</i></button>
                <button type="button" data-cmd="underline" title="Underline (⌘/Ctrl+U)"><u>U</u></button>
                <button type="button" data-cmd="insertUnorderedList" title="Bulleted list">• • •</button>
                <button type="button" data-cmd="insertOrderedList" title="Numbered list">1.</button>
                <input type="color" class="rte-color" aria-label="Text color">
                <select data-size-select class="rte-size-select" aria-label="Text size">
                  <option value="body">Body</option>
                  <option value="subhead">Subhead</option>
                  <option value="head">Head</option>
                </select>
                <button type="button" data-cmd="removeFormat" title="Clear formatting">Clear</button>
              </div>
              <div class="plan-contents rte" contenteditable="true" data-plan-content="true"
                data-plan-idx="${activeIdx}" data-plan-field="clgContents"
                placeholder="Type or paste content. Use ⌘/Ctrl+B, I, U. Bullets supported.">
                ${(activePlan.clgContents || '').trim() || '<p><br></p>'}
              </div>
              <small class="muted-text">Tip: Use ⌘/Ctrl+B, I, U. Click list buttons for bullets. ⌘/Ctrl+K sets the plan CTA.</small>
            </div>
          </div>
        `;
        plansContainer.appendChild(sheet);
      }

      if (addPlanBtn) {
        const isMax = state.clgPlans.length >= MAX_PLANS;
        addPlanBtn.disabled = isMax;
        addPlanBtn.setAttribute("title", isMax ? "Max plans reached" : "Add plan");
        addPlanBtn.setAttribute("aria-label", isMax ? "Max plans reached" : "Add plan");
      }
    }

    function formatPlanCtaSummary(plan) {
      const defaultLabel = "None";
      const label = (plan?.clgCtaLabel || "").trim();
      const url = (plan?.clgCtaUrl || "").trim();
      const displayLabel = label || defaultLabel;
      if (!url) return `Current Label: ${displayLabel} (no link)`;
      return `CTA button: ${displayLabel} — ${url}`;
    }

    function updatePlanCtaSummary(card, plan) {
      const summaryEl = card?.querySelector('[data-plan-cta-summary]');
      if (!summaryEl) return;
      summaryEl.textContent = formatPlanCtaSummary(plan);
    }

    function setPlanCtaFromPrompt(idx, card) {
      const plan = state.clgPlans[idx];
      if (!plan) return;
      const currentUrl = plan.clgCtaUrl || "";
      const currentLabel = plan.clgCtaLabel || "";
      const urlInput = prompt("(Optional Link) - You may put a link to be embedded in the Plan Label:", currentUrl);
      if (urlInput === null) return;
      const labelInput = prompt("Plan Label Message:", currentLabel);
      if (labelInput === null) return;
      plan.clgCtaUrl = String(urlInput || "").trim();
      plan.clgCtaLabel = String(labelInput || "").trim();
      updatePlanCtaSummary(card, plan);
      persistNow();
    }

    function buildAppConfigFromState(s) {
      // TERM DELIVERY RULES (V4):
      // - Classic terms: show in regular terms area if selected
      // - Tile terms: only show if active; if appliesToAll => regular terms area, else => per-plan terms

      const deliveredRegular = [];

      // Classic terms
      const ctSel = termsTilesState.classicTermsSelected || {};
      const ctVal = termsTilesState.classicTermsValues || {};

      function formatTermValue(def, rawVal) {
        if (rawVal == null || String(rawVal).trim() === "") return "";
        if (def?.input?.type === "date") return fmtDate(rawVal);
        if (def?.input?.suffix) {
          const suffix = def.input.suffix;
          return String(rawVal).includes(suffix) ? rawVal : `${rawVal} ${suffix}`;
        }
        return rawVal;
      }

      function pushRegular(key, label, rawVal, type, def) {
        if (!label) return;
        let finalLabel = label;
        if (rawVal && String(rawVal).trim() !== "") {
          if (def) {
            finalLabel = `${label}: ${formatTermValue(def, rawVal)}`;
          } else {
            finalLabel = type === "date" ? `${label}: ${fmtDate(rawVal)}` : `${label}: ${rawVal}`;
          }
        }
        deliveredRegular.push({ key, label: finalLabel });
      }

      if (ctSel.attorneyCount) pushRegular("attorneyCount", "Attorney Count", ctVal.attorneyCount, "text");
      if (ctSel.currentSpend)  pushRegular("currentSpend",  "Current Spend",  ctVal.currentSpend,  "text");
      if (ctSel.currentTermEnd)pushRegular("currentTermEnd","Current Term End",ctVal.currentTermEnd,"date");

      // Tile terms that are active + appliesToAll
      const ttState = termsTilesState.tileTermsState || {};
      const activeOrders = termsTilesState.activeTileTermsOrder || {};
      const seenTileRegular = new Set();

      function maybePushTileRegular(termId) {
        if (seenTileRegular.has(termId)) return;
        const def = tileTermById[termId];
        if (!def) return;
        const st = ttState[termId];
        if (!st || !st.active || !st.appliesToAll) return;
        const val = st.globalValue || (def.input?.dataKey ? (s[def.input.dataKey] || "") : "");
        pushRegular(termId, def.label, val, def.input?.type === "date" ? "date" : "text", def);
        seenTileRegular.add(termId);
      }

      Object.keys(activeOrders).forEach(group => {
        (activeOrders[group] || []).forEach(maybePushTileRegular);
      });

      // Cap for regular area (legacy behavior)
      const delivered = deliveredRegular.slice(0, MAX_TERM_SELECTIONS);

      // Plans + plan terms
      const plans = (s.clgPlans || []).map((plan, idx) => {
        const planId = plan.__id;
        const planTerms = [];
        const seenPlanTerms = new Set();

        function maybePushPlanTerm(termId) {
          if (seenPlanTerms.has(termId)) return;
          const def = tileTermById[termId];
          if (!def) return;
          const st = ttState[termId];
          if (!st || !st.active || st.appliesToAll) return;

          let rawVal = "";
          if (st.perPlanValues && planId && planId in st.perPlanValues) rawVal = st.perPlanValues[planId] || "";
          if (!rawVal) rawVal = st.globalValue || ""; // fallback

          let label = def.label;
          if (rawVal && String(rawVal).trim() !== "") {
            label = `${def.label}: ${formatTermValue(def, rawVal)}`;
          }
          planTerms.push({ key: termId, label });
          seenPlanTerms.add(termId);
        }
        Object.keys(activeOrders).forEach(group => {
          (activeOrders[group] || []).forEach(maybePushPlanTerm);
        });

        return {
          id: idx + 1,
          title: plan.clgPlatform || `Plan ${idx + 1}`,
          price: plan.clgPrice || "",
          contentsHtml: plan.clgContents || "",
          terms: planTerms,
          cta: plan.clgCtaLabel || "",
          ctaLabel: plan.clgCtaLabel || "",
          ctaUrl: plan.clgCtaUrl || ""
        };
      });

      // Keep Rep header selection available to the Presenter (raw + label)
      let repFile = "";
      let repLabel = "";
      try {
        repFile  = localStorage.getItem("LNP_LN_REP_FILE")  || localStorage.getItem("LNP_LN_REP") || "";
        repLabel = localStorage.getItem("LNP_LN_REP_LABEL") || "";
      } catch (e) {
        repFile = "";
        repLabel = "";
      }
      // NEW: pull uploaded header (best-effort) so Presenter can use it
let uploadedHeaderDataUrl = "";
let uploadedHeaderMeta = null;

try{
  // Prefer IDB, fallback to localStorage
  // Note: buildAppConfigFromState isn't async; we rely on localStorage fallback being present.
  const metaStr = localStorage.getItem("LNP_UPLOADED_HEADER_META_V1");
  const dataUrl = localStorage.getItem("LNP_UPLOADED_HEADER_DATAURL_V1");
  if (dataUrl) uploadedHeaderDataUrl = dataUrl;
  if (metaStr) uploadedHeaderMeta = JSON.parse(metaStr);
} catch(e){}


      window.APP_CONFIG = {
        ui: {
          companyName: s.clgFirmName || "Default Firm",
          subhead: s.clgIncentive || "",
          terms: delivered,
          plans: plans,

          // Backward-compatible (now RAW filename)
          LN_Rep: repFile,

          // New explicit fields
          LN_RepFile: repFile,
          LN_RepLabel: repLabel,
          uploadedHeaderDataUrl: uploadedHeaderDataUrl || "",
          uploadedHeaderMeta: uploadedHeaderMeta || null

        }
      };
    }

    /* =========================
     * G) RTE SANITIZE/HOOKS
     * ========================= */
    const PLAN_RTE_ALLOWED = {
      ALLOWED_TAGS: ['b','strong','i','em','u','p','br','ul','ol','li','a','span'],
      ALLOWED_ATTR: ['href','target','rel','style','class'],
      FORBID_TAGS: ['style','script','iframe','object','embed','form','input','button','img','video','audio']
    };

    if (window.DOMPurify && DOMPurify.addHook) {
      DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
        if (data.attrName !== 'style') return;
        const m = /color\s*:\s*([^;]+)/i.exec(data.attrValue);
        if (m) { data.attrValue = `color:${m[1].trim()}`; } else { data.keepAttr = false; }
      });
    }

    const planSelectionByIdx = {};
    function rememberSelectionFor(el){
      const idx = el.getAttribute('data-plan-idx');
      const sel = window.getSelection();
      if (!idx || !sel || sel.rangeCount === 0) return;
      planSelectionByIdx[idx] = sel.getRangeAt(0);
    }
    function restoreSelectionFor(idx, editor){
      const r = planSelectionByIdx[idx];
      if (!r) return;
      const sel = window.getSelection();
      editor.focus();
      sel.removeAllRanges();
      sel.addRange(r);
    }

    // selection + color handling
    (() => {
      const rangeByEditor = new WeakMap();

      function getCurrentRange() {
        const sel = window.getSelection();
        return (sel && sel.rangeCount) ? sel.getRangeAt(0).cloneRange() : null;
      }

      function restoreRange(range) {
        if (!range) return false;
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return true;
      }

      document.addEventListener('selectionchange', () => {
        const sel = window.getSelection();
        if (!sel || !sel.anchorNode) return;
        const editor = sel.anchorNode.nodeType === 1
          ? sel.anchorNode.closest?.('.plan-contents.rte')
          : sel.anchorNode.parentElement?.closest?.('.plan-contents.rte');
        if (editor) {
          const r = getCurrentRange();
          if (r) rangeByEditor.set(editor, r);
        }
      });

      document.addEventListener('mousedown', (e) => {
        const btn = e.target.closest('.plan-toolbar button, .plan-toolbar .ln-btn');
        if (btn) e.preventDefault();
      });

      document.addEventListener('change', (e) => {
        const colorInput = e.target.closest('.plan-toolbar input[type="color"].rte-color');
        if (!colorInput) return;

        const card = colorInput.closest('.plan-sheet');
        const editor = card?.querySelector('.plan-contents.rte');
        if (!editor) return;

        const saved = rangeByEditor.get(editor);

        requestAnimationFrame(() => {
          editor.focus({ preventScroll: true });
          restoreRange(saved);

          const color = colorInput.value;
          applyColorByWrap(color);
        });
      });

      function applyColorByWrap(color) {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        const range = sel.getRangeAt(0);
        if (range.collapsed) return;

        const frag = range.extractContents();
        const span = document.createElement('span');
        span.style.color = color;

        if (frag.childNodes.length === 1 &&
            frag.firstChild.nodeType === 1 &&
            frag.firstChild.nodeName === 'SPAN' &&
            frag.firstChild.style?.color === color) {
          range.insertNode(frag.firstChild);
        } else {
          span.appendChild(frag);
          range.insertNode(span);
          span.normalize();
        }

        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.addRange(newRange);
      }
    })();

    function textToParagraphs(t){
      const esc = t.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
      return '<p>'+esc.split(/\n{2,}/).map(s=>s.replace(/\n/g,'<br>')).join('</p><p>')+'</p>';
    }

    function insertHtmlAtCursor(editor, html){
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) { editor.insertAdjacentHTML('beforeend', html); return; }
      let range = sel.getRangeAt(0);
      if (!editor.contains(range.startContainer)) { editor.focus(); range = window.getSelection().getRangeAt(0); }
      range.deleteContents();
      const frag = range.createContextualFragment(html);
      const last = frag.lastChild;
      range.insertNode(frag);
      if (last){
        range.setStartAfter(last);
        range.collapse(true);
        sel.removeAllRanges(); sel.addRange(range);
      }
    }

    function convertFontTagsToSpan(rootEl){
      rootEl.querySelectorAll('font[color]').forEach(font => {
        const span = document.createElement('span');
        const color = font.getAttribute('color');
        if (color) span.setAttribute('style', `color:${color}`);
        span.innerHTML = font.innerHTML;
        font.replaceWith(span);
      });
    }

    function syncPlanContents(idx, editor){
      sanitizeAndReplaceIfChanged(editor);
      if (state.clgPlans[idx]) state.clgPlans[idx].clgContents = editor.innerHTML;
      persistNow();
    }


    /* =========================
     * H) EVENT WIRING
     * ========================= */

    // Hydrate top fields from state (initial)
    form.querySelectorAll("[data-key]").forEach(el => {
      const key = el.getAttribute("data-key");
      if (state[key]) el.value = state[key];
    });

    // Render term panels
    renderClassicTopTerms();
    renderAllTermsTiles();
    hydrateFormFromState();
    syncTileTermPlanSlots();

    const STORAGE_KEY = "clgFormVars";
const STORAGE_SCHEMA = 1;

function persistNow(){
  const payload = {
    __schema: STORAGE_SCHEMA,
    ...buildProfilePayload()
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch(e){}
}

    // Clear (NOTE: does NOT clear LN_Rep)
    function clearForm() {
      form.querySelectorAll("[data-key]").forEach(el => { el.value = ""; });
      form.querySelectorAll("[data-term-option]").forEach(cb => { cb.checked = false; });

      state.clgFirmName = "";
      state.clgNumAttorneys = "";
      state.clgYoyIncrease = "";
      state.clgIncentive = "";
      state.clgSelectedTerms = [];
      state.clgCurrentSpend = "";
      state.clgEffectiveDate = "";
      state.clgActivationDate = "";
      state.clgExtensionTermEnd = "";
      state.clgCurrentTermEnd = "";
      state.clgTermEndDate = "";
      state.clgExtensionTerm = "";
      state.clgnbExtensionTerm = "";
      state.clgIntroPrice = "";
      state.clgTermStartDate = "";
      state.clgPromotion = "";
      state.clgFreeTimeAvailable = "";
      state.clgCostPerAttorney = "";
      state.clgPlans = [makeEmptyPlan()];
      activePlanId = null;
      renderPlans();
      termsTilesState = defaultTermsTilesState();
      termsTilesExpandedByGroup = TERMS_TILE_GROUPS.reduce((acc, group) => {
        acc[group.id] = new Set();
        return acc;
      }, {});
      termsTilesExpandedByGroup[SHARED_TERMS_GROUP] = new Set();
      try { localStorage.removeItem(TERMS_TILES_STORAGE_KEY); } catch (e) {}
      renderClassicTopTerms();
      renderAllTermsTiles();
      syncTileTermPlanSlots();
      localStorage.removeItem("clgFormVars");
      buildAppConfigFromState(state);
    }
    clearBtn.addEventListener("click", clearForm);

    function clearPlansOnly() {
      state.clgPlans = [makeEmptyPlan()];
      activePlanId = null;
      renderPlans();
      syncTileTermPlanSlots();
      persistNow();
    }
    if (clearPlansBtn) {
      clearPlansBtn.addEventListener("click", clearPlansOnly);
    }

    function clearTermsOnly() {
      termsTilesState = defaultTermsTilesState();
      termsTilesExpandedByGroup = TERMS_TILE_GROUPS.reduce((acc, group) => {
        acc[group.id] = new Set();
        return acc;
      }, {});
      termsTilesExpandedByGroup[SHARED_TERMS_GROUP] = new Set();
      state.clgSelectedTerms = [];
      classicTermsDefs.forEach(def => {
        if (def.dataKey) state[def.dataKey] = "";
      });
      Object.values(tileTermDefinitions).forEach(def => {
        if (def.input?.dataKey) state[def.input.dataKey] = "";
      });
      try { localStorage.removeItem(TERMS_TILES_STORAGE_KEY); } catch (e) {}
      renderClassicTopTerms();
      renderAllTermsTiles();
      syncTileTermPlanSlots();
      persistNow();
    }
    if (planTabs) {
      planTabs.addEventListener("click", (e) => {
        const tab = e.target.closest(".plan-tab[data-plan-id]");
        if (!tab) return;
        if (suppressPlanTabClick) {
          e.preventDefault();
          return;
        }
        activePlanId = tab.dataset.planId;
        renderPlans();
      });
    }

    // Plans initial render
    renderPlans();

    /* =========================
     * Plans: tab long-press drag to reorder
     * ========================= */
    let dragTabEl = null;
    let planTabHoldTimer = null;
    let armedPlanTabId = null;
    let suppressPlanTabClick = false;

    function clearPlanTabHoldState() {
      if (planTabHoldTimer) {
        clearTimeout(planTabHoldTimer);
        planTabHoldTimer = null;
      }
      if (!planTabs) return;
      planTabs.querySelectorAll('.plan-tab.is-reorder-armed').forEach(tab => tab.classList.remove('is-reorder-armed'));
      armedPlanTabId = null;
    }

    function reorderPlansByTabDom() {
      if (!planTabs) return;
      const tabs = [...planTabs.querySelectorAll('.plan-tab[data-plan-id]')];
      const ids = tabs.map(tab => tab.dataset.planId).filter(Boolean);
      if (!ids.length) return;
      const byId = new Map((state.clgPlans || []).map(p => [p.__id, p]));
      const next = ids.map(id => byId.get(id)).filter(Boolean);
      if (!next.length) return;
      state.clgPlans = next;
      activePlanId = dragTabEl?.dataset.planId || activePlanId;
      persistNow();
      renderPlans();
      buildAppConfigFromState(state);
    }

    function getClosestPlanTab(container, x) {
      const tabs = [...container.querySelectorAll('.plan-tab[data-plan-id]:not(.is-dragging)')];
      let best = null;
      let bestDist = Infinity;
      tabs.forEach(tab => {
        const rect = tab.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const dist = Math.abs(x - cx);
        if (dist < bestDist) {
          bestDist = dist;
          best = { el: tab, cx };
        }
      });
      return best;
    }

    if (planTabs) {
      const beginHold = (targetTab) => {
        clearPlanTabHoldState();
        if (!targetTab?.dataset?.planId) return;
        planTabHoldTimer = setTimeout(() => {
          armedPlanTabId = targetTab.dataset.planId;
          targetTab.classList.add('is-reorder-armed');
        }, 1000);
      };

      planTabs.addEventListener('mousedown', (e) => {
        const tab = e.target.closest('.plan-tab[data-plan-id]');
        if (!tab) return;
        beginHold(tab);
      });
      planTabs.addEventListener('touchstart', (e) => {
        const tab = e.target.closest('.plan-tab[data-plan-id]');
        if (!tab) return;
        beginHold(tab);
      }, { passive: true });

      ['mouseup','mouseleave','touchend','touchcancel'].forEach(evt => {
        planTabs.addEventListener(evt, () => {
          if (!dragTabEl) clearPlanTabHoldState();
        });
      });

      planTabs.addEventListener('dragstart', (e) => {
        const tab = e.target.closest('.plan-tab[data-plan-id]');
        if (!tab || tab.dataset.planId !== armedPlanTabId) { e.preventDefault(); return; }
        dragTabEl = tab;
        tab.classList.add('is-dragging');
        suppressPlanTabClick = true;
        try { e.dataTransfer.setData('text/plain', tab.dataset.planId || 'plan'); } catch {}
        e.dataTransfer.effectAllowed = 'move';
      });

      planTabs.addEventListener('dragover', (e) => {
        if (!dragTabEl) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const hit = getClosestPlanTab(planTabs, e.clientX);
        if (!hit || !hit.el || hit.el === dragTabEl) return;
        if (e.clientX > hit.cx) {
          planTabs.insertBefore(dragTabEl, hit.el.nextElementSibling);
        } else {
          planTabs.insertBefore(dragTabEl, hit.el);
        }
      });

      planTabs.addEventListener('drop', (e) => {
        if (!dragTabEl) return;
        e.preventDefault();
      });

      planTabs.addEventListener('dragend', () => {
        if (dragTabEl) dragTabEl.classList.remove('is-dragging');
        clearPlanTabHoldState();
        reorderPlansByTabDom();
        dragTabEl = null;
        setTimeout(() => { suppressPlanTabClick = false; }, 0);
      });
    }
    // Plan inputs
    plansContainer.addEventListener("input", function (e) {
      const field = e.target.getAttribute("data-plan-field");
      const idxStr = e.target.getAttribute("data-plan-idx");
      if (!field || idxStr == null) return;

      const idx = Number(idxStr);
      if (!state.clgPlans[idx]) return;

      let val = e.target.value;

      if (field === "clgPrice") {
        state.clgPlans[idx].clgPrice = val;
        const cents = parseCurrencyToCents(val);
        state.clgPlans[idx].clgPriceCents = (cents == null ? null : cents);
        return;
      }

      if (field === "clgPlatform") {
        state.clgPlans[idx].clgPlatform = val;
        updatePlanTabLabel(idx);
        renderAllTermsTiles();
        return;
      }

      if (field === "clgContents") {
        state.clgPlans[idx].clgContents = val;
      }
    });

    plansContainer.addEventListener("blur", function (e) {
      const field = e.target.getAttribute("data-plan-field");
      const idxStr = e.target.getAttribute("data-plan-idx");
      if (field !== "clgPrice" || idxStr == null) return;

      const idx = Number(idxStr);
      const cents = parseCurrencyToCents(e.target.value);
      if (cents != null) {
        const pretty = currencyFmt.format(cents / 100);
        e.target.value = pretty;
        state.clgPlans[idx].clgPrice = pretty;
        state.clgPlans[idx].clgPriceCents = cents;
      }
    }, true);

    // Plans: remove
    plansContainer.addEventListener("click", function (e) {
      const rem = e.target.getAttribute("data-remove");
      if (rem != null) {
        const removeIdx = Number(rem);
        const removedId = state.clgPlans[removeIdx]?.__id;
        state.clgPlans.splice(removeIdx, 1);
        if (state.clgPlans.length === 0) state.clgPlans.push(makeEmptyPlan());
        if (removedId && removedId === activePlanId) {
          const nextIdx = Math.min(removeIdx, state.clgPlans.length - 1);
          activePlanId = state.clgPlans[nextIdx]?.__id || null;
        }
        renderPlans();
        syncTileTermPlanSlots();
        renderAllTermsTiles();
      }
    });

    // Plans: add
    addPlanBtn.addEventListener("click", function () {
      if (state.clgPlans.length >= MAX_PLANS) return;
      state.clgPlans.push(makeEmptyPlan());
      ensurePlanIds();
      activePlanId = state.clgPlans[state.clgPlans.length - 1]?.__id || null;
      renderPlans();
      syncTileTermPlanSlots();
      renderAllTermsTiles();
    });

    // Form input (top-level)
    form.addEventListener("input", function (e) {
      const key = e.target.getAttribute("data-key");
      if (!key) return;

      if (key === "clgCurrentSpend" || key === "clgIntroPrice") {
        const cents = parseCurrencyToCents(e.target.value);
        state[key] = cents == null ? "" : currencyFmt.format(cents / 100);
        return;
      }

      if (key === "clgYoyIncrease") {
        const bps = parsePercentToBps(e.target.value);
        state.clgYoyIncrease = bps == null ? "" : (bps / 100).toFixed(2).replace(/\.00$/, "") + "%";
        return;
      }

      state[key] = e.target.value;
      persistNow();
    });

    form.addEventListener("blur", function (e) {
      const key = e.target.getAttribute("data-key");
      if (!key) return;
      const labelText = e.target.closest(".field")?.querySelector("label")?.textContent || "";
      const format = inferInputFormat({ label: labelText, dataKey: key, type: e.target.type });
      if (!format) return;
      const formatted = formatValueForInput(e.target.value, format);
      if (formatted !== e.target.value) e.target.value = formatted;
      if (key === "clgCurrentSpend" || key === "clgIntroPrice") {
        const cents = parseCurrencyToCents(formatted);
        state[key] = cents == null ? formatted : currencyFmt.format(cents / 100);
      } else if (key === "clgYoyIncrease") {
        const bps = parsePercentToBps(formatted);
        state.clgYoyIncrease = bps == null ? formatted : (bps / 100).toFixed(2).replace(/\.00$/, "") + "%";
      } else {
        state[key] = formatted;
      }
      persistNow();
    }, true);

    // Term checkbox selection
    form.addEventListener("change", function (e) {
      const termKey = e.target.getAttribute("data-term-option");
      if (!termKey) return;

      let selected = Array.isArray(state.clgSelectedTerms) ? [...state.clgSelectedTerms] : [];
      if (e.target.checked) {
        if (!selected.includes(termKey)) {
          if (selected.length >= MAX_TERM_SELECTIONS) { e.target.checked = false; return; }
          selected.push(termKey);
        }
      } else {
        selected = selected.filter(k => k !== termKey);
      }
      state.clgSelectedTerms = selected;
      persistNow();
    });

    // Export -> HTML file
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const data = getProposalData();
        const rawPlans = data.clgPlans || data.plans || data.planCards || (data.form?.plans) || [];
        const plans = rawPlans.map(normalizePlan);
        const emailHtml = buildEmailHtml(plans, data);
        downloadEmailHtml(emailHtml, 'proposal-email.html');
      });
    }

    // Download Profile (JSON) with popup filename prompt
    if (downloadProfileBtn) {
      downloadProfileBtn.addEventListener("click", () => {
        const payload = {
          meta: {
            app: "LNPresents-Builder",
            version: 1,
            exportedAt: new Date().toISOString()
          },
          data: buildProfilePayload()
        };

        const suggestedBase = state.clgFirmName || "lnpresents-profile";
        let rawBase = window.prompt("File name for this profile (no extension):", suggestedBase);
        if (rawBase === null) return;

        rawBase = rawBase.trim();
        if (!rawBase) rawBase = suggestedBase;

        let safeBase = rawBase
          .toLowerCase()
          .replace(/[^a-z0-9\-]+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        if (!safeBase) safeBase = "lnpresents-profile";
        const filename = `${safeBase}.json`;

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        trackAnalyticsEvent("builder_profile_downloaded", {
          event_category: "builder",
          event_label: filename
        });
      });
    }

    // Upload Profile (JSON) with overwrite confirmation
    if (uploadProfileInput) {
      uploadProfileInput.addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        try {
          const text = await file.text();
          const json = JSON.parse(text);

          const ok = window.confirm(
            "Load this profile and overwrite all current Builder details (firm info, terms, and plan contents)?"
          );
          if (!ok) return;

          applyLoadedProfile(json);
          alert("Profile loaded into Builder.");

          trackAnalyticsEvent("builder_profile_uploaded", {
            event_category: "builder",
            event_label: file.name || "unknown"
          });
        } catch (err) {
          console.error("Error loading profile:", err);
          alert("Could not load that file. Make sure it was exported from LN Presents Builder.");
        } finally {
          e.target.value = "";
        }
      });
    }

    // Save
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const toSave = buildProfilePayload();
      localStorage.setItem("clgFormVars", JSON.stringify(toSave));
      buildAppConfigFromState(state);

      const selectedTerms = Array.isArray(state.clgSelectedTerms)
        ? state.clgSelectedTerms.filter(Boolean)
        : [];
      const plansInProposal = Array.isArray(state.clgPlans)
        ? state.clgPlans.filter(Boolean).length
        : 0;

      trackAnalyticsEvent("builder_proposal_saved", {
        event_category: "builder",
        plans_in_proposal: plansInProposal,
        selected_terms_count: selectedTerms.length,
        selected_terms: selectedTerms.join(",")
      });

      selectedTerms.forEach((termKey) => {
        trackAnalyticsEvent("builder_term_selected_on_save", {
          event_category: "builder",
          term_key: termKey
        });
      });

      const original = saveBtn.textContent;
      saveBtn.textContent = "Saved ✓";
      setTimeout(() => (saveBtn.textContent = original), 1200);
    });

    /* =========================
     * I) RTE INTERACTIONS
     * ========================= */
    plansContainer.addEventListener('input', (e)=>{
      const editor = e.target.closest('.plan-contents[contenteditable]');
      if (!editor) return;
      const idx = Number(editor.getAttribute('data-plan-idx'));
      if (Number.isNaN(idx)) return;
      if (state.clgPlans[idx]) state.clgPlans[idx].clgContents = editor.innerHTML;
    });

    ['mouseup','keyup','touchend'].forEach(ev=>{
      plansContainer.addEventListener(ev, (e)=>{
        const editor = e.target.closest('.plan-contents[contenteditable]');
        if (editor) rememberSelectionFor(editor);
      });
    });

    plansContainer.addEventListener('paste', (e)=>{
      const editor = e.target.closest('.plan-contents[contenteditable]');
      if (!editor) return;
      e.preventDefault();
      const html = (e.clipboardData && e.clipboardData.getData('text/html')) || '';
      const text = (e.clipboardData && e.clipboardData.getData('text/plain')) || '';
      const incoming = html && html.trim() ? html : textToParagraphs(text);
      const cleaned = DOMPurify.sanitize(incoming, PLAN_RTE_ALLOWED);
      const normalized = normalizeForPaste(cleaned);
      insertHtmlAtCursor(editor, normalized);
      const idx = Number(editor.getAttribute('data-plan-idx'));
      syncPlanContents(idx, editor);
      convertFontTagsToSpan(editor);
    });

    plansContainer.addEventListener('keydown', (e)=>{
      const editor = e.target.closest('.plan-contents[contenteditable]');
      if (!editor) return;
      const planIdx = Number(editor.getAttribute('data-plan-idx'));
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (!['b','i','u','k'].includes(k)) return;
      e.preventDefault();
      if (k === 'b') document.execCommand('bold');
      if (k === 'i') document.execCommand('italic');
      if (k === 'u') document.execCommand('underline');
      if (k === 'k') {
        const card = editor.closest('.plan-sheet');
        setPlanCtaFromPrompt(planIdx, card);
      }
      convertFontTagsToSpan(editor);
      if (state.clgPlans[planIdx]) state.clgPlans[planIdx].clgContents = editor.innerHTML;
    });

    plansContainer.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-cmd]');
      if (!btn) return;
      const toolbar = btn.closest('.plan-toolbar');
      const idx = btn.getAttribute('data-plan-idx')
        || toolbar?.getAttribute('data-plan-idx')
        || btn.closest('.plan-sheet')?.getAttribute('data-plan-idx');
      if (idx == null) return;
      const editor = plansContainer.querySelector('.plan-contents[data-plan-idx="'+idx+'"]');
      if (!editor) return;
      restoreSelectionFor(idx, editor);
      const cmd = btn.getAttribute('data-cmd');
      if (cmd === 'createLink') {
        const card = editor.closest('.plan-sheet');
        setPlanCtaFromPrompt(Number(idx), card);
      } else if (cmd === 'removeFormat') {
        document.execCommand('removeFormat', false, null);
        editor.querySelectorAll('a').forEach(a=>{ a.replaceWith(document.createTextNode(a.textContent)); });
      } else {
        document.execCommand(cmd, false, null);
      }

      convertFontTagsToSpan(editor);
      const i = Number(idx);
      if (state.clgPlans[i]) state.clgPlans[i].clgContents = editor.innerHTML;
    });

    document.addEventListener('selectionchange', ()=>{
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const node = sel.anchorNode;
      if (!node) return;
      const editor = node.nodeType === 1 ? node.closest('.plan-contents[contenteditable]')
                                         : node.parentElement?.closest('.plan-contents[contenteditable]');
      if (!editor) return;
      rememberSelectionFor(editor);
    });

    plansContainer.addEventListener('focusout', (e)=>{
      const editor = e.target.closest('.plan-contents[contenteditable]');
      if (!editor) return;
      convertFontTagsToSpan(editor);
      const idx = Number(editor.getAttribute('data-plan-idx'));
      if (state.clgPlans[idx]) state.clgPlans[idx].clgContents = editor.innerHTML;
    });

    // =========================
    // PRESETS: load from GitHub + drag/drop with {{STATE}} injection
    // =========================
    const PRESETS_URL = "https://raw.githubusercontent.com/chase-gardner/LN-Presents/refs/heads/main/Plan-Presets.json";
    const presetListEl = document.getElementById("presetList");
    const STATE_TOKEN_RE = /\{\{\s*STATE\s*\}\}/gi;

    let allPresets = [];
    let draggedPreset = null;
    let lastPresetState = localStorage.getItem("lnpPresetState") || "";

    async function loadPlanPresetsFromGitHub() {
      if (!presetListEl) return;
      presetListEl.innerHTML = `<p class="presets-empty">Loading presets…</p>`;

      try {
        const res = await fetch(PRESETS_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        allPresets = Array.isArray(json) ? json : [];
        renderPresetGroups(allPresets);
      } catch (err) {
        console.error("Error loading presets:", err);
        presetListEl.innerHTML = `<p class="presets-empty">Could not load presets from GitHub. Please try again later.</p>`;
      }
    }

    function renderPresetGroups(presets) {
      if (!presets.length) {
        presetListEl.innerHTML = `<p class="presets-empty">No presets found in Plan-Presets.json.</p>`;
        return;
      }

      const byGroup = {};
      presets.forEach(p => {
        const g = p.group || "Other";
        if (!byGroup[g]) byGroup[g] = [];
        byGroup[g].push(p);
      });

      presetListEl.innerHTML = "";

      Object.keys(byGroup).sort().forEach(groupName => {
        const groupEl = document.createElement("div");
        groupEl.className = "preset-group";

        const label = document.createElement("div");
        label.className = "preset-group__label";
        label.textContent = groupName;
        groupEl.appendChild(label);

        byGroup[groupName].forEach(preset => {
          const pill = document.createElement("button");
          pill.type = "button";
          pill.className = "preset-pill";
          pill.textContent = preset.name || "Preset";
          pill.draggable = true;

          pill.dataset.presetName = preset.name || "";
          pill.dataset.usesState = STATE_TOKEN_RE.test(preset.contents || "") ? "true" : "false";

          pill.addEventListener("dragstart", (e) => {
            draggedPreset = preset;
            e.dataTransfer.effectAllowed = "copy";
            e.dataTransfer.setData("text/plain", preset.name || "Preset");
          });

          pill.addEventListener("dragend", () => {
            draggedPreset = null;
          });

          groupEl.appendChild(pill);
        });

        presetListEl.appendChild(groupEl);
      });
    }

    function applyPresetToEditor(editor, preset) {
      if (!editor || !preset) return;

      let raw = String(preset.contents || "");

      if (STATE_TOKEN_RE.test(raw)) {
        const userState = window.prompt(
          "Enter the State for this proposal (e.g., Florida):",
          lastPresetState || ""
        );
        if (userState === null) return;

        lastPresetState = userState.trim();
        if (lastPresetState) {
          localStorage.setItem("lnpPresetState", lastPresetState);
        }
        raw = raw.replace(STATE_TOKEN_RE, lastPresetState || "");
      }

      const html = textToParagraphs(raw);
      const cleaned = DOMPurify.sanitize(html, PLAN_RTE_ALLOWED);
      insertHtmlAtCursor(editor, cleaned);
    }

    plansContainer.addEventListener("dragover", (e) => {
      const editor = e.target.closest('[data-plan-content="true"]');
      if (!editor || !draggedPreset) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      editor.classList.add("preset-drop-target");
    });

    plansContainer.addEventListener("dragleave", (e) => {
      const editor = e.target.closest('[data-plan-content="true"]');
      if (!editor) return;
      editor.classList.remove("preset-drop-target");
    });

    plansContainer.addEventListener("drop", (e) => {
      const editor = e.target.closest('[data-plan-content="true"]');
      if (!editor || !draggedPreset) return;
      e.preventDefault();
      editor.classList.remove("preset-drop-target");

      applyPresetToEditor(editor, draggedPreset);

      const idx = Number(editor.getAttribute("data-plan-idx"));
      syncPlanContents(idx, editor);
    });

    loadPlanPresetsFromGitHub();

    /* =========================
     * J) INITIAL CONFIG BUILD
     * ========================= */
    buildAppConfigFromState(state);

  });

/* ===== Inline script 5 from LNPresents-Builder.html ===== */
(function(){
  const body = document.body;
  const openBtn = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');
  const overlay = document.getElementById('sidebarOverlay');

  if (!openBtn || !closeBtn || !overlay) return;

  function closePanel(){
    body.classList.remove('sidebar-open');
  }
  function toggle(){
    body.classList.toggle('sidebar-open');
  }

  openBtn.addEventListener('click', toggle);
  closeBtn.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  // Close if user rotates / resizes back to desktop
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 1101px)').matches) closePanel();
  });
})();
