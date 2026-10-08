# Guide d'utilisation : Gestion des clés Stripe depuis l'administration

Ce document détaille la procédure pour configurer, tester et gérer les clés de paiement Stripe directement depuis le panneau d'administration de Precept France.

---

## 1. Accès à la configuration

1. Rendez-vous sur l'espace d'administration : `https://www.preceptfrance.fr/admin` (ou `http://localhost:3000/admin` en local).
2. Connectez-vous avec le mot de passe administrateur.
3. Dans la barre de navigation supérieure, cliquez sur l'onglet **Paramètres** (ou accédez directement à `/admin/parametres`).
4. Vous pouvez également cliquer sur la carte **Paiements Stripe** présente sur le tableau de bord principal.

---

## 2. Basculer entre Mode Test et Mode Production

L'encadré **Environnement actif de paiement** permet de choisir le mode opérationnel de la boutique :

* 🟡 **Mode Test (Staging / Tests)** :
  * Utilise la clé secrète de test (`sk_test_...`) et le webhook de test.
  * Permet de passer des commandes avec les cartes bancaires fictives de Stripe (ex. `4242 4242 4242 4242`).
  * Aucun compte bancaire réel n'est débité.
* 🟢 **Mode Production (Transactions réelles)** :
  * Utilise la clé secrète de production (`sk_live_...`) et le webhook de production.
  * C'est le mode requis pour que les vrais clients puissent régler leurs achats en ligne.

> **Remarque :** Le changement prend effet immédiatement sur le site sans nécessiter de redémarrage du serveur.

---

## 3. Où récupérer vos clés dans le Dashboard Stripe

Connectez-vous à votre compte sur [dashboard.stripe.com](https://dashboard.stripe.com).

### 3.1. Clés d'API Secrètes
1. Allez dans le menu **Développeurs** (en haut à droite) > **Clés d'API** (`API keys`).
2. Pour les clés de test : activez l'interrupteur **« Mode test »** en haut à droite du tableau de bord Stripe. La clé commence par `sk_test_` (ou `rk_test_`).
3. Pour les clés réelles : désactivez le mode test. La clé commence par `sk_live_` (ou `rk_live_`).
4. Cliquez sur **Révéler la clé secrète** et copiez-la.

### 3.2. Secrets de signature Webhook (`whsec_...`)
1. Dans le tableau de bord Stripe, allez dans **Développeurs** > **Webhooks**.
2. Cliquez sur **Ajouter un point de terminaison** (Endpoint).
3. Renseignez l'URL du webhook :
   ```
   https://www.preceptfrance.fr/api/webhook
   ```
4. Sélectionnez l'événement à écouter :
   * `checkout.session.completed`
5. Cliquez sur **Ajouter le point de terminaison**.
6. Dans la page du webhook nouvellement créé, localisez la section **Secret de signature** (`Signing secret`) et cliquez sur **Révéler**.
7. Copiez la valeur (elle commence par `whsec_...`).

*(Répétez cette étape en Mode Test puis en Mode Production pour obtenir vos deux secrets distincts).*

---

## 4. Saisie et Enregistrement dans l'administration

Sur la page `/admin/parametres` :

1. **Clés Mode Test** :
   * Collez votre clé secrète de test (`sk_test_...`).
   * Collez votre secret de signature webhook test (`whsec_...`).
2. **Clés Mode Production** :
   * Collez votre clé secrète de production (`sk_live_...`).
   * Collez votre secret de signature webhook production (`whsec_...`).
3. Cliquez sur **« Enregistrer la configuration Stripe »** en bas de la page.

### Bonnes pratiques & Sécurité :
* **Chiffrement au repos** : Toutes les clés secrètes enregistrées sont automatiquement chiffrées en base de données avec l'algorithme fort **AES-256-GCM**.
* **Masquage à l'affichage** : Une fois enregistrées, les clés ne sont jamais réaffichées en clair dans le navigateur (ex. `sk_live_••••••••1a2b`).
* **Conservation des clés existantes** : Pour modifier uniquement une clé ou changer de mode, vous pouvez laisser les autres champs vides ; les clés déjà configurées ne seront pas écrasées.
* **Suppression / Retour au `.env`** : En cliquant sur l'icône corbeille rouge à côté d'une clé enregistrée en base, vous la supprimez de la base de données. L'application réutilise alors automatiquement la variable d'environnement définie dans `.env`.

---

## 5. Tester la connexion Stripe

Pour chaque environnement, un bouton **« Tester la connexion »** est mis à votre disposition :

* **Tester la clé actuelle** : Si vous laissez le champ vide et cliquez sur le bouton, l'application teste la clé actuellement active en mémoire ou en base de données.
* **Tester une nouvelle clé avant de sauvegarder** : Vous pouvez coller une nouvelle clé dans le champ et cliquer directement sur le bouton de test. Stripe confirmera immédiatement si la clé est valide et fonctionnelle.

Un message de validation vert (ou un rapport d'erreur explicite en cas de clé invalide) apparaîtra directement sous l'intitulé.

---

## 6. Vérification du cycle de commande complet

Pour valider que l'ensemble du flux fonctionne après configuration :

1. Basculez en **Mode Test**.
2. Allez sur la boutique (`/boutique`) et ajoutez un livre au panier.
3. Validez la commande pour être redirigé vers la page de paiement sécurisée Stripe.
4. Vérifiez que le bandeau jaune de test Stripe s'affiche en haut de la page de paiement.
5. Utilisez une carte de test Stripe (ex : `4242 4242 4242 4242`, date future, CVC `123`).
6. Validez le paiement et vérifiez la redirection vers `/boutique/succes`.
7. Retournez sur `/admin/commandes` : la commande doit apparaître avec le statut **Payée**.
8. Une fois les tests concluants, retournez sur `/admin/parametres` et sélectionnez **Mode Production** pour ouvrir les ventes réelles.

---

## 7. Résolution des problèmes fréquents

| Problème | Cause possible | Solution |
| :--- | :--- | :--- |
| **Erreur de préfixe lors de l'enregistrement** | Clé de test collée dans le formulaire de production (ou inversement). | Vérifiez que les clés de test commencent par `sk_test_` et celles de production par `sk_live_`. |
| **« Échec de connexion Stripe : Invalid API Key »** | La clé a été mal copiée ou révoquée sur Stripe. | Recopiez la clé complète depuis le dashboard Stripe. |
| **Le statut de la commande reste « En attente » après paiement** | Le webhook Stripe n'a pas pu joindre le site ou le secret est incorrect. | Vérifiez dans Stripe (*Développeurs > Webhooks*) les tentatives de livraison HTTP. Assurez-vous que le secret `whsec_...` correspond exactement au point de terminaison. |
| **Erreur 500 lors du paiement** | Aucune clé Stripe n'est configurée (ni en base ni dans `.env`). | Configurez au moins une clé secrète dans `/admin/parametres`. |
