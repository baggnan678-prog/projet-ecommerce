/**
 * ============================================================
 *  catalogue.js — Filtrage, recherche et tri des produits
 * ============================================================
 *
 *  Ce fichier gère la page catalogue.html.
 *  Il permet à l'utilisateur de :
 *    - Filtrer les produits par catégorie (Tous / Informatique / Téléphonie / Audio / Accessoires)
 *    - Rechercher un produit par mot-clé (en temps réel, lettre par lettre)
 *    - Trier les résultats par prix (croissant ou décroissant)
 *
 *  Dépendances (chargées avant ce fichier dans catalogue.html) :
 *    - data.js  → fournit le tableau PRODUITS
 *    - main.js  → fournit genererCardProduit() et formaterPrix()
 *
 *  Fonctions de ce fichier :
 *    1. filtrerEtAfficher()   → Applique les filtres actifs et rafraîchit la grille
 *    2. afficherResultats()   → Insère les cartes produits dans le DOM
 *    3. initFiltres()         → Branche les événements (clics, saisie)
 * ============================================================
 */


/* ============================================================
   VARIABLES D'ÉTAT (état actuel des filtres)
   ============================================================ */

/**
 * categorieActive
 * ----------------
 * Stocke la catégorie sélectionnée par l'utilisateur.
 * Valeur initiale : 'tous' → aucun filtre, tous les produits sont affichés.
 * Valeurs possibles : 'tous', 'informatique', 'telephonie', 'audio', 'accessoires'
 */
let categorieActive = 'tous';

/**
 * triActif
 * ---------
 * Stocke le type de tri sélectionné.
 * null  → aucun tri (ordre d'origine du tableau PRODUITS)
 * 'asc' → prix croissant (du moins cher au plus cher)
 * 'desc'→ prix décroissant (du plus cher au moins cher)
 */
let triActif = null;

/**
 * recherche
 * ----------
 * Stocke le texte saisi par l'utilisateur dans la barre de recherche.
 * Initialement vide → pas de filtre de recherche.
 */
let recherche = '';


/* ============================================================
   1. FILTRER ET AFFICHER LES PRODUITS
   ============================================================ */

/**
 * filtrerEtAfficher()
 * --------------------
 * Fonction principale du catalogue.
 * Elle lit les 3 variables d'état (categorieActive, triActif, recherche),
 * applique les filtres sur le tableau PRODUITS, et appelle afficherResultats()
 * pour mettre à jour la page.
 *
 * Ordre d'application des traitements :
 *   1. Copie de tous les produits dans un tableau temporaire "resultats"
 *   2. Filtrage par catégorie (si une catégorie est choisie)
 *   3. Filtrage par recherche textuelle (si du texte est saisi)
 *   4. Tri par prix (si un tri est actif)
 *   5. Affichage des résultats filtrés/triés
 *
 * Cette fonction est appelée à chaque fois qu'un filtre change :
 *   - Clic sur une catégorie
 *   - Clic sur un bouton de tri
 *   - Frappe dans la barre de recherche
 */
function filtrerEtAfficher() {
  // Crée une copie du tableau PRODUITS (spread operator [...])
  // On ne modifie JAMAIS PRODUITS directement pour ne pas perdre les données
  let resultats = [...PRODUITS];

  /* ── Étape 1 : Filtre par catégorie ─────────────────────── */
  // Si l'utilisateur n'a pas choisi "Tous", on garde seulement
  // les produits dont la catégorie correspond à la sélection
  if (categorieActive !== 'tous') {
    resultats = resultats.filter(p => p.categorie === categorieActive);
    // Exemple : si categorieActive = 'audio', seuls les écouteurs et enceintes passent
  }

  /* ── Étape 2 : Filtre par texte de recherche ─────────────── */
  // Si l'utilisateur a tapé quelque chose (pas juste des espaces)
  if (recherche.trim() !== '') {
    const terme = recherche.toLowerCase().trim();
    // .trim() supprime les espaces en début/fin
    // .toLowerCase() rend la recherche insensible à la casse (minuscules/majuscules)

    resultats = resultats.filter(p =>
      p.nom.toLowerCase().includes(terme) ||          // Cherche dans le nom
      p.description.toLowerCase().includes(terme)     // Cherche aussi dans la description
    );
    // Exemple : "laptop" trouvera "Laptop ProMax 15" et "Laptop Essential"
  }

  /* ── Étape 3 : Tri par prix ──────────────────────────────── */
  if (triActif === 'asc') {
    // Prix croissant : a.prix - b.prix donne un nombre négatif si a < b
    // → sort() met a avant b (ordre croissant)
    resultats.sort((a, b) => a.prix - b.prix);
  } else if (triActif === 'desc') {
    // Prix décroissant : b.prix - a.prix donne un nombre négatif si b < a
    // → sort() met b avant a (ordre décroissant)
    resultats.sort((a, b) => b.prix - a.prix);
  }
  // Si triActif === null → pas de tri, l'ordre original est conservé

  /* ── Étape 4 : Affichage ─────────────────────────────────── */
  afficherResultats(resultats);
}


/* ============================================================
   2. AFFICHER LES RÉSULTATS DANS LA GRILLE
   ============================================================ */

/**
 * afficherResultats(produits)
 * ----------------------------
 * Vide la grille HTML et la remplit avec les cartes des produits
 * passés en paramètre.
 *
 * Gère aussi :
 *   - Le compteur de résultats (ex : "5 produit(s) trouvé(s)")
 *   - Le message "Aucun produit trouvé" si la liste est vide
 *
 * @param {Array} produits - Tableau de produits à afficher (déjà filtrés/triés)
 */
function afficherResultats(produits) {
  // Récupère les éléments HTML cibles dans la page
  const grille = document.getElementById('grille-produits');       // La grille des cards
  const compteur = document.getElementById('compteur-resultats');  // Le texte "X produit(s)"
  const messageVide = document.getElementById('message-vide');     // Message si aucun résultat

  // Si la grille n'existe pas dans la page, on arrête (sécurité)
  if (!grille) return;

  // Vide la grille avant de la remplir avec les nouveaux résultats
  grille.innerHTML = '';

  /* ── Cas : aucun résultat ─────────────────────────────────── */
  if (produits.length === 0) {
    // Affiche le message "Aucun produit trouvé"
    messageVide && (messageVide.style.display = 'flex');
    // Met à jour le compteur à 0
    if (compteur) compteur.textContent = '0 produit(s) trouvé(s)';
    return; // Sort de la fonction, il n'y a rien d'autre à faire
  }

  /* ── Cas : des résultats existent ───────────────────────────*/
  // Cache le message "vide" car on a des résultats à afficher
  messageVide && (messageVide.style.display = 'none');

  // Met à jour le compteur avec le nombre de produits trouvés
  if (compteur) {
    compteur.textContent = `${produits.length} produit(s) trouvé(s)`;
  }

  // Pour chaque produit du tableau, génère sa carte HTML et l'ajoute à la grille
  produits.forEach(produit => {
    const card = genererCardProduit(produit); // Fonction définie dans main.js
    grille.appendChild(card); // Ajoute la carte à la fin de la grille
  });
}


/* ============================================================
   3. INITIALISATION DES FILTRES (événements)
   ============================================================ */

/**
 * initFiltres()
 * --------------
 * Branche tous les écouteurs d'événements sur les boutons de filtre,
 * de tri et sur la barre de recherche.
 *
 * Cette fonction est appelée une seule fois au chargement de la page.
 * Après ça, toutes les interactions utilisateur sont automatiquement gérées.
 */
function initFiltres() {

  /* ── Boutons de catégorie ────────────────────────────────── */
  // Sélectionne tous les boutons ayant l'attribut data-categorie
  // Exemples : <button data-categorie="tous">, <button data-categorie="audio">
  document.querySelectorAll('[data-categorie]').forEach(btn => {
    btn.addEventListener('click', () => {

      // Retire la classe 'actif' de TOUS les boutons de catégorie
      // et remet aria-pressed à false (pour l'accessibilité)
      document.querySelectorAll('[data-categorie]').forEach(b => {
        b.classList.remove('actif');
        b.setAttribute('aria-pressed', 'false');
      });

      // Active visuellement le bouton cliqué
      btn.classList.add('actif');
      btn.setAttribute('aria-pressed', 'true'); // Indique aux lecteurs d'écran que ce bouton est actif

      // Met à jour la variable d'état avec la catégorie choisie
      // btn.dataset.categorie lit la valeur de l'attribut data-categorie du bouton
      categorieActive = btn.dataset.categorie;

      // Relance le filtrage et le rafraîchissement de la grille
      filtrerEtAfficher();
    });
  });

  /* ── Boutons de tri par prix ─────────────────────────────── */
  // Sélectionne tous les boutons ayant l'attribut data-tri
  // Exemples : <button data-tri="asc">, <button data-tri="desc">
  document.querySelectorAll('[data-tri]').forEach(btn => {
    btn.addEventListener('click', () => {
      const valeur = btn.dataset.tri; // 'asc' ou 'desc'

      if (triActif === valeur) {
        // Si l'utilisateur reclique sur le même tri → on le désactive (toggle)
        triActif = null;
        btn.classList.remove('actif');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        // Sinon, on active le nouveau tri et désactive l'ancien
        document.querySelectorAll('[data-tri]').forEach(b => {
          b.classList.remove('actif');
          b.setAttribute('aria-pressed', 'false');
        });
        triActif = valeur; // Mémorise le tri actif ('asc' ou 'desc')
        btn.classList.add('actif');
        btn.setAttribute('aria-pressed', 'true');
      }

      // Relance le filtrage avec le nouveau tri
      filtrerEtAfficher();
    });
  });

  /* ── Barre de recherche en temps réel ───────────────────── */
  // Sélectionne le champ de recherche (id="recherche")
  const barreRecherche = document.getElementById('recherche');

  if (barreRecherche) {
    // Événement 'input' : déclenché à chaque frappe de l'utilisateur
    // (contrairement à 'change' qui attend que l'utilisateur quitte le champ)
    barreRecherche.addEventListener('input', (e) => {
      recherche = e.target.value; // Mémorise le texte saisi
      filtrerEtAfficher();        // Relance le filtrage immédiatement
    });

    /* ── Bouton "effacer" la recherche ───────────────────── */
    // Le ? (optional chaining) empêche une erreur si le bouton n'existe pas
    document.getElementById('effacer-recherche')?.addEventListener('click', () => {
      barreRecherche.value = ''; // Vide le champ de recherche visuellement
      recherche = '';            // Réinitialise la variable d'état
      filtrerEtAfficher();       // Relance le filtrage (affiche tout)
      barreRecherche.focus();    // Remet le curseur dans le champ de recherche
    });
  }
}


/* ============================================================
   INITIALISATION AU CHARGEMENT DE LA PAGE
   ============================================================ */

/**
 * Événement DOMContentLoaded
 * ---------------------------
 * S'exécute automatiquement quand le HTML est chargé.
 *
 * Lance dans l'ordre :
 *  1. initFiltres()       → Active tous les boutons et la recherche
 *  2. filtrerEtAfficher() → Affiche tous les produits au chargement initial
 *
 * Note : main.js a déjà son propre DOMContentLoaded qui lance
 * initNavbar() et mettreAJourCompteurNavbar(). Les deux blocs
 * s'exécutent tous les deux, il n'y a pas de conflit.
 */
document.addEventListener('DOMContentLoaded', () => {
  initFiltres();      // Branche les écouteurs d'événements sur les filtres
  filtrerEtAfficher(); // Affiche tous les produits dès le chargement de la page
});
