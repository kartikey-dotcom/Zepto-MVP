// Zepto AI Cross-Category Assistant - Recommendation & Matcher Engine
import { NON_GROCERY_CATALOG } from "./catalog.js";

// Comprehensive Cross-Category Rules Engine
const CROSS_CATEGORY_RULES = [
  {
    category: "Electronics",
    triggerKeywords: ["samsung", "charger", "cable", "phone", "galaxy", "iphone", "adapter", "usb", "device", "tech"],
    items: [
      {
        id: "ng_tech_3",
        name: "PowerPulse 25W Super Fast Adapter",
        category: "Electronics & Accessories",
        price: 899,
        mrp: 1299,
        image: "🔌",
        stock_count: 12,
        hook: "⚡ 100% Compatible with your phone! Charge 0 to 50% in just 25 mins.",
        specs: { "Output Power": "25W Super Fast", "Interface": "USB Type-C", "Safety": "Over-current protection", "Guarantee": "10-Min Replacement" }
      },
      {
        id: "ng_tech_2",
        name: "Mi Braided USB-C Tough Cable 1.5m",
        category: "Electronics & Accessories",
        price: 199,
        mrp: 299,
        image: "🔌",
        stock_count: 14,
        hook: "🔌 Kevlar braided ultra-durable cable. 10,000+ bends tested for fast charge.",
        specs: { "Length": "1.5 Meters", "Data Transfer": "480 Mbps", "Output": "3A Current Support", "Material": "Kevlar Braided" }
      },
      {
        id: "ele_006",
        name: "boAt Airdopes 141 Wireless Earbuds",
        category: "Electronics & Accessories",
        price: 1299,
        mrp: 2990,
        image: "🎧",
        stock_count: 10,
        hook: "🎵 Enjoy 42H total playtime & ENx noise cancellation for clear calls.",
        specs: { "Playtime": "42 Hours", "Driver": "8mm Dynamic", "Water Resistance": "IPX4 Sweatproof" }
      }
    ]
  },
  {
    category: "Breakfast & Dairy",
    triggerKeywords: ["milk", "bread", "eggs", "dairy", "bakery", "butter", "breakfast", "oats", "corn flakes"],
    items: [
      {
        id: "ng_tech_1",
        name: "Portronics 20W Fast Charger Adapter",
        category: "Electronics & Accessories",
        price: 349,
        mrp: 599,
        image: "🔌",
        stock_count: 8,
        hook: "☕ Keep your phone charged while prepping breakfast! 20W Power Delivery.",
        specs: { "Output Wattage": "20W PD 3.0", "Port": "USB Type-C", "Certification": "BIS Certified" }
      },
      {
        id: "hku_004",
        name: "Milton Thermosteel Vacuum Flask 1L",
        category: "Home & Kitchen Utilities",
        price: 899,
        mrp: 1150,
        image: "🧴",
        stock_count: 15,
        hook: "🫖 Keep tea & coffee hot for 24 hours while commuting!",
        specs: { "Capacity": "1 Liter", "Material": "18/8 Stainless Steel", "Insulation": "Vacuum Insulated" }
      }
    ]
  },
  {
    category: "Vegetables & Cooking",
    triggerKeywords: ["tomato", "onion", "vegetables", "veggies", "potato", "chilli", "cooking", "dal", "atta", "rice"],
    items: [
      {
        id: "ng_beauty_1",
        name: "The Derma Co 1% Hyaluronic Sunscreen (50g)",
        category: "Personal Care & Beauty",
        price: 499,
        mrp: 599,
        image: "🧴",
        stock_count: 5,
        hook: "☀️ Grab daily UV protection with SPF 50 while doing morning grocery shopping.",
        specs: { "SPF Protection": "SPF 50 PA++++", "Key Ingredients": "1% Hyaluronic Acid & Vitamin E", "Formula": "Non-greasy, Zero White Cast" }
      },
      {
        id: "ng_home_1",
        name: "Shalimar Oxo-Biodegradable Garbage Bags (30s)",
        category: "Home & Kitchen Utilities",
        price: 120,
        mrp: 150,
        image: "🗑️",
        stock_count: 22,
        hook: "🗑️ Need kitchen garbage bags? Add a roll of leak-proof biodegradable bags.",
        specs: { "Pack Size": "30 Medium Bags", "Material": "Oxo-Biodegradable", "Handles": "Durable Tie String" }
      },
      {
        id: "hku_001",
        name: "ChefMaster Automatic Electric Dough Kneader",
        category: "Home & Kitchen Utilities",
        price: 1499,
        mrp: 2499,
        image: "🥣",
        stock_count: 6,
        hook: "🍞 Knead perfect roti dough in 3 minutes with zero effort!",
        specs: { "Capacity": "3 Liters", "Motor": "350W Pure Copper", "Bowl": "Food grade Stainless Steel" }
      }
    ]
  },
  {
    category: "Snacks & Drinks",
    triggerKeywords: ["chips", "coke", "doritos", "lays", "soda", "cold-drink", "snacks", "munchies", "kurkure", "party"],
    items: [
      {
        id: "ele_019",
        name: "boAt Stone 180 5W Bluetooth Speaker",
        category: "Electronics & Accessories",
        price: 999,
        mrp: 2490,
        image: "🔊",
        stock_count: 9,
        hook: "🎶 Pair your late night snacks with music! 10H playback portable speaker.",
        specs: { "Sound Output": "5W RMS", "Playtime": "10 Hours", "Connectivity": "Bluetooth v5.0" }
      },
      {
        id: "ng_pet_1",
        name: "Pedigree Chicken Dry Dog Food (1.2kg)",
        category: "Pet Supplies & Wellness",
        price: 360,
        mrp: 420,
        image: "🐶",
        stock_count: 4,
        hook: "🐶 Don't forget your furry friend! 100% Complete & balanced pet food.",
        specs: { "Net Weight": "1.2 kg", "Flavor": "Chicken & Vegetables", "Protein": "20% Protein" }
      }
    ]
  },
  {
    category: "Personal Care",
    triggerKeywords: ["face wash", "shampoo", "soap", "moisturizer", "lipstick", "beauty", "skin", "cream"],
    items: [
      {
        id: "pcb_002",
        name: "CeraVe Hydrating Facial Cleanser 236ml",
        category: "Personal Care & Beauty",
        price: 750,
        mrp: 899,
        image: "🧴",
        stock_count: 7,
        hook: "✨ Dermatologist recommended gentle hydration for daily fresh skin.",
        specs: { "Skin Type": "Normal to Dry Skin", "Formula": "Fragrance-Free", "Ceramides": "1, 3, 6-II" }
      }
    ]
  }
];

export class ZeptoAIMatcher {
  constructor(config = {}) {
    this.stockVerificationRequired = config.stockVerificationRequired ?? true;
  }

  // Resets the matcher session
  resetSession() {}

  /**
   * Dynamically evaluates active cart items and search query to return the most relevant recommendation.
   * @param {Object} cartSummary - Summary generated by ZeptoCart
   * @param {string} searchQuery - Current search query from user
   * @returns {Object|null} Recommendation object or null
   */
  getRecommendation(cartSummary, searchQuery = "") {
    if (!cartSummary || cartSummary.itemsCount === 0) {
      return null;
    }

    const cleanQuery = searchQuery.trim().toLowerCase();
    const isAlreadyInCart = (item) => cartSummary.itemIds.includes(item.id);
    const hasStock = (item) => !this.stockVerificationRequired || (item.stock_count ?? 10) > 0;

    // Get the most recently added item in cart
    const lastCartEntry = cartSummary.items[cartSummary.items.length - 1];
    const lastItem = lastCartEntry ? lastCartEntry.item : null;

    let candidateItem = null;
    let matchingHook = "";

    // --- STRATEGY 1: MATCH LATEST ADDED CART ITEM ---
    if (lastItem) {
      const itemText = (lastItem.name + " " + lastItem.category + " " + (lastItem.tags || []).join(" ")).toLowerCase();

      for (const ruleGroup of CROSS_CATEGORY_RULES) {
        if (ruleGroup.triggerKeywords.some(kw => itemText.includes(kw))) {
          const match = ruleGroup.items.find(item => !isAlreadyInCart(item) && hasStock(item));
          if (match) {
            candidateItem = match;
            matchingHook = match.hook;
            break;
          }
        }
      }
    }

    // --- STRATEGY 2: MATCH ACTIVE SEARCH QUERY ---
    if (!candidateItem && cleanQuery.length > 0) {
      for (const ruleGroup of CROSS_CATEGORY_RULES) {
        if (ruleGroup.triggerKeywords.some(kw => cleanQuery.includes(kw))) {
          const match = ruleGroup.items.find(item => !isAlreadyInCart(item) && hasStock(item));
          if (match) {
            candidateItem = match;
            matchingHook = match.hook;
            break;
          }
        }
      }
    }

    // --- STRATEGY 3: FALLBACK TO ANY UNADDED HIGH-MARGIN ITEM ---
    if (!candidateItem) {
      for (const ruleGroup of CROSS_CATEGORY_RULES) {
        const match = ruleGroup.items.find(item => !isAlreadyInCart(item) && hasStock(item));
        if (match) {
          candidateItem = match;
          matchingHook = match.hook;
          break;
        }
      }
    }

    if (candidateItem) {
      return {
        item: candidateItem,
        hook: matchingHook || "✨ 100% Quality & Compatibility Checked for 10-Min Delivery",
        category: candidateItem.category
      };
    }

    return null;
  }
}
