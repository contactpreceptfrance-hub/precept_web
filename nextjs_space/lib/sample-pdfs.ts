/**
 * Single source of truth for Precept France PDFs (sample lessons, Études Éclair,
 * and methodological brochures) located in /public/pdfs/.
 *
 * Safe to import from both Server and Client Components (no Node fs/blob imports).
 */

export interface AvailablePdfFile {
  title: string
  url: string
  filename: string
  /** Exact Product.name in the catalogue when this PDF is a book's sample excerpt */
  bookName?: string
}

export interface AvailablePdfGroup {
  category: string
  label: string
  files: AvailablePdfFile[]
}

export const AVAILABLE_PDF_GROUPS: AvailablePdfGroup[] = [
  {
    category: '40_minutes',
    label: 'Série 40 Minutes (Extraits Semaine 1)',
    files: [
      {
        title: 'Bâtir un mariage qui fructifie vraiment (Semaine 1)',
        bookName: 'Bâtir un mariage qui fructifie vraiment',
        url: '/pdfs/40_minutes/Mariage-Semaine-1.pdf',
        filename: 'Mariage-Semaine-1.pdf',
      },
      {
        title: 'Comment faire des choix que vous ne regretterez pas (Semaine 1)',
        bookName: 'Comment faire des choix que vous ne regretterez pas',
        url: '/pdfs/40_minutes/Choix-Semaine-1.pdf',
        filename: 'Choix-Semaine-1.pdf',
      },
      {
        title: 'Comment savoir que Dieu est votre Père ? (Semaine 1)',
        bookName: 'Comment savoir que Dieu est votre Père ?',
        url: '/pdfs/40_minutes/Pere-Semaine-1.pdf',
        filename: 'Pere-Semaine-1.pdf',
      },
      {
        title: 'Enflammez votre passion pour Dieu (Semaine 1)',
        bookName: 'Enflammez votre passion pour Dieu',
        url: '/pdfs/40_minutes/Enflammez-Semaine-1.pdf',
        filename: 'Enflammez-Semaine-1.pdf',
      },
      {
        title: 'Jésus : comprendre sa mort et sa résurrection (Semaine 1)',
        bookName: 'Jésus : comprendre sa mort et sa résurrection',
        url: '/pdfs/40_minutes/Resurrection-Semaine-1.pdf',
        filename: 'Resurrection-Semaine-1.pdf',
      },
      {
        title: "Jésus : faire l'expérience de son toucher (Semaine 1)",
        bookName: "Jésus : faire l'expérience de son toucher",
        url: '/pdfs/40_minutes/Toucher-Semaine-1.pdf',
        filename: 'Toucher-Semaine-1.pdf',
      },
      {
        title: "Jésus : à l'écoute de sa voix (Semaine 1)",
        bookName: "Jésus : à l'écoute de sa voix",
        url: '/pdfs/40_minutes/Voix-Semaine-1.pdf',
        filename: 'Voix-Semaine-1.pdf',
      },
      {
        title: "Le ciel, l'enfer et la vie après la mort (Semaine 1)",
        bookName: "Le ciel, l'enfer et la vie après la mort",
        url: '/pdfs/40_minutes/Ciel-Semaine-1.pdf',
        filename: 'Ciel-Semaine-1.pdf',
      },
      {
        title: "Pardonner : briser l'emprise du passé (Semaine 1)",
        bookName: "Pardonner : briser l'emprise du passé",
        url: '/pdfs/40_minutes/Pardonner-Semaine-1.pdf',
        filename: 'Pardonner-Semaine-1.pdf',
      },
    ],
  },
  {
    category: 'seigneur',
    label: 'Série Seigneur (Extraits & Leçons)',
    files: [
      {
        title: 'Dieu, es-tu là ? (Semaine 1)',
        bookName: 'Dieu, es-tu là ?',
        url: '/pdfs/seigneur/Dieu-Es-tu-la-Semaine-1.pdf',
        filename: 'Dieu-Es-tu-la-Semaine-1.pdf',
      },
      {
        title: "Seigneur, j'ai besoin de réponses (Jours 1 à 4)",
        bookName: "Seigneur, j'ai besoin de réponses",
        url: '/pdfs/seigneur/Reponses-Jour-1-4.pdf',
        filename: 'Reponses-Jour-1-4.pdf',
      },
      {
        title: 'Seigneur, enseigne-moi à étudier la Bible (Jours 1 à 4)',
        bookName: 'Seigneur, enseigne-moi à étudier la Bible',
        url: '/pdfs/seigneur/Seigneur-Enseigne-Jour-1-4.pdf',
        filename: 'Seigneur-Enseigne-Jour-1-4.pdf',
      },
      {
        title: 'Seigneur, enseigne-moi à prier (Jours 1 et 2)',
        bookName: 'Seigneur, enseigne-moi à prier',
        url: '/pdfs/seigneur/Seigneur-enseigne-moi-prier-jour-1-et-2.pdf',
        filename: 'Seigneur-enseigne-moi-prier-jour-1-et-2.pdf',
      },
      {
        title: 'Seigneur, je veux te connaître (Chapitre 1)',
        bookName: 'Seigneur, je veux te connaître',
        url: '/pdfs/seigneur/Seigneur-je-veux-te-connaiitre-chapitre-1.pdf',
        filename: 'Seigneur-je-veux-te-connaiitre-chapitre-1.pdf',
      },
    ],
  },
  {
    category: 'enfants_dd',
    label: 'Enfants & Ados — Découvre et Déterre (D&D)',
    files: [
      {
        title: "L'extraordinaire création de Dieu (Semaine 1)",
        bookName: "L'extraordinaire création de Dieu",
        url: '/pdfs/enfants_dd/Creation-semaine-1-et-plus-3.pdf',
        filename: 'Creation-semaine-1-et-plus-3.pdf',
      },
      {
        title: 'Déterrons le passé (Semaine 1)',
        bookName: 'Déterrons le passé',
        url: '/pdfs/enfants_dd/Deterrons-semaine-1.pdf',
        filename: 'Deterrons-semaine-1.pdf',
      },
      {
        title: 'Jésus sous les réflecteurs (Semaine 1)',
        bookName: 'Jésus sous les réflecteurs',
        url: '/pdfs/enfants_dd/Jesus-sous-les-refleteurs-semaine-1.pdf',
        filename: 'Jesus-sous-les-refleteurs-semaine-1.pdf',
      },
      {
        title: "Jésus, vers l'Éternité — Jean 17-21 (Semaine 1)",
        bookName: "Jésus, vers l'Éternité",
        url: '/pdfs/enfants_dd/Jesus-vers-lEternite-Jean-17-21-semaine-1.pdf',
        filename: 'Jesus-vers-lEternite-Jean-17-21-semaine-1.pdf',
      },
    ],
  },
  {
    category: 'etudes_inductives_pup',
    label: 'Études Inductives & PUP (Précepte sur Précepte)',
    files: [
      {
        title: '1 Thessaloniciens (Leçon 1)',
        bookName: '1 Thessaloniciens',
        url: '/pdfs/etudes_inductives_pup/1-Thessaloniciens-Lecon-1.pdf',
        filename: '1-Thessaloniciens-Lecon-1.pdf',
      },
      {
        title: '2 Timothée (Leçon 1)',
        bookName: '2 Timothée',
        url: '/pdfs/etudes_inductives_pup/2-Timothee-Lecon-1.pdf',
        filename: '2-Timothee-Lecon-1.pdf',
      },
      {
        title: 'Choisir la Victoire — Josué (Semaine 1)',
        bookName: 'Choisir la Victoire',
        url: '/pdfs/etudes_inductives_pup/Josue-Semaine-1.pdf',
        filename: 'Josue-Semaine-1.pdf',
      },
      {
        title: 'Enfin Libéré — Galates (Semaine 1)',
        bookName: 'Enfin Libéré',
        url: '/pdfs/etudes_inductives_pup/Enfin-libere-Gal-Semaine-1.pdf',
        filename: 'Enfin-libere-Gal-Semaine-1.pdf',
      },
      {
        title: 'Esdras et Aggée (Leçon 1)',
        bookName: 'Esdras et Aggée',
        url: '/pdfs/etudes_inductives_pup/Esra-Aggee-Lecon-1.pdf',
        filename: 'Esra-Aggee-Lecon-1.pdf',
      },
      {
        title: "L'appel à suivre Jésus — Luc (Semaine 1)",
        bookName: "L'appel à suivre Jésus",
        url: '/pdfs/etudes_inductives_pup/Lappel-a-suivre-Jesus-Luc-semaine-1.pdf',
        filename: 'Lappel-a-suivre-Jesus-Luc-semaine-1.pdf',
      },
      {
        title: 'La clé pour vivre par la Foi — Hébreux (Semaine 1)',
        bookName: 'La clé pour vivre par la Foi',
        url: '/pdfs/etudes_inductives_pup/Semaine-1-Hebreux.pdf',
        filename: 'Semaine-1-Hebreux.pdf',
      },
      {
        title: 'Romains, partie 1 (Leçon 1)',
        bookName: 'Romains, partie 1',
        url: '/pdfs/etudes_inductives_pup/Romains-partie1-Lecon-1-1.pdf',
        filename: 'Romains-partie1-Lecon-1-1.pdf',
      },
      {
        title: 'Romains, partie 3 (Leçon 1)',
        bookName: 'Romains, partie 3',
        url: '/pdfs/etudes_inductives_pup/Romans-Pt3-Lecon-1.pdf',
        filename: 'Romans-Pt3-Lecon-1.pdf',
      },
      {
        title: 'Romains, partie 4 (Leçon 1)',
        bookName: 'Romains, partie 4',
        url: '/pdfs/etudes_inductives_pup/Romains-Pt4-Lecon-1.pdf',
        filename: 'Romains-Pt4-Lecon-1.pdf',
      },
    ],
  },
  {
    category: 'etudes_eclair_exploratoires',
    label: 'Études Éclair & Exploratoires',
    files: [
      {
        title: 'Crier à Dieu (Étude exploratoire)',
        url: '/pdfs/etudes_eclair_exploratoires/Crier-a-Dieu-Etude-exploratoire-PR-4-25.pdf',
        filename: 'Crier-a-Dieu-Etude-exploratoire-PR-4-25.pdf',
      },
      {
        title: 'Enflammez — Psaume 23 (Étude exploratoire)',
        url: '/pdfs/etudes_eclair_exploratoires/Enflammez-Psaume-23.pdf',
        filename: 'Enflammez-Psaume-23.pdf',
      },
      {
        title: 'Remporter le prix (Étude Éclair)',
        url: '/pdfs/etudes_eclair_exploratoires/Etude-Eclair-Remporter-le-prix.pdf',
        filename: 'Etude-Eclair-Remporter-le-prix.pdf',
      },
      {
        title: 'Philippiens 4:4-9 (Étude Éclair)',
        url: '/pdfs/etudes_eclair_exploratoires/Philippiens-4v4-9.pdf',
        filename: 'Philippiens-4v4-9.pdf',
      },
      {
        title: 'Psaume 19 (Étude Éclair)',
        url: '/pdfs/etudes_eclair_exploratoires/Psalm-19-LS.pdf',
        filename: 'Psalm-19-LS.pdf',
      },
      {
        title: 'Un meilleur sacrifice (Étude exploratoire)',
        url: '/pdfs/etudes_eclair_exploratoires/Un-meilleur-sacrifice-Etude-exploratoire-PR-3-25.pdf',
        filename: 'Un-meilleur-sacrifice-Etude-exploratoire-PR-3-25.pdf',
      },
      {
        title: 'La vérité sur Dieu — Jean 1:1-18 (Étude Éclair)',
        url: '/pdfs/etudes_eclair_exploratoires/Verite-sur-Dieu-Jean1v1-18.pdf',
        filename: 'Verite-sur-Dieu-Jean1v1-18.pdf',
      },
    ],
  },
  {
    category: 'brochures_outils',
    label: 'Brochures, Outils & Méthode Précepte',
    files: [
      {
        title: "Guide complet : Choisir l'étude idéale (Édition 2026)",
        url: '/pdfs/brochures_outils/Choisir-letude-ideale-7-26.pdf',
        filename: 'Choisir-letude-ideale-7-26.pdf',
      },
      {
        title: "Guide : Choisir l'étude idéale (Fiche synthèse)",
        url: '/pdfs/brochures_outils/Choisir-letude-ideale-9-24.pdf',
        filename: 'Choisir-letude-ideale-9-24.pdf',
      },
      {
        title: 'Dépliant Précepte',
        url: '/pdfs/brochures_outils/Depliant-PR-2-25.pdf',
        filename: 'Depliant-PR-2-25.pdf',
      },
      {
        title: 'Dépliant Livres & Études',
        url: '/pdfs/brochures_outils/Depliant-PR-livres-3-24.pdf',
        filename: 'Depliant-PR-livres-3-24.pdf',
      },
      {
        title: 'Les origines des Ministères Précepte',
        url: '/pdfs/brochures_outils/Les-origines-des-Ministeres-Precepte-11-23-1.pdf',
        filename: 'Les-origines-des-Ministeres-Precepte-11-23-1.pdf',
      },
      {
        title: 'Catalogue Livres PR',
        url: '/pdfs/brochures_outils/Livres-PR-12-25.pdf',
        filename: 'Livres-PR-12-25.pdf',
      },
      {
        title: "La Méthode Précepte d'étude biblique (MPEB)",
        url: '/pdfs/brochures_outils/MPEB-La-methode-Precepte-detude-biblique-9-23.pdf',
        filename: 'MPEB-La-methode-Precepte-detude-biblique-9-23.pdf',
      },
      {
        title: 'Fiche Méthode Précepte',
        url: '/pdfs/brochures_outils/Methode-Precepte-2-25.pdf',
        filename: 'Methode-Precepte-2-25.pdf',
      },
      {
        title: 'Précepte Unique',
        url: '/pdfs/brochures_outils/Precepte-unique-11-23.pdf',
        filename: 'Precepte-unique-11-23.pdf',
      },
      {
        title: 'Signet des mots-clés',
        url: '/pdfs/brochures_outils/Signet-mots-cles-11-23.pdf',
        filename: 'Signet-mots-cles-11-23.pdf',
      },
      {
        title: 'Marque-page OIA',
        url: '/pdfs/brochures_outils/2023-Bookmark-OIA.pdf',
        filename: '2023-Bookmark-OIA.pdf',
      },
    ],
  },
]

/**
 * Mapping between book title and its sample PDF located in /public/pdfs/,
 * derived directly from AVAILABLE_PDF_GROUPS so there is only one list to maintain.
 */
export const SAMPLE_PDFS_BY_TITLE: Record<string, string> = Object.fromEntries(
  AVAILABLE_PDF_GROUPS.flatMap((group) =>
    group.files
      .filter((file): file is AvailablePdfFile & { bookName: string } => Boolean(file.bookName))
      .map((file) => [file.bookName, file.url]),
  ),
)

/** Map URL -> clean human label for quick display. */
const PDF_NAME_LOOKUP = new Map<string, string>()
for (const group of AVAILABLE_PDF_GROUPS) {
  for (const file of group.files) {
    PDF_NAME_LOOKUP.set(file.url, file.title)
  }
}

export function getPdfDisplayName(urlOrPath: string | null | undefined): string {
  if (!urlOrPath) return 'Aucun'
  const known = PDF_NAME_LOOKUP.get(urlOrPath)
  if (known) return known

  try {
    const parts = urlOrPath.split('/')
    const filename = decodeURIComponent(parts[parts.length - 1] || urlOrPath)
    return filename.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ')
  } catch {
    return urlOrPath
  }
}

/**
 * Returns the public path to the sample PDF for a given book name, or null if none exists.
 */
export function getSamplePdfUrl(bookName: string): string | null {
  if (!bookName) return null
  return SAMPLE_PDFS_BY_TITLE[bookName] || null
}
