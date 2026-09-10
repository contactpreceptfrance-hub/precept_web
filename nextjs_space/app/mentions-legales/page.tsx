import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { Article, Champ } from '@/app/components/legal-page'
import { LEGAL, ADRESSE_COMPLETE } from '@/lib/legal'

export const metadata: Metadata = {
  alternates: { canonical: '/mentions-legales' },
  title: 'Mentions légales — Precept France',
  description:
    "Éditeur, directeur de la publication, hébergeur et propriété intellectuelle du site Precept France.",
  robots: { index: true, follow: true },
}

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      titre="Mentions légales"
      intro="Informations légales relatives au site preceptfrance.fr, conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique."
    >
      <Article titre="1. Éditeur du site">
        <p>
          Le site <strong>preceptfrance.fr</strong> est édité par&nbsp;:
        </p>
        <ul>
          <li>
            <strong>Dénomination&nbsp;:</strong> {LEGAL.denomination}
          </li>
          <li>
            <strong>Forme juridique&nbsp;:</strong> {LEGAL.formeJuridique}
          </li>
          <li>
            <strong>Numéro RNA&nbsp;:</strong>{' '}
            <Champ valeur={LEGAL.rna} label="numéro RNA (W…)" />
          </li>
          <li>
            <strong>Numéro SIRET&nbsp;:</strong>{' '}
            <Champ valeur={LEGAL.siret} label="numéro SIRET" />
          </li>
          <li>
            <strong>Siège social&nbsp;:</strong>{' '}
            <Champ valeur={ADRESSE_COMPLETE} label="adresse du siège social" />
          </li>
          <li>
            <strong>Téléphone&nbsp;:</strong>{' '}
            <Champ valeur={LEGAL.telephone} label="numéro de téléphone" />
          </li>
          <li>
            <strong>Courriel&nbsp;:</strong>{' '}
            <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
          </li>
          <li>
            <strong>TVA&nbsp;:</strong> {LEGAL.mentionTva}
          </li>
        </ul>
      </Article>

      <Article titre="2. Directeur de la publication">
        <p>
          <Champ
            valeur={LEGAL.representant}
            label="nom du président ou représentant légal"
          />
          , en qualité de représentant légal de {LEGAL.denomination}.
        </p>
      </Article>

      <Article titre="3. Hébergement">
        <p>Le site est hébergé par&nbsp;:</p>
        <ul>
          <li>
            <strong>{LEGAL.hebergeur.nom}</strong>
          </li>
          <li>{LEGAL.hebergeur.adresse}</li>
          <li>
            <a href={LEGAL.hebergeur.site} target="_blank" rel="noopener noreferrer">
              {LEGAL.hebergeur.site}
            </a>
          </li>
        </ul>
      </Article>

      <Article titre="4. Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments du site — textes, mise en page, logo, charte
          graphique, photographies et visuels de couverture — est protégé par le droit
          d&apos;auteur. Les ouvrages proposés à la vente, la méthode d&apos;étude
          inductive et les marques <em>Precept</em> et <em>Precept Ministries</em>{' '}
          demeurent la propriété de leurs titulaires respectifs.
        </p>
        <p>
          Toute reproduction, représentation, adaptation ou diffusion, totale ou
          partielle, sur quelque support que ce soit, est interdite sans autorisation
          écrite préalable. Le contenu du site peut en revanche être cité et partagé par
          lien, à condition d&apos;en indiquer la source.
        </p>
      </Article>

      <Article titre="5. Données personnelles">
        <p>
          Le traitement des données collectées par le formulaire de contact et lors
          d&apos;une commande est décrit dans notre{' '}
          <Link href="/confidentialite">politique de confidentialité</Link>. Vous y
          trouverez les finalités, les durées de conservation et la manière d&apos;exercer
          vos droits.
        </p>
      </Article>

      <Article titre="6. Cookies et stockage local">
        <p>
          Ce site <strong>ne dépose aucun cookie publicitaire ni de mesure
          d&apos;audience</strong>. Votre panier est conservé dans le stockage local de
          votre navigateur&nbsp;: cette donnée ne quitte jamais votre appareil et reste
          strictement nécessaire au fonctionnement de la boutique, ce qui la dispense de
          consentement préalable.
        </p>
        <p>
          Le paiement est traité par Stripe, qui dépose ses propres cookies techniques et
          de lutte contre la fraude sur ses pages sécurisées, au moment du paiement
          uniquement.
        </p>
      </Article>

      <Article titre="7. Conditions de vente">
        <p>
          Toute commande passée sur la boutique est régie par nos{' '}
          <Link href="/cgv">conditions générales de vente</Link>.
        </p>
      </Article>

      <Article titre="8. Crédits">
        <p>
          Conception et développement du site&nbsp;:{' '}
          <a href="https://engadi.com" target="_blank" rel="noopener noreferrer">
            Engadi
          </a>
          .
        </p>
      </Article>
    </LegalPage>
  )
}
