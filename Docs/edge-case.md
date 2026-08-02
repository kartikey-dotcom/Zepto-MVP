# Zepto AI Cross-Category Assistant — Edge-Case & Boundary Scenario Analysis

**Project Title:** Zepto AI Cross-Category Assistant MVP  
**Domain:** Quick Commerce (Q-Commerce) / Real-time Recommendation & In-Flow UI Safeguards  
**Document Version:** 1.0.0  
**Status:** Approved Technical Risk & Edge-Case Reference  
**Reference Documents:**  
* [problemstatement.md](file:///c:/Users/DELL/OneDrive/Desktop/Krishna/Zepto%20MVP/Docs/problemstatement.md)  
* [Architecture.md](file:///c:/Users/DELL/OneDrive/Desktop/Krishna/Zepto%20MVP/Docs/Architecture.md)  
* [PhaseWiseImplementationPlan.md](file:///c:/Users/DELL/OneDrive/Desktop/Krishna/Zepto%20MVP/Docs/PhaseWiseImplementationPlan.md)  

---

## 1. Executive Overview

This document provides a comprehensive analysis of **Edge-Case Scenarios**, failure modes, and automated safeguards engineered for the **Zepto AI Cross-Category Assistant** MVP. It defines how the system handles catalog discrepancies, UI limitations, and conflicting user intent to guarantee zero forced friction during checkout.

---

## 2. Core Assistant Edge-Case Taxonomy & Safeguards

### Category 1: Recommendation & Matcher Engine Logic

#### E1.1 Empty Cart Context
* **Scenario:** The user opens the cart drawer with zero items added.
* **Risk:** The AI Matcher executes with empty inputs, leading to null pointers, errors, or generic recommendations showing too early.
* **System Safeguard:** The AI Matcher is suppressed until at least one item is present in the cart. The checkout card area displays a subtle placeholder or remains hidden.

#### E1.2 Redundant Recommendations
* **Scenario:** The AI Matcher recommends a high-margin item (e.g., "Organic Vitamin C Serum") that the user has already manually added to their cart.
* **Risk:** Redundant suggestions look unprofessional and waste the single-nudge opportunity.
* **System Safeguard:** The matching engine cross-checks candidate items against the active cart list. If an item is already present in the cart, it is filtered out of the recommendation pool.

#### E1.3 Conflicting Shopping Context (Cart vs. Search Intent)
* **Scenario:** The user has daily groceries in the cart (e.g., Milk, Bread), but search input or recent search history indicates interest in "Dog Food".
* **Risk:** Recommending kitchen utilities matches the cart but ignores the user's active search interest.
* **System Safeguard:** Active Search Input intent is given a higher weighting coefficient in the matching algorithm. If a search term is present, recommendations default to matching the search category first.

#### E1.4 Low-Confidence or No Logical Matches
* **Scenario:** The items in the cart (e.g., a single packet of salt) do not logically map to any non-grocery category.
* **Risk:** Displaying an irrelevant match breaks user trust and conversion rates.
* **System Safeguard:** Fall back to a highly rated, high-margin, universally required non-grocery utility (e.g., "Eco-Friendly Garbage Bags" or "Multi-Surface Wet Wipes") instead of displaying nothing or a broken match.

---

### Category 2: UI/UX Guardrails & Session Limits

#### E2.1 Rapid Cart Modification (Cart Thrashing)
* **Scenario:** The user quickly increments and decrements quantities or toggles items in the cart (e.g., clicking "+" and "-" on bread 10 times).
* **Risk:** The recommendation card repeatedly flashes, changes recommendations rapidly, or triggers UI lagging.
* **System Safeguard:** 
  * **Debouncing:** UI updates are debounced by **300ms** to prevent execution on rapid sequential updates.
  * **Recommendation Lock:** Once a recommendation is displayed during a session, it is locked. The card does not change or re-trigger if the cart is edited, unless the recommended item itself is added.

#### E2.2 Checkout Pass-Through Blockage
* **Scenario:** The user is in "Speed Mode" and clicks "Place Order" while the AI suggestion card is still rendering or fetching data.
* **Risk:** The assistant delays payment or blocks the user from checking out (violating the "Zero Forced Friction" guideline).
* **System Safeguard:** The "Place Order" button operates on an independent client thread. It is immediately clickable regardless of the loading state, matching confidence, or visibility of the AI recommendation card.

#### E2.3 Dark Store Out-of-Stock Recommendation
* **Scenario:** The AI Matcher identifies the perfect accessory (e.g., Type-C cable) for a phone in the cart, but that item is out of stock in the user's local dark store.
* **Risk:** User adds the item to the cart, but the transaction fails, or they receive a cancellation message post-payment.
* **System Safeguard:** Real-time stock verification is performed before displaying the suggestion card. If the inventory count is `0`, the item is omitted from recommendations.

---

## 3. Automated Edge-Case Safeguard Matrix

| Edge-Case ID | Category | Scenario | Automated Safeguard |
|---|---|---|---|
| **E1.1** | Matcher Logic | Cart is empty | Suppress recommendation surface; show waiting message or hide card. |
| **E1.2** | Matcher Logic | Suggested item already in cart | Filter out active cart items from the candidate recommendation pool. |
| **E1.3** | Matcher Logic | Cart has groceries, Search has "Pet" | Prioritize Active Search Intent over Cart contents for category matching. |
| **E1.4** | Matcher Logic | No logical category match found | Fall back to universally useful non-grocery essentials (wipes, garbage bags). |
| **E2.1** | UI/UX Flow | Cart modified rapidly (thrashing) | Apply 300ms input debouncing and lock the suggestion card once rendered. |
| **E2.2** | UI/UX Flow | User clicks "Place Order" immediately | Enable instant pass-through; checkout action is always unblocked. |
| **E2.3** | Inventory | Recommended item is out of stock | Run pre-render stock check; exclude items with `stock_count == 0`. |
| **E2.4** | Compatibility| Recommending wrong device cable | Extract brand/model tags to filter accessory options to compatible models. |
