// Zepto AI Cross-Category Assistant - Practical Recommendation & Trust Shield Engine

const FRICTION_SOLVING_PAIRS = [
  {
    category: "Tech & Electronics",
    triggerKeywords: ["samsung", "charger", "cable", "phone", "galaxy", "iphone", "adapter", "usb", "device", "tech"],
    recommendation: {
      id: "rec_tech_101",
      product_name: "PowerPulse 25W Super Fast Adapter",
      category: "Electronics",
      price: 899,
      mrp: 1299,
      image: "🔌",
      contextual_bridge: "✅ 100% Verified for your device — 25W PD Fast Charging with Overheating Protection.",
      trust_shield: {
        spec_summary: "25W PD Output | USB Type-C Port | Surge & Overheat Protection",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Doorstep Replacement Guarantee",
        return_policy_summary: "No hassle returns. If defective or incompatible, rider swaps it instantly at your doorstep."
      }
    }
  },
  {
    category: "Heavy Staples & Cooking Prep",
    triggerKeywords: ["atta", "flour", "wheat", "dal", "rice", "ghee", "oil", "cooking", "staples"],
    recommendation: {
      id: "rec_home_102",
      product_name: "ChefMaster Automatic Electric Dough Kneader",
      category: "Home & Kitchen Utilities",
      price: 1499,
      mrp: 2499,
      image: "🥣",
      contextual_bridge: "Kneading flour by hand? Knead smooth roti dough in 60s with zero countertop mess.",
      trust_shield: {
        spec_summary: "3L Food Grade Stainless Steel | 350W Copper Motor | Easy Clean",
        dark_store_status: "Quality Checked & Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Doorstep Replacement Guarantee",
        return_policy_summary: "100% Quality Inspected. Defective or damaged items swapped at your doorstep in 10 mins."
      }
    }
  },
  {
    category: "Snacks & Finger Foods",
    triggerKeywords: ["chips", "doritos", "lays", "coke", "soda", "greasy", "snacks", "munchies", "kurkure", "party"],
    recommendation: {
      id: "rec_hygiene_103",
      product_name: "Himalaya Herbal Gentle Wet Wipes (72s)",
      category: "Hygiene & Care",
      price: 185,
      mrp: 220,
      image: "🧼",
      contextual_bridge: "Eating chips? Pack of 72 Wet Wipes to keep your hands and screens grease-free.",
      trust_shield: {
        spec_summary: "100% Alcohol-Free | Hypoallergenic Aloe Vera | 72 Extra Moist Wipes",
        dark_store_status: "Verified in Stock at Dark Store #204",
        return_policy_title: "10-Minute Doorstep Replacement Guarantee",
        return_policy_summary: "Instant hassle-free doorstep exchange guarantee on all hygiene products."
      }
    }
  },
  {
    category: "Personal Care & Beauty",
    triggerKeywords: ["skincare", "face wash", "cleanser", "soap", "serum", "makeup", "cosmetics", "cream", "lotion"],
    recommendation: {
      id: "rec_beauty_104",
      product_name: "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel",
      category: "Personal Care & Beauty",
      price: 499,
      mrp: 599,
      image: "🧴",
      contextual_bridge: "Dermatologically tested daily sunscreen to lock in moisture after washing.",
      trust_shield: {
        spec_summary: "SPF 50 PA++++ | 1% Hyaluronic Acid | Zero White Cast & Non-Greasy",
        dark_store_status: "Dermatologically Tested & Verified at Dark Store #204",
        return_policy_title: "10-Minute Doorstep Replacement Guarantee",
        return_policy_summary: "If damaged or seal broken upon delivery, rider replaces it in 10 mins."
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
   * Evaluates cart contents & search query to return practical, friction-solving recommendations
   * with explicit Trust & Return Policy metadata.
   */
  getRecommendation(cartSummary, searchQuery = "") {
    if (!cartSummary || cartSummary.itemsCount === 0) {
      return null;
    }

    const cleanQuery = searchQuery.trim().toLowerCase();
    const isAlreadyInCart = (rec) => cartSummary.itemIds.includes(rec.id);

    // Get latest added item in cart
    const lastCartEntry = cartSummary.items[cartSummary.items.length - 1];
    const lastItem = lastCartEntry ? lastCartEntry.item : null;

    let selectedPair = null;

    // 1. MATCH LATEST ADDED CART ITEM
    if (lastItem) {
      const itemText = (lastItem.name + " " + lastItem.category + " " + (lastItem.tags || []).join(" ")).toLowerCase();
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

    // 3. FALLBACK TO FIRST UNADDED FRICTION-SOLVING PAIR
    if (!selectedPair) {
      selectedPair = FRICTION_SOLVING_PAIRS.find(pair => !isAlreadyInCart(pair.recommendation));
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
          trust_shield: rec.trust_shield
        }
      };
    }

    return null;
  }
}
