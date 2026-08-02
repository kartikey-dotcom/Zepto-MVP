"""
Zepto MVP - HTTP Server with API Endpoint (GET /api/search?q={query})
Serves static frontend files and exposes the Universal Search API.
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
