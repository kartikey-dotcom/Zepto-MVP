// Zepto AI Cross-Category Assistant - Main App Script
import { GROCERY_ITEMS, NON_GROCERY_CATALOG } from "./catalog.js";
import { ZeptoCart } from "./cart.js";
import { ZeptoAIMatcher } from "./ai_matcher.js";
import { executeSearch } from "./search_engine.js";

// Initialize core modules
const cart = new ZeptoCart();
const matcher = new ZeptoAIMatcher({ stockVerificationRequired: true });

// Track active search query context & current search results
let activeSearchQuery = "";
let currentRecommendation = null;
let activeCategory = "All";
let currentSearchResults = [];
let lastPlacedOrder = null;

// --- DOM Cache ---
const DOM = {
  // Search
  simSearchInput: document.getElementById("sim-search-input"),
  btnSearchSim: document.getElementById("btn-search-sim"),
  appSearchInput: document.getElementById("app-search-input"),
  searchResultsDropdown: document.getElementById("search-results-dropdown"),

  // Category Rail
  categoryRail: document.getElementById("category-rail"),

  // Popular Essentials Grid
  popularSection: document.getElementById("popular-essentials-section"),
  popularGrid: document.getElementById("popular-products-grid"),

  // Mobile App screen state views
  cartSectionHeader: document.getElementById("cart-section-header"),
  clearCartLink: document.getElementById("clear-cart-link"),
  cartItemsList: document.getElementById("cart-items-list"),
  cartBillView: document.getElementById("cart-bill-view"),
  cartActionBar: document.getElementById("cart-action-bar"),
  phoneCartScroll: document.getElementById("phone-cart-scroll"),
  phoneTime: document.getElementById("phone-time"),

  // Bill components
  billSubtotal: document.getElementById("bill-subtotal"),
  billDeliveryFee: document.getElementById("bill-delivery-fee"),
  billGrandTotal: document.getElementById("bill-grand-total"),
  checkoutTotalPrice: document.getElementById("checkout-total-price"),
  btnPlaceOrder: document.getElementById("btn-place-order"),

  // AI Suggestion Nudge Surface
  aiSuggestionNudge: document.getElementById("ai-suggestion-nudge"),
  aiNudgeCard: document.getElementById("ai-nudge-card"),
  aiRecommendationText: document.getElementById("ai-recommendation-text"),
  aiItemIcon: document.getElementById("ai-item-icon"),
  aiItemName: document.getElementById("ai-item-name"),
  aiItemPrice: document.getElementById("ai-item-price"),
  aiTrustPillsRow: document.getElementById("ai-trust-pills-row"),
  btnAiCardAdd: document.getElementById("btn-ai-card-add"),

  // Fast Preview Sheet Drawer
  specSheetOverlay: document.getElementById("spec-sheet-overlay"),
  btnCloseSpecSheet: document.getElementById("btn-close-spec-sheet"),
  sheetItemIcon: document.getElementById("sheet-item-icon"),
  sheetItemName: document.getElementById("sheet-item-name"),
  sheetItemPrice: document.getElementById("sheet-item-price"),
  btnSheetAddCart: document.getElementById("btn-sheet-add-cart"),

  // Trust & Reassurance Shield elements
  trustSpecSummary: document.getElementById("trust-spec-summary"),
  trustDarkStoreText: document.getElementById("trust-dark-store-text"),
  trustReturnTitle: document.getElementById("trust-return-title"),
  trustReturnSummary: document.getElementById("trust-return-summary"),

  // Payment Processing & Success Modal
  paymentModalOverlay: document.getElementById("payment-modal-overlay"),
  payStepProcessing: document.getElementById("pay-step-processing"),
  payStepSuccess: document.getElementById("pay-step-success"),
  payStatusTitle: document.getElementById("pay-status-title"),
  payStatusSub: document.getElementById("pay-status-sub"),
  payProgressFill: document.getElementById("pay-progress-fill"),
  payOrderId: document.getElementById("pay-order-id"),
  payPaidAmount: document.getElementById("pay-paid-amount"),
  btnDoneCheckout: document.getElementById("btn-done-checkout"),
  btnRequestReturn: document.getElementById("btn-request-return"),

  // 10-Min Return & Doorstep Swap Drawer Modal
  returnModalOverlay: document.getElementById("return-modal-overlay"),
  btnCloseReturn: document.getElementById("btn-close-return"),
  returnFormBody: document.getElementById("return-form-body"),
  returnDispatchBody: document.getElementById("return-dispatch-body"),
  reasonPillsRow: document.getElementById("reason-pills-row"),
  returnItemsList: document.getElementById("return-items-list"),
  returnOrderRef: document.getElementById("return-order-ref"),
  btnConfirmReturn: document.getElementById("btn-confirm-return"),
  btnDoneReturn: document.getElementById("btn-done-return"),
  dispatchSubText: document.getElementById("dispatch-sub-text"),

  // Toast
  cartToastNotif: document.getElementById("cart-toast-notif")
};

// --- Time Initialization ---
function updatePhoneClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  if (DOM.phoneTime) DOM.phoneTime.textContent = `${hours}:${minutes}`;
}
setInterval(updatePhoneClock, 1000);
updatePhoneClock();

// --- Logger Helper ---
function logDebug(module, message, type = "info") {
  console.log(`[${module}] ${message}`);
}

// Toast notification display helper
function showToast(message) {
  if (!DOM.cartToastNotif) return;
  DOM.cartToastNotif.textContent = message;
  DOM.cartToastNotif.classList.add("show");
  setTimeout(() => {
    DOM.cartToastNotif.classList.remove("show");
  }, 2500);
}

// --- Render Popular Essentials Grid ---
function renderPopularEssentials(categoryFilter = "All") {
  if (!DOM.popularGrid) return;
  
  const allProducts = [...GROCERY_ITEMS, ...NON_GROCERY_CATALOG];
  let filtered = allProducts;
  
  if (categoryFilter !== "All") {
    filtered = allProducts.filter(item => 
      item.category === categoryFilter || 
      (item.tags && item.tags.includes(categoryFilter.toLowerCase()))
    );
  }

  DOM.popularGrid.innerHTML = "";
  filtered.slice(0, 6).forEach(item => {
    const card = document.createElement("div");
    card.className = "essential-card";
    card.setAttribute("data-id", item.id);
    card.innerHTML = `
      <div class="essential-icon">${item.image}</div>
      <div class="essential-info">
        <span class="essential-title">${item.name}</span>
        <span class="essential-unit">${item.unit || "1 Unit"}</span>
        <div class="essential-price-row">
          <span class="essential-price">₹${item.price}</span>
          ${item.mrp ? `<span class="essential-mrp">₹${item.mrp}</span>` : ""}
        </div>
      </div>
      <button class="btn-add-green" data-id="${item.id}">+ ADD</button>
    `;
    DOM.popularGrid.appendChild(card);
  });
}

// --- Category Rail Listener ---
if (DOM.categoryRail) {
  DOM.categoryRail.addEventListener("click", e => {
    if (e.target.classList.contains("cat-pill")) {
      DOM.categoryRail.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
      e.target.classList.add("active");
      
      const cat = e.target.getAttribute("data-cat");
      activeCategory = cat;
      renderPopularEssentials(cat);
      logDebug("CategoryRail", `Filter active category: ${cat}`);
    }
  });
}

// Handle "+ ADD" clicks on Popular Essentials grid
if (DOM.popularGrid) {
  DOM.popularGrid.addEventListener("click", e => {
    if (e.target.classList.contains("btn-add-green")) {
      const id = e.target.getAttribute("data-id");
      let item = GROCERY_ITEMS.find(g => g.id === id);
      if (!item) {
        item = NON_GROCERY_CATALOG.find(ng => ng.id === id);
      }
      
      if (item) {
        cart.addItem(item, 1);
        showToast(`Added ${item.name} to cart!`);
        logDebug("Cart", `Added product from popular grid: ${item.name} (₹${item.price})`, "success");
      }
    }
  });
}

// --- Render Cart inside Mobile App ---
function renderCart(summary) {
  if (summary.itemsCount === 0) {
    if (DOM.cartSectionHeader) DOM.cartSectionHeader.style.display = "none";
    if (DOM.cartItemsList) DOM.cartItemsList.style.display = "none";
    if (DOM.cartBillView) DOM.cartBillView.style.display = "none";
    if (DOM.cartActionBar) DOM.cartActionBar.style.display = "none";
    if (DOM.aiSuggestionNudge) DOM.aiSuggestionNudge.style.display = "none";
    currentRecommendation = null;
    return;
  }

  if (DOM.cartSectionHeader) DOM.cartSectionHeader.style.display = "flex";
  if (DOM.cartItemsList) DOM.cartItemsList.style.display = "flex";
  if (DOM.cartBillView) DOM.cartBillView.style.display = "flex";
  if (DOM.cartActionBar) DOM.cartActionBar.style.display = "flex";

  // Render cart product rows
  DOM.cartItemsList.innerHTML = "";
  summary.items.forEach(entry => {
    const row = document.createElement("div");
    row.className = "cart-item-row";
    row.innerHTML = `
      <div class="item-visual">${entry.item.image || "📦"}</div>
      <div class="item-details">
        <span class="item-title">${entry.item.name || entry.item.product_name}</span>
        <span class="item-subtitle">₹${entry.item.price} • ${entry.item.unit || "1 Unit"}</span>
      </div>
      <div class="item-row-right">
        <div class="qty-control">
          <button class="btn-qty btn-minus" data-id="${entry.item.id}">-</button>
          <span class="qty-val">${entry.quantity}</span>
          <button class="btn-qty btn-plus" data-id="${entry.item.id}">+</button>
        </div>
      </div>
    `;
    DOM.cartItemsList.appendChild(row);
  });

  // Render bill details
  if (DOM.billSubtotal) DOM.billSubtotal.textContent = `₹${summary.subtotal}`;
  
  if (DOM.billDeliveryFee) {
    if (summary.deliveryFee === 0) {
      DOM.billDeliveryFee.textContent = "FREE";
      DOM.billDeliveryFee.className = "bill-value free";
    } else {
      DOM.billDeliveryFee.textContent = `₹${summary.deliveryFee}`;
      DOM.billDeliveryFee.className = "bill-value";
    }
  }
  
  if (DOM.billGrandTotal) DOM.billGrandTotal.textContent = `₹${summary.total}`;
  if (DOM.checkoutTotalPrice) DOM.checkoutTotalPrice.textContent = `₹${summary.total}`;
}

// Handle cart quantity modifications (- 1 +)
if (DOM.cartItemsList) {
  DOM.cartItemsList.addEventListener("click", e => {
    if (e.target.classList.contains("btn-plus")) {
      const id = e.target.getAttribute("data-id");
      const entry = cart.items.find(entry => entry.item.id === id);
      if (entry) {
        cart.updateQuantity(id, entry.quantity + 1);
        logDebug("Cart", `Incremented quantity of ${entry.item.name || entry.item.product_name}`);
      }
    } else if (e.target.classList.contains("btn-minus")) {
      const id = e.target.getAttribute("data-id");
      const entry = cart.items.find(entry => entry.item.id === id);
      if (entry) {
        cart.updateQuantity(id, entry.quantity - 1);
        logDebug("Cart", `Decremented quantity of ${entry.item.name || entry.item.product_name}`);
      }
    }
  });
}

// Clear Cart Link hook
if (DOM.clearCartLink) {
  DOM.clearCartLink.addEventListener("click", () => {
    cart.clear();
    matcher.resetSession();
    activeSearchQuery = "";
    if (DOM.appSearchInput) DOM.appSearchInput.value = "";
    logDebug("Cart", "Cart cleared via link in drawer UI");
  });
}

// --- AI Recommendation Engine Pipeline ---
function runAIRecommendationEngine(summary) {
  if (summary.itemsCount === 0) {
    if (DOM.aiSuggestionNudge) DOM.aiSuggestionNudge.style.display = "none";
    currentRecommendation = null;
    return;
  }

  // Evaluate cart using Option B Direct Companion Logic & Silent Collapse
  const response = matcher.evaluateCart(summary, "stalled_non_grocery_shopper");

  if (response && response.recommendation_required && response.recommendation) {
    currentRecommendation = response;
    const rec = response.recommendation;

    DOM.aiRecommendationText.textContent = rec.contextual_bridge;
    DOM.aiItemIcon.textContent = rec.image || "✨";
    DOM.aiItemName.textContent = rec.product_name || rec.name;
    DOM.aiItemPrice.textContent = `₹${rec.price}`;

    if (DOM.aiTrustPillsRow) {
      const badges = rec.trust_badges || [
        "🛡️ 10-Min Doorstep Swap",
        "✅ 100% Brand Authentic"
      ];
      DOM.aiTrustPillsRow.innerHTML = badges.map(b => `<span class="micro-trust-pill">${b}</span>`).join("");
    }

    DOM.aiSuggestionNudge.style.display = "block";
    logDebug("AI Engine", `Nudge card displayed: ${rec.product_name}`, "matcher");
  } else {
    // SILENT COLLAPSE: Hide AI Assistant card completely
    if (DOM.aiSuggestionNudge) DOM.aiSuggestionNudge.style.display = "none";
    currentRecommendation = null;
    logDebug("AI Engine", "Silent collapse triggered: Hiding AI card", "info");
  }
}

// Subscribe renderer to cart state changes
cart.subscribe(summary => {
  renderCart(summary);
  runAIRecommendationEngine(summary);
});

// --- 1-Tap Fast Spec & Trust Preview Sheet Drawer ---
function openPreviewSheet(recommendationResponse) {
  if (!recommendationResponse) return;
  
  const rec = recommendationResponse.recommendation || recommendationResponse.item || recommendationResponse;
  const trust = rec.trust_shield || {};

  DOM.sheetItemIcon.textContent = rec.image || "🔌";
  DOM.sheetItemName.textContent = rec.product_name || rec.name;
  DOM.sheetItemPrice.textContent = `₹${rec.price}`;

  if (DOM.trustSpecSummary) DOM.trustSpecSummary.textContent = trust.spec_summary || "100% Quality & Compatibility Checked for 10-Min Delivery";
  if (DOM.trustDarkStoreText) DOM.trustDarkStoreText.textContent = trust.dark_store_status || "Verified in Stock at Dark Store #204";
  if (DOM.trustReturnTitle) DOM.trustReturnTitle.textContent = trust.return_policy_title || "10-Minute Instant Doorstep Replacement Guarantee";
  if (DOM.trustReturnSummary) DOM.trustReturnSummary.textContent = trust.return_policy_summary || "No hassle returns. Rider swaps defective items instantly at doorstep.";

  DOM.specSheetOverlay.classList.add("active");
  logDebug("PreviewSheet", `Opened specification sheet for: ${rec.product_name || rec.name}`);
}

function closePreviewSheet() {
  DOM.specSheetOverlay.classList.remove("active");
}

if (DOM.aiSuggestionNudge) {
  DOM.aiSuggestionNudge.addEventListener("click", () => {
    openPreviewSheet(currentRecommendation);
  });
}

if (DOM.btnAiCardAdd) {
  DOM.btnAiCardAdd.addEventListener("click", e => {
    e.stopPropagation(); // Prevent opening preview sheet overlay when tapping + ADD
    if (currentRecommendation) {
      const rec = currentRecommendation.recommendation || currentRecommendation.item || currentRecommendation;
      const cartItem = {
        id: rec.id,
        name: rec.product_name || rec.name,
        price: rec.price,
        mrp: rec.mrp,
        image: rec.image || "✨",
        unit: "1 Unit",
        category: rec.category
      };
      cart.addItem(cartItem, 1);
      showToast(`Added ${cartItem.name} to cart!`);
      logDebug("Cart", `Added card suggestion: ${cartItem.name} (₹${cartItem.price})`, "success");
    }
  });
}

if (DOM.btnCloseSpecSheet) {
  DOM.btnCloseSpecSheet.addEventListener("click", closePreviewSheet);
}

if (DOM.btnSheetAddCart) {
  DOM.btnSheetAddCart.addEventListener("click", () => {
    if (currentRecommendation) {
      const rec = currentRecommendation.recommendation || currentRecommendation.item || currentRecommendation;
      const cartItem = {
        id: rec.id,
        name: rec.product_name || rec.name,
        price: rec.price,
        mrp: rec.mrp,
        image: rec.image || "🔌",
        unit: "1 Unit",
        category: rec.category
      };
      cart.addItem(cartItem, 1);
      showToast(`Added ${cartItem.name} to cart!`);
      logDebug("Cart", `Added suggestion: ${cartItem.name} (₹${cartItem.price})`, "success");
      closePreviewSheet();
    }
  });
}

// --- Universal Search Engine & Wildcard Dropdown Logic ---
function updateSearchDropdown(query) {
  const cleanQuery = query.trim();
  if (cleanQuery.length === 0) {
    if (DOM.searchResultsDropdown) DOM.searchResultsDropdown.style.display = "none";
    currentSearchResults = [];
    return;
  }

  const response = executeSearch(cleanQuery);
  currentSearchResults = response.results || [];

  DOM.searchResultsDropdown.innerHTML = "";

  if (currentSearchResults.length === 0) {
    const row = document.createElement("div");
    row.className = "no-results-row";
    row.textContent = "No matching products found.";
    DOM.searchResultsDropdown.appendChild(row);
  } else {
    // Search source header badge
    const headerRow = document.createElement("div");
    headerRow.className = "search-source-header";
    headerRow.innerHTML = response.source === "wildcard_generator" 
      ? `<span class="source-badge wildcard">✨ AI Instant Match (Wildcard)</span>`
      : `<span class="source-badge seed">⚡ 10-MIN Catalog (${response.count} items)</span>`;
    DOM.searchResultsDropdown.appendChild(headerRow);

    currentSearchResults.forEach(item => {
      const row = document.createElement("div");
      row.className = "search-result-row";
      row.innerHTML = `
        <div class="search-result-info">
          <div class="search-result-icon">${item.image || "📦"}</div>
          <div class="search-result-details">
            <span class="search-result-name">${item.name}</span>
            <div class="search-result-price-row">
              <span class="search-result-price">₹${item.price}</span>
              ${item.mrp ? `<span class="search-result-mrp">₹${item.mrp}</span>` : ""}
              <span class="search-result-delivery">⚡ 10 mins</span>
            </div>
            ${item.ai_verified_badge ? `<span class="search-ai-badge">${item.ai_verified_badge.status}</span>` : ""}
          </div>
        </div>
        <button class="btn-add-search-result" data-id="${item.id}">+ ADD</button>
      `;
      DOM.searchResultsDropdown.appendChild(row);
    });
  }

  DOM.searchResultsDropdown.style.display = "flex";
}

if (DOM.appSearchInput) {
  DOM.appSearchInput.addEventListener("input", () => {
    const query = DOM.appSearchInput.value;
    activeSearchQuery = query.trim();
    updateSearchDropdown(query);

    if (activeSearchQuery) {
      logDebug("Search", `Active query: "${activeSearchQuery}"`);
    }
    
    runAIRecommendationEngine(cart.getSummary());
  });
}

if (DOM.searchResultsDropdown) {
  DOM.searchResultsDropdown.addEventListener("click", e => {
    if (e.target.classList.contains("btn-add-search-result")) {
      const id = e.target.getAttribute("data-id");
      
      let item = currentSearchResults.find(i => i.id === id);
      if (!item) item = GROCERY_ITEMS.find(g => g.id === id);
      if (!item) item = NON_GROCERY_CATALOG.find(ng => ng.id === id);
      
      if (item) {
        cart.addItem(item, 1);
        showToast(`Added ${item.name} to cart!`);
        logDebug("Cart", `Searched and added: ${item.name} (₹${item.price})`, "success");
        
        DOM.appSearchInput.value = "";
        activeSearchQuery = "";
        DOM.searchResultsDropdown.style.display = "none";
      }
    }
  });
}

document.addEventListener("click", e => {
  if (DOM.appSearchInput && !DOM.appSearchInput.contains(e.target) && 
      DOM.searchResultsDropdown && !DOM.searchResultsDropdown.contains(e.target)) {
    DOM.searchResultsDropdown.style.display = "none";
  }
});

// --- Animated Checkout & Payment Placement Pipeline ---
if (DOM.btnPlaceOrder) {
  DOM.btnPlaceOrder.addEventListener("click", () => {
    const summary = cart.getSummary();
    if (summary.itemsCount === 0) return;

    // 1. Initial State Setup
    DOM.btnPlaceOrder.classList.add("loading");
    DOM.btnPlaceOrder.innerHTML = `<span>Processing...</span> ⚡`;

    if (DOM.payStepProcessing) DOM.payStepProcessing.style.display = "block";
    if (DOM.payStepSuccess) DOM.payStepSuccess.style.display = "none";
    if (DOM.payProgressFill) DOM.payProgressFill.style.width = "0%";
    if (DOM.payStatusTitle) DOM.payStatusTitle.textContent = "Securing Payment...";
    if (DOM.payStatusSub) DOM.payStatusSub.textContent = "Connecting securely with bank gateway";

    // Show modal overlay
    if (DOM.paymentModalOverlay) {
      DOM.paymentModalOverlay.classList.add("active");
    }

    logDebug("Checkout", `Initiated animated payment flow for ₹${summary.total}`, "info");

    // 2. Stage 1: Payment Authorization (1.2s)
    setTimeout(() => {
      if (DOM.payProgressFill) DOM.payProgressFill.style.width = "45%";
    }, 200);

    // 3. Stage 2: Express Dark Store Packing (1.4s mark)
    setTimeout(() => {
      if (DOM.payStatusTitle) DOM.payStatusTitle.textContent = "Payment Verified! ⚡";
      if (DOM.payStatusSub) DOM.payStatusSub.textContent = "Packing at Dark Store #204 & Assigning Rider";
      if (DOM.payProgressFill) DOM.payProgressFill.style.width = "100%";
    }, 1400);

    // 4. Stage 3: Order Confirmed Screen (2.5s mark)
    setTimeout(() => {
      if (DOM.payStepProcessing) DOM.payStepProcessing.style.display = "none";
      if (DOM.payStepSuccess) DOM.payStepSuccess.style.display = "block";

      const orderId = `#ZPT-${Math.floor(100000 + Math.random() * 900000)}`;
      if (DOM.payOrderId) DOM.payOrderId.textContent = orderId;
      if (DOM.payPaidAmount) DOM.payPaidAmount.textContent = `₹${summary.total}`;

      // Save order snapshot for returns
      lastPlacedOrder = {
        orderId: orderId,
        total: summary.total,
        items: [...summary.items]
      };

      DOM.btnPlaceOrder.classList.remove("loading");
      DOM.btnPlaceOrder.innerHTML = `<span>Proceed to Pay</span> →`;

      logDebug("Checkout", `Order ${orderId} confirmed successfully for ₹${summary.total}`, "success");
    }, 2500);
  });
}

// Close order success modal & clear cart on Track Order / Done click
if (DOM.btnDoneCheckout) {
  DOM.btnDoneCheckout.addEventListener("click", () => {
    const lastOrderId = DOM.payOrderId ? DOM.payOrderId.textContent : "#ZPT";
    
    if (DOM.paymentModalOverlay) {
      DOM.paymentModalOverlay.classList.remove("active");
    }

    cart.clear();
    matcher.resetSession();
    if (DOM.appSearchInput) DOM.appSearchInput.value = "";

    showToast(`🎉 ${lastOrderId} placed! Arriving in 10 mins`);
    logDebug("Checkout", "Cart cleared and returned to catalog view");
  });
}

// --- 10-Min Doorstep Return / Exchange Handlers ---
let selectedReturnReason = "Damaged / Defective";

if (DOM.reasonPillsRow) {
  DOM.reasonPillsRow.addEventListener("click", e => {
    if (e.target.classList.contains("reason-pill")) {
      DOM.reasonPillsRow.querySelectorAll(".reason-pill").forEach(p => p.classList.remove("active"));
      e.target.classList.add("active");
      selectedReturnReason = e.target.getAttribute("data-reason") || "Damaged / Defective";
      logDebug("Return", `Selected return reason: ${selectedReturnReason}`);
    }
  });
}

if (DOM.btnRequestReturn) {
  DOM.btnRequestReturn.addEventListener("click", () => {
    if (!lastPlacedOrder || !lastPlacedOrder.items.length) {
      showToast("No active order found to return!");
      return;
    }

    if (DOM.returnOrderRef) DOM.returnOrderRef.textContent = lastPlacedOrder.orderId;

    // Render items list inside return drawer
    if (DOM.returnItemsList) {
      DOM.returnItemsList.innerHTML = lastPlacedOrder.items.map(entry => `
        <div class="return-item-row">
          <label>
            <input type="checkbox" checked value="${entry.item.id}">
            <span>${entry.item.image || "📦"} ${entry.item.name || entry.item.product_name} (${entry.quantity}x)</span>
          </label>
          <strong>₹${entry.item.price * entry.quantity}</strong>
        </div>
      `).join("");
    }

    if (DOM.returnFormBody) DOM.returnFormBody.style.display = "block";
    if (DOM.returnDispatchBody) DOM.returnDispatchBody.style.display = "none";

    if (DOM.returnModalOverlay) {
      DOM.returnModalOverlay.classList.add("active");
    }

    logDebug("Return", `Opened 10-Min Return drawer for order ${lastPlacedOrder.orderId}`);
  });
}

if (DOM.btnCloseReturn) {
  DOM.btnCloseReturn.addEventListener("click", () => {
    if (DOM.returnModalOverlay) DOM.returnModalOverlay.classList.remove("active");
  });
}

if (DOM.btnConfirmReturn) {
  DOM.btnConfirmReturn.addEventListener("click", () => {
    const orderId = lastPlacedOrder ? lastPlacedOrder.orderId : "#ZPT";

    if (DOM.returnFormBody) DOM.returnFormBody.style.display = "none";
    if (DOM.returnDispatchBody) DOM.returnDispatchBody.style.display = "block";

    if (DOM.dispatchSubText) {
      DOM.dispatchSubText.textContent = `Rider #402 dispatched to your doorstep for '${selectedReturnReason}' exchange.`;
    }

    showToast(`🛡️ 10-Min Doorstep Swap requested for ${orderId}!`);
    logDebug("Return", `Confirmed 10-Min Doorstep Swap for order ${orderId} (Reason: ${selectedReturnReason})`, "success");
  });
}

if (DOM.btnDoneReturn) {
  DOM.btnDoneReturn.addEventListener("click", () => {
    if (DOM.returnModalOverlay) DOM.returnModalOverlay.classList.remove("active");
    if (DOM.paymentModalOverlay) DOM.paymentModalOverlay.classList.remove("active");

    cart.clear();
    matcher.resetSession();
    if (DOM.appSearchInput) DOM.appSearchInput.value = "";

    showToast("🛡️ Rider on the way for doorstep exchange!");
    logDebug("Return", "Return flow complete. Cart reset.");
  });
}

// --- App Bootstrap ---
renderPopularEssentials("All");
