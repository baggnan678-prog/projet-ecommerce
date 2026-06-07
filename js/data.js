/**
 * ============================================================
 *  data.js — Base de données des produits
 * ============================================================
 *
 *  Ce fichier contient TOUS les produits de la boutique TechBF.
 *  Il est chargé en premier dans chaque page HTML (avant main.js,
 *  catalogue.js, panier.js) pour que les autres scripts puissent
 *  accéder à la liste des produits.
 *
 *  Structure d'un produit :
 *  ┌─────────────┬─────────────────────────────────────────────┐
 *  │  Propriété  │  Description                                │
 *  ├─────────────┼─────────────────────────────────────────────┤
 *  │  id         │  Identifiant unique du produit (nombre)     │
 *  │  nom        │  Nom commercial affiché sur le site         │
 *  │  categorie  │  Famille du produit pour les filtres        │
 *  │             │  Valeurs possibles : "informatique",        │
 *  │             │  "telephonie", "audio", "accessoires"       │
 *  │  prix       │  Prix actuel en FCFA (entier)               │
 *  │  ancienPrix │  Prix barré avant promotion (null si aucun) │
 *  │  image      │  URL de la photo (Unsplash)                 │
 *  │  badge      │  Étiquette affichée sur la card :           │
 *  │             │  "PROMO", "NOUVEAU", ou null (aucun badge)  │
 *  │  description│  Court texte descriptif du produit          │
 *  │  specs      │  Objet clé/valeur des caractéristiques      │
 *  │             │  techniques (affiché dans l'onglet Specs)   │
 *  └─────────────┴─────────────────────────────────────────────┘
 *
 *  Pour ajouter un nouveau produit, copiez un objet existant,
 *  changez l'id (doit être unique) et remplissez les champs.
 * ============================================================
 */

/* PRODUITS est un tableau (Array) d'objets.
   Chaque objet représente un produit de la boutique.
   La variable est globale : tous les autres fichiers JS peuvent
   l'utiliser directement. */
const PRODUITS = [

  /* ── Produit 1 : Laptop haut de gamme ──────────────────── */
  {
    id: 1,                          // Identifiant unique
    nom: "Laptop ProMax 15",        // Nom affiché sur le site
    categorie: "informatique",      // Catégorie pour le filtre
    prix: 450000,                   // Prix actuel en FCFA
    ancienPrix: 520000,             // Ancien prix (affiché barré) → promo de 70 000 FCFA
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    badge: "PROMO",                 // Étiquette rouge "PROMO" sur la card
    description: "Ordinateur portable ultra-performant. Processeur i9, 32Go RAM, SSD 1To, écran 15.6\" 144Hz.",
    specs: {                        // Caractéristiques techniques affichées dans l'onglet
      Processeur: "Intel Core i9-13900H",
      RAM: "32 Go DDR5",
      Stockage: "1 To NVMe SSD",
      Écran: "15.6\" 144Hz IPS",
      GPU: "NVIDIA RTX 4060",
      Batterie: "90Wh – jusqu'à 8h"
    }
  },

  /* ── Produit 2 : Laptop entrée de gamme ────────────────── */
  {
    id: 2,
    nom: "Laptop Essential",
    categorie: "informatique",
    prix: 220000,
    ancienPrix: null,               // null = pas de promo, pas d'ancien prix affiché
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80",
    badge: null,                    // null = pas de badge sur la card
    description: "Idéal pour les études et le bureau. Léger, autonome, fiable au quotidien.",
    specs: {
      Processeur: "Intel Core i5-1235U",
      RAM: "16 Go DDR4",
      Stockage: "512 Go SSD",
      Écran: "14\" FHD IPS",
      GPU: "Intel Iris Xe",
      Batterie: "56Wh – jusqu'à 10h"
    }
  },

  /* ── Produit 3 : Smartphone milieu de gamme ─────────────── */
  {
    id: 3,
    nom: "Smartphone Galaxy S",
    categorie: "telephonie",
    prix: 180000,
    ancienPrix: 200000,             // Promo de 20 000 FCFA
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
    badge: "PROMO",
    description: "Écran AMOLED 6.7 pouces, 128Go. Appareil photo 108 MP, charge rapide 65W.",
    specs: {
      Écran: "6.7\" AMOLED 120Hz",
      RAM: "8 Go",
      Stockage: "128 Go",
      Appareil_photo: "108 MP triple",  // Le underscore sera remplacé par un espace à l'affichage
      Batterie: "5000 mAh – 65W",
      OS: "Android 14"
    }
  },

  /* ── Produit 4 : Smartphone entrée de gamme ─────────────── */
  {
    id: 4,
    nom: "Smartphone Lite",
    categorie: "telephonie",
    prix: 85000,
    ancienPrix: null,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80",
    badge: "NOUVEAU",               // Badge bleu "NOUVEAU" sur la card
    description: "Excellent rapport qualité/prix. Parfait pour une première utilisation smartphone moderne.",
    specs: {
      Écran: "6.5\" IPS LCD",
      RAM: "4 Go",
      Stockage: "64 Go",
      Appareil_photo: "50 MP dual",
      Batterie: "5000 mAh – 18W",
      OS: "Android 13"
    }
  },

  /* ── Produit 5 : Écouteurs Bluetooth ────────────────────── */
  {
    id: 5,
    nom: "Écouteurs Bluetooth Pro",
    categorie: "audio",
    prix: 45000,
    ancienPrix: 55000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    badge: "PROMO",
    description: "Son Hi-Fi, autonomie 30h. Réduction de bruit active, commandes tactiles.",
    specs: {
      Type: "Circum-aural fermé",
      Connectivité: "Bluetooth 5.3",
      Autonomie: "30h (ANC activé)",
      ANC: "Oui – hybride",         // ANC = Active Noise Cancelling
      Codec: "LDAC / AAC / SBC",
      Microphone: "4 mics CVC 8.0"
    }
  },

  /* ── Produit 6 : Enceinte Portable ──────────────────────── */
  {
    id: 6,
    nom: "Enceinte Portable",
    categorie: "audio",
    prix: 28000,
    ancienPrix: null,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    badge: null,
    description: "Résistante à l'eau IPX7, autonomie 12h. Son 360° puissant et profond.",
    specs: {
      Puissance: "20W RMS",
      Connectivité: "Bluetooth 5.0 + AUX",
      Autonomie: "12h",
      Résistance: "IPX7",           // IPX7 = résiste à l'immersion jusqu'à 1m pendant 30min
      Dimensions: "180 × 75 mm",
      Poids: "560g"
    }
  },

  /* ── Produit 7 : Clavier Mécanique ──────────────────────── */
  {
    id: 7,
    nom: "Clavier Mécanique",
    categorie: "accessoires",
    prix: 35000,
    ancienPrix: null,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
    badge: "NOUVEAU",
    description: "Switches Cherry MX Red, rétroéclairage RGB, construction aluminium.",
    specs: {
      Switches: "Cherry MX Red",
      Format: "TKL (87 touches)",   // TKL = Tenkeyless, sans pavé numérique
      Rétroéclairage: "RGB par touche",
      Connexion: "USB-C détachable",
      Matériau: "Châssis aluminium",
      Polling: "1000 Hz"            // Polling rate = vitesse de détection des frappes
    }
  },

  /* ── Produit 8 : Souris sans fil ────────────────────────── */
  {
    id: 8,
    nom: "Souris sans fil",
    categorie: "accessoires",
    prix: 15000,
    ancienPrix: 18000,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
    badge: "PROMO",
    description: "Ergonomique, 12 mois d'autonomie, récepteur nano USB.",
    specs: {
      Capteur: "Optique 1600 DPI",
      Connexion: "2.4 GHz sans fil",
      Autonomie: "12 mois (1 pile AA)",
      Boutons: "6 boutons programmables",
      Poids: "101g",
      Portée: "10 m"
    }
  },

  /* ── Produit 9 : Tablette ────────────────────────────────── */
  {
    id: 9,
    nom: "Tablette 10 pouces",
    categorie: "informatique",
    prix: 160000,
    ancienPrix: null,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    badge: null,
    description: "Idéale pour la lecture et le multimédia. Stylus inclus, écran anti-reflet.",
    specs: {
      Écran: "10.1\" IPS 1920×1200",
      RAM: "6 Go",
      Stockage: "128 Go",
      Batterie: "7040 mAh",
      Stylet: "Inclus",
      OS: "Android 13"
    }
  },

  /* ── Produit 10 : Câble USB-C ────────────────────────────── */
  {
    id: 10,
    nom: "Câble USB-C 2m",
    categorie: "accessoires",
    prix: 3500,
    ancienPrix: null,
    image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400&q=80",
    badge: null,
    description: "Charge rapide 65W, transfert données 10 Gbps, tressé nylon résistant.",
    specs: {
      Longueur: "2 mètres",
      Charge: "65W Power Delivery",
      Données: "10 Gbps USB 3.2",
      Gaine: "Tressé nylon",
      Connecteurs: "USB-C mâle × 2",
      Garantie: "2 ans"
    }
  },

  /* ── Produit 11 : Chargeur rapide ───────────────────────── */
  {
    id: 11,
    nom: "Chargeur rapide 65W",
    categorie: "accessoires",
    prix: 12000,
    ancienPrix: 15000,
    image: "https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=400&q=80",
    badge: "PROMO",
    description: "Compatible tous smartphones récents, GaN compact, 3 ports simultanés.",
    specs: {
      Puissance: "65W max",
      Ports: "2× USB-C + 1× USB-A",
      Technologie: "GaN III",       // GaN = Nitrure de Gallium, plus compact que le silicium
      Compatibilité: "PD 3.0 / QC 4+",
      Dimensions: "50 × 50 × 28 mm",
      Poids: "95g"
    }
  },

  /* ── Produit 12 : Webcam HD ──────────────────────────────── */
  {
    id: 12,
    nom: "Webcam HD 1080p",
    categorie: "informatique",
    prix: 22000,
    ancienPrix: null,
    image: "https://images.unsplash.com/photo-1625275733-c74f5f82d548?w=400&q=80",
    badge: "NOUVEAU",
    description: "Mise au point auto, micro stéréo intégré, compatible tous OS.",
    specs: {
      Résolution: "1080p 30fps / 720p 60fps",
      Angle: "90° FOV",             // FOV = Field of View, angle de vue
      Mise_au_point: "Autofocus",
      Microphone: "Stéréo intégré",
      Connexion: "USB-A",
      Compatibilité: "Windows / macOS / Linux"
    }
  },
];
