import re
import os
import streamlit as st

st.set_page_config(
    page_title="Zepto — 10-Minute Grocery & Instant Delivery",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Remove default Streamlit top padding & margins so the app fits cleanly at the top
st.markdown("""
<style>
    .block-container {
        padding-top: 0rem !important;
        padding-bottom: 0rem !important;
        padding-left: 0rem !important;
        padding-right: 0rem !important;
    }
    header {visibility: hidden;}
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

def get_bundled_html():
    # File paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    index_path = os.path.join(base_dir, "index.html")
    css_path = os.path.join(base_dir, "src", "style.css")
    catalog_path = os.path.join(base_dir, "src", "catalog.js")
    catalog_json_path = os.path.join(base_dir, "src", "catalog.json")
    search_engine_path = os.path.join(base_dir, "src", "search_engine.js")
    cart_path = os.path.join(base_dir, "src", "cart.js")
    matcher_path = os.path.join(base_dir, "src", "ai_matcher.js")
    app_path = os.path.join(base_dir, "src", "app.js")

    # Read base index.html
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Read and embed style.css
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()
    html = html.replace('<link rel="stylesheet" href="./src/style.css">', f"<style>{css}</style>")

    # Read JS components & catalog json
    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog_js = f.read().replace("export ", "")

    with open(catalog_json_path, "r", encoding="utf-8") as f:
        catalog_seed_json = f.read()

    with open(search_engine_path, "r", encoding="utf-8") as f:
        search_engine_js = f.read().replace("export ", "")
        search_engine_js = re.sub(
            r'import\s+catalogSeed\s+from\s+["\'][^"\']+["\'](?:\s+assert\s+{[^}]+})?;?',
            'const catalogSeed = ' + catalog_seed_json + ';',
            search_engine_js
        )

    with open(cart_path, "r", encoding="utf-8") as f:
        cart_js = f.read().replace("export ", "")

    with open(matcher_path, "r", encoding="utf-8") as f:
        matcher_js = f.read().replace("export ", "")
        matcher_js = re.sub(r'import\s+{[^}]+}\s+from\s+["\'][^"\']+["\'];?', '', matcher_js)

    with open(app_path, "r", encoding="utf-8") as f:
        app_js = f.read()
        app_js = re.sub(r'import\s+{[^}]+}\s+from\s+["\'][^"\']+["\'];?', '', app_js)

    # Bundle all JS elements into a single execution block
    bundled_js = f"{catalog_js}\n{search_engine_js}\n{cart_js}\n{matcher_js}\n{app_js}"
    
    # Inject bundled scripts into index.html
    html = html.replace('<script type="module" src="./src/app.js"></script>', f'<script type="module">{bundled_js}</script>')
    
    return html

try:
    html_content = get_bundled_html()
    # Serve the iframe container natively with scrollbars enabled
    st.components.v1.html(html_content, height=860, scrolling=True)
except Exception as e:
    st.error(f"Error bundling project assets: {e}")
    st.info("Make sure index.html and src/ folder files are in the same directory.")
