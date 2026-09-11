import { SERIES_CONFIG } from '@/lib/types'

/**
 * Editorial copy for each series, for the study page.
 *
 * A separate file from SERIES_CONFIG on purpose: that one carries the shop's
 * display order and nothing else, and coupling marketing prose to it would mean
 * every copy change touches how /boutique sorts. They stay keyed together
 * instead — the type below makes a key typo a compile error, so the two cannot
 * drift apart silently.
 */
type StudyGuideEntry = {
  /** What the reader gets out of it, in one sentence. */
  blurb: string
  /** What it asks of them, so they can judge before buying. */
  engagement: string
}

export const STUDY_GUIDE: Record<string, StudyGuideEntry> = {
  '40min': {
    blurb:
      'Des études thématiques courtes, sans devoirs à la maison. Le point de départ le plus simple, et le plus souple quand l’emploi du temps est serré.',
    engagement: 'Environ 40 minutes par séance · aucun travail entre les séances',
  },
  seigneur: {
    blurb:
      'Des études centrées sur la relation avec Dieu, écrites par Kay Arthur. Un premier pas vers l’étude personnelle régulière.',
    engagement: 'Quelques semaines · travail personnel léger',
  },
  etudes: {
    blurb:
      'La collection inductive proprement dite : on observe le texte, on l’interprète dans son contexte, puis on l’applique.',
    engagement: 'Rythme modéré · un temps d’étude personnel entre les séances',
  },
  saisir: {
    blurb:
      'Un niveau intermédiaire, avec des devoirs hebdomadaires : plus exigeant que la série Seigneur, moins dense que Précepte sur Précepte.',
    engagement: 'Devoirs hebdomadaires · niveau intermédiaire',
  },
  pup: {
    blurb:
      'L’étude verset par verset, la plus approfondie que nous proposions. Pour qui veut prendre un livre biblique et l’épuiser.',
    engagement: 'Plusieurs mois · environ 5 heures de travail personnel par semaine',
  },
  enfants: {
    blurb:
      'La même méthode, adaptée aux 7-12 ans : observer, comprendre, appliquer, avec des activités plutôt que des dissertations.',
    engagement: 'Pour les enfants · en famille ou en groupe',
  },
}

/**
 * The series in the order the shop displays them — lightest commitment first —
 * each paired with its copy.
 *
 * Derived from SERIES_CONFIG so the ladder here and the rows on /boutique
 * always tell the same story.
 */
export const STUDY_LADDER = SERIES_CONFIG.map(({ key, label }) => ({
  key,
  label,
  ...STUDY_GUIDE[key],
}))
