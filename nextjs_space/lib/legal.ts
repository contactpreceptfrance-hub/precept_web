/**
 * Identité légale de Precept France — source unique pour les mentions légales,
 * les CGV et la politique de confidentialité.
 *
 * ⚠ Les valeurs marquées À COMPLÉTER sont volontairement vides : les pages
 * affichent alors un encadré rouge « [À COMPLÉTER — … ] » impossible à manquer,
 * plutôt qu'un blanc silencieux. Remplissez-les avant la mise en ligne.
 *
 * ⚠ Ces textes sont des modèles rédigés à partir des obligations courantes du
 * Code de la consommation et du RGPD. Faites-les relire par un juriste avant
 * d'ouvrir la boutique.
 */

export const LEGAL = {
  /** Dénomination exacte telle que déclarée en préfecture. */
  denomination: 'Precept France',

  formeJuridique: 'Association déclarée régie par la loi du 1er juillet 1901',

  /** Numéro RNA (format W suivi de 9 chiffres), figurant sur le récépissé de déclaration. */
  rna: '', // À COMPLÉTER

  /** SIRET, si l'association en possède un (obligatoire dès lors qu'elle vend). */
  siret: '', // À COMPLÉTER

  /** Siège social. */
  adresse: {
    rue: '',        // À COMPLÉTER
    codePostal: '', // À COMPLÉTER
    ville: '',      // À COMPLÉTER
    pays: 'France',
  },

  /** Président·e ou représentant·e légal·e — également directeur de la publication. */
  representant: '', // À COMPLÉTER

  email: 'contactpreceptfrance@gmail.com',

  telephone: '', // À COMPLÉTER

  /** Non assujettie à la TVA : mention obligatoire sur tout document commercial. */
  mentionTva: 'TVA non applicable, article 293 B du Code général des impôts',

  /** Hébergeur du site — obligation d'information de la LCEN. */
  hebergeur: {
    nom: 'Vercel Inc.',
    adresse: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
    site: 'https://vercel.com',
  },

  /** Médiateur de la consommation : l'adhésion à un médiateur est obligatoire pour tout vendeur en ligne. */
  mediateur: {
    nom: '',     // À COMPLÉTER
    adresse: '', // À COMPLÉTER
    site: '',    // À COMPLÉTER
  },

  livraison: {
    zone: 'France métropolitaine',
    delai: '3 à 5 jours ouvrés',
    delaiMaximum: '30 jours',
    transporteurs: 'La Poste (lettre suivie ou Colissimo)',
  },

  /** Date de dernière révision affichée en bas des trois pages. */
  derniereMiseAJour: '10 septembre 2026',
} as const

export const ADRESSE_COMPLETE = [
  LEGAL.adresse.rue,
  `${LEGAL.adresse.codePostal} ${LEGAL.adresse.ville}`.trim(),
  LEGAL.adresse.pays,
]
  .filter(Boolean)
  .join(', ')
