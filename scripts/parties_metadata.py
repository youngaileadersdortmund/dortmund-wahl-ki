import os
import json
import re
from collections import OrderedDict

BASE_DIR = os.path.join("..", "contents", "2025")

JSON_PATH = os.path.join("..", "src", "frontend", "public", "parties_metadata.json")

PROMPT_FILES = {
    "prompt_de.txt": "de",
    "prompt.txt": "en",  
}

SPLIT_RE = re.compile(r'[,;\n\r]+')


def parse_points(text):
    items = []
    for raw in SPLIT_RE.split(text):
        s = raw.strip()
        if s:
            items.append(s)
    return items


def load_json(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    return {"program": {}, "kommu": {}}


def ensure_party_container(data, container, party_slug):
    if party_slug not in data[container]:
        data[container][party_slug] = {
            "name": party_slug.upper(),
            "de": {"visual_impact_points": []} if container == "kommu" else {"visual_points": []},
            "en": {"visual_impact_points": []} if container == "kommu" else {"visual_points": []},
        }
    else:
        # ensure keys exist (backward compatibility)
        if "name" not in data[container][party_slug]:
            data[container][party_slug]["name"] = party_slug.upper()
        # ensure language and point lists exist
        for lang in ("de", "en"):
            if lang not in data[container][party_slug]:
                data[container][party_slug][lang] = {}
            key_name = "visual_impact_points" if container == "kommu" else "visual_points"
            if key_name not in data[container][party_slug][lang]:
                data[container][party_slug][lang][key_name] = []


def add_points_to_data(data, container, party_slug, lang, points):
    key_name = "visual_impact_points" if container == "kommu" else "visual_points"
    ensure_party_container(data, container, party_slug)
    existing = data[container][party_slug][lang].get(key_name, [])

    existing_norm = {e.strip().lower() for e in existing}
    for p in points:
        if p.strip().lower() not in existing_norm:
            existing.append(p.strip())
            existing_norm.add(p.strip().lower())
    data[container][party_slug][lang][key_name] = existing


def find_party_slug_from_path(file_path):
    parts = file_path.split(os.sep)
    if "2025" in parts:
        idx = parts.index("2025")
        if idx + 1 < len(parts):
            return parts[idx + 1]

    parent = os.path.dirname(os.path.dirname(file_path))
    return os.path.basename(parent)


def main():
    data = load_json(JSON_PATH)
    updated = False
    summary = []

    for root, dirs, files in os.walk(BASE_DIR):
        for fname in files:
            if fname in PROMPT_FILES:
                lang = PROMPT_FILES[fname]
                full_path = os.path.join(root, fname)
                try:
                    with open(full_path, "r", encoding="utf-8") as f:
                        raw = f.read()
                except Exception as e:
                    print(f"Failed to read {full_path}: {e}")
                    continue
                points = parse_points(raw)
                if not points:
                    continue

                # determine container and party slug
                results_folder = os.path.basename(os.path.dirname(full_path))
                party_slug = find_party_slug_from_path(full_path).lower()

                if results_folder.lower().endswith("_program") or "_program" in results_folder.lower():
                    container = "program"
                else:
                    container = "kommu"

                add_points_to_data(data, container, party_slug, lang, points)
                updated = True
                summary.append(
                    (full_path, container, party_slug, lang, points))

    if updated:
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(
            f"Updated {JSON_PATH} with points from {len(summary)} prompt files.")
        for s in summary:
            path, container, party, lang, pts = s
            print(
                f"- {path} -> {container}[{party}].{lang}  (+{len(pts)} points)")
    else:
        print("No points found or nothing to update.")


if __name__ == "__main__":
    main()
