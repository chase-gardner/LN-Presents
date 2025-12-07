# LNPresents – Front-End User Guide

This version of the README is for people **using** the proposal tool in the browser (not developers). It explains what the screen does, how to enter proposal details, and how your data is handled.

---

## What LNPresents Does

LNPresents is a proposal builder and presenter for your LexisNexis-style plans. You fill out a short form with plan details, pricing, and terms, and the tool formats it into clean proposal cards you can show to a client.

It’s designed to be:
- **Simple** – fill in plans, pick terms, present.
- **Flexible** – show 1–4+ plans depending on what you need.
- **Local** – data stays in your browser unless you export/share it.

---

## Basic Operations

1. **Open the Proposal Builder page** in your browser.
2. **Add plans** (Plan name, price, and plan contents).
3. **Choose term options** (Retention vs New Business).
4. **Click Save** to keep your current work in the browser.
5. **Open/refresh the presenter** to show the clean view.
6. **Click Clear** if you want to start over.

That’s it. Most users will only ever do those steps.

---

## Key Features

### 1. Retention vs New Business Term Options
The form supports having **separate term selections** for:
- **Retention / Renewal** pricing or terms
- **New Business** pricing or terms

This lets you present the right term structure for different client situations without rewriting the whole proposal.

### 2. Dynamic Plan Amount & Formatting
You can add multiple plans (for example, “Core,” “Plus,” “AI Add-On”) and the layout will:
- Place plans in a consistent card style
- Try to keep them aligned
- Only move to a new row when there’s space

This gives you a professional, even layout when presenting.

### 3. Save & Clear Buttons
- **Save**: stores your current proposal data in your browser so you don’t lose it if you refresh or come back later.
- **Clear**: wipes the current form so you can build a new proposal from scratch.

These controls are meant to make fast, repeatable proposal building easier.

---

## Data Storage & Security

- Your data is stored **on your device**, typically in the browser’s local storage.
- No data is sent to a server by default.
- Because it’s **local-only**, it’s as private as your device/browser is.
- If you share your computer or use a public machine, **click Clear** when done so the next person can’t see your proposal.
- If IT later connects this to a backend, they’ll tell you — but the current setup is browser-based.

---

## What You Can Enter

- **Plan Name** – what the client will recognize.
- **Price** – formatted for presenting.
- **Plan Contents / Description** – what’s included.
- **Terms** – retention vs new business.
- **Activation/Effective Dates** – if enabled in your build.

Some versions allow basic text formatting in the plan description (bold, underline, etc.) when pasted or entered with shortcuts.

---

## Presenter View

After you enter everything:
- The presenter shows the **clean version** of your proposal.
- The **LexisNexis logo** is static from the assets folder, so branding stays consistent.
- You can screen share it or export/print if your environment allows.

---

## Tips for Best Results

- Keep plan names short.
- Fill in all fields for each plan so cards match visually.
- Use Save before navigating away.
- Clear when switching to a different customer.

---

## FAQ

**Q: Will I lose my proposal if I refresh?**  
A: Not if you clicked **Save** — it’s stored locally.

**Q: Can others see my proposal?**  
A: Only if they’re on the same device/browser and you didn’t Clear it.

**Q: Can I add more than two plans?**  
A: Yes, the layout is dynamic. It will wrap to the next row when needed.

---

## Support / Changes
If something doesn’t load (like the logo) or terms don’t show on the presenter, tell your admin or the person who shared the tool with you — they may need to update paths or enable that field.

---
