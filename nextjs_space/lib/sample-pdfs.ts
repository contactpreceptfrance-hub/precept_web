/**
 * Mapping between book title (or ID) and its sample PDF located in /public/pdfs/
 */

export const SAMPLE_PDFS_BY_TITLE: Record<string, string> = {
  // Série 40 Minutes
  'Bâtir un mariage qui fructifie vraiment': '/pdfs/40_minutes/Mariage-Semaine-1.pdf',
  'Comment faire des choix que vous ne regretterez pas': '/pdfs/40_minutes/Choix-Semaine-1.pdf',
  'Comment savoir que Dieu est votre Père ?': '/pdfs/40_minutes/Pere-Semaine-1.pdf',
  'Enflammez votre passion pour Dieu': '/pdfs/40_minutes/Enflammez-Semaine-1.pdf',
  'Jésus : comprendre sa mort et sa résurrection': '/pdfs/40_minutes/Resurrection-Semaine-1.pdf',
  'Jésus : faire l\'expérience de son toucher': '/pdfs/40_minutes/Toucher-Semaine-1.pdf',
  'Jésus : à l\'écoute de sa voix': '/pdfs/40_minutes/Voix-Semaine-1.pdf',
  'Le ciel, l\'enfer et la vie après la mort': '/pdfs/40_minutes/Ciel-Semaine-1.pdf',
  'Pardonner : briser l\'emprise du passé': '/pdfs/40_minutes/Pardonner-Semaine-1.pdf',

  // Série Seigneur
  'Dieu, es-tu là ?': '/pdfs/seigneur/Dieu-Es-tu-la-Semaine-1.pdf',
  'Seigneur, enseigne-moi à prier': '/pdfs/seigneur/Seigneur-enseigne-moi-prier-jour-1-et-2.pdf',
  'Seigneur, enseigne-moi à étudier la Bible': '/pdfs/seigneur/Seigneur-Enseigne-Jour-1-4.pdf',
  'Seigneur, j\'ai besoin de réponses': '/pdfs/seigneur/Reponses-Jour-1-4.pdf',
  'Seigneur, je veux te connaître': '/pdfs/seigneur/Seigneur-je-veux-te-connaiitre-chapitre-1.pdf',

  // Études Inductives / Ancien & Nouveau Testament
  'Choisir la Victoire': '/pdfs/etudes_inductives_pup/Josue-Semaine-1.pdf',
  'Enfin Libéré': '/pdfs/etudes_inductives_pup/Enfin-libere-Gal-Semaine-1.pdf',
  'L\'appel à suivre Jésus': '/pdfs/etudes_inductives_pup/Lappel-a-suivre-Jesus-Luc-semaine-1.pdf',
  'La clé pour vivre par la Foi': '/pdfs/etudes_inductives_pup/Semaine-1-Hebreux.pdf',

  // Précepte sur Précepte (PUP)
  '1 Thessaloniciens': '/pdfs/etudes_inductives_pup/1-Thessaloniciens-Lecon-1.pdf',
  '2 Timothée': '/pdfs/etudes_inductives_pup/2-Timothee-Lecon-1.pdf',
  'Esdras et Aggée': '/pdfs/etudes_inductives_pup/Esra-Aggee-Lecon-1.pdf',
  'Romains, partie 1': '/pdfs/etudes_inductives_pup/Romains-partie1-Lecon-1-1.pdf',
  'Romains, partie 3': '/pdfs/etudes_inductives_pup/Romans-Pt3-Lecon-1.pdf',
  'Romains, partie 4': '/pdfs/etudes_inductives_pup/Romains-Pt4-Lecon-1.pdf',

  // Enfants & Ados (Découvre et Déterre - D&D)
  'Déterrons le passé': '/pdfs/enfants_dd/Deterrons-semaine-1.pdf',
  'Jésus sous les réflecteurs': '/pdfs/enfants_dd/Jesus-sous-les-refleteurs-semaine-1.pdf',
  'Jésus, vers l\'Éternité': '/pdfs/enfants_dd/Jesus-vers-lEternite-Jean-17-21-semaine-1.pdf',
  'L\'extraordinaire création de Dieu': '/pdfs/enfants_dd/Creation-semaine-1-et-plus-3.pdf',
}

/**
 * Returns the public path to the sample PDF for a given book name, or null if none exists.
 */
export function getSamplePdfUrl(bookName: string): string | null {
  if (!bookName) return null
  return SAMPLE_PDFS_BY_TITLE[bookName] || null
}
