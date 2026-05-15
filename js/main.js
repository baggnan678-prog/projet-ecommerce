// ── Navbar hamburger ──────────────────────────────────────────────────────────
function initNavbar() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const ouvert = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', ouvert);
    burger.classList.toggle('actif', ouvert);
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('actif');
      burger.setAttribute('aria-expanded', false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('actif');
      burger.setAttribute('aria-expanded', false);
    }
  });
}

// ── Compteur panier dans la navbar ───────────────────────────────────────────
function mettreAJourCompteurNavbar() {
  const panier = getPanier();
  const total = panier.reduce((acc, item) => acc + item.quantite, 0);
  document.querySelectorAll('.panier-compteur').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-flex' : 'none';
  });
}

// ── Utilitaires panier (localStorage) ────────────────────────────────────────
function getPanier() {
  try {
    return JSON.parse(localStorage.getItem('panier')) || [];
  } catch {
    return [];
  }
}

function sauvegarderPanier(panier) {
  localStorage.setItem('panier', JSON.stringify(panier));
}

function ajouterAuPanier(produitId, quantite = 1) {
  const produit = PRODUITS.find(p => p.id === produitId);
  if (!produit) return;

  const panier = getPanier();
  const index = panier.findIndex(item => item.id === produitId);

  if (index !== -1) {
    panier[index].quantite += quantite;
  } else {
    panier.push({ ...produit, quantite });
  }

  sauvegarderPanier(panier);
  mettreAJourCompteurNavbar();
  afficherFeedbackPanier();
}

// ── Feedback visuel ajout panier ─────────────────────────────────────────────
function afficherFeedbackPanier() {
  let toast = document.getElementById('toast-panier');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-panier';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = 'Produit ajouté au panier';
  toast.classList.add('visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('visible'), 2500);
}

// ── Formater prix en FCFA ─────────────────────────────────────────────────────
function formaterPrix(montant) {
  return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
}

// ── Générer une card produit ──────────────────────────────────────────────────
function genererCardProduit(produit) {
  const ancienPrixHTML = produit.ancienPrix
    ? `<span class="ancien-prix">${formaterPrix(produit.ancienPrix)}</span>`
    : '';
  const badgeHTML = produit.badge
    ? `<span class="badge badge--${produit.badge.toLowerCase()}">${produit.badge}</span>`
    : '';

  const imageHTML = produit.image
    ? `<img src="${produit.image}" alt="${produit.nom}" class="card-img" loading="lazy">`
    : `<div class="card-img-placeholder">${produit.nom.charAt(0)}</div>`;

  const article = document.createElement('article');
  article.className = 'card-produit';
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

  article.querySelector('.btn--panier').addEventListener('click', (e) => {
    e.preventDefault();
    ajouterAuPanier(produit.id);
    const btn = e.currentTarget;
    btn.textContent = 'Ajouté !';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Ajouter au panier';
      btn.disabled = false;
    }, 1800);
  });

  return article;
}

// ── Initialisation globale ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  mettreAJourCompteurNavbar();
});
