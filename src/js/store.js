export const createStore = () => {
  let state = {
    selectedGlass: "pint",
    drinks: [],
  };

  return {
    getState: () => state,

    setSelectedGlass(glass) {
      state.selectedGlass = glass;
    },

    loadClassico() {
      state.drinks = [
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
        { id: 6, name: "Coca", glass: "soft", color: "#4a2c11", qty: 0 },
        { id: 7, name: "Limonade", glass: "soft", color: "#4a2c11", qty: 0 },
      ];
    },

    addDrink(name, glass, color) {
      if (!name || !name.trim()) return;

      const existing = state.drinks.find(
        (d) =>
          d.name.toLowerCase() === name.trim().toLowerCase() &&
          d.glass === glass &&
          d.color === color,
      );

      if (existing) {
        existing.qty++;
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

    /* NOUVELLE LOGIQUE : 1 -> 0 -> Suppression au clic suivant */
    updateQuantity(id, delta) {
      const drink = state.drinks.find((d) => d.id === id);
      if (!drink) return;

      if (delta < 0) {
        if (drink.qty === 0) {
          state.drinks = state.drinks.filter((d) => d.id !== id);
        } else {
          drink.qty += delta; // Ou gestion personnalisée si qty descend sous 0
        }
      } else {
        drink.qty += delta; // Utilise la valeur réelle de delta au lieu de ++
      }
    },

    clear() {
      state.drinks = [];
    },

    getTotalCount() {
      return state.drinks.reduce((acc, d) => acc + d.qty, 0);
    },
  };
};

export const store = createStore();
