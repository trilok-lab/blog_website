# theming/utils.py
import json
import os
from django.conf import settings

THEMES_DIR = os.path.join(settings.BASE_DIR, "theming", "themes")

def get_available_themes():
    """Return a list of available theme names (files without extension)."""
    return [f.replace(".json", "") for f in os.listdir(THEMES_DIR) if f.endswith(".json")]

def load_theme(theme_name):
    """Load theme JSON by name."""
    path = os.path.join(THEMES_DIR, f"{theme_name}.json")
    if not os.path.exists(path):
        return None
    with open(path, "r") as f:
        return json.load(f)
