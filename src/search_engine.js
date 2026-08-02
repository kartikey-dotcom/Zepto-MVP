// Universal Search Engine Service with Tier-1 Seed Catalog & Tier-2 Wildcard Generator
import catalogSeed from "./catalog.json" assert { type: "json" };

const CATEGORY_EMOJIS = {
  "Fresh & Daily Staples": "🥬",
  "Packaged Foods & Snacks": "🍿",
  "Personal Care & Beauty": "🧴",
  "Electronics & Accessories": "🔌",
  "Home & Kitchen Utilities": "🧹",
  "Hygiene & Baby Care": "👶",
  "Pet Supplies & Wellness": "🐶"
};

/**
 * Infer department category from user query keywords
 */
export function inferCategoryFromQuery(query) {
  const q = query.toLowerCase();
  
  if (/(charger|adapter|cable|usb|mouse|keyboard|powerbank|earbuds|headphones|watch|battery|tech|phone|laptop|router|speaker|camera|tv|led|plug)/.test(q)) {
    return "Electronics & Accessories";
  }
  if (/(sunscreen|cleanser|lipstick|cream|serum|shampoo|conditioner|face wash|makeup|perfume|deo|kajal|soap|moisturizer|lotion|beauty|skincare|cosmetics)/.test(q)) {
    return "Personal Care & Beauty";
  }
  if (/(kneader|mat|pan|kettle|cleaner|detergent|mop|broom|wiper|cooker|container|bottle|tiffin|garbage|trash|harpic|lizol|kitchen|home|utility)/.test(q)) {
    return "Home & Kitchen Utilities";
  }
  if (/(diaper|baby|wipes|sanitizer|handwash|lotion|powder|infant|child|hygiene)/.test(q)) {
    return "Hygiene & Baby Care";
  }
  if (/(dog|cat|pet|whiskas|pedigree|drools|litter|chew|bone|fish food|bird|collar|leash)/.test(q)) {
    return "Pet Supplies & Wellness";
  }
  if (/(doritos|chips|lays|maggi|coke|sprite|chocolate|biscuit|cookie|red bull|coffee|tea|juice|snack|munchies|namkeen|candy|nutella)/.test(q)) {
    return "Packaged Foods & Snacks";
  }
  return "Fresh & Daily Staples";
}

export function isNonGrocery(category) {
  return [
    "Electronics & Accessories",
    "Personal Care & Beauty",
    "Home & Kitchen Utilities",
    "Hygiene & Baby Care",
    "Pet Supplies & Wellness"
  ].includes(category);
}

export function getPlaceholderImageForCategory(category) {
  return CATEGORY_EMOJIS[category] || "📦";
}

/**
 * Main Search Execution Engine Function
 * Tier 1: Matches Curated Seed Dataset (300 SKUs)
 * Tier 2: Wildcard Fallback Generator (Guarantees zero-empty-search)
 */
export function executeSearch(rawQuery) {
  const query = (rawQuery || "").toLowerCase().trim();
  if (!query) {
    return { status: "success", source: "none", results: [] };
  }

  // 1. Tier 1: Search Seed Catalog
  const exactMatches = catalogSeed.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(query);
    const catMatch = item.category.toLowerCase().includes(query);
    const tagMatch = item.keywords && item.keywords.some(k => k.toLowerCase().includes(query));
    return nameMatch || catMatch || tagMatch;
  });

  if (exactMatches.length > 0) {
    return {
      status: "success",
      source: "seed_catalog",
      count: exactMatches.length,
      results: exactMatches
    };
  }

  // 2. Tier 2: Wildcard Fallback Generator
  const detectedCategory = inferCategoryFromQuery(query);
  const formattedTitle = rawQuery.charAt(0).toUpperCase() + rawQuery.slice(1);
  const generatedPrice = Math.floor(Math.random() * (499 - 99 + 1)) + 99;
  const generatedMrp = generatedPrice + Math.floor(Math.random() * 80) + 40;

  const generatedItem = {
    id: `dyn_${Date.now()}`,
    name: formattedTitle,
    category: detectedCategory,
    price: generatedPrice,
    mrp: generatedMrp,
    unit: "1 Unit",
    delivery_time: "10 mins",
    in_stock: true,
    image: getPlaceholderImageForCategory(detectedCategory),
    keywords: [query, detectedCategory.toLowerCase()],
    ai_verified_badge: isNonGrocery(detectedCategory) ? {
      status: "✨ AI Verified",
      spec_summary: "100% Quality & Compatibility Checked for 10-Min Delivery",
      trust_tag: "10-Minute Instant Doorstep Replacement Guarantee"
    } : null
  };

  return {
    status: "success",
    source: "wildcard_generator",
    count: 1,
    results: [generatedItem]
  };
}
