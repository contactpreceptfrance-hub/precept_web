import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { Article, Champ } from '@/app/components/legal-page'
import { LEGAL, ADRESSE_COMPLETE } from '@/lib/legal'

export const metadata: Metadata = {
  alternates: { canonical: '/confidentialite' },
  title: 'Politique de confidentialité — Precept France',
  description:
    "Quelles données Precept France collecte, pourquoi, combien de temps elles sont conservées et comment exercer vos droits.",
  robots: { index: true, follow: true },
}

export default function ConfidentialitePage() {
  return (
    <LegalPage
      titre="Politique de confidentialité"
      intro="Nous collectons le strict nécessaire pour répondre à vos messages et vous expédier vos commandes. Cette page dit précisément quoi, pourquoi, pour combien de temps, et comment reprendre la main."
    >
      <Article titre="1. Responsable du traitement">
        <p>
          {LEGAL.denomination}, {LEGAL.formeJuridique}, dont le siège est situé{' '}
          <Champ valeur={ADRESSE_COMPLETE} label="adresse du siège social" />, représentée
          par <Champ valeur={LEGAL.representant} label="nom du représentant légal" />.
        </p>
        <p>
          Pour toute question relative à vos données&nbsp;:{' '}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
        </p>
      </Article>

      <Article titre="2. Données collectées et finalités">
        <p>Nous ne collectons vos données que dans trois situations.</p>
        <p>
          <strong>Lorsque vous nous écrivez</strong> par le formulaire de contact&nbsp;:
          votre nom, votre adresse électronique, l&apos;objet et le contenu de votre
          message. Ces données servent à vous répondre et, si votre message est une demande
          pour rejoindre un groupe d&apos;étude, à vous mettre en relation avec le
          responsable du groupe le plus proche. Base légale&nbsp;: notre intérêt légitime à
          traiter les demandes qui nous sont adressées.
        </p>
        <p>
          <strong>Lorsque vous passez commande</strong>&nbsp;: votre nom, votre adresse
          électronique, votre adresse de livraison, le détail des ouvrages commandés, le
          montant et l&apos;identifiant de la transaction. Ces données servent à traiter la
          commande, l&apos;expédier, vous tenir informé et satisfaire nos obligations
          comptables. Base légale&nbsp;: l&apos;exécution du contrat, puis une obligation
          légale de conservation.
        </p>
        <p>
          <strong>Lorsque vous envoyez un formulaire</strong>&nbsp;: une empreinte non
          réversible de votre adresse IP, calculée avec une clé secrète et impossible à
          retrouver. Elle sert uniquement à limiter le nombre d&apos;envois automatisés, et
          n&apos;est jamais rapprochée du contenu de votre message. Votre adresse IP
          elle-même n&apos;est pas enregistrée. Base légale&nbsp;: notre intérêt légitime à
          protéger le site contre les abus.
        </p>
        <p>
          <strong>
            Nous ne recevons ni ne conservons aucune donnée de carte bancaire.
          </strong>{' '}
          Celles-ci sont saisies sur les serveurs de Stripe et ne transitent jamais par les
          nôtres.
        </p>
      </Article>

      <Article titre="3. Destinataires">
        <p>
          Vos données ne sont ni vendues, ni louées, ni transmises à des fins publicitaires.
          Elles sont accessibles aux personnes de {LEGAL.denomination} chargées des
          commandes et de la correspondance, ainsi qu&apos;aux prestataires techniques
          strictement nécessaires au fonctionnement du site&nbsp;:
        </p>
        <ul>
          <li>
            <strong>Stripe</strong> — traitement des paiements (États-Unis et Irlande)
          </li>
          <li>
            <strong>Vercel</strong> — hébergement du site (États-Unis)
          </li>
          <li>
            <strong>Neon</strong> — hébergement de la base de données (Union européenne,
            région de Francfort)
          </li>
          <li>
            <strong>La Poste</strong> — acheminement des colis (nom et adresse de livraison
            uniquement)
          </li>
        </ul>
        <p>
          Si vous demandez à rejoindre un groupe d&apos;étude, votre nom, votre adresse
          électronique et le contenu de votre demande sont transmis au responsable du groupe
          concerné&nbsp;: c&apos;est l&apos;objet même de votre démarche. Aucune autre
          demande ne lui est communiquée.
        </p>
        <p>
          Les transferts hors Union européenne sont encadrés par les clauses contractuelles
          types de la Commission européenne.
        </p>
      </Article>

      <Article titre="4. Durées de conservation">
        <ul>
          <li>
            <strong>Messages de contact&nbsp;:</strong> trois ans à compter du dernier
            échange, puis suppression.
          </li>
          <li>
            <strong>Commandes et pièces comptables&nbsp;:</strong> dix ans, conformément à
            l&apos;article L.123-22 du Code de commerce.
          </li>
          <li>
            <strong>Empreinte d&apos;adresse IP&nbsp;:</strong> supprimée automatiquement
            au-delà de vingt-cinq heures.
          </li>
          <li>
            <strong>Données de paiement&nbsp;:</strong> conservées par Stripe selon sa
            propre politique&nbsp;; nous n&apos;en détenons aucune.
          </li>
        </ul>
      </Article>

      <Article titre="5. Vos droits">
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement,
          de limitation, d&apos;opposition et de portabilité sur vos données, ainsi que du
          droit de définir des directives relatives à leur sort après votre décès.
        </p>
        <p>
          Pour les exercer, écrivez à{' '}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. Nous répondons dans un délai
          d&apos;un mois. Les données rattachées à une commande payée ne peuvent toutefois
          être effacées avant le terme du délai légal de conservation comptable.
        </p>
        <p>
          Si notre réponse ne vous satisfait pas, vous pouvez introduire une réclamation
          auprès de la Commission nationale de l&apos;informatique et des libertés (CNIL),
          3 place de Fontenoy, 75007 Paris —{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            www.cnil.fr
          </a>
          .
        </p>
      </Article>

      <Article titre="6. Cookies et stockage local">
        <p>
          Ce site <strong>n&apos;utilise aucun cookie de mesure d&apos;audience,
          publicitaire ou de réseau social</strong>. Aucun consentement ne vous est demandé
          parce qu&apos;il n&apos;y a rien à consentir.
        </p>
        <p>
          Le contenu de votre panier est enregistré dans le stockage local de votre
          navigateur afin de ne pas disparaître si vous changez de page. Cette information
          reste sur votre appareil, ne nous est jamais transmise, et disparaît si vous videz
          les données de votre navigateur.
        </p>
        <p>
          Lors du paiement, Stripe dépose ses propres cookies techniques et de prévention de
          la fraude sur ses pages sécurisées.
        </p>
        <p>
          Un cookie strictement technique est déposé sur l&apos;espace d&apos;administration
          réservé à l&apos;équipe, afin de maintenir la session ouverte. Il n&apos;est
          jamais déposé lors d&apos;une visite ordinaire du site, ne contient aucune donnée
          personnelle et ne requiert pas de consentement.
        </p>
      </Article>

      <Article titre="7. Sécurité">
        <p>
          Le site est intégralement servi en HTTPS. L&apos;accès à la base de données est
          restreint et le paiement est délégué à un prestataire certifié PCI-DSS. Nous
          appliquons le principe de minimisation&nbsp;: aucune donnée n&apos;est demandée si
          elle n&apos;est pas nécessaire.
        </p>
      </Article>

      <Article titre="8. Modifications">
        <p>
          Cette politique peut évoluer avec le site. Toute modification substantielle sera
          signalée sur cette page, dont la date de mise à jour figure ci-dessous. Les
          conditions de vente sont consultables{' '}
          <Link href="/cgv">ici</Link>.
        </p>
      </Article>
    </LegalPage>
  )
}
