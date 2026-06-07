/**
 * ============================================================
 *  main.js — Fonctions partagées par toutes les pages
 * ============================================================
 *
 *  Ce fichier est chargé sur CHAQUE page du site (après data.js).
 *  Il contient les fonctions utilitaires réutilisables :
 *
 *  1. initNavbar()              → Menu hamburger (mobile)
 *  2. mettreAJourCompteurNavbar() → Compteur d'articles dans l'icône Panier
 *  3. getPanier()               → Lire le panier depuis le navigateur
 *  4. sauvegarderPanier()       → Écrire le panier dans le navigateur
 *  5. ajouterAuPanier()         → Ajouter/incrémenter un produit dans le panier
 *  6. afficherFeedbackPanier()  → Toast "Produit ajouté au panier"
 *  7. formaterPrix()            → Formater un nombre en "X FCFA"
 *  8. genererCardProduit()      → Créer la carte HTML d'un produit
 *
 *  Le panier est stocké dans localStorage du navigateur sous la
 *  clé "panier". C'est un tableau JSON d'objets produit avec
 *  une propriété "quantite" supplémentaire.
 * ============================================================
 */


/* ============================================================
   1. MENU HAMBURGER (navigation mobile)
   ============================================================ */

/**
 * initNavbar()
 * ------------
 * Active le menu hamburger pour les écrans mobiles.
 *
 * Comportement :
 *  - Clic sur le bouton ☰ (id="burger") → ouvre/ferme le menu
 *  - Clic sur un lien du menu → ferme automatiquement le menu
 *  - Clic en dehors du menu → ferme automatiquement le menu
 *
 * Le menu est ouvert/fermé en ajoutant/retirant la classe CSS "open"
 * sur l'élément <ul id="nav-links">.
 *
 * aria-expanded est mis à jour pour l'accessibilité (lecteurs d'écran).
 */
function initNavbar() {
  // Récupère le bouton hamburger et la liste de liens du menu
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');

  // Si l'un des deux éléments est absent de la page, on sort immédiatement
  if (!burger || !navLinks) return;

  /* ── Clic sur le bouton hamburger ────────────────────────── */
  burger.addEventListener('click', () => {
    // toggle('open') ajoute 'open' si absent, le retire si présent
    // La valeur retournée indique si la classe est maintenant présente (true) ou non (false)
    const ouvert = navLinks.classList.toggle('open');

    // Met à jour l'attribut d'accessibilité (true = menu ouvert, false = menu fermé)
    burger.setAttribute('aria-expanded', ouvert);

    // Ajoute/retire la classe 'actif' sur le bouton (pour l'animation des 3 traits → croix)
    burger.classList.toggle('actif', ouvert);
  });

  /* ── Clic sur n'importe quel lien du menu ────────────────── */
  // Quand l'utilisateur clique sur un lien, on ferme le menu
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');   // Ferme le menu
      burger.classList.remove('actif');    // Remet le bouton à l'état normal
      burger.setAttribute('aria-expanded', false);
    });
  });

  /* ── Clic en dehors du menu ──────────────────────────────── */
  // Si l'utilisateur clique ailleurs que sur le burger ou le menu, on ferme
  document.addEventListener('click', (e) => {
    // e.target = l'élément sur lequel l'utilisateur a cliqué
    // .contains() vérifie si l'élément cliqué est DANS le burger ou le menu
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('actif');
      burger.setAttribute('aria-expanded', false);
    }
  });
}


/* ============================================================
   2. COMPTEUR PANIER DANS LA NAVBAR
   ============================================================ */

/**
 * mettreAJourCompteurNavbar()
 * ----------------------------
 * Met à jour le badge numérique affiché sur l'icône "Panier"
 * dans la barre de navigation.
 *
 * Exemple : si le panier contient 2 laptops + 1 souris,
 *           le badge affiche "3".
 *
 * Le badge se cache automatiquement si le panier est vide (total = 0).
 *
 * Tous les éléments ayant la classe CSS "panier-compteur" sont mis
 * à jour (il peut y en avoir plusieurs si la navbar est dupliquée).
 */
function mettreAJourCompteurNavbar() {
  const panier = getPanier(); // Récupère le tableau des articles

  // Additionne les quantités de tous les articles
  // acc = accumulateur (commence à 0), item.quantite = quantité de chaque article
  const total = panier.reduce((acc, item) => acc + item.quantite, 0);

  // Met à jour chaque badge ".panier-compteur" dans la page
  document.querySelectorAll('.panier-compteur').forEach(el => {
    el.textContent = total; // Affiche le nombre total

    // Affiche le badge seulement si le total est supérieur à 0
    // 'inline-flex' = visible, 'none' = caché
    el.style.display = total > 0 ? 'inline-flex' : 'none';
  });
}


/* ============================================================
   3. LIRE LE PANIER (localStorage)
   ============================================================ */

/**
 * getPanier()
 * -----------
 * Lit et retourne le contenu du panier depuis le localStorage
 * du navigateur.
 *
 * Le localStorage stocke tout en texte (string). JSON.parse()
 * convertit ce texte en tableau JavaScript d'objets produit.
 *
 * Retourne :
 *  - Le tableau des articles si le panier existe
 *  - Un tableau vide [] si le panier est vide ou si une erreur survient
 *
 * Le try/catch protège contre les erreurs si localStorage est
 * désactivé (ex : navigation privée avec restrictions).
 */
function getPanier() {
  try {
    // localStorage.getItem('panier') → renvoie une chaîne JSON ou null
    // JSON.parse(null) retourne null, donc on utilise || [] pour renvoyer un tableau vide
    return JSON.parse(localStorage.getItem('panier')) || [];
  } catch {
    // En cas d'erreur (JSON invalide, localStorage bloqué...), on renvoie un tableau vide
    return [];
  }
}


/* ============================================================
   4. SAUVEGARDER LE PANIER (localStorage)
   ============================================================ */

/**
 * sauvegarderPanier(panier)
 * --------------------------
 * Enregistre le tableau d'articles dans le localStorage du navigateur.
 *
 * JSON.stringify() convertit le tableau JavaScript en texte JSON
 * pour pouvoir le stocker (localStorage ne supporte que les strings).
 *
 * @param {Array} panier - Tableau d'objets produit avec propriété "quantite"
 *
 * Exemple de contenu stocké :
 * [{"id":1,"nom":"Laptop ProMax","prix":450000,"quantite":2}, ...]
 */
function sauvegarderPanier(panier) {
  localStorage.setItem('panier', JSON.stringify(panier));
}


/* ============================================================
   5. AJOUTER UN PRODUIT AU PANIER
   ============================================================ */

/**
 * ajouterAuPanier(produitId, quantite)
 * --------------------------------------
 * Ajoute un produit au panier ou augmente sa quantité s'il est
 * déjà présent.
 *
 * Logique :
 *  1. Cherche le produit dans la liste PRODUITS (data.js) via son id
 *  2. Cherche si ce produit est déjà dans le panier
 *  3a. Si oui → augmente la quantité existante
 *  3b. Si non → ajoute une nouvelle entrée dans le panier
 *  4. Sauvegarde, met à jour le compteur et affiche un toast
 *
 * @param {number} produitId - L'id du produit à ajouter (ex : 1, 2, 3...)
 * @param {number} [quantite=1] - Quantité à ajouter (défaut : 1)
 */
function ajouterAuPanier(produitId, quantite = 1) {
  // Cherche le produit dans le tableau PRODUITS (défini dans data.js)
  const produit = PRODUITS.find(p => p.id === produitId);

  // Si le produit n'existe pas (id invalide), on arrête
  if (!produit) return;

  // Récupère le panier actuel depuis localStorage
  const panier = getPanier();

  // Cherche si ce produit est déjà dans le panier
  // findIndex retourne -1 si non trouvé
  const index = panier.findIndex(item => item.id === produitId);

  if (index !== -1) {
    // Le produit EST déjà dans le panier → on augmente sa quantité
    panier[index].quantite += quantite;
  } else {
    // Le produit N'EST PAS encore dans le panier → on l'ajoute
    // Le spread operator {...produit} copie toutes les propriétés du produit
    // On y ajoute la propriété "quantite"
    panier.push({ ...produit, quantite });
  }

  // Enregistre le panier modifié dans localStorage
  sauvegarderPanier(panier);

  // Met à jour le badge numérique dans la navbar
  mettreAJourCompteurNavbar();

  // Affiche une notification "Produit ajouté au panier"
  afficherFeedbackPanier();
}


/* ============================================================
   6. NOTIFICATION TOAST "PRODUIT AJOUTÉ"
   ============================================================ */

/**
 * afficherFeedbackPanier()
 * -------------------------
 * Affiche une petite notification temporaire en bas de l'écran
 * pour confirmer que le produit a bien été ajouté au panier.
 *
 * Ce "toast" (petite boîte de notification) est créé dynamiquement
 * la première fois, puis réutilisé pour les appels suivants.
 *
 * Il disparaît automatiquement après 2,5 secondes (2500 ms).
 *
 * Le clearTimeout évite les bugs si l'utilisateur ajoute plusieurs
 * produits rapidement : le timer repart toujours à zéro.
 */
function afficherFeedbackPanier() {
  // Cherche si le toast existe déjà dans la page
  let toast = document.getElementById('toast-panier');

  if (!toast) {
    // Première utilisation : on crée l'élément <div> du toast
    toast = document.createElement('div');
    toast.id = 'toast-panier';

    // Attributs d'accessibilité : annonce le texte aux lecteurs d'écran
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    // Ajoute le toast au bas de la page
    document.body.appendChild(toast);
  }

  // Définit le message affiché dans le toast
  toast.textContent = 'Produit ajouté au panier';

  // Rend le toast visible (la classe CSS 'visible' le fait apparaître avec une animation)
  toast.classList.add('visible');

  // Annule le timer précédent si le toast était déjà affiché
  // (évite qu'il disparaisse trop tôt si on ajoute plusieurs produits vite)
  clearTimeout(toast._timer);

  // Programme la disparition du toast après 2,5 secondes
  toast._timer = setTimeout(() => toast.classList.remove('visible'), 2500);
}


/* ============================================================
   7. FORMATER UN PRIX EN FCFA
   ============================================================ */

/**
 * formaterPrix(montant)
 * ----------------------
 * Convertit un nombre entier en chaîne de caractères lisible
 * avec le format français et la devise FCFA.
 *
 * Exemples :
 *   formaterPrix(450000)  →  "450 000 FCFA"
 *   formaterPrix(3500)    →  "3 500 FCFA"
 *   formaterPrix(28000)   →  "28 000 FCFA"
 *
 * Intl.NumberFormat est une API native du navigateur pour
 * formater les nombres selon les conventions locales.
 * 'fr-FR' utilise l'espace comme séparateur de milliers.
 *
 * @param {number} montant - Le montant en FCFA (nombre entier)
 * @returns {string} Le montant formaté avec l'unité "FCFA"
 */
function formaterPrix(montant) {
  // new Intl.NumberFormat('fr-FR') crée un formateur pour le français (France)
  // .format(montant) applique le formatage au nombre
  // + ' FCFA' ajoute l'unité monétaire
  return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
}


/* ============================================================
   8. GÉNÉRER LA CARTE HTML D'UN PRODUIT
   ============================================================ */

/**
 * genererCardProduit(produit)
 * ----------------------------
 * Crée et retourne un élément HTML <article> représentant
 * la carte visuelle d'un produit (image, nom, prix, bouton panier).
 *
 * Cette fonction est utilisée dans :
 *  - index.html     → section "Produits vedettes"
 *  - catalogue.js   → grille de tous les produits
 *  - produit.html   → section "Produits similaires"
 *
 * La carte contient :
 *  - Un badge (PROMO / NOUVEAU) si applicable
 *  - Un lien cliquable vers la page détail du produit
 *  - L'image du produit (ou une initiale si pas d'image)
 *  - Le nom, la description, le prix (et l'ancien prix si promo)
 *  - Un bouton "Ajouter au panier"
 *
 * @param {Object} produit - Un objet produit de data.js
 * @returns {HTMLElement} L'élément <article> créé, prêt à insérer dans le DOM
 */
function genererCardProduit(produit) {

  /* ── Prépare le HTML de l'ancien prix ────────────────────── */
  // Si ancienPrix existe, on crée le <span> avec le prix barré
  // Sinon, on retourne une chaîne vide (rien n'est affiché)
  const ancienPrixHTML = produit.ancienPrix
    ? `<span class="ancien-prix">${formaterPrix(produit.ancienPrix)}</span>`
    : '';

  /* ── Prépare le HTML du badge (PROMO / NOUVEAU) ──────────── */
  // .toLowerCase() transforme "PROMO" en "promo" pour la classe CSS badge--promo
  const badgeHTML = produit.badge
    ? `<span class="badge badge--${produit.badge.toLowerCase()}">${produit.badge}</span>`
    : '';

  /* ── Prépare le HTML de l'image ──────────────────────────── */
  // Si le produit a une URL d'image → affiche un <img>
  // Sinon → affiche un carré avec la première lettre du nom (fallback)
  const imageHTML = produit.image
    ? `<img src="${produit.image}" alt="${produit.nom}" class="card-img" loading="lazy">`
    : `<div class="card-img-placeholder">${produit.nom.charAt(0)}</div>`;

  /* ── Crée l'élément HTML <article> ──────────────────────── */
  const article = document.createElement('article');
  article.className = 'card-produit'; // Classe CSS pour le style de la carte

  // innerHTML remplit l'article avec le HTML de la carte
  // Les template literals (backticks ``) permettent d'insérer les variables directement
  article.innerHTML = `
    ${badgeHTML}
    <a href="produit.html?id=${produit.id}" class="card-lien-image" aria-label="Voir ${produit.nom}">
      <div class="card-image-wrap">${imageHTML}</div>
    </a>
    <div class="card-corps">
      <h3 class="card-nom">
        <a href="produit.html?id=${produit.id}">${produit.nom}</a>
      </h3>
      <p class="card-description">${produit.description}</p>
      <div class="card-prix">
        <span class="prix-actuel">${formaterPrix(produit.prix)}</span>
        ${ancienPrixHTML}
      </div>
      <button class="btn btn--primaire btn--panier" data-id="${produit.id}" aria-label="Ajouter ${produit.nom} au panier">
        Ajouter au panier
      </button>
    </div>
  `;

  /* ── Gestion du bouton "Ajouter au panier" ───────────────── */
  // On sélectionne le bouton dans la carte qu'on vient de créer
  article.querySelector('.btn--panier').addEventListener('click', (e) => {
    // e.preventDefault() empêche la navigation si le bouton est dans un <a>
    e.preventDefault();

    // Ajoute le produit au panier (quantité 1 par défaut)
    ajouterAuPanier(produit.id);

    // Feedback visuel sur le bouton : il se désactive et affiche "Ajouté !"
    const btn = e.currentTarget;
    btn.textContent = 'Ajouté !';
    btn.disabled = true; // Empêche les clics multiples rapides

    // Après 1,8 secondes, le bouton retrouve son état normal
    setTimeout(() => {
      btn.textContent = 'Ajouter au panier';
      btn.disabled = false;
    }, 1800);
  });

  // Retourne l'élément <article> créé, prêt à être inséré dans la page
  return article;
}


/* ============================================================
   INITIALISATION AU CHARGEMENT DE LA PAGE
   ============================================================ */

/**
 * Événement DOMContentLoaded
 * ---------------------------
 * Ce bloc s'exécute automatiquement dès que le HTML de la page
 * est entièrement chargé et analysé par le navigateur.
 *
 * Il appelle les fonctions d'initialisation communes à toutes les pages :
 *  - initNavbar()               → Active le menu hamburger
 *  - mettreAJourCompteurNavbar() → Affiche le bon nombre d'articles dans le panier
 */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();              // Active le menu hamburger mobile
  mettreAJourCompteurNavbar(); // Synchronise le compteur panier avec localStorage
});
