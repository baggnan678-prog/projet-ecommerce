// ── panier.js — logique complète du panier ───────────────────────────────────

const FRAIS_LIVRAISON = 5000;

function afficherPanier() {
  const panier = getPanier();
  const corps = document.getElementById('panier-corps');
  const vide = document.getElementById('panier-vide');
  const plein = document.getElementById('panier-plein');

  if (!corps) return;

  if (panier.length === 0) {
    vide && (vide.style.display = 'flex');
    plein && (plein.style.display = 'none');
    return;
  }

  vide && (vide.style.display = 'none');
  plein && (plein.style.display = 'block');

  corps.innerHTML = '';

  panier.forEach(item => {
    const imageHTML = item.image
      ? `<img src="${item.image}" alt="${item.nom}" class="panier-img" loading="lazy">`
      : `<div class="panier-img-placeholder">${item.nom.charAt(0)}</div>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Produit">
        <div class="panier-produit-info">
          <div class="panier-img-wrap">${imageHTML}</div>
          <div>
            <a href="produit.html?id=${item.id}" class="panier-nom">${item.nom}</a>
            <span class="panier-prix-unit">${formaterPrix(item.prix)} / unité</span>
          </div>
        </div>
      </td>
      <td data-label="Prix unitaire">${formaterPrix(item.prix)}</td>
      <td data-label="Quantité">
        <div class="quantite-ctrl">
          <button class="btn-quantite" data-action="moins" data-id="${item.id}" aria-label="Diminuer la quantité">−</button>
          <span class="quantite-val" aria-live="polite">${item.quantite}</span>
          <button class="btn-quantite" data-action="plus" data-id="${item.id}" aria-label="Augmenter la quantité">+</button>
        </div>
      </td>
      <td data-label="Sous-total">${formaterPrix(item.prix * item.quantite)}</td>
      <td data-label="Supprimer">
        <button class="btn-supprimer" data-id="${item.id}" aria-label="Supprimer ${item.nom}">×</button>
      </td>
    `;
    corps.appendChild(tr);
  });

  corps.querySelectorAll('.btn-quantite').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      modifierQuantite(id, action);
    });
  });

  corps.querySelectorAll('.btn-supprimer').forEach(btn => {
    btn.addEventListener('click', () => {
      ouvrirModalSuppression(parseInt(btn.dataset.id));
    });
  });

  calculerTotaux();
}

function modifierQuantite(id, action) {
  const panier = getPanier();
  const index = panier.findIndex(item => item.id === id);
  if (index === -1) return;

  if (action === 'plus') {
    panier[index].quantite += 1;
  } else if (action === 'moins') {
    panier[index].quantite -= 1;
    if (panier[index].quantite <= 0) {
      panier.splice(index, 1);
    }
  }

  sauvegarderPanier(panier);
  mettreAJourCompteurNavbar();
  afficherPanier();
}

function supprimerArticle(id) {
  const panier = getPanier().filter(item => item.id !== id);
  sauvegarderPanier(panier);
  mettreAJourCompteurNavbar();
  afficherPanier();
}

function viderPanier() {
  sauvegarderPanier([]);
  mettreAJourCompteurNavbar();
  afficherPanier();
}

function calculerTotaux() {
  const panier = getPanier();
  const sousTotal = panier.reduce((acc, item) => acc + item.prix * item.quantite, 0);
  const total = sousTotal + (panier.length > 0 ? FRAIS_LIVRAISON : 0);

  const elSousTotal = document.getElementById('sous-total');
  const elLivraison = document.getElementById('frais-livraison');
  const elTotal = document.getElementById('total-general');
  const elNbArticles = document.getElementById('nb-articles');

  if (elSousTotal) elSousTotal.textContent = formaterPrix(sousTotal);
  if (elLivraison) elLivraison.textContent = panier.length > 0 ? formaterPrix(FRAIS_LIVRAISON) : '—';
  if (elTotal) elTotal.textContent = formaterPrix(panier.length > 0 ? total : 0);
  if (elNbArticles) {
    const nb = panier.reduce((acc, item) => acc + item.quantite, 0);
    elNbArticles.textContent = `${nb} article${nb > 1 ? 's' : ''}`;
  }
}

// ── Modals ────────────────────────────────────────────────────────────────────
let idArticleASupprimer = null;

function ouvrirModalSuppression(id) {
  idArticleASupprimer = id;
  const modal = document.getElementById('modal-suppression');
  if (modal) {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('visible');
    modal.querySelector('[data-focus]')?.focus();
  }
}

function fermerModalSuppression() {
  idArticleASupprimer = null;
  const modal = document.getElementById('modal-suppression');
  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('visible');
  }
}

function ouvrirModalVider() {
  const modal = document.getElementById('modal-vider');
  if (modal) {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('visible');
  }
}

function fermerModalVider() {
  const modal = document.getElementById('modal-vider');
  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('visible');
  }
}

// ── Init page panier ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  afficherPanier();

  document.getElementById('btn-vider')?.addEventListener('click', ouvrirModalVider);

  document.getElementById('modal-suppr-confirmer')?.addEventListener('click', () => {
    if (idArticleASupprimer !== null) {
      supprimerArticle(idArticleASupprimer);
    }
    fermerModalSuppression();
  });

  document.getElementById('modal-suppr-annuler')?.addEventListener('click', fermerModalSuppression);

  document.getElementById('modal-vider-confirmer')?.addEventListener('click', () => {
    viderPanier();
    fermerModalVider();
  });

  document.getElementById('modal-vider-annuler')?.addEventListener('click', fermerModalVider);

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('visible');
        modal.setAttribute('aria-hidden', 'true');
        idArticleASupprimer = null;
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      fermerModalSuppression();
      fermerModalVider();
    }
  });

  document.getElementById('btn-commander')?.addEventListener('click', () => {
    if (getPanier().length > 0) {
      window.location.href = 'contact.html';
    }
  });
});
