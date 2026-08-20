import "/css/style.css"; 
import { store } from "/js/store.js";

const GLASS_SVGS = {
  pint: `<svg viewBox="0 0 24 24"><path d="M6 2L8 22H16L18 2H6Z" stroke="#94a3b8" stroke-width="1.5" fill="none"/><path d="M7 6L8 20H16L17 6H7Z" fill="{COLOR}"/></svg>`,
  cocktail: `<svg viewBox="0 0 24 24"><path d="M3 3L12 13L21 3H3ZM12 13V20M8 20H16" stroke="#94a3b8" stroke-width="1.5" fill="none"/><path d="M6 6L12 12.5L18 6H6Z" fill="{COLOR}"/></svg>`,
  wine: `<svg viewBox="0 0 24 24"><path d="M6 3C6 3 5 13 12 13C19 13 18 3 18 3H6ZM12 13V20M8 20H16" stroke="#94a3b8" stroke-width="1.5" fill="none"/><path d="M7.5 7C7.5 7 7 11.5 12 11.5C16 16.5 7 7.5H7.5Z" fill="{COLOR}"/></svg>`,
  shot: `<svg viewBox="0 0 24 24"><path d="M7 8L8.5 21H15.5L17 8H7Z" stroke="#94a3b8" stroke-width="1.5" fill="none"/><path d="M8 12L9 20H15L16 12H8Z" fill="{COLOR}"/></svg>`,
  soft: `<svg viewBox="0 0 24 24"><path d="M7 3H17V21H7V3Z" stroke="#94a3b8" stroke-width="1.5" fill="none"/><path d="M8 8H16V20H8V8Z" fill="{COLOR}"/></svg>`,
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("drink-form");
  const glassButtons = document.querySelectorAll(".btn-glass-type");
  const templateButtons = document.querySelectorAll(".btn-template");
  const orderList = document.getElementById("order-list");
  const totalCount = document.getElementById("total-count");
  const resetBtn = document.getElementById("reset-order");

  // Helper pour basculer le verre actif dans l'UI et le Store
  function selectGlassInput(glassType) {
    glassButtons.forEach((btn) => {
      const isActive = btn.dataset.glass === glassType;
      btn.classList.toggle("active", isActive);
    });
    store.setSelectedGlass(glassType);
  }

  // Sélection manuelle du type de verre
  glassButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectGlassInput(btn.dataset.glass);
    });
  });

  // Gestion de la sélection des catégories (Templates)
  templateButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 1. Mise à jour de la classe active sur les boutons de catégorie
      templateButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // 2. Chargement du template dans le store
      const templateKey = btn.dataset.template;
      store.loadTemplate(templateKey);

      // 3. Adaptation dynamique du verre par défaut selon la catégorie
      if (templateKey === "souper") {
        selectGlassInput("wine");
      } else {
        selectGlassInput("pint");
      }

      render();
    });
  });

  // Soumission du formulaire d'ajout personnalisé
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("drink-name");
    const colorInput = document.getElementById("drink-color");

    store.addDrink(
      nameInput.value,
      store.getState().selectedGlass,
      colorInput.value
    );

    nameInput.value = "";
    render();
  });

  // Ingestion des clics + / - dans la grille de commande
  orderList.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-counter");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const delta = btn.classList.contains("btn-plus") ? 1 : -1;

    store.updateQuantity(id, delta);
    render();
  });

  // Vider complètement la commande
  resetBtn.addEventListener("click", () => {
    store.clear();
    render();
  });

  // Rendu UI
  function render() {
    orderList.innerHTML = "";

    store.getState().drinks.forEach((drink) => {
      const card = document.createElement("div");
      card.className = `drink-card ${drink.qty === 0 ? "is-zero" : ""}`;

      const svgIcon = (GLASS_SVGS[drink.glass] || GLASS_SVGS.pint).replace(
        "{COLOR}",
        drink.color
      );

      const minusIcon = drink.qty === 0 ? "🗑️" : "-";

      card.innerHTML = `
        <div class="drink-card-title">${drink.name}</div>
        <div class="drink-card-visual">${svgIcon}</div>
        <div class="drink-card-controls">
          <button type="button" class="btn-counter btn-minus" data-id="${drink.id}">${minusIcon}</button>
          <span class="drink-card-qty">${drink.qty}</span>
          <button type="button" class="btn-counter btn-plus" data-id="${drink.id}">+</button>
        </div>
      `;
      orderList.appendChild(card);
    });

    totalCount.textContent = store.getTotalCount();
  }

  // Chargement initial du template Classico par défaut
  store.loadTemplate("classico");
  render();
});