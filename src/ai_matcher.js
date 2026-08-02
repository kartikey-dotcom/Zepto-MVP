// Zepto AI Cross-Category Assistant - Direct Companion & Multi-Category Logic Engine

// Direct Companion Matrix (Key = Non-Grocery Item ID or Keyword)
const DIRECT_COMPANION_MATRIX = {
  // Dough Kneader / Kitchen Appliances
  "hku_001": {
    id: "rec_mat_001",
    name: "Silicone Non-Stick Dough & Roti Kneading Mat",
    price: 199,
    mrp: 399,
    image: "🫓",
    benefit_text: "Keep countertops clean & dough fresh!",
    specs: "Food Grade Silicone | Non-Slip Surface | Easy Wash"
  },
  "rec_home_105": {
    id: "rec_mat_001",
    name: "Silicone Non-Stick Dough & Roti Kneading Mat",
    price: 199,
    mrp: 399,
    image: "🫓",
    benefit_text: "Keep countertops clean & dough fresh!",
    specs: "Food Grade Silicone | Non-Slip Surface | Easy Wash"
  },
  // Cables / Tech / Chargers
  "ng_tech_2": {
    id: "rec_tech_101",
    name: "PowerPulse 25W Fast Wall Adapter",
    price: 399,
    mrp: 699,
    image: "🔌",
    benefit_text: "Pair with a 20W adapter for maximum charging speed",
    specs: "20W PD Output | Type-C Port | Surge Protection"
  },
  "g8": {
    id: "rec_tech_101",
    name: "PowerPulse 25W Fast Wall Adapter",
    price: 399,
    mrp: 699,
    image: "🔌",
    benefit_text: "Pair with a 20W adapter for maximum charging speed",
    specs: "20W PD Output | Type-C Port | Surge Protection"
  },
  // Face Wash / Cleanser / Skincare
  "pcb_002": {
    id: "rec_beauty_111",
    name: "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel",
    price: 349,
    mrp: 499,
    image: "🧴",
    benefit_text: "Lock in hydration post-cleansing",
    specs: "SPF 50 PA++++ | 1% Hyaluronic Acid | Non-Greasy"
  },
  "ng_beauty_1": {
    id: "pcb_002",
    name: "CeraVe Hydrating Facial Cleanser 236ml",
    price: 750,
    mrp: 899,
    image: "🧴",
    benefit_text: "Cleanse skin gently before applying sunscreen",
    specs: "Essential Ceramides 1, 3, 6-II | Fragrance-Free"
  },
  // Binge Snacks / Chips
  "g7": {
    id: "rec_hygiene_109",
    name: "Himalaya Gentle Wet Wipes (15s Pack)",
    price: 49,
    mrp: 60,
    image: "🧼",
    benefit_text: "Keep hands & controller grease-free",
    specs: "100% Alcohol-Free | Aloe Vera Enriched | 15 Wipes"
  }
};

function getDirectAccessoryByKeyword(nonGroceryItem) {
  const text = (nonGroceryItem.name + " " + (nonGroceryItem.category || "")).toLowerCase();
  
  if (text.includes("kneader") || text.includes("cooker") || text.includes("pan") || text.includes("kettle")) {
    return DIRECT_COMPANION_MATRIX["hku_001"];
  }
  if (text.includes("cable") || text.includes("usb") || text.includes("phone") || text.includes("charger")) {
    return DIRECT_COMPANION_MATRIX["ng_tech_2"];
  }
  if (text.includes("cleanser") || text.includes("face wash") || text.includes("serum")) {
    return DIRECT_COMPANION_MATRIX["pcb_002"];
  }
  if (text.includes("chips") || text.includes("doritos") || text.includes("lays")) {
    return DIRECT_COMPANION_MATRIX["g7"];
  }
  return null;
}

const FRICTION_SOLVING_PAIRS = [
  {
    category: "Samsung Electronics",
    triggerKeywords: ["samsung", "galaxy", "25w", "fast charger"],
    recommendation: {
      id: "rec_tech_101",
      product_name: "PowerPulse 25W Super Fast Adapter",
      category: "Electronics & Accessories",
      price: 899,
      mrp: 1299,
      image: "🔌",
      contextual_bridge: "✅ 100% Verified for your device — 25W PD Fast Charging with Overheating Protection.",
      trust_shield: {
        spec_summary: "25W PD Output | USB Type-C Port | Surge & Overheat Protection",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "No hassle returns. If defective or incompatible, rider swaps it instantly at your doorstep."
      }
    }
  },
  {
    category: "Apple Tech",
    triggerKeywords: ["iphone", "apple", "ipad", "airpods", "lightning"],
    recommendation: {
      id: "rec_tech_102",
      product_name: "Apple Original 20W USB-C Power Adapter",
      category: "Electronics & Accessories",
      price: 1699,
      mrp: 1900,
      image: "🔌",
      contextual_bridge: "✅ Apple Certified 20W PD Output for iPhone 12/13/14/15 Fast Charging.",
      trust_shield: {
        spec_summary: "20W PD Output | Apple Lightning & Type-C Compatible | BIS Certified",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "100% Genuine Apple Accessory. If defective, rider replaces it in 10 mins."
      }
    }
  },
  {
    category: "Audio & Wireless",
    triggerKeywords: ["earbuds", "headphones", "neckband", "airdopes", "bluetooth", "wireless"],
    recommendation: {
      id: "rec_tech_103",
      product_name: "Mi 10000mAh 18W Fast Charging Power Bank",
      category: "Electronics & Accessories",
      price: 1199,
      mrp: 1999,
      image: "🔋",
      contextual_bridge: "🔋 Charge your wireless earbuds up to 8x on the go with 18W Fast Charging.",
      trust_shield: {
        spec_summary: "10000mAh Lithium Polymer | 18W Dual Output | 12-Layer Circuit Protection",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "Rider swaps incompatible or damaged power bank at your doorstep in 10 mins."
      }
    }
  },
  {
    category: "Computer Peripherals",
    triggerKeywords: ["mouse", "keyboard", "logitech", "zebronics", "hp", "pendrive", "computer"],
    recommendation: {
      id: "rec_tech_104",
      product_name: "Zebronics Precision Gaming Mouse Pad",
      category: "Electronics & Accessories",
      price: 199,
      mrp: 399,
      image: "🖱️",
      contextual_bridge: "🖱️ Ultra-smooth non-slip surface to prevent wrist fatigue & optical mouse lag.",
      trust_shield: {
        spec_summary: "Anti-Fray Stitched Edges | Non-Slip Rubber Base | Washable Fabric",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "Quality checked item. Instant replacement if size or texture is not as expected."
      }
    }
  },
  {
    category: "Atta & Flour",
    triggerKeywords: ["atta", "flour", "wheat", "aashirvaad"],
    recommendation: {
      id: "rec_home_105",
      product_name: "ChefMaster Automatic Electric Dough Kneader",
      category: "Home & Kitchen Utilities",
      price: 1499,
      mrp: 2499,
      image: "🥣",
      contextual_bridge: "Kneading flour by hand? Knead smooth roti dough in 60s with zero countertop mess.",
      trust_shield: {
        spec_summary: "3L Food Grade Stainless Steel | 350W Copper Motor | Easy Clean",
        dark_store_status: "Quality Checked & Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "100% Quality Inspected. Defective or damaged items swapped at your doorstep in 10 mins."
      }
    }
  },
  {
    category: "Rice & Grains Pantry",
    triggerKeywords: ["rice", "dal", "basmati", "pulses", "oil", "ghee", "sugar", "salt", "staples"],
    recommendation: {
      id: "rec_home_106",
      product_name: "Signoraware Airtight Pantry Storage Containers (6s)",
      category: "Home & Kitchen Utilities",
      price: 349,
      mrp: 499,
      image: "🫙",
      contextual_bridge: "🌾 Keep your kitchen staples 100% moisture-free & pest-protected in airtight containers.",
      trust_shield: {
        spec_summary: "BPA-Free Food Grade Plastic | Airtight Silicone Seal | Stackable 6 Pack",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "If containers arrive cracked or broken, rider replaces set at doorstep in 10 mins."
      }
    }
  },
  {
    category: "Fresh Veggies & Cooking",
    triggerKeywords: ["tomato", "onion", "veggies", "vegetable", "paneer", "spices", "cooking", "chilli", "garlic"],
    recommendation: {
      id: "rec_home_107",
      product_name: "Silicone Non-Stick Baking & Roti Kneading Mat",
      category: "Home & Kitchen Utilities",
      price: 299,
      mrp: 499,
      image: "🫓",
      contextual_bridge: "🍳 Protect kitchen counters & chop veggies with zero countertop stains.",
      trust_shield: {
        spec_summary: "Heat Resistant Silicone | Measurement Markings | Easy Washable",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "Instant doorstep replacement if mat is damaged or defective."
      }
    }
  },
  {
    category: "Breakfast & Dairy",
    triggerKeywords: ["milk", "bread", "eggs", "dairy", "bakery", "butter", "oats", "tea", "coffee"],
    recommendation: {
      id: "rec_home_108",
      product_name: "Milton Thermosteel Vacuum Insulated Flask (1L)",
      category: "Home & Kitchen Utilities",
      price: 899,
      mrp: 1150,
      image: "🧴",
      contextual_bridge: "🫖 Keep tea & coffee scalding hot for 24 hours while commuting.",
      trust_shield: {
        spec_summary: "1L Capacity | 18/8 Stainless Steel | 24 Hours Hot & Cold Insulation",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "Tested vacuum seal. Rider replaces defective flask at doorstep in 10 mins."
      }
    }
  },
  {
    category: "Chips & Greasy Snacks",
    triggerKeywords: ["chips", "doritos", "lays", "greasy", "snacks", "munchies", "kurkure", "namkeen"],
    recommendation: {
      id: "rec_hygiene_109",
      product_name: "Himalaya Herbal Gentle Wet Wipes (72s)",
      category: "Hygiene & Care",
      price: 185,
      mrp: 220,
      image: "🧼",
      contextual_bridge: "Eating chips? Pack of 72 Wet Wipes to keep your hands and screens grease-free.",
      trust_shield: {
        spec_summary: "100% Alcohol-Free | Hypoallergenic Aloe Vera | 72 Extra Moist Wipes",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "Instant hassle-free doorstep exchange guarantee on all hygiene products."
      }
    }
  },
  {
    category: "Beverages & Drinks",
    triggerKeywords: ["coke", "sprite", "thums up", "soda", "cold drink", "energy drink", "red bull", "juice", "beverage"],
    recommendation: {
      id: "rec_tech_110",
      product_name: "boAt Stone 180 5W Portable Bluetooth Speaker",
      category: "Electronics & Accessories",
      price: 999,
      mrp: 2490,
      image: "🔊",
      contextual_bridge: "🎶 Pair your chilled drinks & snacks with 10H continuous party audio.",
      trust_shield: {
        spec_summary: "5W RMS HD Sound | 10 Hours Playtime | IPX7 Sweat & Splashproof",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "If audio or pairing is defective, rider replaces it at your doorstep in 10 mins."
      }
    }
  },
  {
    category: "Skincare & Beauty",
    triggerKeywords: ["skincare", "face wash", "cleanser", "soap", "serum", "makeup", "cosmetics", "cream", "lotion", "sunscreen"],
    recommendation: {
      id: "rec_beauty_111",
      product_name: "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel",
      category: "Personal Care & Beauty",
      price: 499,
      mrp: 599,
      image: "🧴",
      contextual_bridge: "Dermatologically tested daily sunscreen to lock in moisture after washing.",
      trust_shield: {
        spec_summary: "SPF 50 PA++++ | 1% Hyaluronic Acid | Zero White Cast & Non-Greasy",
        dark_store_status: "Dermatologically Tested & Verified at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "If damaged or seal broken upon delivery, rider replaces it in 10 mins."
      }
    }
  },
  {
    category: "Baby Care",
    triggerKeywords: ["baby", "diaper", "pampers", "mamypoko", "infant", "child"],
    recommendation: {
      id: "rec_baby_112",
      product_name: "Himalaya Baby Lotion Extra Soft (400ml)",
      category: "Hygiene & Baby Care",
      price: 280,
      mrp: 350,
      image: "🧴",
      contextual_bridge: "👶 Soothe diaper friction & keep infant skin velvety soft 24/7.",
      trust_shield: {
        spec_summary: "Olive Oil & Almond Oil enriched | Hypoallergenic | Paraben Free",
        dark_store_status: "Pediatrician Tested & Verified at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "Rider replaces damaged baby care bottles instantly at doorstep."
      }
    }
  },
  {
    category: "Pet Care",
    triggerKeywords: ["dog", "cat", "pet", "pedigree", "whiskas", "drools"],
    recommendation: {
      id: "rec_pet_113",
      product_name: "Meat Up Chicken Flavor Dog Chew Bones (10s)",
      category: "Pet Supplies & Wellness",
      price: 249,
      mrp: 320,
      image: "🦴",
      contextual_bridge: "🦴 Satisfy your dog's natural chew instinct while protecting teeth & gums.",
      trust_shield: {
        spec_summary: "100% Rawhide Chews | High Protein | Reduces Tartar & Plaque Build-Up",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
        return_policy_summary: "100% Fresh pet treats guarantee. Replacement available at doorstep."
      }
    }
  }
];

export class ZeptoAIMatcher {
  constructor(config = {}) {
    this.stockVerificationRequired = config.stockVerificationRequired ?? true;
  }

  resetSession() {}

  /**
   * Option B: Multi-Category Direct Companion & Evaluation Logic (/api/cart/evaluate)
   */
  evaluateCart(cartSummary, userSegment = "stalled_non_grocery_shopper") {
    if (!cartSummary || cartSummary.itemsCount === 0) {
      return { recommendation_required: false, recommendation: null };
    }

    if (userSegment !== "stalled_non_grocery_shopper") {
      return { recommendation_required: false, recommendation: null };
    }

    const cartItems = cartSummary.items.map(e => e.item);

    const isGrocery = (item) => {
      const cat = (item.category || "").toLowerCase();
      const id = (item.id || "").toLowerCase();
      return cat.includes("grocery") || cat.includes("staples") || cat.includes("packaged") || cat.includes("snacks") || id.startsWith("g");
    };

    const hasGrocery = cartItems.some(item => isGrocery(item));
    const nonGroceryItem = cartItems.find(item => !isGrocery(item));

    // --- MULTI-CATEGORY CASE (OPTION B) ---
    if (hasGrocery && nonGroceryItem) {
      const directAccessory = DIRECT_COMPANION_MATRIX[nonGroceryItem.id] || getDirectAccessoryByKeyword(nonGroceryItem);

      if (directAccessory && !cartSummary.itemIds.includes(directAccessory.id)) {
        return {
          recommendation_required: true,
          recommendation: {
            id: directAccessory.id,
            product_name: directAccessory.name,
            price: directAccessory.price,
            mrp: directAccessory.mrp,
            image: directAccessory.image || "✨",
            contextual_bridge: `Pair with your ${nonGroceryItem.name}: ${directAccessory.benefit_text}`,
            trust_badges: [
              "🛡️ 10-Min Doorstep Swap",
              "✅ 100% Brand Authentic"
            ],
            trust_shield: {
              spec_summary: directAccessory.specs,
              dark_store_status: "Verified in Stock at Dark Store #204",
              return_policy_title: "10-Minute Instant Doorstep Replacement Guarantee",
              return_policy_summary: "No hassle returns. Rider swaps defective items instantly at doorstep."
            }
          }
        };
      } else {
        // SILENT COLLAPSE: Non-grocery goal achieved, no direct companion found
        return { recommendation_required: false, recommendation: null };
      }
    }

    // --- STANDARD SINGLE-CATEGORY GROCERY CART LOGIC ---
    const rec = this.getRecommendation(cartSummary);
    if (rec && rec.recommendation) {
      return {
        recommendation_required: true,
        recommendation: rec.recommendation
      };
    }

    return { recommendation_required: false, recommendation: null };
  }

  /**
   * Evaluates active cart items & search query for standard single-category cases
   */
  getRecommendation(cartSummary, searchQuery = "") {
    if (!cartSummary || cartSummary.itemsCount === 0) {
      return null;
    }

    const cleanQuery = searchQuery.trim().toLowerCase();
    const isAlreadyInCart = (rec) => cartSummary.itemIds.includes(rec.id);

    const lastCartEntry = cartSummary.items[cartSummary.items.length - 1];
    const lastItem = lastCartEntry ? lastCartEntry.item : null;

    let selectedPair = null;

    // 1. MATCH LATEST ADDED CART ITEM
    if (lastItem) {
      const itemText = (lastItem.name + " " + (lastItem.category || "") + " " + ((lastItem.keywords || lastItem.tags) || []).join(" ")).toLowerCase();
      selectedPair = FRICTION_SOLVING_PAIRS.find(pair => 
        pair.triggerKeywords.some(kw => itemText.includes(kw)) &&
        !isAlreadyInCart(pair.recommendation)
      );
    }

    // 2. MATCH SEARCH QUERY
    if (!selectedPair && cleanQuery.length > 0) {
      selectedPair = FRICTION_SOLVING_PAIRS.find(pair => 
        pair.triggerKeywords.some(kw => cleanQuery.includes(kw)) &&
        !isAlreadyInCart(pair.recommendation)
      );
    }

    // 3. DYNAMIC ROTATION FALLBACK
    if (!selectedPair) {
      const key = lastItem ? (lastItem.id + lastItem.name) : "default";
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0;
      }
      
      const startIndex = Math.abs(hash) % FRICTION_SOLVING_PAIRS.length;
      for (let i = 0; i < FRICTION_SOLVING_PAIRS.length; i++) {
        const idx = (startIndex + i) % FRICTION_SOLVING_PAIRS.length;
        const candidate = FRICTION_SOLVING_PAIRS[idx];
        if (!isAlreadyInCart(candidate.recommendation)) {
          selectedPair = candidate;
          break;
        }
      }
    }

    if (selectedPair) {
      const rec = selectedPair.recommendation;
      return {
        status: "success",
        recommendation: {
          id: rec.id,
          product_name: rec.product_name,
          category: rec.category,
          price: rec.price,
          mrp: rec.mrp,
          image: rec.image,
          contextual_bridge: rec.contextual_bridge,
          trust_badges: [
            "🛡️ 10-Min Doorstep Swap",
            "✅ 100% Brand Authentic"
          ],
          trust_shield: rec.trust_shield
        }
      };
    }

    return null;
  }
}
