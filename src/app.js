// Zepto AI Cross-Category Assistant - Main App Script
import { GROCERY_ITEMS, NON_GROCERY_CATALOG } from "./catalog.js";
import { ZeptoCart } from "./cart.js";
import { ZeptoAIMatcher } from "./ai_matcher.js";

// Initialize core modules
const cart = new ZeptoCart();
const matcher = new ZeptoAIMatcher({ stockVerificationRequired: true });

// Track active search query context
let activeSearchQuery = "";
let currentRecommendation = null;

// --- DOM Cache ---
const DOM = {
  // Scenario Preset Buttons
  presetSamsung: document.getElementById("preset-samsung"),
  presetBreakfast: document.getElementById("preset-breakfast"),
  presetDinner: document.getElementById("preset-dinner"),
  presetParty: document.getElementById("preset-party"),
  btnClearScenario: document.getElementById("btn-clear-scenario"),

  // Search
  simSearchInput: document.getElementById("sim-search-input"),
  btnSearchSim: document.getElementById("btn-search-sim"),
  appSearchInput: document.getElementById("app-search-input"),
  searchResultsDropdown: document.getElementById("search-results-dropdown"),

  // Left Panel Lists & Logs
  quickCatalogList: document.getElementById("quick-catalog-list"),
  debugMessages: document.getElementById("debug-messages"),
  debugTimestamp: document.getElementById("debug-timestamp"),
  debugLogBox: document.getElementById("debug-log-box"),

  // Mobile App screen state views
  cartEmptyView: document.getElementById("cart-empty-view"),
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
  billHandlingFee: document.getElementById("bill-handling-fee"),
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
  DOM.phoneTime.textContent = `${hours}:${minutes}`;
  DOM.debugTimestamp.textContent = `${hours}:${minutes}:${String(now.getSeconds()).padStart(2, '0')}`;
}
setInterval(updatePhoneClock, 1000);
updatePhoneClock();

// --- Logger Helper ---
function logDebug(module, message, type = "info") {
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const prefix = `[${timeStr}] [${module}] `;
  let color = "#abb2dd"; // default info color
  
  if (type === "success") color = "#00ff88";
  if (type === "warning") color = "#ff9f43";
  if (type === "matcher") color = "#a29bfe";
  
  const msgEl = document.createElement("div");
  msgEl.style.color = color;
  msgEl.style.marginBottom = "4px";
  msgEl.innerHTML = `<span style="opacity: 0.6;">${prefix}</span>${message}`;
  
  // Append & auto-scroll
  DOM.debugMessages.appendChild(msgEl);
  DOM.debugLogBox.scrollTop = DOM.debugLogBox.scrollHeight;
}

// --- Render Quick Add Catalog (Left Side) ---
function renderCatalog() {
  DOM.quickCatalogList.innerHTML = "";
  GROCERY_ITEMS.forEach(item => {
    const card = document.createElement("div");
    card.className = "catalog-item-card";
    card.innerHTML = `
      <div class="catalog-item-info">
        <span class="catalog-item-icon">${item.image}</span>
        <div>
          <div class="catalog-item-name">${item.name}</div>
          <div class="catalog-item-price">₹${item.price} • ${item.unit}</div>
        </div>
      </div>
      <button class="btn-add-quick" data-id="${item.id}">+ Add</button>
    `;
    DOM.quickCatalogList.appendChild(card);
  });

  // Attach quick-add listeners
  DOM.quickCatalogList.addEventListener("click", e => {
    if (e.target.classList.contains("btn-add-quick")) {
      const id = e.target.getAttribute("data-id");
      const item = GROCERY_ITEMS.find(g => g.id === id);
      if (item) {
        cart.addItem(item, 1);
        showToast(`Added ${item.name} to cart!`);
        logDebug("Cart", `Added ${item.name} (₹${item.price})`, "success");
      }
    }
  });
}

// --- Toast Notification ---
function showToast(message) {
  DOM.cartToastNotif.textContent = message;
  DOM.cartToastNotif.classList.add("show");
  setTimeout(() => {
    DOM.cartToastNotif.classList.remove("show");
  }, 2000);
}

// --- Render Cart (Right Side inside Mobile) ---
function renderCart(summary) {
  // Toggle layout based on cart volume
  if (summary.itemsCount === 0) {
    DOM.cartEmptyView.style.display = "flex";
    DOM.cartSectionHeader.style.display = "none";
    DOM.cartItemsList.style.display = "none";
    DOM.cartBillView.style.display = "none";
    DOM.cartActionBar.style.display = "none";
    DOM.aiSuggestionNudge.style.display = "none";
    currentRecommendation = null;
    return;
  }

  DOM.cartEmptyView.style.display = "none";
  DOM.cartSectionHeader.style.display = "flex";
  DOM.cartItemsList.style.display = "flex";
  DOM.cartBillView.style.display = "flex";
  DOM.cartActionBar.style.display = "flex";

  // Render product rows (Cards)
  DOM.cartItemsList.innerHTML = "";
  summary.items.forEach(entry => {
    const row = document.createElement("div");
    row.className = "cart-item-row";
    row.innerHTML = `
      <div class="item-visual">${entry.item.image}</div>
      <div class="item-details">
        <span class="item-title">${entry.item.name}</span>
        <span class="item-subtitle">₹${entry.item.price}</span>
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
  DOM.billSubtotal.textContent = `₹${summary.subtotal}`;
  
  if (summary.deliveryFee === 0) {
    DOM.billDeliveryFee.textContent = "FREE";
    DOM.billDeliveryFee.className = "bill-value free";
  } else {
    DOM.billDeliveryFee.textContent = `₹${summary.deliveryFee}`;
    DOM.billDeliveryFee.className = "bill-value";
  }
  
  DOM.billGrandTotal.textContent = `₹${summary.total}`;
  DOM.checkoutTotalPrice.textContent = `₹${summary.total}`;
}

// Handle cart quantity modification clicks inside mobile shell
DOM.cartItemsList.addEventListener("click", e => {
  if (e.target.classList.contains("btn-plus")) {
    const id = e.target.getAttribute("data-id");
    const entry = cart.items.find(entry => entry.item.id === id);
    if (entry) {
      cart.updateQuantity(id, entry.quantity + 1);
      logDebug("Cart", `Incremented quantity of ${entry.item.name}`, "info");
    }
  } else if (e.target.classList.contains("btn-minus")) {
    const id = e.target.getAttribute("data-id");
    const entry = cart.items.find(entry => entry.item.id === id);
    if (entry) {
      cart.updateQuantity(id, entry.quantity - 1);
      logDebug("Cart", `Decremented quantity of ${entry.item.name}`, "info");
    }
  }
});

// Clear Cart Link hook inside mobile cart drawer
DOM.clearCartLink.addEventListener("click", () => {
  cart.clear();
  matcher.resetSession();
  activeSearchQuery = "";
  DOM.simSearchInput.value = "";
  DOM.appSearchInput.value = "";
  clearPresetButtonStates();
  logDebug("Cart", "Cart cleared via link in drawer UI", "info");
});

// --- AI Recommendation Pipeline ---
function runAIRecommendationEngine(summary) {
  // Clear recommendation view if cart is empty
  if (summary.itemsCount === 0) {
    DOM.aiSuggestionNudge.style.display = "none";
    currentRecommendation = null;
    return;
  }

  // Get matching suggestion from AI engine
  const recommendation = matcher.getRecommendation(summary, activeSearchQuery);

  if (recommendation) {
    currentRecommendation = recommendation;
    const item = recommendation.item;

    // In-Flow Nudge rendering
    DOM.aiRecommendationText.textContent = recommendation.hook;
    DOM.aiItemIcon.textContent = item.image;
    DOM.aiItemName.textContent = item.name;
    DOM.aiItemPrice.textContent = `₹${item.price}`;
    DOM.aiSuggestionNudge.style.display = "block";

    // Debug tracking logs
    const categoriesStr = `[${summary.categories.join(", ")}]`;
    logDebug("ContextProcessor", `Processed active categories: ${categoriesStr}`, "matcher");
    if (activeSearchQuery) {
      logDebug("AIMatcher", `Matched item "${item.name}" via active search intent: "${activeSearchQuery}"`, "success");
    } else {
      logDebug("AIMatcher", `Rule matched item "${item.name}" under category "${item.category}". Lock state active.`, "success");
    }
  } else {
    DOM.aiSuggestionNudge.style.display = "none";
    currentRecommendation = null;
  }
}

// Subscribe cart changes to update UI & AI Matcher
cart.subscribe(summary => {
  renderCart(summary);
  runAIRecommendationEngine(summary);
});

// --- Slide-Up Preview Sheet UI Logic ---
function openPreviewSheet(recommendation) {
  if (!recommendation) return;
  const item = recommendation.item;

  DOM.sheetItemIcon.textContent = item.image;
  DOM.sheetItemName.textContent = item.name;
  DOM.sheetItemPrice.textContent = `₹${item.price}`;

  // Generate specifications table
  DOM.sheetSpecsTable.innerHTML = "";
  Object.entries(item.specs).forEach(([specKey, specVal]) => {
    const row = document.createElement("div");
    row.className = "spec-item";
    row.innerHTML = `
      <span class="spec-name">${specKey}</span>
      <span class="spec-value">${specVal}</span>
    `;
    DOM.sheetSpecsTable.appendChild(row);
  });

  // Action Button stock check
  if (item.stock_count > 0) {
    DOM.btnSheetAddCart.textContent = `Add to Cart & Checkout (₹${item.price})`;
    DOM.btnSheetAddCart.className = "btn-add-action";
    DOM.btnSheetAddCart.disabled = false;
  } else {
    DOM.btnSheetAddCart.textContent = "Out of Stock";
    DOM.btnSheetAddCart.className = "btn-add-action disabled";
    DOM.btnSheetAddCart.disabled = true;
  }

  // Animate sheet upwards
  DOM.specSheetOverlay.classList.add("active");
  logDebug("UI_Drawer", `Opened Instant Verification Sheet for: ${item.name}`, "info");
}

function closePreviewSheet() {
  DOM.specSheetOverlay.classList.remove("active");
}

// Nudge card click -> open sheet
DOM.aiSuggestionNudge.addEventListener("click", () => {
  openPreviewSheet(currentRecommendation);
});

DOM.btnCloseSpecSheet.addEventListener("click", closePreviewSheet);

// 1-Tap Add Action Inside Sheet
DOM.btnSheetAddCart.addEventListener("click", () => {
  if (currentRecommendation) {
    const item = currentRecommendation.item;
    cart.addItem(item, 1);
    showToast(`Added ${item.name} to cart!`);
    logDebug("Cart", `Added cross-category suggestion: ${item.name} (₹${item.price})`, "success");
    closePreviewSheet();
  }
});

// --- Scenario presets, Search & Order Placement ---

// Preset Trigger: Samsung Galaxy Charger
DOM.presetSamsung.addEventListener("click", () => {
  cart.clear();
  matcher.resetSession();
  activeSearchQuery = "";
  DOM.simSearchInput.value = "";
  DOM.appSearchInput.value = "";
  
  const charger = GROCERY_ITEMS.find(g => g.id === "g8");
  cart.addItem(charger, 1);

  clearPresetButtonStates();
  DOM.presetSamsung.classList.add("active");
  
  logDebug("Scenario", "Samsung Charger Preset activated: Samsung Galaxy Charger (₹1499) loaded.", "success");
});

// Preset Trigger: Breakfast
DOM.presetBreakfast.addEventListener("click", () => {
  cart.clear();
  matcher.resetSession();
  activeSearchQuery = "";
  DOM.simSearchInput.value = "";
  DOM.appSearchInput.value = "";
  
  const milk = GROCERY_ITEMS.find(g => g.id === "g1");
  const bread = GROCERY_ITEMS.find(g => g.id === "g2");
  
  cart.addItem(milk, 1);
  cart.addItem(bread, 1);

  // Set active class visual state
  clearPresetButtonStates();
  DOM.presetBreakfast.classList.add("active");
  
  logDebug("Scenario", "Tech Refill preset activated: Dairy & Bakery loaded.", "success");
});

// Preset Trigger: Dinner
DOM.presetDinner.addEventListener("click", () => {
  cart.clear();
  matcher.resetSession();
  activeSearchQuery = "";
  DOM.simSearchInput.value = "";
  DOM.appSearchInput.value = "";
  
  const tomatoes = GROCERY_ITEMS.find(g => g.id === "g4");
  const onion = GROCERY_ITEMS.find(g => g.id === "g5");
  
  cart.addItem(tomatoes, 1);
  cart.addItem(onion, 1);

  clearPresetButtonStates();
  DOM.presetDinner.classList.add("active");
  
  logDebug("Scenario", "Cosmetics Routine preset activated: Veggies loaded.", "success");
});

// Preset Trigger: Party Snacks
DOM.presetParty.addEventListener("click", () => {
  cart.clear();
  matcher.resetSession();
  activeSearchQuery = "";
  DOM.simSearchInput.value = "";
  DOM.appSearchInput.value = "";
  
  const chips = GROCERY_ITEMS.find(g => g.id === "g6");
  const coke = GROCERY_ITEMS.find(g => g.id === "g7");
  
  cart.addItem(chips, 1);
  cart.addItem(coke, 2);

  clearPresetButtonStates();
  DOM.presetParty.classList.add("active");
  
  logDebug("Scenario", "Late Night Snacks preset activated: Chips & Beverages loaded.", "success");
});

// Clear scenario
DOM.btnClearScenario.addEventListener("click", () => {
  cart.clear();
  matcher.resetSession();
  activeSearchQuery = "";
  DOM.simSearchInput.value = "";
  DOM.appSearchInput.value = "";
  clearPresetButtonStates();
  logDebug("Scenario", "Scenario reset. Cart is empty, session matcher cleared.", "info");
});

function clearPresetButtonStates() {
  if (DOM.presetSamsung) DOM.presetSamsung.classList.remove("active");
  if (DOM.presetBreakfast) DOM.presetBreakfast.classList.remove("active");
  if (DOM.presetDinner) DOM.presetDinner.classList.remove("active");
  if (DOM.presetParty) DOM.presetParty.classList.remove("active");
}

// Helper: Update Search Dropdown results
function updateSearchDropdown(query) {
  const cleanQuery = query.trim().toLowerCase();
  if (cleanQuery.length === 0) {
    DOM.searchResultsDropdown.style.display = "none";
    return;
  }

  // Filter both catalogs
  const groceryMatches = GROCERY_ITEMS.filter(item => 
    item.name.toLowerCase().includes(cleanQuery) || 
    (item.tags && item.tags.some(t => t.includes(cleanQuery)))
  );
  
  const nonGroceryMatches = NON_GROCERY_CATALOG.filter(item => 
    item.name.toLowerCase().includes(cleanQuery) ||
    (item.trigger_rule && item.trigger_rule.search_intent.some(term => term.includes(cleanQuery)))
  );

  const allMatches = [...groceryMatches, ...nonGroceryMatches];
  DOM.searchResultsDropdown.innerHTML = "";

  if (allMatches.length === 0) {
    const row = document.createElement("div");
    row.className = "no-results-row";
    row.textContent = "No matching products found.";
    DOM.searchResultsDropdown.appendChild(row);
  } else {
    allMatches.forEach(item => {
      const row = document.createElement("div");
      row.className = "search-result-row";
      row.innerHTML = `
        <div class="search-result-info">
          <div class="search-result-icon">${item.image}</div>
          <div class="search-result-details">
            <span class="search-result-name">${item.name}</span>
            <span class="search-result-price">₹${item.price}</span>
          </div>
        </div>
        <button class="btn-add-search-result" data-id="${item.id}">+ Add</button>
      `;
      DOM.searchResultsDropdown.appendChild(row);
    });
  }

  DOM.searchResultsDropdown.style.display = "flex";
}

// In-Flow Search Bar input handling (Syncs with engine & shows dropdown)
DOM.appSearchInput.addEventListener("input", () => {
  const query = DOM.appSearchInput.value;
  activeSearchQuery = query.trim();
  DOM.simSearchInput.value = query; // Sync with desktop box

  updateSearchDropdown(query);

  if (activeSearchQuery) {
    logDebug("SearchSim", `Search query input in app search: "${activeSearchQuery}"`, "info");
  }
  
  // Re-run matching pipeline
  runAIRecommendationEngine(cart.getSummary());
});

// Search Dropdown List item quick addition hook
DOM.searchResultsDropdown.addEventListener("click", e => {
  if (e.target.classList.contains("btn-add-search-result")) {
    const id = e.target.getAttribute("data-id");
    
    // Find in either catalog
    let item = GROCERY_ITEMS.find(g => g.id === id);
    if (!item) {
      item = NON_GROCERY_CATALOG.find(ng => ng.id === id);
    }
    
    if (item) {
      cart.addItem(item, 1);
      showToast(`Added ${item.name} to cart!`);
      logDebug("Cart", `Searched and added: ${item.name} (₹${item.price})`, "success");
      
      // Reset search inputs & dropdown
      DOM.appSearchInput.value = "";
      DOM.simSearchInput.value = "";
      activeSearchQuery = "";
      DOM.searchResultsDropdown.style.display = "none";
    }
  }
});

// Hide dropdown on clicking outside
document.addEventListener("click", e => {
  if (DOM.appSearchInput && !DOM.appSearchInput.contains(e.target) && 
      DOM.searchResultsDropdown && !DOM.searchResultsDropdown.contains(e.target)) {
    DOM.searchResultsDropdown.style.display = "none";
  }
});

// Search Simulation click (Desktop side control)
DOM.btnSearchSim.addEventListener("click", () => {
  const query = DOM.simSearchInput.value;
  activeSearchQuery = query.trim();
  DOM.appSearchInput.value = query; // Sync with mobile search input
  
  updateSearchDropdown(query);

  if (activeSearchQuery) {
    logDebug("SearchSim", `Simulated search query via control panel: "${activeSearchQuery}"`, "info");
  } else {
    logDebug("SearchSim", "Search input cleared.", "info");
  }
  
  // Re-run matching pipeline
  runAIRecommendationEngine(cart.getSummary());
});

// Search input Enter key trigger
DOM.simSearchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    DOM.btnSearchSim.click();
  }
});

// Place Order (Instant Pass-Through)
DOM.btnPlaceOrder.addEventListener("click", () => {
  const summary = cart.getSummary();
  showToast("🎉 Order Placed Successfully! (Pass-Through Complete)");
  logDebug("Checkout", `Placed order for ₹${summary.total}. Pass-through verification passed successfully.`, "success");
  
  // Clear cart & reset state
  setTimeout(() => {
    cart.clear();
    matcher.resetSession();
    clearPresetButtonStates();
    DOM.simSearchInput.value = "";
    DOM.appSearchInput.value = "";
  }, 1000);
});

// --- App Bootstrap ---
renderCatalog();
logDebug("System", "QuickShop AI Assistant bootstrap complete. UI interactive.", "success");
