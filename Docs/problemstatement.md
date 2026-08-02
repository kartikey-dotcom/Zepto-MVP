# Zepto AI Cross-Category Assistant — Problem Statement

**Target Domain:** Quick Commerce (Q-Commerce) — Grocery, Instant Delivery & Catalog Expansion  
**Target Organization:** Zepto (`com.zepto.customer`)  
**Core Strategic Objective:** Convert stalled grocery-only shoppers into active buyers of high-margin non-grocery categories (Electronics, Cosmetics, Personal Care, Baby Care, Pet Care, Home Utilities) by addressing information friction and discoverability barriers in real time.

---

## 1. Executive Summary & Context

Zepto has achieved market leadership in delivering groceries and daily essentials in 10 minutes. However, a significant user segment—**Stalled Non-Grocery Shoppers**—relies on Zepto solely for fast grocery refills (milk, bread, vegetables) while defaulting to dedicated e-commerce platforms like Amazon or Nykaa for non-grocery purchases. 

When users purchase groceries, they enter a **30-second "Speed Mode"** focused on completing the transaction rapidly. During this high-speed checkout flow, they systematically ignore home-screen promotions (**Banner Blindness**) and abandon high-consideration items due to uncertainty regarding product specifications, compatibility, and returns.

The **Zepto AI Cross-Category Assistant** resolves this by analyzing cart context in real time, presenting context-aware non-grocery recommendations directly inside the checkout flow, and offering instant verification of specifications, local stock, and return policies.

---

## 2. Core Friction Points

```
+---------------------------------------------------------------------------------------------------------+
|                              CUSTOMER CONVERSION FRICTION CLASSIFICATION                                |
+------------------------------------+-----------------------+--------------------------------------------+
| Friction Category                  | Root Cause            | Customer Psychological Barrier             |
+------------------------------------+-----------------------+--------------------------------------------+
| **1. Spec & Compatibility Doubt**  | Lack of clear details | "Will this charger fit my specific phone?" |
|                                    |                       | "Is this beauty product chemical-free?"     |
| **2. Banner Blindness**            | UI saturation         | Users overlook standard homepage ads and  |
|                                    |                       | carousels during fast grocery shop tasks.  |
| **3. Return & Replacement Anxiety**| Lack of trust         | "What if this gadget is defective? Is there|
|                                    |                       | an easy doorstep exchange policy?"         |
| **4. Instant Convenience Bias**    | Habitual mindset      | Customers associate Zepto only with fresh  |
|                                    |                       | emergency grocery refill purchases.        |
+------------------------------------+-----------------------+--------------------------------------------+
```

---

## 3. Strict UI/UX Guardrails (Zero Forced Friction)

To avoid disrupting the high-speed checkout experience, the assistant engine must adhere to the following guardrails:
* **No Full-Screen Overlays:** Suggestions must be embedded natively within the flow (no pop-ups blocking payment).
* **No Auto-Adding:** Items must never be placed in the cart without explicit user consent.
* **Strict 1-Nudge Limit:** A maximum of **one** AI recommendation is allowed per checkout session.
* **Instant Pass-Through:** Users can tap "Place Order" directly to bypass suggestions without needing to dismiss them first.
* **1-Tap Instant Action:** Tapping the recommendation opens a fast preview sheet containing specs, stock confirmation, and a doorstep guarantee, letting users add the item instantly.
