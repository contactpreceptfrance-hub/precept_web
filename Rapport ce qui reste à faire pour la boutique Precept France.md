# Rapport : ce qui reste à faire pour la boutique Precept France

Oct 13, 2026 · @Luis Fernando Rosales

La boutique est presque prête à vendre : il reste un point obligatoire à régler (le médiateur de la consommation) et un essai de commande complet à faire. Deux améliorations peuvent attendre après l'ouverture.

Depuis l'audit du 21 septembre, trois des quatre points qui bloquaient l'ouverture sont réglés : les clés de paiement Stripe, les prix et les informations légales de l'association. Ce rapport a été vérifié le 13 octobre sur le site public et dans l'administration.

## Ce qui est réglé

| Point | Ce que l'on constate | Source |
| --- | --- | --- |
| Paiement Stripe | Les quatre clés (test et production) sont enregistrées et le mode production est actif | Administration, page Paramètres |
| Prix des 42 livres | Les prix varient de 11,99 € à 32,99 € selon le titre ; ils étaient tous à 12,99 € avant | Administration, page Livres |
| Informations légales | RNA, SIRET, adresse, représentant et téléphone sont renseignés ; il ne reste plus de texte « À COMPLÉTER » dans les mentions légales | [Mentions légales](https://www.preceptfrance.fr/mentions-legales) |
| Livraison et frais de port | Adresse demandée au paiement, frais de port de 4,90 €, zone de livraison écrite dans les CGV | Audit du 21 septembre ; [CGV](https://www.preceptfrance.fr/cgv) |
| Stock et alertes | Le stock baisse après chaque commande payée et l'équipe est prévenue par e-mail | Audit du 21 septembre |
| Administration | Commandes, messages et livres se gèrent en ligne ; un guide d'utilisation est rédigé | Administration |

Les deux lignes « Audit du 21 septembre » n'ont pas été revérifiées aujourd'hui.

## Ce qui reste à faire

| N° | À faire | Pourquoi | Quand | Qui |
| --- | --- | --- | --- | --- |
| 1 | Choisir et souscrire un médiateur de la consommation (CM2C, Medicys, AME Conso…), puis inscrire son nom, son adresse et son site dans l'article 11 des CGV | C'est obligatoire pour tout vendeur en ligne. Les CGV affichent encore « À COMPLÉTER » à cet endroit. L'abonnement coûte quelques dizaines d'euros par an | Avant les premières ventes | L'association pour l'abonnement, la personne qui gère le site pour le texte |
| 2 | Faire une commande d'essai du début à la fin en mode test, puis revenir en mode production | Vérifier que le paiement, l'adresse de livraison, les e-mails et l'arrivée dans « Commandes » fonctionnent, sans débiter personne | Avant les premières ventes | L'équipe, avec la section 6 du guide d'utilisation |
| 3 | Contrôler la connexion Stripe en production avec le bouton « Tester la connexion (Live) » | Confirmer que les clés enregistrées sont acceptées par Stripe | Avant les premières ventes | L'équipe |
| 4 | Ajouter la mention « TVA non applicable, art. 293 B du CGI » sur les pages de la boutique | Elle figure dans les CGV mais pas sur la boutique, où sont affichés les prix | Après l'ouverture | La personne qui gère le site |
| 5 | Prévoir une alerte quand un paiement ne correspond à aucune commande | Aujourd'hui, ce cas laisse seulement une trace technique que personne ne lit. Il est rare, mais la somme serait encaissée sans commande visible | Après l'ouverture | La personne qui gère le site |
| 6 | Faire relire les CGV, les mentions légales et la politique de confidentialité par un juriste | Ce sont des modèles rédigés à partir des obligations courantes ; ils n'ont pas été relus | Dès que possible | L'association |
| 7 | Contrôler la première vraie commande et le premier vrai message : fiche de commande, passage en « Expédiées », e-mails automatiques | Ces écrans n'ont pas pu être vus, car il n'y a encore ni commande ni message | À la première commande | L'équipe |

## Points d'attention

- La boutique est déjà en mode paiement réel (le tableau de bord affiche « Live »). Si le site est ouvert au public, le point 1 devient urgent : le médiateur doit figurer dans les CGV avant de vendre.
- Pendant l'essai de commande, la boutique est en mode test et aucun client ne paie vraiment. Revenez en mode production tout de suite après.
- Les textes juridiques sont des modèles. Ils couvrent le cas d'un petit catalogue de livres envoyés en France, mais seul un juriste peut les valider.

## Par où commencer

1. Choisir un médiateur et souscrire l'abonnement.
2. Faire inscrire son nom dans les CGV (article 11).
3. Faire la commande d'essai en mode test, contrôler la connexion Stripe, puis remettre le mode production.
4. Annoncer l'ouverture de la boutique.
5. Une fois ouverte : mention de TVA, alerte de paiement sans commande, relecture par un juriste.

Sources : [mentions légales](https://www.preceptfrance.fr/mentions-legales), [CGV](https://www.preceptfrance.fr/cgv), [boutique](https://www.preceptfrance.fr/boutique), administration (pages Livres et Paramètres), audit de lancement du 21 septembre.
