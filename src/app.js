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

  // Fast Preview Sheet Drawer
  specSheetOverlay: document.getElementById("spec-sheet-overlay"),
  btnCloseSpecSheet: document.getElementById("btn-close-spec-sheet"),
  sheetItemIcon: document.getElementById("sheet-item-icon"),
  sheetItemName: document.getElementById("sheet-item-name"),
  sheetItemPrice: document.getElementById("sheet-item-price"),
  sheetSpecsTable: document.getElementById("sheet-specs-table"),
  btnSheetAddCart: document.getElementById("btn-sheet-add-cart"),

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
        <span class="item-title">${entry.item.name}</span>
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
        logDebug("Cart", `Incremented quantity of ${entry.item.name}`);
      }
    } else if (e.target.classList.contains("btn-minus")) {
      const id = e.target.getAttribute("data-id");
      const entry = cart.items.find(entry => entry.item.id === id);
      if (entry) {
        cart.updateQuantity(id, entry.quantity - 1);
        logDebug("Cart", `Decremented quantity of ${entry.item.name}`);
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

  const recommendation = matcher.getRecommendation(summary, activeSearchQuery);

  if (recommendation) {
    currentRecommendation = recommendation;
    const recItem = recommendation.item;

    DOM.aiRecommendationText.textContent = recommendation.hook;
    DOM.aiItemIcon.textContent = recItem.image || "🔌";
    DOM.aiItemName.textContent = recItem.name;
    DOM.aiItemPrice.textContent = `₹${recItem.price}`;

    DOM.aiSuggestionNudge.style.display = "block";
    logDebug("AI Engine", `Nudge card displayed: ${recItem.name}`, "matcher");
  } else {
    if (DOM.aiSuggestionNudge) DOM.aiSuggestionNudge.style.display = "none";
    currentRecommendation = null;
  }
}

// Subscribe renderer to cart state changes
cart.subscribe(summary => {
  renderCart(summary);
  runAIRecommendationEngine(summary);
});

// --- 1-Tap Fast Spec Sheet Drawer ---
function openPreviewSheet(recommendation) {
  if (!recommendation) return;
  const item = recommendation.item;

  DOM.sheetItemIcon.textContent = item.image || "🔌";
  DOM.sheetItemName.textContent = item.name;
  DOM.sheetItemPrice.textContent = `₹${item.price}`;

  DOM.sheetSpecsTable.innerHTML = "";
  if (item.specs) {
    Object.entries(item.specs).forEach(([key, val]) => {
      const row = document.createElement("div");
      row.className = "spec-item";
      row.innerHTML = `
        <span class="spec-name">${key}</span>
        <span class="spec-value">${val}</span>
      `;
      DOM.sheetSpecsTable.appendChild(row);
    });
  } else if (item.ai_verified_badge) {
    const row1 = document.createElement("div");
    row1.className = "spec-item";
    row1.innerHTML = `<span class="spec-name">Verification</span><span class="spec-value">${item.ai_verified_badge.status}</span>`;
    const row2 = document.createElement("div");
    row2.className = "spec-item";
    row2.innerHTML = `<span class="spec-name">Trust Tag</span><span class="spec-value">${item.ai_verified_badge.trust_tag}</span>`;
    DOM.sheetSpecsTable.appendChild(row1);
    DOM.sheetSpecsTable.appendChild(row2);
  }

  DOM.specSheetOverlay.classList.add("active");
  logDebug("PreviewSheet", `Opened specification sheet for: ${item.name}`);
}

function closePreviewSheet() {
  DOM.specSheetOverlay.classList.remove("active");
}

if (DOM.aiSuggestionNudge) {
  DOM.aiSuggestionNudge.addEventListener("click", () => {
    openPreviewSheet(currentRecommendation);
  });
}

if (DOM.btnCloseSpecSheet) {
  DOM.btnCloseSpecSheet.addEventListener("click", closePreviewSheet);
}

if (DOM.btnSheetAddCart) {
  DOM.btnSheetAddCart.addEventListener("click", () => {
    if (currentRecommendation) {
      const item = currentRecommendation.item;
      cart.addItem(item, 1);
      showToast(`Added ${item.name} to cart!`);
      logDebug("Cart", `Added suggestion: ${item.name} (₹${item.price})`, "success");
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
    // Search source header badge (Seed dataset vs Wildcard fallback)
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
      
      // Look up item in current search results, or catalogs
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

// --- Checkout Placement Hook ---
if (DOM.btnPlaceOrder) {
  DOM.btnPlaceOrder.addEventListener("click", () => {
    const summary = cart.getSummary();
    showToast("🎉 Order Placed Successfully!");
    logDebug("Checkout", `Placed order for ₹${summary.total}. Pass-through verification passed successfully.`, "success");
    
    setTimeout(() => {
      cart.clear();
      matcher.resetSession();
      if (DOM.appSearchInput) DOM.appSearchInput.value = "";
    }, 1200);
  });
}

// --- App Bootstrap ---
renderPopularEssentials("All");
