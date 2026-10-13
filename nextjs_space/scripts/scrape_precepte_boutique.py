#!/usr/bin/env python3
"""
Scraper for PDF files on https://precepte.ca/boutique/
Uses Wayback Machine snapshot to reliably download all sample lessons,
studies, and brochures even when the live site is protected by Cloudflare.
"""

import os
import re
import sys
import time
import json
import urllib.request
import urllib.error

OUTPUT_BASE_DIR = "/Users/engadi/GitHub/precept_web/scraped_pdfs"

# Mapping and classification of the 57 boutique PDFs + relevant extras
BOUTIQUE_PDFS = [
    # --- Série 40 Minutes ---
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Mariage-Semaine-1.pdf",
        "title": "Bâtir un mariage qui fructifie vraiment (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2024/01/Mariage-Semaine-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Choix-Semaine-1.pdf",
        "title": "Comment faire des choix que vous ne regretterez pas (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Choix-Semaine-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Pere-Semaine-1.pdf",
        "title": "Comment savoir que Dieu est votre Père ? (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Pere-Semaine-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Enflammez-Semaine-1.pdf",
        "title": "Enflammez votre passion pour Dieu (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Enflammez-Semaine-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Relation-Semaine-1.pdf",
        "title": "Entretenir une relation réelle avec Dieu (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Relation-Semaine-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Disciple-Semaine-1.pdf",
        "title": "Être un disciple : ce qu'il en coûte vraiment (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Disciple-Semaine-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Toucher-Semaine-1.pdf",
        "title": "Jésus : faire l'expérience de son toucher (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Toucher-Semaine-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Voix-Semaine-1.pdf",
        "title": "Jésus : à l'écoute de sa voix (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Voix-Semaine-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Resurrection-Semaine-1.pdf",
        "title": "Jésus : comprendre sa mort et sa résurrection (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Resurrection-Semaine-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Ciel-Semaine-1.pdf",
        "title": "Le ciel, l'enfer et la vie après la mort (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Ciel-Semaine-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Libere-de-lemprise-de-la-peur-1.pdf",
        "title": "Libéré de l'emprise de la peur (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2025/04/Libere-de-lemprise-de-la-peur-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Adoration-Semaine-1.pdf",
        "title": "Mener une vie d'adoration authentique (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/04/Adoration-Semaine-1.pdf",
    },
    {
        "series": "40_minutes",
        "category_fr": "Série 40 Minutes",
        "filename": "Pardonner-Semaine-1.pdf",
        "title": "Pardonner : briser l'emprise du passé (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Pardonner-Semaine-1.pdf",
    },

    # --- Série Seigneur ---
    {
        "series": "seigneur",
        "category_fr": "Série Seigneur",
        "filename": "Dieu-Es-tu-la-Semaine-1.pdf",
        "title": "Dieu es-tu là? T'intéresses-tu à moi? Me connais-tu? (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Dieu-Es-tu-la-Semaine-1.pdf",
    },
    {
        "series": "seigneur",
        "category_fr": "Série Seigneur",
        "filename": "Seigneur-Enseigne-Jour-1-4.pdf",
        "title": "Seigneur, enseigne-moi à étudier la Bible (Jours 1 à 4)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Seigneur-Enseigne-Jour-1-4.pdf",
    },
    {
        "series": "seigneur",
        "category_fr": "Série Seigneur",
        "filename": "Seigneur-enseigne-moi-prier-jour-1-et-2.pdf",
        "title": "Seigneur, enseigne-moi à prier (Jours 1 et 2)",
        "url": "https://www.precepte.ca/wp-content/uploads/2025/04/Seigneur-enseigne-moi-prier-jour-1-et-2.pdf",
    },
    {
        "series": "seigneur",
        "category_fr": "Série Seigneur",
        "filename": "Reponses-Jour-1-4.pdf",
        "title": "Seigneur, j'ai besoin de réponses (Jours 1 à 4)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Reponses-Jour-1-4.pdf",
    },
    {
        "series": "seigneur",
        "category_fr": "Série Seigneur",
        "filename": "Seigneur-je-veux-te-connaiitre-chapitre-1.pdf",
        "title": "Seigneur, je veux te connaître (Chapitre 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/06/Seigneur-je-veux-te-connaiitre-chapitre-1.pdf",
    },

    # --- Série Enfants (D&D / Explorateurs) ---
    {
        "series": "enfants_dd",
        "category_fr": "Enfants & Ados (D&D / Explorateurs)",
        "filename": "Creation-semaine-1-et-plus-3.pdf",
        "title": "L'extraordinaire création de Dieu - Genèse 1 et 2 (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Creation-semaine-1-et-plus-3.pdf",
    },
    {
        "series": "enfants_dd",
        "category_fr": "Enfants & Ados (D&D / Explorateurs)",
        "filename": "Deterrons-semaine-1.pdf",
        "title": "Déterrons le passé - Genèse 3 à 11 (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/06/Deterrons-semaine-1.pdf",
    },
    {
        "series": "enfants_dd",
        "category_fr": "Enfants & Ados (D&D / Explorateurs)",
        "filename": "Abraham-Jour-1-3.pdf",
        "title": "Abraham le vaillant explorateur de Dieu - Genèse 11 à 25 (Jours 1 à 3)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Abraham-Jour-1-3.pdf",
    },
    {
        "series": "enfants_dd",
        "category_fr": "Enfants & Ados (D&D / Explorateurs)",
        "filename": "Jesus-sous-les-refleteurs-semaine-1.pdf",
        "title": "Jésus sous les réflecteurs - Jean 1 à 10 (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Jesus-sous-les-refleteurs-semaine-1.pdf",
    },
    {
        "series": "enfants_dd",
        "category_fr": "Enfants & Ados (D&D / Explorateurs)",
        "filename": "Semaine-1-Jesus-puissance-incroyable-11-24.pdf",
        "title": "Jésus - puissance incroyable, amour incroyable - Jean 11 à 16 (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2024/11/Semaine-1-Jesus-puissance-incroyable-11-24.pdf",
    },
    {
        "series": "enfants_dd",
        "category_fr": "Enfants & Ados (D&D / Explorateurs)",
        "filename": "Jesus-vers-lEternite-Jean-17-21-semaine-1.pdf",
        "title": "Jésus - vers l'éternité et au-delà - Jean 17 à 21 (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2024/03/Jesus-vers-lEternite-Jean-17-21-semaine-1.pdf",
    },

    # --- Série PUP & Études Inductives ---
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Genese-Semaine-1-Enseigne-moi-tes-voies.pdf",
        "title": "Enseigne-moi tes voies - Genèse, Exode, Lévitique, Nombres, Deutéronome (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Genese-Semaine-1-Enseigne-moi-tes-voies.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Josue-Semaine-1.pdf",
        "title": "Choisir la victoire - Triompher de la défaite - Josué, Juges, Ruth (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/04/Josue-Semaine-1.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Lappel-a-suivre-Jesus-Luc-semaine-1.pdf",
        "title": "L'appel à suivre Jésus - Luc (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Lappel-a-suivre-Jesus-Luc-semaine-1.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Enfin-libere-Gal-Semaine-1.pdf",
        "title": "Enfin libéré de l'esclavage ! - Galates, Éphésiens (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2024/05/Enfin-libere-Gal-Semaine-1.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Semaine-1-Hebreux.pdf",
        "title": "La clé pour vivre par la Foi - Hébreux (Semaine 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2025/01/Semaine-1-Hebreux.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Tite-lecon-1.pdf",
        "title": "Tite (Leçon 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/07/Tite-lecon-1.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Esra-Aggee-Lecon-1.pdf",
        "title": "Esdras et Aggée (Leçon 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/03/Esra-Aggee-Lecon-1.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Alliance-Lecon-1-11-24.pdf",
        "title": "L'Alliance (Leçon 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2024/11/Alliance-Lecon-1-11-24.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Romains-partie1-Lecon-1-1.pdf",
        "title": "Romains partie 1 - chapitres 1 à 5 (Leçon 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/07/Romains-partie1-Lecon-1-1.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Romains-P2-lecon-1-1.pdf",
        "title": "Romains partie 2 - chapitres 6 à 8 (Leçon 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/07/Romains-P2-lecon-1-1.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Romans-Pt3-Lecon-1.pdf",
        "title": "Romains partie 3 - chapitres 9 à 11 (Leçon 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2024/05/Romans-Pt3-Lecon-1.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "Romains-Pt4-Lecon-1.pdf",
        "title": "Romains partie 4 - chapitres 12 à 16 (Leçon 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2025/03/Romains-Pt4-Lecon-1.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "2-Timothee-Lecon-1.pdf",
        "title": "2 Timothée (Leçon 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2024/03/2-Timothee-Lecon-1.pdf",
    },
    {
        "series": "etudes_inductives_pup",
        "category_fr": "Précepte sur Précepte (PUP) & Études Inductives",
        "filename": "1-Thessaloniciens-Lecon-1.pdf",
        "title": "1 Thessaloniciens (Leçon 1)",
        "url": "https://www.precepte.ca/wp-content/uploads/2025/02/1-Thessaloniciens-Lecon-1.pdf",
    },

    # --- Études Éclair & Études Exploratoires ---
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "Un-meilleur-sacrifice-Etude-exploratoire-PR-3-25.pdf",
        "title": "Un meilleur sacrifice (Hébreux 10.5-10) - Étude exploratoire",
        "url": "https://www.precepte.ca/wp-content/uploads/2025/04/Un-meilleur-sacrifice-Etude-exploratoire-PR-3-25.pdf",
    },
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "Crier-a-Dieu-Etude-exploratoire-PR-4-25.pdf",
        "title": "Crier à Dieu (Psaume 102.2-6 et 19-23) - Étude exploratoire",
        "url": "https://www.precepte.ca/wp-content/uploads/2025/04/Crier-a-Dieu-Etude-exploratoire-PR-4-25.pdf",
    },
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "Briser-lempriseHeb-12v1-3.pdf",
        "title": "Briser l'emprise du passé (Hébreux 12.1-3) - Étude Éclair",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/06/Briser-lempriseHeb-12v1-3.pdf",
    },
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "Verite-sur-Dieu-Jean1v1-18.pdf",
        "title": "Comment puis-je savoir la vérité sur Dieu ? (Jean 1.1-18) - Étude Éclair",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/06/Verite-sur-Dieu-Jean1v1-18.pdf",
    },
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "Etude-Eclair-Remporter-le-prix.pdf",
        "title": "Courir pour remporter le prix - Étude Éclair",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/01/Etude-Eclair-Remporter-le-prix.pdf",
    },
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "Dieu-est-amour-1Jn4v7-21.pdf",
        "title": "Dieu est amour (1 Jean 4.7-21) - Étude Éclair",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/06/Dieu-est-amour-1Jn4v7-21.pdf",
    },
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "Psalm-19-LS.pdf",
        "title": "Dieu parle ! (Psaume 19) - Étude Éclair",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/06/Psalm-19-LS.pdf",
    },
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "Enflammez-Psaume-23.pdf",
        "title": "Enflammez (Psaume 23) - Étude Éclair",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/06/Enflammez-Psaume-23.pdf",
    },
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "En-securite-et-protege-Ps-91.pdf",
        "title": "En sécurité et protégé (Psaume 91) - Étude Éclair",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/06/En-securite-et-protege-Ps-91.pdf",
    },
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "Etude-Eclair-La-vraie-richesse.pdf",
        "title": "La vraie richesse (Éphésiens 1.3-14) - Étude Éclair",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/01/Etude-Eclair-La-vraie-richesse.pdf",
    },
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "Philippiens-4v4-9.pdf",
        "title": "Philippiens 4.4-9 - Étude Éclair",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/06/Philippiens-4v4-9.pdf",
    },
    {
        "series": "etudes_eclair_exploratoires",
        "category_fr": "Études Éclair & Études Exploratoires",
        "filename": "Etude-Eclair-Qui-est-Jesus.pdf",
        "title": "Qui est Jésus ? - Étude Éclair",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/01/Etude-Eclair-Qui-est-Jesus.pdf",
    },

    # --- Brochures, Signets & Outils ---
    {
        "series": "brochures_outils",
        "category_fr": "Brochures, Signets & Outils",
        "filename": "Depliant-PR-livres-3-24.pdf",
        "title": "Les livres disponibles en français (Catalogue)",
        "url": "https://www.precepte.ca/wp-content/uploads/2025/02/Depliant-PR-livres-3-24.pdf",
    },
    {
        "series": "brochures_outils",
        "category_fr": "Brochures, Signets & Outils",
        "filename": "Depliant-PR-2-25.pdf",
        "title": "Le dépliant Précepte",
        "url": "https://www.precepte.ca/wp-content/uploads/2025/02/Depliant-PR-2-25.pdf",
    },
    {
        "series": "brochures_outils",
        "category_fr": "Brochures, Signets & Outils",
        "filename": "Methode-Precepte-2-25.pdf",
        "title": "La méthode Précepte (Feuille de synthèse)",
        "url": "https://www.precepte.ca/wp-content/uploads/2025/02/Methode-Precepte-2-25.pdf",
    },
    {
        "series": "brochures_outils",
        "category_fr": "Brochures, Signets & Outils",
        "filename": "MPEB-La-methode-Precepte-detude-biblique-9-23.pdf",
        "title": "La méthode Précepte d'étude biblique (Brochure complète)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/09/MPEB-La-methode-Precepte-detude-biblique-9-23.pdf",
    },
    {
        "series": "brochures_outils",
        "category_fr": "Brochures, Signets & Outils",
        "filename": "2023-Bookmark-OIA.pdf",
        "title": "Signet O-I-A (Observation - Interprétation - Application)",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/07/2023-Bookmark-OIA.pdf",
    },
    {
        "series": "brochures_outils",
        "category_fr": "Brochures, Signets & Outils",
        "filename": "Choisir-letude-ideale-9-24.pdf",
        "title": "Choisir l'étude idéale (Guide d'orientation)",
        "url": "https://www.precepte.ca/wp-content/uploads/2024/09/Choisir-letude-ideale-9-24.pdf",
    },
    {
        "series": "brochures_outils",
        "category_fr": "Brochures, Signets & Outils",
        "filename": "Signet-mots-cles-11-23.pdf",
        "title": "Signet de mots clés pour l'étude inductive",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/11/Signet-mots-cles-11-23.pdf",
    },
    {
        "series": "brochures_outils",
        "category_fr": "Brochures, Signets & Outils",
        "filename": "Les-origines-des-Ministeres-Precepte-11-23-1.pdf",
        "title": "Les origines des Ministères Précepte",
        "url": "https://www.precepte.ca/wp-content/uploads/2023/11/Les-origines-des-Ministeres-Precepte-11-23-1.pdf",
    },
]

EXISTING_LOCAL_FALLBACKS = {
    "Depliant-PR-2-25.pdf": "/Users/engadi/GitHub/precept_web/Depliant-PR-12-25.pdf",
    "Signet-mots-cles-11-23.pdf": "/Users/engadi/GitHub/precept_web/Signet-de-mots-cles.pdf",
}

def download_file(url: str, dest_path: str, retries: int = 3) -> bool:
    """Download a file with redirect follow and retry logic."""
    wayback_url = f"https://web.archive.org/web/2025id_/{url}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(wayback_url, headers=headers)
            with urllib.request.urlopen(req, timeout=35) as resp:
                data = resp.read()
                # Verify that it is a valid PDF
                if not data.startswith(b"%PDF"):
                    print(f"      [WARN] File does not start with %PDF: starts with {data[:20]}")
                    return False
                with open(dest_path, "wb") as f_out:
                    f_out.write(data)
                return True
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return False
            time.sleep(2 * attempt)
        except Exception as e:
            time.sleep(2 * attempt)
    return False

def main():
    print("=" * 60)
    print("  SCRAPER PDF - BOUTIQUE PRECEPTE.CA")
    print("=" * 60)
    print(f"Destination: {OUTPUT_BASE_DIR}\n")

    os.makedirs(OUTPUT_BASE_DIR, exist_ok=True)
    manifest = []
    success_count = 0
    fallback_count = 0
    fail_count = 0

    for i, item in enumerate(BOUTIQUE_PDFS, 1):
        series_dir = os.path.join(OUTPUT_BASE_DIR, item["series"])
        os.makedirs(series_dir, exist_ok=True)
        dest_file = os.path.join(series_dir, item["filename"])

        print(f"[{i:02d}/{len(BOUTIQUE_PDFS)}] {item['filename']} ...", end=" ", flush=True)

        # Check if already downloaded and valid
        if os.path.exists(dest_file) and os.path.getsize(dest_file) > 1000:
            with open(dest_file, "rb") as check_f:
                if check_f.read(4) == b"%PDF":
                    size = os.path.getsize(dest_file)
                    print(f"ALREADY EXISTS ({size:,} octets)")
                    manifest.append({
                        **item,
                        "local_path": dest_file,
                        "file_size": size,
                        "status": "EXISTING"
                    })
                    success_count += 1
                    continue

        # Attempt download
        ok = download_file(item["url"], dest_file)
        if ok:
            size = os.path.getsize(dest_file)
            print(f"OK ({size:,} octets)")
            manifest.append({
                **item,
                "local_path": dest_file,
                "file_size": size,
                "status": "DOWNLOADED"
            })
            success_count += 1
        else:
            # Check if we have a local fallback from the parent repo
            fb_path = EXISTING_LOCAL_FALLBACKS.get(item["filename"])
            if fb_path and os.path.exists(fb_path):
                import shutil
                shutil.copy2(fb_path, dest_file)
                size = os.path.getsize(dest_file)
                print(f"LOCAL FALLBACK ({size:,} octets)")
                manifest.append({
                    **item,
                    "local_path": dest_file,
                    "file_size": size,
                    "status": "LOCAL_FALLBACK"
                })
                fallback_count += 1
            else:
                print("FAILED / NOT ARCHIVED")
                manifest.append({
                    **item,
                    "local_path": None,
                    "file_size": 0,
                    "status": "FAILED"
                })
                fail_count += 1

        # Gentle delay to avoid archive.org rate limit
        time.sleep(0.4)

    # Save manifest.json
    manifest_path = os.path.join(OUTPUT_BASE_DIR, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f_m:
        json.dump(manifest, f_m, ensure_ascii=False, indent=2)

    # Save README.md catalog
    readme_path = os.path.join(OUTPUT_BASE_DIR, "README.md")
    with open(readme_path, "w", encoding="utf-8") as f_r:
        f_r.write("# Catalogue des PDFs Précepte (Extraits & Études)\n\n")
        f_r.write(f"Scrapé depuis `https://precepte.ca/boutique/` le {time.strftime('%Y-%m-%d %H:%M:%S')}.\n\n")
        f_r.write(f"- **Total fichiers** : {len(BOUTIQUE_PDFS)}\n")
        f_r.write(f"- **Téléchargés avec succès** : {success_count}\n")
        f_r.write(f"- **Copies locales de secours** : {fallback_count}\n")
        f_r.write(f"- **Échecs** : {fail_count}\n\n")

        # Group by series
        current_series = None
        for item in sorted(manifest, key=lambda x: (x["series"], x["filename"])):
            if item["series"] != current_series:
                current_series = item["series"]
                f_r.write(f"\n## {item['category_fr']}\n\n")
                f_r.write("| Fichier | Titre / Description | Taille | Statut |\n")
                f_r.write("| :--- | :--- | :--- | :--- |\n")
            size_kb = f"{item['file_size'] / 1024:.1f} Ko" if item["file_size"] else "-"
            f_r.write(f"| `{item['filename']}` | {item['title']} | {size_kb} | {item['status']} |\n")

    print("\n" + "=" * 60)
    print(f"Terminé ! Téléchargés: {success_count}, Fallback: {fallback_count}, Échecs: {fail_count}")
    print(f"Manifest sauvegardé : {manifest_path}")
    print(f"Catalogue Markdown sauvegardé : {readme_path}")
    print("=" * 60)

if __name__ == "__main__":
    main()
