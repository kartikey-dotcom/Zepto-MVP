"""
Zepto MVP - HTTP Server with API Endpoints
Serves static frontend files and exposes:
- GET /api/search?q={query}
- GET /api/recommendation
"""

import os
import json
import random
import time
import urllib.parse
from http.server import SimpleHTTPRequestHandler, HTTPServer

# Load Seed Dataset (300 SKUs)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CATALOG_PATH = os.path.join(BASE_DIR, "src", "catalog.json")

try:
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        CATALOG_SEED = json.load(f)
except Exception as e:
    CATALOG_SEED = []

CATEGORY_EMOJIS = {
    "Fresh & Daily Staples": "🥬",
    "Packaged Foods & Snacks": "🍿",
    "Personal Care & Beauty": "🧴",
    "Electronics & Accessories": "🔌",
    "Home & Kitchen Utilities": "🧹",
    "Hygiene & Baby Care": "👶",
    "Pet Supplies & Wellness": "🐶"
}

NON_GROCERY_CATEGORIES = {
    "Electronics & Accessories",
    "Personal Care & Beauty",
    "Home & Kitchen Utilities",
    "Hygiene & Baby Care",
    "Pet Supplies & Wellness"
}

def infer_category(query):
    q = query.lower()
    if any(k in q for k in ["charger", "adapter", "cable", "usb", "mouse", "keyboard", "powerbank", "earbuds", "headphones", "watch", "battery", "tech", "phone", "laptop", "router", "speaker"]):
        return "Electronics & Accessories"
    if any(k in q for k in ["sunscreen", "cleanser", "lipstick", "cream", "serum", "shampoo", "conditioner", "face wash", "makeup", "perfume", "deo", "soap", "moisturizer", "lotion", "beauty", "skincare"]):
        return "Personal Care & Beauty"
    if any(k in q for k in ["kneader", "mat", "pan", "kettle", "cleaner", "detergent", "mop", "broom", "wiper", "cooker", "container", "bottle", "tiffin", "garbage", "trash", "harpic", "lizol", "kitchen", "home"]):
        return "Home & Kitchen Utilities"
    if any(k in q for k in ["diaper", "baby", "wipes", "sanitizer", "handwash", "lotion", "powder", "infant", "child", "hygiene"]):
        return "Hygiene & Baby Care"
    if any(k in q for k in ["dog", "cat", "pet", "whiskas", "pedigree", "drools", "litter", "chew", "bone", "fish food"]):
        return "Pet Supplies & Wellness"
    if any(k in q for k in ["doritos", "chips", "lays", "maggi", "coke", "sprite", "chocolate", "biscuit", "cookie", "red bull", "coffee", "tea", "juice", "snack", "nutella"]):
        return "Packaged Foods & Snacks"
    return "Fresh & Daily Staples"

class ZeptoAPIRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # Handle /api/recommendation
        if parsed_url.path == "/api/recommendation":
            self.send_json_response({
                "status": "success",
                "recommendation": {
                    "id": "rec_tech_101",
                    "product_name": "PowerPulse 25W Super Fast Adapter",
                    "category": "Electronics",
                    "price": 899,
                    "mrp": 1299,
                    "contextual_bridge": "✅ 100% Verified for your device — 25W PD Fast Charging with Overheating Protection.",
                    "trust_shield": {
                        "spec_summary": "25W PD Output | USB Type-C Port | Surge & Overheat Protection",
                        "dark_store_status": "Verified in Stock at Dark Store #204",
                        "return_policy_title": "10-Minute Doorstep Replacement Guarantee",
                        "return_policy_summary": "No hassle returns. If defective or incompatible, rider swaps it instantly at your doorstep."
                    }
                }
            })
            return

        # Handle /api/search?q={query}
        if parsed_url.path == "/api/search":
            query_params = urllib.parse.parse_qs(parsed_url.query)
            query = query_params.get("q", [""])[0].strip()
            
            if not query:
                self.send_json_response({"status": "success", "source": "none", "results": []})
                return

            q_lower = query.lower()
            
            # 1. Tier 1: Search Seed Dataset (300 SKUs)
            matches = [
                item for item in CATALOG_SEED
                if q_lower in item["name"].lower() or
                   q_lower in item["category"].lower() or
                   any(q_lower in k.lower() for k in item.get("keywords", []))
            ]

            if matches:
                self.send_json_response({
                    "status": "success",
                    "source": "seed_catalog",
                    "count": len(matches),
                    "results": matches
                })
                return

            # 2. Tier 2: Wildcard Fallback Generator
            detected_category = infer_category(query)
            title = query.capitalize()
            price = random.randint(99, 499)
            
            is_non_grocery = detected_category in NON_GROCERY_CATEGORIES
            
            generated_item = {
                "id": f"dyn_{int(time.time() * 1000)}",
                "name": title,
                "category": detected_category,
                "price": price,
                "delivery_time": "10 mins",
                "in_stock": True,
                "image_url": CATEGORY_EMOJIS.get(detected_category, "📦"),
                "ai_verified_badge": {
                    "status": "✨ AI Verified",
                    "spec_summary": "100% Quality & Compatibility Checked for 10-Min Delivery",
                    "trust_tag": "10-Minute Instant Doorstep Replacement Guarantee"
                } if is_non_grocery else None
            }

            self.send_json_response({
                "status": "success",
                "source": "wildcard_generator",
                "count": 1,
                "results": [generated_item]
            })
            return

        # Serve static files for all other paths
        super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        if parsed_url.path == "/api/cart/evaluate":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                body = json.loads(post_data.decode('utf-8'))
            except Exception:
                body = {}

            user_segment = body.get("userSegment", "stalled_non_grocery_shopper")
            cart_items = body.get("cartItems", [])

            # Guardrail: Only evaluate for Stalled Shoppers
            if user_segment != "stalled_non_grocery_shopper" or not cart_items:
                self.send_json_response({"recommendation_required": False, "recommendation": None})
                return

            has_grocery = any(item.get("category") in ["Grocery", "Fresh & Daily Staples", "Packaged Foods & Snacks"] or str(item.get("id")).startswith("g") for item in cart_items)
            non_grocery_item = next((item for item in cart_items if item.get("category") not in ["Grocery", "Fresh & Daily Staples", "Packaged Foods & Snacks"] and not str(item.get("id")).startswith("g")), None)

            # MULTI-CATEGORY CASE (Option B)
            if has_grocery and non_grocery_item:
                ng_name = str(non_grocery_item.get("name", "")).lower()
                ng_id = str(non_grocery_item.get("id", ""))

                if "adapter" in ng_name or "charger" in ng_name:
                    self.send_json_response({
                        "recommendation_required": True,
                        "recommendation": {
                            "id": "rec_cable_100w",
                            "product_name": "Mi Braided 100W USB-C to USB-C Tough Cable (1.5m)",
                            "price": 199,
                            "mrp": 399,
                            "contextual_bridge": f"🔌 Pair with your {non_grocery_item.get('name')}: 100W Fast Charging & 5A current support",
                            "trust_badges": [
                                "🛡️ 10-Min Doorstep Swap",
                                "✅ 100% Brand Authentic"
                            ],
                            "trust_shield": {
                                "spec_summary": "100W PD Output | E-Marker Chip | 5A Current | 1.5m Kevlar Braided",
                                "return_policy_title": "10-Minute Instant Doorstep Replacement Guarantee"
                            }
                        }
                    })
                    return
                elif "kneader" in ng_name or "hku_001" in ng_id:
                    self.send_json_response({
                        "recommendation_required": True,
                        "recommendation": {
                            "id": "rec_mat_001",
                            "product_name": "Silicone Non-Stick Dough & Roti Kneading Mat",
                            "price": 199,
                            "mrp": 399,
                            "contextual_bridge": f"Pair with your {non_grocery_item.get('name')}: Keep countertops clean & dough fresh!",
                            "trust_badges": [
                                "🛡️ 10-Min Doorstep Swap",
                                "✅ 100% Brand Authentic"
                            ],
                            "trust_shield": {
                                "spec_summary": "Food Grade Silicone | Non-Slip Surface | Easy Wash",
                                "return_policy_title": "10-Minute Instant Doorstep Replacement Guarantee"
                            }
                        }
                    })
                    return
                elif "cable" in ng_name or "usb" in ng_name or "ng_tech_2" in ng_id:
                    self.send_json_response({
                        "recommendation_required": True,
                        "recommendation": {
                            "id": "rec_tech_101",
                            "product_name": "PowerPulse 20W Fast Wall Adapter",
                            "price": 399,
                            "mrp": 699,
                            "contextual_bridge": f"Pair with your {non_grocery_item.get('name')}: Pair with a 20W adapter for maximum charging speed",
                            "trust_badges": [
                                "🛡️ 10-Min Doorstep Swap",
                                "✅ 100% Brand Authentic"
                            ],
                            "trust_shield": {
                                "spec_summary": "20W PD Output | Type-C Port | Surge Protection",
                                "return_policy_title": "10-Minute Instant Doorstep Replacement Guarantee"
                            }
                        }
                    })
                    return
                else:
                    # SILENT COLLAPSE: Goal achieved, no direct companion found
                    self.send_json_response({"recommendation_required": False, "recommendation": None})
                    return

            # Single-Category Grocery Cart Fallback
            self.send_json_response({
                "recommendation_required": True,
                "recommendation": {
                    "id": "rec_tech_101",
                    "product_name": "PowerPulse 25W Super Fast Adapter",
                    "price": 899,
                    "mrp": 1499,
                    "contextual_bridge": "✅ 100% Verified for your device — 25W PD Fast Charging with Overheating Protection.",
                    "trust_badges": [
                        "🛡️ 10-Min Doorstep Swap",
                        "✅ 100% Brand Authentic"
                    ],
                    "trust_shield": {
                        "spec_summary": "25W PD Output | USB Type-C Port | Surge & Overheat Protection",
                        "return_policy_title": "10-Minute Instant Doorstep Replacement Guarantee"
                    }
                }
            })}
                }
            })
            return

    def send_json_response(self, data, status_code=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

def run(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, ZeptoAPIRequestHandler)
    print(f"Zepto MVP HTTP & API Server running on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
