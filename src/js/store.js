/**
 * Configuration des templates de boissons prédéfinis.
 */
export const TEMPLATES = Object.freeze({
  classico: {
    label: "Classico",
    drinks: [
      { id: 1, name: "Bière", glass: "pint", color: "#f59e0b", qty: 0 },
      { id: 2, name: "Mazout", glass: "pint", color: "#4a2c11", qty: 0 },
      { id: 3, name: "Panaché", glass: "pint", color: "#facc15", qty: 0 },
      { id: 4, name: "Get 27", glass: "shot", color: "#10b981", qty: 0 },
      {
        id: 5,
        name: "Ricard / Reggio",
        glass: "soft",
        color: "#fef08a",
        qty: 0,
      },
      { id: 6, name: "Blanc Coca", glass: "pint", color: "#4a2c11", qty: 0 },
      { id: 7, name: "Blanc Jus", glass: "pint", color: "#6aff00ff", qty: 0 },
    ],
  },
  souper: {
    label: "Souper (Vin)",
    drinks: [
      { id: 101, name: "Vin Rouge", glass: "wine", color: "#7f1d1d", qty: 0 },
      { id: 102, name: "Vin Blanc", glass: "wine", color: "#fef08a", qty: 0 },
      { id: 103, name: "Vin Rosé", glass: "wine", color: "#fda4af", qty: 0 },
      { id: 104, name: "Eau Plate", glass: "soft", color: "#38bdf8", qty: 0 },
      {
        id: 105,
        name: "Eau Pétillante",
        glass: "soft",
        color: "#7dd3fc",
        qty: 0,
      },
    ],
  },
});

/**
 * Normalise les chaînes de caractères pour la comparaison.
 */
const normalizeText = (text) => text.trim().toLowerCase();

/**
 * Crée le magasin d'état centralisé (Store pattern).
 */
export const createStore = (initialState = {}) => {
  let state = {
    selectedGlass: "pint",
    drinks: [],
    ...initialState,
  };

  const findDrinkById = (id) => state.drinks.find((drink) => drink.id === id);

  const findMatchingDrink = (name, glass, color) => {
    const targetName = normalizeText(name);
    return state.drinks.find(
      (drink) =>
        normalizeText(drink.name) === targetName &&
        drink.glass === glass &&
        drink.color === color,
    );
  };

  const removeDrink = (id) => {
    state.drinks = state.drinks.filter((drink) => drink.id !== id);
  };

  return {
    getState: () => state,

    setSelectedGlass(glass) {
      state.selectedGlass = glass;
    },

    loadTemplate(templateKey) {
      const template = TEMPLATES[templateKey];
      if (!template) return;

      // Deep copy des objets pour éviter les mutations croisées
      state.drinks = template.drinks.map((drink) => ({ ...drink }));
    },

    addDrink(name, glass, color) {
      if (!name || !name.trim()) return;

      const existingDrink = findMatchingDrink(name, glass, color);

      if (existingDrink) {
        existingDrink.qty += 1;
      } else {
        state.drinks.push({
          id: Date.now(),
          name: name.trim(),
          glass,
          color,
          qty: 1,
        });
      }
    },

    updateQuantity(id, delta) {
      const drink = findDrinkById(id);
      if (!drink) return;

      // Règle métier : Si déjà à 0 et qu'on retire encore, on supprime
      if (drink.qty === 0 && delta < 0) {
        removeDrink(id);
        return;
      }

      drink.qty += delta;

      // Garde-fou pour ne jamais passer en dessous de 0
      if (drink.qty < 0) {
        drink.qty = 0;
      }
    },

    clear() {
      state.drinks = [];
    },

    getTotalCount() {
      return state.drinks.reduce((total, drink) => total + drink.qty, 0);
    },
  };
};

export const store = createStore();
