================================================================
  TECHBF — Site E-Commerce | Projet Final Formation Web
================================================================

AUTEUR    : Baggnan Seydou
FORMATION : Génie Logiciel — UTM Ouagadougou
ANNÉE     : 2026
THÈME     : Boutique d'électronique et d'accessoires high-tech
            ciblant le marché burkinabè (prix en FCFA)

----------------------------------------------------------------
DESCRIPTION DU PROJET
----------------------------------------------------------------

TechBF est un site e-commerce fictif dédié à la vente de
produits high-tech (ordinateurs, smartphones, audio, accessoires)
au Burkina Faso. Le site reflète le contexte local : prix en FCFA,
modes de paiement locaux (Orange Money, Moov Money, Coris Money),
livraison à Ouagadougou.

----------------------------------------------------------------
STRUCTURE DES FICHIERS
----------------------------------------------------------------

projet-ecommerce/
├── index.html         → Page d'accueil (hero, catégories, vedettes)
├── catalogue.html     → Catalogue avec filtres, recherche et tri
├── produit.html       → Fiche produit (tabs, accordéon FAQ)
├── panier.html        → Panier avec persistance localStorage
├── contact.html       → Formulaire de commande avec validation
├── css/
│   └── style.css      → Feuille de styles unique (Mobile First)
├── js/
│   ├── data.js        → Tableau de 12 produits (source de vérité)
│   ├── main.js        → Navbar, panier utilitaires, card produit
│   ├── catalogue.js   → Filtres catégorie, recherche live, tri prix
│   └── panier.js      → Logique panier, localStorage, modals
└── README.txt

----------------------------------------------------------------
FONCTIONNALITÉS IMPLÉMENTÉES
----------------------------------------------------------------

✅ Navbar fixe avec hamburger responsive (toutes les pages)
✅ Génération des produits depuis tableau JS (data.js)
✅ Recherche live par nom de produit (catalogue)
✅ Filtre par catégorie (5 boutons)
✅ Tri par prix croissant / décroissant
✅ Ajout au panier avec feedback bouton
✅ Modifier quantité dans le panier (+/-)
✅ Supprimer un article avec modal de confirmation
✅ Vider le panier avec modal de confirmation
✅ Calcul dynamique sous-total / livraison / total
✅ Persistance panier en localStorage (inter-pages + rechargement)
✅ Tabs Description / Caractéristiques / Avis clients
✅ Accordéon FAQ (4 questions)
✅ Validation formulaire (email, téléphone 8-10 chiffres, champs requis)
✅ Retour visuel erreur/valide sur les champs
✅ Message de succès + vidage panier à la soumission
✅ Breadcrumb sur la page produit
✅ Produits similaires (même catégorie)
✅ Responsive : 375px / 768px / 1280px / 1440px
✅ CSS Variables sur :root
✅ Approche Mobile First
✅ Flexbox/Grid uniquement (pas de float)
✅ HTML sémantique (header, nav, main, section, article, footer)
✅ Accessibilité : aria-label, role, aria-live, aria-expanded

----------------------------------------------------------------
TECHNOLOGIES UTILISÉES
----------------------------------------------------------------

- HTML5 sémantique
- CSS3 (Variables, Flexbox, Grid, Media Queries, Transitions)
- JavaScript ES6+ (vanilla, sans framework ni bibliothèque)
- Google Fonts : Sora + Inter
- localStorage pour la persistance du panier

================================================================
