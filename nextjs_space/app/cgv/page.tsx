import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { Article, Champ } from '@/app/components/legal-page'
import { LEGAL, ADRESSE_COMPLETE } from '@/lib/legal'

export const metadata: Metadata = {
  alternates: { canonical: '/cgv' },
  title: 'Conditions générales de vente — Precept France',
  description:
    "Prix, commande, paiement, livraison, droit de rétractation et garanties applicables aux commandes passées sur la boutique Precept France.",
  robots: { index: true, follow: true },
}

export default function CgvPage() {
  return (
    <LegalPage
      titre="Conditions générales de vente"
      intro="Ces conditions régissent toute commande d'ouvrages passée sur preceptfrance.fr. Elles sont acceptées avant le paiement et vous pouvez les conserver ou les imprimer à tout moment."
    >
      <Article titre="Article 1 — Objet et champ d'application">
        <p>
          Les présentes conditions générales de vente s&apos;appliquent à toutes les
          ventes d&apos;ouvrages et de supports d&apos;étude biblique conclues sur le site
          preceptfrance.fr entre {LEGAL.denomination} (ci-après «&nbsp;le vendeur&nbsp;»)
          et toute personne physique non professionnelle passant commande (ci-après
          «&nbsp;le client&nbsp;»).
        </p>
        <p>
          Le client déclare avoir pris connaissance de ces conditions et les avoir
          acceptées avant de valider sa commande. Toute commande vaut acceptation sans
          réserve. Le vendeur se réserve le droit de les modifier&nbsp;; la version
          applicable est celle en vigueur à la date de la commande.
        </p>
      </Article>

      <Article titre="Article 2 — Identité du vendeur">
        <ul>
          <li>
            {LEGAL.denomination} — {LEGAL.formeJuridique}
          </li>
          <li>
            Siège social&nbsp;:{' '}
            <Champ valeur={ADRESSE_COMPLETE} label="adresse du siège social" />
          </li>
          <li>
            SIRET&nbsp;: <Champ valeur={LEGAL.siret} label="numéro SIRET" />
          </li>
          <li>
            Courriel&nbsp;: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
          </li>
          <li>
            Téléphone&nbsp;:{' '}
            <Champ valeur={LEGAL.telephone} label="numéro de téléphone" />
          </li>
        </ul>
      </Article>

      <Article titre="Article 3 — Produits">
        <p>
          Les ouvrages proposés sont décrits et présentés avec la plus grande exactitude
          possible. Les photographies de couverture sont contractuelles quant au titre
          concerné, mais de légères différences de teinte ou de format peuvent apparaître
          d&apos;une réimpression à l&apos;autre sans engager la responsabilité du
          vendeur.
        </p>
        <p>
          Les offres sont valables dans la limite des stocks disponibles. Si un ouvrage
          se révélait indisponible après la commande, le client en serait informé sans
          délai et remboursé de la somme correspondante.
        </p>
      </Article>

      <Article titre="Article 4 — Prix">
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises, hors frais de
          livraison. <strong>{LEGAL.mentionTva}.</strong>
        </p>
        <p>
          Les frais de livraison sont indiqués avant la validation définitive du paiement
          et s&apos;ajoutent au montant des articles. Le prix facturé est celui affiché au
          moment de la commande.
        </p>
      </Article>

      <Article titre="Article 5 — Commande">
        <p>
          Le client sélectionne les ouvrages, vérifie le contenu de son panier, accepte
          les présentes conditions puis confirme sa commande en procédant au paiement. La
          validation du paiement forme la vente.
        </p>
        <p>
          Un courriel de confirmation récapitulant la commande est adressé au client. Le
          vendeur se réserve le droit d&apos;annuler toute commande présentant un
          caractère anormal ou de mauvaise foi, ou émanant d&apos;un client avec lequel un
          litige de paiement serait en cours.
        </p>
      </Article>

      <Article titre="Article 6 — Paiement">
        <p>
          Le paiement s&apos;effectue en ligne par carte bancaire via{' '}
          <strong>Stripe</strong>, prestataire de services de paiement agréé. Les données
          de carte sont saisies directement sur les serveurs sécurisés de Stripe&nbsp;:{' '}
          <strong>
            le vendeur n&apos;y a jamais accès et n&apos;en conserve aucune copie
          </strong>
          .
        </p>
        <p>
          La commande est enregistrée après confirmation du paiement par Stripe. En cas de
          refus d&apos;autorisation, la commande est automatiquement annulée et aucun
          montant n&apos;est débité.
        </p>
      </Article>

      <Article titre="Article 7 — Livraison">
        <p>
          Les commandes sont expédiées en <strong>{LEGAL.livraison.zone}</strong> par{' '}
          {LEGAL.livraison.transporteurs}, à l&apos;adresse indiquée par le client lors du
          paiement. Il appartient au client de vérifier l&apos;exactitude de cette adresse.
        </p>
        <p>
          Le délai de préparation et d&apos;acheminement est habituellement de{' '}
          <strong>{LEGAL.livraison.delai}</strong> à compter de la confirmation du
          paiement, et n&apos;excédera pas {LEGAL.livraison.delaiMaximum}. Passé ce délai,
          le client peut, après mise en demeure restée sans effet, résoudre la vente et
          obtenir le remboursement intégral des sommes versées.
        </p>
        <p>
          À la réception, il est recommandé de vérifier l&apos;état du colis. En cas de
          colis endommagé ou de contenu manquant, le client est invité à formuler des
          réserves auprès du transporteur et à en informer le vendeur dans les meilleurs
          délais, si possible avec des photographies.
        </p>
      </Article>

      <Article titre="Article 8 — Droit de rétractation">
        <p>
          Conformément aux articles L.221-18 et suivants du Code de la consommation, le
          client dispose d&apos;un délai de <strong>quatorze (14) jours</strong> à compter
          de la réception de sa commande pour exercer son droit de rétractation, sans
          avoir à motiver sa décision ni à supporter de pénalité.
        </p>
        <p>
          Pour exercer ce droit, il suffit d&apos;adresser une déclaration dénuée
          d&apos;ambiguïté à <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>, ou
          d&apos;utiliser le formulaire type reproduit en annexe.
        </p>
        <p>
          Les ouvrages doivent être renvoyés au plus tard quatorze jours après
          communication de la décision, dans un état permettant leur remise en vente.{' '}
          <strong>Les frais de retour restent à la charge du client.</strong> La
          responsabilité du client peut être engagée en cas de dépréciation résultant de
          manipulations autres que celles nécessaires pour établir la nature et les
          caractéristiques de l&apos;ouvrage.
        </p>
        <p>
          Le remboursement, incluant les frais de livraison standard initialement payés,
          intervient au plus tard quatorze jours après récupération des ouvrages ou
          réception d&apos;une preuve de leur expédition, par le même moyen de paiement
          que celui utilisé lors de la commande.
        </p>
      </Article>

      <Article titre="Article 9 — Garanties légales">
        <p>
          Indépendamment de toute garantie commerciale, le vendeur reste tenu de la
          garantie légale de conformité (articles L.217-3 et suivants du Code de la
          consommation) et de la garantie des vices cachés (articles 1641 et suivants du
          Code civil).
        </p>
        <p>
          Au titre de la garantie de conformité, le client dispose de deux ans à compter
          de la délivrance du bien et peut choisir entre la réparation et le remplacement,
          sous réserve des conditions de coût prévues par la loi. Au titre de la garantie
          des vices cachés, il peut choisir entre la résolution de la vente et une
          réduction du prix, dans un délai de deux ans à compter de la découverte du vice.
        </p>
      </Article>

      <Article titre="Article 10 — Données personnelles">
        <p>
          Les données recueillies pour le traitement de la commande sont nécessaires à son
          exécution. Leur traitement est détaillé dans notre{' '}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </Article>

      <Article titre="Article 11 — Réclamations et médiation">
        <p>
          Toute réclamation peut être adressée à{' '}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. Le vendeur s&apos;engage à
          y répondre dans les meilleurs délais.
        </p>
        <p>
          Conformément à l&apos;article L.612-1 du Code de la consommation, le client peut,
          en cas de litige non résolu par voie amiable, recourir gratuitement au médiateur
          de la consommation dont relève le vendeur&nbsp;:
        </p>
        <ul>
          <li>
            <Champ valeur={LEGAL.mediateur.nom} label="nom du médiateur de la consommation" />
          </li>
          <li>
            <Champ valeur={LEGAL.mediateur.adresse} label="adresse du médiateur" />
          </li>
          <li>
            <Champ valeur={LEGAL.mediateur.site} label="site internet du médiateur" />
          </li>
        </ul>
      </Article>

      <Article titre="Article 12 — Droit applicable">
        <p>
          Les présentes conditions sont soumises au droit français. En cas de litige, les
          tribunaux français sont compétents, sans préjudice des règles protectrices
          applicables au consommateur.
        </p>
      </Article>

      <Article titre="Annexe — Formulaire type de rétractation">
        <p className="text-sm text-darkblue/60">
          À compléter et renvoyer uniquement si vous souhaitez vous rétracter.
        </p>
        <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm leading-7">
          <p>
            À l&apos;attention de {LEGAL.denomination},{' '}
            <Champ valeur={ADRESSE_COMPLETE} label="adresse du siège social" />,{' '}
            {LEGAL.email} —
          </p>
          <p className="mt-3">
            Je vous notifie par la présente ma rétractation du contrat portant sur la
            vente des ouvrages ci-dessous&nbsp;:
          </p>
          <p className="mt-3">
            Commandé le&nbsp;: …………… Reçu le&nbsp;: ……………
            <br />
            Ouvrages&nbsp;: ……………………………………………………………
            <br />
            Nom du client&nbsp;: ……………………………………………………
            <br />
            Adresse du client&nbsp;: ………………………………………………
            <br />
            Date&nbsp;: …………… Signature (si notification papier)&nbsp;: ……………
          </p>
        </div>
      </Article>
    </LegalPage>
  )
}
