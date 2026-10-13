import os
import json

base_dir = '/Users/engadi/GitHub/precept_web/scraped_pdfs'
categories = {
    '40_minutes': 'Série 40 Minutes (Extraits Semaine 1)',
    'seigneur': 'Série Seigneur (Extraits & Guides)',
    'enfants_dd': 'Enfants & Ados - D&D Découvre & Déterre (Extraits)',
    'etudes_inductives_pup': 'Précepte sur Précepte (PUP) & Études Inductives',
    'etudes_eclair_exploratoires': 'Études Éclair & Études Exploratoires',
    'brochures_outils': 'Brochures, Signets & Outils Méthodologiques',
}

manifest = []
total_files = 0
total_bytes = 0

for cat_folder, cat_name in categories.items():
    folder_path = os.path.join(base_dir, cat_folder)
    if not os.path.isdir(folder_path):
        continue
    for fname in sorted(os.listdir(folder_path)):
        if fname.endswith('.pdf'):
            fpath = os.path.join(folder_path, fname)
            size = os.path.getsize(fpath)
            total_files += 1
            total_bytes += size
            manifest.append({
                'category': cat_folder,
                'category_name': cat_name,
                'filename': fname,
                'file_size': size,
                'file_size_formatted': f'{size / (1024*1024):.2f} Mo' if size > 1024*1024 else f'{size / 1024:.1f} Ko',
                'local_path': fpath,
            })

with open(os.path.join(base_dir, 'manifest.json'), 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

readme_content = f"""# Catalogue des PDFs Précepte Téléchargés

Fichiers scrapés et archivés depuis la boutique canadienne `https://precepte.ca/boutique/`.

- **Total fichiers PDF disponibles** : {total_files}
- **Poids total** : {total_bytes / (1024*1024):.2f} Mo
- **Emplacement local** : `scraped_pdfs/`

---
"""

for cat_folder, cat_name in categories.items():
    items = [m for m in manifest if m['category'] == cat_folder]
    if not items:
        continue
    readme_content += f"\n## {cat_name} ({len(items)} fichiers)\n\n"
    readme_content += "| Fichier | Taille | Dossier |\n"
    readme_content += "| :--- | :--- | :--- |\n"
    for it in items:
        readme_content += f"| `{it['filename']}` | {it['file_size_formatted']} | `{cat_folder}` |\n"

with open(os.path.join(base_dir, 'README.md'), 'w', encoding='utf-8') as f:
    f.write(readme_content)

print(f"Catalogue mis à jour avec {total_files} fichiers ({total_bytes / (1024*1024):.2f} Mo).")
