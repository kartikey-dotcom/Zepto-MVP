// Zepto AI Cross-Category Assistant Mock Catalog Data
// Exposes both core grocery items and high-margin non-grocery expansion categories

export const GROCERY_ITEMS = [
  {
    id: "g8",
    name: "Samsung Galaxy Charger",
    category: "Electronics",
    price: 1499,
    unit: "1 Unit",
    image: "📱",
    tags: ["samsung", "charger", "galaxy"]
  },
  {
    id: "g1",
    name: "Amul Taaza Fresh Toned Milk",
    category: "dairy",
    price: 27,
    unit: "500 ml",
    image: "🥛",
    tags: ["milk", "dairy", "morning-routine"]
  },
  {
    id: "g2",
    name: "Harvest Gold Sliced White Bread",
    category: "bakery",
    price: 45,
    unit: "400 g",
    image: "🍞",
    tags: ["bread", "breakfast", "bakery"]
  },
  {
    id: "g3",
    name: "Farm Fresh Large Eggs",
    category: "dairy",
    price: 84,
    unit: "6 pcs",
    image: "🥚",
    tags: ["eggs", "protein", "breakfast"]
  },
  {
    id: "g4",
    name: "Fresh Hybrid Tomatoes",
    category: "vegetables",
    price: 38,
    unit: "500 g",
    image: "🍅",
    tags: ["tomato", "veggies", "cooking"]
  },
  {
    id: "g5",
    name: "Premium Onion (Pyaz)",
    category: "vegetables",
    price: 42,
    unit: "1 kg",
    image: "🧅",
    tags: ["onion", "veggies", "cooking"]
  },
  {
    id: "g6",
    name: "Lay's Classic Salted Potato Chips",
    category: "snacks",
    price: 30,
    unit: "90 g",
    image: "🥔",
    tags: ["chips", "snacks", "munchies"]
  },
  {
    id: "g7",
    name: "Coca-Cola Zero Sugar Soft Drink",
    category: "beverages",
    price: 40,
    unit: "300 ml Can",
    image: "🥤",
    tags: ["coke", "soda", "cold-drink"]
  }
];

export const NON_GROCERY_CATALOG = [
  // --- Category: Electronics Accessories ---
  {
    id: "ng_tech_3",
    name: "PowerPulse 25W Adapter",
    category: "Electronics",
    price: 899,
    image: "🔌",
    stock_count: 12,
    specs: {
      "Output Power": "25W Super Fast Charging",
      "Interface": "USB Type-C",
      "Compatibility": "Galaxy S20/S21/S22/S23, Note 20, Tab S7/S8",
      "Features": "Over-current protection, Short-circuit safety"
    },
    replacement_guarantee: "10-Minute Doorstep Replacement & Return",
    trigger_rule: {
      cart_items: ["g8"], // Triggered when Samsung Galaxy Charger is in cart
      search_intent: ["adapter", "powerpulse", "samsung adapter", "plug"],
      routine_hook: "This adapter is perfect for your Charger. Adding it now ensures you're ready to power up!"
    }
  },
  {
    id: "ng_tech_1",
    name: "Portronics 20W Type-C Fast Charger",
    category: "Electronics",
    price: 349,
    image: "🔌",
    stock_count: 8,
    specs: {
      "Output Wattage": "20W Power Delivery (PD 3.0)",
      "Port Type": "USB Type-C",
      "Compatibility": "iPhone 12/13/14/15, Samsung Galaxy S21/S22/S23, Pixel 6/7/8",
      "Safety Certifications": "BIS Certified, Surge & Over-temperature Protection"
    },
    replacement_guarantee: "10-Minute Doorstep Replacement & Return",
    trigger_rule: {
      cart_categories: ["dairy", "bakery"], // If user buying breakfast, nudge charger as "convenience tech utility"
      search_intent: ["charger", "cable", "tech", "portronics", "phone"],
      routine_hook: "Keep your devices powered while cooking breakfast! Charge from 0 to 50% in just 30 mins."
    }
  },
  {
    id: "ng_tech_2",
    name: "Mi Braided USB-C to USB-C Tough Cable",
    category: "Electronics",
    price: 199,
    image: "🔌",
    stock_count: 14,
    specs: {
      "Cable Length": "1.5 Meters",
      "Data Transfer Speed": "Up to 480 Mbps",
      "Material": "Kevlar braided fiber for high durability (10,000+ bends tested)",
      "Maximum Output": "3A current charging support"
    },
    replacement_guarantee: "10-Minute Doorstep Replacement & Return",
    trigger_rule: {
      cart_items: ["ng_tech_1"], // Cross-sell compatibility nudge
      search_intent: ["cable", "c-type", "wire", "mi"],
      routine_hook: "Pair with your fast charger for unbreakable charging speed at home."
    }
  },

  // --- Category: Beauty & Cosmetics ---
  {
    id: "ng_beauty_1",
    name: "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel",
    category: "Cosmetics",
    price: 499,
    image: "🧴",
    stock_count: 5,
    specs: {
      "SPF Protection": "SPF 50 PA++++",
      "Key Ingredients": "1% Hyaluronic Acid, Vitamin E, Titanium Dioxide",
      "Skin Type": "Suitable for all skin types, non-greasy, zero white cast",
      "Free From": "Parabens, Sulfates, Mineral Oils"
    },
    replacement_guarantee: "10-Minute Doorstep Replacement & Return",
    trigger_rule: {
      cart_categories: ["vegetables"], // Fresh morning routine hook
      search_intent: ["sunscreen", "spf", "derma", "skin", "cream"],
      routine_hook: "Grab your daily UV protection with your fresh morning groceries."
    }
  },

  // --- Category: Home & Kitchen Utilities ---
  {
    id: "ng_home_1",
    name: "Shalimar Oxo-Biodegradable Garbage Bags",
    category: "Home Utilities",
    price: 120,
    image: "🗑️",
    stock_count: 22,
    specs: {
      "Pack Size": "30 Bags (Size: Medium, 19 x 21 inches)",
      "Material": "Oxo-Biodegradable plastic (environmentally friendly)",
      "Strength": "Leak-proof sealed bottom, durable tie-string handles"
    },
    replacement_guarantee: "10-Minute Doorstep Replacement & Return",
    trigger_rule: {
      cart_categories: ["vegetables", "dairy"], // Groceries generate kitchen trash
      search_intent: ["bag", "garbage", "trash", "cleaning", "kitchen"],
      routine_hook: "Need kitchen garbage bags? Add a roll of Shalimar Oxo-biodegradable bags."
    }
  },

  // --- Category: Pet Care ---
  {
    id: "ng_pet_1",
    name: "Pedigree Chicken & Vegetables Dry Dog Food",
    category: "Pet Care",
    price: 360,
    image: "🐶",
    stock_count: 4,
    specs: {
      "Net Weight": "1.2 kg",
      "Flavor": "Chicken & Vegetables",
      "Nutrient Composition": "20% Protein, 10% Crude Fiber, Omega-6 & Zinc for skin health",
      "Life Stage": "Adult Dogs (1+ Years)"
    },
    replacement_guarantee: "10-Minute Doorstep Replacement & Return",
    trigger_rule: {
      cart_categories: ["snacks", "beverages"],
      search_intent: ["dog", "pedigree", "pet", "dog food", "food"],
      routine_hook: "Don't forget your furry friend! Pedigree chicken dry food is ready at your local dark store."
    }
  },

  // --- Category: Baby Care ---
  {
    id: "ng_baby_1",
    name: "Himalaya Herbal Gentle Baby Wipes",
    category: "Baby Care",
    price: 185,
    image: "👶",
    stock_count: 10,
    specs: {
      "Pack Size": "72 Wipes",
      "Ingredients": "Aloe Vera, Indian Lotus, Clinically tested hypoallergenic formula",
      "Alcohol Status": "100% Alcohol-free, paraben-free",
      "Use cases": "Diaper changes, face/body cleaning for infant skin"
    },
    replacement_guarantee: "10-Minute Doorstep Replacement & Return",
    trigger_rule: {
      cart_categories: ["dairy"],
      search_intent: ["baby", "wipes", "himalaya", "diaper", "child"],
      routine_hook: "Stock up on gentle baby essentials with your daily dairy refill."
    }
  }
];
