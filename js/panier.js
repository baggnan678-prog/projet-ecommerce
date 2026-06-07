/**
 * ============================================================
 *  panier.js — Logique complète de la page panier
 * ============================================================
 *
 *  Ce fichier gère EXCLUSIVEMENT la page panier.html.
 *  Il ne s'exécute que sur cette page (pas sur les autres).
 *
 *  Fonctionnalités :
 *    - Afficher les articles du panier dans un tableau HTML
 *    - Modifier les quantités (boutons + et -)
 *    - Supprimer un article (avec confirmation par modale)
 *    - Vider tout le panier (avec confirmation par modale)
 *    - Calculer et afficher les totaux (sous-total, livraison, total)
 *    - Rediriger vers la page de commande (contact.html)
 *
 *  Dépendances (chargées avant dans panier.html) :
 *    - data.js  → fournit PRODUITS (pour retrouver les images, noms...)
 *    - main.js  → fournit getPanier(), sauvegarderPanier(),
 *                  mettreAJourCompteurNavbar(), formaterPrix()
 *
 *  Fonctions de ce fichier :
 *    1. afficherPanier()          → Construit le tableau HTML du panier
 *    2. modifierQuantite()        → Augmente ou diminue la quantité d'un article
 *    3. supprimerArticle()        → Retire définitivement un article
 *    4. viderPanier()             → Vide entièrement le panier
 *    5. calculerTotaux()          → Met à jour les montants affichés
 *    6. ouvrirModalSuppression()  → Ouvre la boîte de confirmation "Supprimer ?"
 *    7. fermerModalSuppression()  → Ferme cette boîte de confirmation
 *    8. ouvrirModalVider()        → Ouvre la boîte de confirmation "Vider le panier ?"
 *    9. fermerModalVider()        → Ferme cette boîte de confirmation
 * ============================================================
 */


/* ============================================================
   CONSTANTE : FRAIS DE LIVRAISON
   ============================================================ */

/**
 * FRAIS_LIVRAISON
 * ----------------
 * Montant fixe des frais de livraison en FCFA.
 * Ajouté au sous-total si le panier contient au moins un article.
 * Si le panier est vide, les frais ne sont pas comptés.
 */
const FRAIS_LIVRAISON = 5000; // 5 000 FCFA


/* ============================================================
   1. AFFICHER LE PANIER
   ============================================================ */

/**
 * afficherPanier()
 * -----------------
 * Fonction principale de la page panier.
 * Construit dynamiquement le tableau HTML listant tous les articles.
 *
 * Comportement selon l'état du panier :
 *   - Panier VIDE    → affiche le message "Votre panier est vide"
 *                      et cache le tableau
 *   - Panier NON VIDE → cache le message vide, affiche le tableau
 *                       avec tous les articles, et calcule les totaux
 *
 * Pour chaque article, la ligne du tableau contient :
 *   - L'image + le nom + le prix unitaire (colonne Produit)
 *   - Le prix unitaire seul (colonne Prix unitaire)
 *   - Les boutons − quantite + (colonne Quantité)
 *   - Le sous-total de la ligne = prix × quantité (colonne Sous-total)
 *   - Le bouton × pour supprimer l'article (dernière colonne)
 */
function afficherPanier() {
  // Récupère le panier depuis localStorage via getPanier() (défini dans main.js)
  const panier = getPanier();

  // Récupère les éléments HTML de la page
  const corps = document.getElementById('panier-corps');  // Le <tbody> du tableau
  const vide = document.getElementById('panier-vide');    // La zone "panier vide"
  const plein = document.getElementById('panier-plein');  // La zone "panier avec articles"

  // Sécurité : si le <tbody> n'existe pas, on arrête
  if (!corps) return;

  /* ── Cas : panier vide ───────────────────────────────────── */
  if (panier.length === 0) {
    // Affiche le message "Votre panier est vide"
    vide && (vide.style.display = 'flex');
    // Cache la zone du tableau (articles + résumé)
    plein && (plein.style.display = 'none');
    return; // Rien d'autre à faire
  }

  /* ── Cas : panier non vide ───────────────────────────────── */
  // Cache le message "vide" et affiche la zone du tableau
  vide && (vide.style.display = 'none');
  plein && (plein.style.display = 'block');

  // Vide le contenu actuel du tableau avant de le reconstruire
  corps.innerHTML = '';

  /* ── Construction des lignes du tableau ──────────────────── */
  // Pour chaque article dans le panier, on crée une ligne <tr>
  panier.forEach(item => {

    /* Prépare l'image ou un placeholder avec la première lettre */
    const imageHTML = item.image
      ? `<img src="${item.image}" alt="${item.nom}" class="panier-img" loading="lazy">`
      : `<div class="panier-img-placeholder">${item.nom.charAt(0)}</div>`;

    // Crée un élément <tr> (ligne de tableau)
    const tr = document.createElement('tr');

    // Remplit la ligne avec les colonnes du tableau
    // formaterPrix() est défini dans main.js et formate en "X FCFA"
    tr.innerHTML = `
      <td data-label="Produit">
        <div class="panier-produit-info">
          <div class="panier-img-wrap">${imageHTML}</div>
          <div>
            <!-- Lien cliquable vers la page détail du produit -->
            <a href="produit.html?id=${item.id}" class="panier-nom">${item.nom}</a>
            <span class="panier-prix-unit">${formaterPrix(item.prix)} / unité</span>
          </div>
        </div>
      </td>
      <td data-label="Prix unitaire">${formaterPrix(item.prix)}</td>
      <td data-label="Quantité">
        <!-- Contrôles de quantité : bouton − / valeur / bouton + -->
        <div class="quantite-ctrl">
          <button class="btn-quantite" data-action="moins" data-id="${item.id}" aria-label="Diminuer la quantité">−</button>
          <span class="quantite-val" aria-live="polite">${item.quantite}</span>
          <button class="btn-quantite" data-action="plus" data-id="${item.id}" aria-label="Augmenter la quantité">+</button>
        </div>
      </td>
      <!-- Sous-total de la ligne = prix × quantité -->
      <td data-label="Sous-total">${formaterPrix(item.prix * item.quantite)}</td>
      <td data-label="Supprimer">
        <!-- Bouton × pour demander la suppression de l'article -->
        <button class="btn-supprimer" data-id="${item.id}" aria-label="Supprimer ${item.nom}">×</button>
      </td>
    `;

    // Ajoute la ligne au <tbody> du tableau
    corps.appendChild(tr);
  });

  /* ── Événements sur les boutons de quantité ──────────────── */
  // On sélectionne TOUS les boutons + et − dans le tableau
  corps.querySelectorAll('.btn-quantite').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);      // Récupère l'id du produit (converti en nombre)
      const action = btn.dataset.action;        // 'plus' ou 'moins'
      modifierQuantite(id, action);             // Appelle la fonction de modification
    });
  });

  /* ── Événements sur les boutons de suppression ───────────── */
  // On sélectionne TOUS les boutons × dans le tableau
  corps.querySelectorAll('.btn-supprimer').forEach(btn => {
    btn.addEventListener('click', () => {
      // Ouvre la modale de confirmation avant de supprimer
      // parseInt convertit la chaîne "1" en nombre 1
      ouvrirModalSuppression(parseInt(btn.dataset.id));
    });
  });

  /* ── Met à jour les totaux en bas de page ────────────────── */
  calculerTotaux();
}


/* ============================================================
   2. MODIFIER LA QUANTITÉ D'UN ARTICLE
   ============================================================ */

/**
 * modifierQuantite(id, action)
 * -----------------------------
 * Augmente ou diminue la quantité d'un article dans le panier.
 *
 * Si la quantité passe à 0 ou moins → l'article est automatiquement
 * retiré du panier (splice).
 *
 * Après la modification :
 *   1. Sauvegarde le panier dans localStorage
 *   2. Met à jour le compteur dans la navbar
 *   3. Rafraîchit l'affichage du panier
 *
 * @param {number} id     - L'id du produit à modifier
 * @param {string} action - 'plus' pour augmenter, 'moins' pour diminuer
 */
function modifierQuantite(id, action) {
  const panier = getPanier(); // Récupère le panier actuel

  // Trouve la position de l'article dans le tableau du panier
  const index = panier.findIndex(item => item.id === id);

  // Si l'article n'est pas trouvé (ne devrait pas arriver), on arrête
  if (index === -1) return;

  if (action === 'plus') {
    // Augmente la quantité de 1
    panier[index].quantite += 1;
  } else if (action === 'moins') {
    // Diminue la quantité de 1
    panier[index].quantite -= 1;

    // Si la quantité est maintenant à 0 ou négative → supprime l'article
    // splice(index, 1) retire 1 élément à la position "index"
    if (panier[index].quantite <= 0) {
      panier.splice(index, 1);
    }
  }

  sauvegarderPanier(panier);      // Enregistre le panier modifié
  mettreAJourCompteurNavbar();    // Synchronise le badge de la navbar
  afficherPanier();               // Reconstruit le tableau du panier
}


/* ============================================================
   3. SUPPRIMER UN ARTICLE DU PANIER
   ============================================================ */

/**
 * supprimerArticle(id)
 * ---------------------
 * Retire définitivement un article du panier (quelle que soit sa quantité).
 *
 * Utilise .filter() pour créer un nouveau tableau sans l'article à supprimer.
 * (Contrairement à splice, filter ne modifie pas le tableau original)
 *
 * @param {number} id - L'id de l'article à supprimer
 */
function supprimerArticle(id) {
  // Garde tous les articles SAUF celui dont l'id correspond
  const panier = getPanier().filter(item => item.id !== id);

  sauvegarderPanier(panier);    // Enregistre le panier sans l'article
  mettreAJourCompteurNavbar();  // Synchronise le badge
  afficherPanier();             // Rafraîchit l'affichage
}


/* ============================================================
   4. VIDER TOUT LE PANIER
   ============================================================ */

/**
 * viderPanier()
 * --------------
 * Supprime tous les articles du panier en une seule opération.
 * Sauvegarde un tableau vide [] dans localStorage.
 */
function viderPanier() {
  sauvegarderPanier([]);        // Remplace le panier par un tableau vide
  mettreAJourCompteurNavbar();  // Le compteur doit afficher 0
  afficherPanier();             // Rafraîchit pour afficher le message "panier vide"
}


/* ============================================================
   5. CALCULER ET AFFICHER LES TOTAUX
   ============================================================ */

/**
 * calculerTotaux()
 * -----------------
 * Calcule le sous-total, les frais de livraison et le total général,
 * puis met à jour les éléments HTML correspondants dans le résumé de commande.
 *
 * Calculs effectués :
 *   sous-total = somme de (prix × quantité) pour chaque article
 *   livraison  = FRAIS_LIVRAISON si le panier n'est pas vide, sinon 0
 *   total      = sous-total + livraison
 *
 * Éléments HTML mis à jour :
 *   #sous-total     → montant des articles
 *   #frais-livraison→ frais de livraison (ou "—" si panier vide)
 *   #total-general  → montant total à payer
 *   #nb-articles    → nombre total d'articles (ex : "3 articles")
 */
function calculerTotaux() {
  const panier = getPanier();

  /* ── Calcul du sous-total ────────────────────────────────── */
  // reduce parcourt tous les articles et accumule (prix × quantité)
  // acc = accumulateur (commence à 0)
  // item.prix * item.quantite = prix total de cet article
  const sousTotal = panier.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  /* ── Calcul du total général ─────────────────────────────── */
  // Si le panier est vide → pas de frais de livraison
  const total = sousTotal + (panier.length > 0 ? FRAIS_LIVRAISON : 0);

  /* ── Récupération des éléments HTML à mettre à jour ─────── */
  const elSousTotal  = document.getElementById('sous-total');
  const elLivraison  = document.getElementById('frais-livraison');
  const elTotal      = document.getElementById('total-general');
  const elNbArticles = document.getElementById('nb-articles');

  /* ── Mise à jour du DOM ──────────────────────────────────── */
  // On vérifie que l'élément existe avant de le modifier (pour éviter les erreurs)
  if (elSousTotal) elSousTotal.textContent = formaterPrix(sousTotal);

  // Les frais de livraison affichent "—" si le panier est vide
  if (elLivraison) elLivraison.textContent = panier.length > 0 ? formaterPrix(FRAIS_LIVRAISON) : '—';

  // Si panier vide → affiche 0 FCFA pour le total
  if (elTotal) elTotal.textContent = formaterPrix(panier.length > 0 ? total : 0);

  // Nombre total d'articles (ex : "3 articles" ou "1 article")
  if (elNbArticles) {
    const nb = panier.reduce((acc, item) => acc + item.quantite, 0);
    // Pluriel conditionnel : 's' si nb > 1, '' si nb = 1
    elNbArticles.textContent = `${nb} article${nb > 1 ? 's' : ''}`;
  }
}


/* ============================================================
   MODALES DE CONFIRMATION
   ============================================================
   Les modales sont des boîtes de dialogue qui demandent une
   confirmation avant d'effectuer une action irréversible.
   Il y en a deux :
     - modal-suppression : pour supprimer un article spécifique
     - modal-vider       : pour vider tout le panier
   ============================================================ */

/**
 * idArticleASupprimer
 * --------------------
 * Variable qui mémorise l'id du produit dont la suppression
 * est en attente de confirmation.
 * Vaut null si aucune suppression n'est en cours.
 */
let idArticleASupprimer = null;


/* ── Modale "Supprimer un article" ──────────────────────── */

/**
 * ouvrirModalSuppression(id)
 * ---------------------------
 * Ouvre la boîte de dialogue de confirmation de suppression.
 * Mémorise l'id de l'article concerné dans idArticleASupprimer.
 * Place le focus sur le bouton "Oui, supprimer" (accessibilité).
 *
 * @param {number} id - L'id de l'article à éventuellement supprimer
 */
function ouvrirModalSuppression(id) {
  idArticleASupprimer = id; // Mémorise l'id pour l'utiliser si l'utilisateur confirme

  const modal = document.getElementById('modal-suppression');
  if (modal) {
    modal.setAttribute('aria-hidden', 'false'); // Rend la modale accessible
    modal.classList.add('visible');             // Affiche la modale (animation CSS)

    // Place le focus sur le bouton de confirmation (attribut data-focus)
    // ? = optional chaining, évite une erreur si le bouton n'existe pas
    modal.querySelector('[data-focus]')?.focus();
  }
}

/**
 * fermerModalSuppression()
 * -------------------------
 * Ferme la boîte de dialogue de suppression sans rien supprimer.
 * Réinitialise idArticleASupprimer à null.
 */
function fermerModalSuppression() {
  idArticleASupprimer = null; // Oublie l'id : la suppression est annulée

  const modal = document.getElementById('modal-suppression');
  if (modal) {
    modal.setAttribute('aria-hidden', 'true'); // Cache la modale aux lecteurs d'écran
    modal.classList.remove('visible');         // Masque la modale visuellement
  }
}


/* ── Modale "Vider le panier" ───────────────────────────── */

/**
 * ouvrirModalVider()
 * -------------------
 * Ouvre la boîte de dialogue de confirmation "Vider le panier ?".
 * Cette action est irréversible, d'où la demande de confirmation.
 */
function ouvrirModalVider() {
  const modal = document.getElementById('modal-vider');
  if (modal) {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('visible');
  }
}

/**
 * fermerModalVider()
 * -------------------
 * Ferme la boîte de dialogue "Vider le panier ?" sans vider le panier.
 */
function fermerModalVider() {
  const modal = document.getElementById('modal-vider');
  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('visible');
  }
}


/* ============================================================
   INITIALISATION DE LA PAGE PANIER
   ============================================================ */

/**
 * Événement DOMContentLoaded
 * ---------------------------
 * S'exécute automatiquement quand le HTML de panier.html est chargé.
 * Initialise toutes les interactions de la page.
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Affichage initial du panier ─────────────────────────── */
  afficherPanier(); // Construit le tableau dès l'ouverture de la page

  /* ── Bouton "Vider le panier" ────────────────────────────── */
  // Le ? empêche une erreur si le bouton n'existe pas dans la page
  document.getElementById('btn-vider')?.addEventListener('click', ouvrirModalVider);

  /* ── Boutons de la modale "Supprimer un article" ─────────── */

  // Bouton "Oui, supprimer" → supprime l'article et ferme la modale
  document.getElementById('modal-suppr-confirmer')?.addEventListener('click', () => {
    if (idArticleASupprimer !== null) {
      supprimerArticle(idArticleASupprimer); // Supprime l'article mémorisé
    }
    fermerModalSuppression(); // Ferme la modale dans tous les cas
  });

  // Bouton "Annuler" → ferme la modale sans rien supprimer
  document.getElementById('modal-suppr-annuler')?.addEventListener('click', fermerModalSuppression);

  /* ── Boutons de la modale "Vider le panier" ──────────────── */

  // Bouton "Oui, vider" → vide le panier et ferme la modale
  document.getElementById('modal-vider-confirmer')?.addEventListener('click', () => {
    viderPanier();      // Supprime tous les articles
    fermerModalVider(); // Ferme la modale
  });

  // Bouton "Annuler" → ferme la modale sans vider le panier
  document.getElementById('modal-vider-annuler')?.addEventListener('click', fermerModalVider);

  /* ── Fermeture des modales en cliquant en dehors ─────────── */
  // Si l'utilisateur clique sur le fond sombre (overlay) de la modale,
  // on ferme la modale (e.target === modal signifie qu'on a cliqué sur
  // l'arrière-plan et non sur la boîte de dialogue elle-même)
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) { // Clic sur le fond et non sur la boîte
        modal.classList.remove('visible');
        modal.setAttribute('aria-hidden', 'true');
        idArticleASupprimer = null; // Réinitialise au cas où c'était la modale de suppression
      }
    });
  });

  /* ── Fermeture des modales avec la touche Échap ──────────── */
  // Comportement standard des boîtes de dialogue : Échap = fermer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      fermerModalSuppression(); // Ferme la modale de suppression si ouverte
      fermerModalVider();       // Ferme la modale "vider" si ouverte
    }
  });

  /* ── Bouton "Commander" ──────────────────────────────────── */
  // Redirige vers la page de commande seulement si le panier n'est pas vide
  document.getElementById('btn-commander')?.addEventListener('click', () => {
    if (getPanier().length > 0) {
      // Redirige vers contact.html pour finaliser la commande
      window.location.href = 'contact.html';
    }
    // Si le panier est vide, rien ne se passe (le bouton est inactif visuellement)
  });
});
