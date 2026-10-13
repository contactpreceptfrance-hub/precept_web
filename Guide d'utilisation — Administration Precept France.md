# Guide d'utilisation — Administration Precept France

Oct 13, 2026 · @Luis Fernando Rosales

Ce guide explique, pas à pas et sans jargon, comment gérer la boutique Precept France : commandes, livres, messages et paiements. Il s'adresse à l'équipe non technique.

## 1. Se connecter

L'administration se trouve à l'adresse www.preceptfrance.fr/admin et s'ouvre avec un seul mot de passe.

1. Ouvrez votre navigateur (Chrome, Safari, Firefox ou Edge).
2. Allez à l'adresse <https://www.preceptfrance.fr/admin>.
3. Saisissez le mot de passe administrateur dans le champ « Mot de passe ».
4. Cliquez sur « Se connecter ».

&#91;image: Page de connexion\]

Le lien « Retour au site » sous le formulaire ramène à la boutique publique. Pour vous déconnecter, utilisez le bouton « Se déconnecter » en bas du menu de gauche, surtout sur un ordinateur partagé.

**Astuce :** ajoutez cette page à vos favoris pour y revenir en un clic.

## 2. Le tableau de bord et le menu

Après la connexion, le tableau de bord résume l'essentiel en quatre cartes. Chaque carte contient un lien qui mène directement à la bonne page.

&#91;image: Tableau de bord\]

| Carte | Ce qu'elle indique | Lien |
| --- | --- | --- |
| Commandes payées à expédier | Colis à préparer | Voir les commandes |
| Messages non traités | Messages du site en attente de réponse | Voir les messages |
| Livres en vente | Nombre de livres visibles dans la boutique (42 aujourd'hui) | Gérer les livres |
| Paiements Stripe | Mode de paiement actif (« Live » = vrais paiements) | Configurer Stripe |

Le menu est la colonne de gauche, visible sur toutes les pages :

| Entrée du menu | À quoi elle sert |
| --- | --- |
| Tableau de bord | Les quatre indicateurs ci-dessus |
| Livres | Le catalogue : prix, descriptions, couvertures, stock, visibilité |
| Commandes | Les commandes des clients, à expédier ou déjà expédiées |
| Messages | Les messages envoyés par le formulaire de contact du site |
| Paramètres | Les paiements Stripe (mode test ou production) |
| Webmail (rubrique Services) | Lien externe vers la messagerie, webmail.migadu.com : il quitte l'administration |
| Retour au site public | Ouvre la boutique publique |
| Se déconnecter | Ferme votre session |

## 3. Gérer les commandes

Chaque achat payé sur le site crée une commande dans l'onglet « Commandes » du menu. La page propose trois vues :

&#91;image: Page Commandes\]

- À expédier : les commandes payées dont le colis n'est pas encore parti (le compteur est aussi sur le tableau de bord) ;
- Expédiées : les commandes déjà envoyées ;
- Toutes : l'historique complet.

Quand aucune commande ne correspond, la page affiche « Aucune commande dans cette vue. »

### Ce qui se passe automatiquement

- Le client paie par carte bancaire, de façon sécurisée, via Stripe.
- Le client reçoit un e-mail de confirmation avec le récapitulatif de sa commande.
- L'équipe reçoit une notification par e-mail à l'adresse contact@preceptfrance.fr.
- Le stock du livre baisse automatiquement si son suivi est activé (voir la section Livres).

### Traiter une commande à expédier

1. Ouvrez « Commandes », puis la vue « À expédier ».
2. Ouvrez la commande : vous y trouvez le nom et l'e-mail du client, son adresse de livraison et la liste des livres avec les quantités.
3. Préparez le colis depuis votre lieu de stockage.
4. Expédiez-le avec votre transporteur habituel (La Poste Colissimo, Mondial Relay, etc.).
5. Marquez la commande comme expédiée : elle passe alors de « À expédier » à « Expédiées ».

## 4. Gérer le catalogue de livres

La page « Livres » liste les 42 livres de la boutique, regroupés par collection. Trois filtres en haut : Tous, Masqués et Épuisés.

&#91;image: Page Livres\]

| Collection | Livres |
| --- | --- |
| La série 40 Minutes | 13 |
| La série Seigneur | 5 |
| La collection Études inductives | 5 |
| La série Saisir et Agir | 1 |
| La série Précepte sur Précepte | 12 |
| Découvrir par toi-même (7-12 ans) | 6 |

Chaque ligne montre la couverture, le titre, le prix et quatre actions :

- Modifier : ouvre la fiche du livre ;
- Masquer : retire le livre de la boutique sans le supprimer ;
- Marquer épuisé : le livre reste affiché mais ne peut plus être commandé ;
- les flèches haut et bas : changent l'ordre du livre dans sa collection.

### Modifier un livre

&#91;image: Fiche de modification d'un livre\]

1. Cliquez sur « Modifier » en face du livre.
2. Changez ce dont vous avez besoin :
   - Titre et Description : le texte affiché sur la boutique ;
   - Prix (€) : par exemple 12,50 ;
   - Stock : nombre d'exemplaires disponibles. Il baisse automatiquement à chaque commande payée et le livre passe en « Épuisé » à 0. Laissez vide (« Non suivi ») pour ne pas suivre le stock ;
   - Série : la collection dans laquelle le livre apparaît ;
   - Couverture (recto) et Quatrième de couverture (verso, facultatif) : image JPEG, PNG ou WebP de 2 Mo maximum. Sans nouveau fichier, l'image actuelle est conservée. La case « Supprimer le verso actuel » retire le verso ;
   - Visibilité : « Visible dans la boutique » (décochez pour masquer) et « Épuisé ».
3. Cliquez sur « Enregistrer » en bas du formulaire. « Annuler » abandonne les changements.

Le lien « Voir dans la boutique », en haut de la fiche, ouvre la page publique du livre pour vérifier le résultat.

### Marquer un livre comme épuisé

Si vous n'avez plus d'exemplaires, cliquez sur « Marquer épuisé » dans la liste, ou cochez « Épuisé » dans la fiche puis enregistrez. Dès que vous recevez de nouveaux exemplaires, annulez l'état épuisé de la même façon. Le livre apparaît dans le filtre « Épuisés » tant qu'il l'est.

### Ajouter un livre

&#91;image: Formulaire Nouveau livre\]

1. Sur la page « Livres », cliquez sur « Ajouter un livre » en haut à droite.
2. Remplissez les mêmes champs que pour une modification : titre, prix, série, description et couverture.
3. Cliquez sur « Ajouter le livre ». Le livre est visible dans la boutique dès l'ajout, sauf si vous décochez « Visible dans la boutique » avant.

### Supprimer un livre

En bas de la fiche, la rubrique « Supprimer ce livre » cache son bouton derrière « Afficher le bouton de suppression », pour éviter les clics par erreur. Préférez « Masquer » : le livre peut revenir en un clic.

## 5. Consulter les messages

La page « Messages » regroupe ce que les visiteurs envoient depuis le site : questions sur une commande, demandes pour démarrer ou rejoindre un groupe d'étude, messages généraux.

&#91;image: Page Messages\]

Trois vues, avec un compteur sur les deux premières :

- À traiter : les messages auxquels vous n'avez pas encore répondu (le compteur est aussi sur le tableau de bord) ;
- Demandes de groupe : les personnes qui veulent démarrer ou rejoindre un groupe d'étude ;
- Tous : l'historique complet.

Chaque message indique l'expéditeur, son adresse e-mail, la date et le texte. Répondez depuis la boîte de l'association (contact@preceptfrance.fr), accessible par le lien « Webmail » du menu, qui ouvre webmail.migadu.com.

Quand rien n'attend, la page affiche « Aucun message dans cette vue. »

## 6. Gérer les paiements Stripe

La boutique encaisse par carte bancaire avec Stripe. La page « Paramètres » permet de choisir entre le mode test et le mode production, sans toucher au site ni redémarrer quoi que ce soit.

&#91;image: Paramètres de paiement Stripe\]

| Mode | Ce qui se passe |
| --- | --- |
| Mode Test (Staging / Tests) | On peut tester un achat avec les cartes de test de Stripe. Aucun compte réel n'est débité. |
| Mode Production (Transactions réelles) | Les clients paient pour de vrai. C'est le mode à laisser actif en temps normal. |

Le badge vert « MODE PRODUCTION » en haut à droite de la carte indique le mode actif. Le tableau de bord le rappelle aussi (« Live »).

### Faire un achat d'essai

1. Choisissez « Mode Test » et enregistrez la configuration.
2. Passez une commande sur le site avec la carte de test 4242 4242 4242 4242, une date future et un code à 3 chiffres.
3. Vérifiez que la commande arrive bien dans l'administration.
4. Revenez immédiatement en « Mode Production » et enregistrez.

Attention : tant que le mode test est actif, aucun client ne paie réellement. Ne le laissez pas actif après l'essai.

### Les clés et le point de terminaison

- Le point de terminaison Webhook (https://www.preceptfrance.fr/api/webhook) est l'adresse que Stripe appelle quand un paiement est terminé (événement checkout.session.completed). Il se déclare dans le tableau de bord Stripe, rubrique Développeurs, puis Webhooks ; le bouton « Copier » recopie l'adresse.
- Quatre champs de clés existent : clé secrète et secret de signature Webhook, en test et en production. Un badge « En base (chiffrée) » signale qu'une clé est déjà enregistrée ; elle s'affiche masquée.
- Laissez un champ vide pour conserver la clé actuelle. Les clés sont chiffrées avant stockage.
- Les boutons « Tester la connexion (Test) » et « Tester la connexion (Live) » vérifient que Stripe répond avec la clé enregistrée.
- « Enregistrer la configuration Stripe », en bas de la page, valide tout changement.

Ne copiez jamais une clé Stripe dans un e-mail ou un message : elle donne accès au compte de paiement.

## 7. Les ressources gratuites du site

Le site propose une page de ressources gratuites : <https://www.preceptfrance.fr/ressources>. Elle ne se gère pas depuis l'administration, mais vous pouvez en partager le lien aux pasteurs, aux responsables de jeunesse ou lors d'ateliers pour faire découvrir la méthode.

- 7 études bibliques en PDF : Un meilleur sacrifice (Hébreux 10), Crier à Dieu dans la détresse (Psaume 102), Comment savoir la vérité sur Dieu ? (Jean 1), Dieu parle ! (Psaume 19), Enflammez votre foi (Psaume 23), La paix de Dieu (Philippiens 4) et Courir pour remporter le prix.
- 6 outils à télécharger : la brochure de la méthode Précepte d'étude biblique, le signet de symboles et mots-clés, le signet O-I-A (Observer, Interpréter, Appliquer), le guide « Choisir l'étude idéale », la feuille synthétique de la méthode et le dépliant de présentation.

## 8. Questions fréquentes et dépannage

### Un client n'a pas reçu son e-mail de confirmation

1. Dans « Commandes », vue « Toutes », vérifiez que sa commande existe et qu'elle est bien payée.
2. Demandez-lui de regarder dans ses courriers indésirables.
3. Si besoin, envoyez-lui un récapitulatif depuis contact@preceptfrance.fr avec les détails de la commande.

### Un livre n'apparaît plus dans la boutique

Ouvrez « Livres » et regardez les filtres « Masqués » et « Épuisés ». Un livre masqué se remet en vente depuis sa fiche, en cochant « Visible dans la boutique ».

### Les changements de prix ou de stock sont-ils longs à apparaître ?

Non, ils sont immédiats après l'enregistrement. Si votre écran n'a pas changé, rechargez la page sans le cache : Ctrl + F5 sur Windows, Cmd + Maj + R sur Mac.

### Comment modifier les informations légales ?

Les mentions légales, les conditions générales de vente et la politique de confidentialité lisent toutes la même source, le fichier lib/legal.ts du site. Pour changer une information, demandez la mise à jour à la personne qui gère le site. Les informations actuelles :

| Information | Valeur |
| --- | --- |
| Numéro RNA | W943 008 438 |
| SIRET | 897 594 990 00011 |
| Adresse | 13 Rue Adèle, 92220 Bagneux |
| Représentant légal | Ammiel KOUADIO |
| Téléphone | +33 7 64 62 71 13 |

### Mon menu ne ressemble pas aux captures

L'administration est mise à jour de temps en temps. Les noms des pages (Livres, Commandes, Messages, Paramètres) restent les mêmes, même si le menu change de place.
