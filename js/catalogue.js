// ── catalogue.js — filtres, recherche, tri ───────────────────────────────────

let categorieActive = 'tous';
let triActif = null;
let recherche = '';

function filtrerEtAfficher() {
  let resultats = [...PRODUITS];

  // Filtrage par catégorie
  if (categorieActive !== 'tous') {
    resultats = resultats.filter(p => p.categorie === categorieActive);
  }

  // Recherche live par nom
  if (recherche.trim() !== '') {
    const terme = recherche.toLowerCase().trim();
    resultats = resultats.filter(p =>
      p.nom.toLowerCase().includes(terme) ||
      p.description.toLowerCase().includes(terme)
    );
  }

  // Tri par prix
  if (triActif === 'asc') {
    resultats.sort((a, b) => a.prix - b.prix);
  } else if (triActif === 'desc') {
    resultats.sort((a, b) => b.prix - a.prix);
  }

  afficherResultats(resultats);
}

function afficherResultats(produits) {
  const grille = document.getElementById('grille-produits');
  const compteur = document.getElementById('compteur-resultats');
  const messageVide = document.getElementById('message-vide');

  if (!grille) return;

  grille.innerHTML = '';

  if (produits.length === 0) {
    messageVide && (messageVide.style.display = 'flex');
    if (compteur) compteur.textContent = '0 produit(s) trouvé(s)';
    return;
  }

  messageVide && (messageVide.style.display = 'none');

  if (compteur) {
    compteur.textContent = `${produits.length} produit(s) trouvé(s)`;
  }

  produits.forEach(produit => {
    const card = genererCardProduit(produit);
    grille.appendChild(card);
  });
}

function initFiltres() {
  // Boutons catégories
  document.querySelectorAll('[data-categorie]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-categorie]').forEach(b => {
        b.classList.remove('actif');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('actif');
      btn.setAttribute('aria-pressed', 'true');
      categorieActive = btn.dataset.categorie;
      filtrerEtAfficher();
    });
  });

  // Boutons tri
  document.querySelectorAll('[data-tri]').forEach(btn => {
    btn.addEventListener('click', () => {
      const valeur = btn.dataset.tri;
      if (triActif === valeur) {
        // Désactiver le tri
        triActif = null;
        btn.classList.remove('actif');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        document.querySelectorAll('[data-tri]').forEach(b => {
          b.classList.remove('actif');
          b.setAttribute('aria-pressed', 'false');
        });
        triActif = valeur;
        btn.classList.add('actif');
        btn.setAttribute('aria-pressed', 'true');
      }
      filtrerEtAfficher();
    });
  });

  // Recherche live
  const barreRecherche = document.getElementById('recherche');
  if (barreRecherche) {
    barreRecherche.addEventListener('input', (e) => {
      recherche = e.target.value;
      filtrerEtAfficher();
    });

    // Effacer la recherche
    document.getElementById('effacer-recherche')?.addEventListener('click', () => {
      barreRecherche.value = '';
      recherche = '';
      filtrerEtAfficher();
      barreRecherche.focus();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initFiltres();
  filtrerEtAfficher();
});
