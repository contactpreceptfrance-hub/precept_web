import { del, put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

/**
 * PDF management for the admin book editor.
 *
 * Supports:
 * 1. Linking to existing PDFs stored in /public/pdfs/
 * 2. Uploading new PDFs (stored in Vercel Blob, with local /public fallback)
 * 3. Editing/replacing PDFs
 * 4. Deleting/unlinking PDFs
 */

export const MAX_PDF_BYTES = 8 * 1024 * 1024 // 8 MB

export type PdfProblem = 'pdf-type' | 'pdf-taille' | 'pdf-stockage'

export interface AvailablePdfFile {
  title: string
  url: string
  filename: string
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
        url: '/pdfs/40_minutes/Mariage-Semaine-1.pdf',
        filename: 'Mariage-Semaine-1.pdf',
      },
      {
        title: 'Comment faire des choix que vous ne regretterez pas (Semaine 1)',
        url: '/pdfs/40_minutes/Choix-Semaine-1.pdf',
        filename: 'Choix-Semaine-1.pdf',
      },
      {
        title: 'Comment savoir que Dieu est votre Père ? (Semaine 1)',
        url: '/pdfs/40_minutes/Pere-Semaine-1.pdf',
        filename: 'Pere-Semaine-1.pdf',
      },
      {
        title: 'Enflammez votre passion pour Dieu (Semaine 1)',
        url: '/pdfs/40_minutes/Enflammez-Semaine-1.pdf',
        filename: 'Enflammez-Semaine-1.pdf',
      },
      {
        title: 'Jésus : comprendre sa mort et sa résurrection (Semaine 1)',
        url: '/pdfs/40_minutes/Resurrection-Semaine-1.pdf',
        filename: 'Resurrection-Semaine-1.pdf',
      },
      {
        title: "Jésus : faire l'expérience de son toucher (Semaine 1)",
        url: '/pdfs/40_minutes/Toucher-Semaine-1.pdf',
        filename: 'Toucher-Semaine-1.pdf',
      },
      {
        title: "Jésus : à l'écoute de sa voix (Semaine 1)",
        url: '/pdfs/40_minutes/Voix-Semaine-1.pdf',
        filename: 'Voix-Semaine-1.pdf',
      },
      {
        title: "Le ciel, l'enfer et la vie après la mort (Semaine 1)",
        url: '/pdfs/40_minutes/Ciel-Semaine-1.pdf',
        filename: 'Ciel-Semaine-1.pdf',
      },
      {
        title: "Pardonner : briser l'emprise du passé (Semaine 1)",
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
        url: '/pdfs/seigneur/Dieu-Es-tu-la-Semaine-1.pdf',
        filename: 'Dieu-Es-tu-la-Semaine-1.pdf',
      },
      {
        title: "Seigneur, j'ai besoin de réponses (Jours 1 à 4)",
        url: '/pdfs/seigneur/Reponses-Jour-1-4.pdf',
        filename: 'Reponses-Jour-1-4.pdf',
      },
      {
        title: 'Seigneur, enseigne-moi à étudier la Bible (Jours 1 à 4)',
        url: '/pdfs/seigneur/Seigneur-Enseigne-Jour-1-4.pdf',
        filename: 'Seigneur-Enseigne-Jour-1-4.pdf',
      },
      {
        title: 'Seigneur, enseigne-moi à prier (Jours 1 et 2)',
        url: '/pdfs/seigneur/Seigneur-enseigne-moi-prier-jour-1-et-2.pdf',
        filename: 'Seigneur-enseigne-moi-prier-jour-1-et-2.pdf',
      },
      {
        title: 'Seigneur, je veux te connaître (Chapitre 1)',
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
        url: '/pdfs/enfants_dd/Creation-semaine-1-et-plus-3.pdf',
        filename: 'Creation-semaine-1-et-plus-3.pdf',
      },
      {
        title: 'Déterrons le passé (Semaine 1)',
        url: '/pdfs/enfants_dd/Deterrons-semaine-1.pdf',
        filename: 'Deterrons-semaine-1.pdf',
      },
      {
        title: 'Jésus sous les réflecteurs (Semaine 1)',
        url: '/pdfs/enfants_dd/Jesus-sous-les-refleteurs-semaine-1.pdf',
        filename: 'Jesus-sous-les-refleteurs-semaine-1.pdf',
      },
      {
        title: "Jésus, vers l'Éternité — Jean 17-21 (Semaine 1)",
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
        url: '/pdfs/etudes_inductives_pup/1-Thessaloniciens-Lecon-1.pdf',
        filename: '1-Thessaloniciens-Lecon-1.pdf',
      },
      {
        title: '2 Timothée (Leçon 1)',
        url: '/pdfs/etudes_inductives_pup/2-Timothee-Lecon-1.pdf',
        filename: '2-Timothee-Lecon-1.pdf',
      },
      {
        title: 'Choisir la Victoire — Josué (Semaine 1)',
        url: '/pdfs/etudes_inductives_pup/Josue-Semaine-1.pdf',
        filename: 'Josue-Semaine-1.pdf',
      },
      {
        title: 'Enfin Libéré — Galates (Semaine 1)',
        url: '/pdfs/etudes_inductives_pup/Enfin-libere-Gal-Semaine-1.pdf',
        filename: 'Enfin-libere-Gal-Semaine-1.pdf',
      },
      {
        title: 'Esdras et Aggée (Leçon 1)',
        url: '/pdfs/etudes_inductives_pup/Esra-Aggee-Lecon-1.pdf',
        filename: 'Esra-Aggee-Lecon-1.pdf',
      },
      {
        title: "L'appel à suivre Jésus — Luc (Semaine 1)",
        url: '/pdfs/etudes_inductives_pup/Lappel-a-suivre-Jesus-Luc-semaine-1.pdf',
        filename: 'Lappel-a-suivre-Jesus-Luc-semaine-1.pdf',
      },
      {
        title: 'La clé pour vivre par la Foi — Hébreux (Semaine 1)',
        url: '/pdfs/etudes_inductives_pup/Semaine-1-Hebreux.pdf',
        filename: 'Semaine-1-Hebreux.pdf',
      },
      {
        title: 'Romains, partie 1 (Leçon 1)',
        url: '/pdfs/etudes_inductives_pup/Romains-partie1-Lecon-1-1.pdf',
        filename: 'Romains-partie1-Lecon-1-1.pdf',
      },
      {
        title: 'Romains, partie 3 (Leçon 1)',
        url: '/pdfs/etudes_inductives_pup/Romans-Pt3-Lecon-1.pdf',
        filename: 'Romans-Pt3-Lecon-1.pdf',
      },
      {
        title: 'Romains, partie 4 (Leçon 1)',
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
        title: "Guide : Choisir l'étude idéale",
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

  // If it's a blob or custom URL, extract the filename cleanly
  try {
    const parts = urlOrPath.split('/')
    const filename = decodeURIComponent(parts[parts.length - 1] || urlOrPath)
    return filename.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ')
  } catch {
    return urlOrPath
  }
}

export function isPdfStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

/** Check %PDF- magic bytes: 0x25, 0x50, 0x44, 0x46 */
function sniffPdf(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 4 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  )
}

/**
 * Stores one PDF and returns its public URL.
 * Supports Vercel Blob (default when BLOB_READ_WRITE_TOKEN is set)
 * or local filesystem storage in /public/pdfs/uploads/ for offline/dev.
 */
export async function uploadPdf(
  file: FormDataEntryValue | null,
  slug: string,
): Promise<{ url: string } | { problem: PdfProblem } | null> {
  if (!(file instanceof File) || file.size === 0) return null

  if (file.size > MAX_PDF_BYTES) return { problem: 'pdf-taille' }

  const buffer = new Uint8Array(await file.arrayBuffer())
  if (!sniffPdf(buffer)) return { problem: 'pdf-type' }

  if (isPdfStorageConfigured()) {
    const { url } = await put(`pdfs/${slug}.pdf`, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'application/pdf',
    })
    return { url }
  }

  // Fallback to local /public/pdfs/uploads/ directory
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'pdfs', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    const safeName = `${slug}-${Date.now()}.pdf`
    const filePath = path.join(uploadsDir, safeName)
    fs.writeFileSync(filePath, Buffer.from(buffer))
    return { url: `/pdfs/uploads/${safeName}` }
  } catch (error) {
    console.error('book-pdfs: could not save local PDF file', error)
    return { problem: 'pdf-stockage' }
  }
}

/**
 * Deletes a PDF that was uploaded from the admin.
 * Files under pre-existing /public/pdfs/ directories (outside uploads) are left alone.
 */
export async function removePdf(url: string | null | undefined): Promise<void> {
  if (!url) return

  // 1. Vercel Blob
  if (/^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(url)) {
    try {
      await del(url)
    } catch (error) {
      console.error('book-pdfs: could not delete old blob PDF', url, error)
    }
    return
  }

  // 2. Local uploaded file
  if (url.startsWith('/pdfs/uploads/')) {
    try {
      const localPath = path.join(process.cwd(), 'public', url)
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath)
      }
    } catch (error) {
      console.error('book-pdfs: could not delete old local PDF', url, error)
    }
  }
}
