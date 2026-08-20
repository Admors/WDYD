import { describe, it, expect, beforeEach } from "vitest";
import { createStore } from "../src/js/store.js";

describe("Drink Store", () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it("devrait démarrer avec une liste de boissons vide", () => {
    expect(store.getState().drinks.length).toBe(0);
    expect(store.getTotalCount()).toBe(0);
  });

  it("devrait ajouter une nouvelle boisson", () => {
    store.addDrink("Bière", "pint", "#f59e0b");

    const drinks = store.getState().drinks;
    expect(drinks.length).toBe(1);
    expect(drinks[0].name).toBe("Bière");
    expect(drinks[0].qty).toBe(1);
  });

  it("devrait incrémenter la quantité si la boisson existe déjà", () => {
    store.addDrink("Bière", "pint", "#f59e0b");
    store.addDrink("Bière", "pint", "#f59e0b");

    const drinks = store.getState().drinks;
    expect(drinks.length).toBe(1);
    expect(drinks[0].qty).toBe(2);
  });

  it("devrait charger le template Classico avec toutes les quantités à 0", () => {
    store.loadClassico();

    const drinks = store.getState().drinks;
    expect(drinks.length).toBe(7);

    drinks.forEach((drink) => {
      expect(drink.qty).toBe(0);
    });

    expect(store.getTotalCount()).toBe(0);
  });

  it("devrait incrémenter une boisson du Classico lorsqu on appuie sur +", () => {
    store.loadClassico();
    const biere = store.getState().drinks.find((d) => d.name === "Bière");

    store.updateQuantity(biere.id, 1);

    const biereUpdated = store
      .getState()
      .drinks.find((d) => d.name === "Bière");
    expect(biereUpdated.qty).toBe(1);
    expect(store.getTotalCount()).toBe(1);
  });

  it("devrait supprimer une boisson de la liste si elle est à 0 et qu on appuie sur -", () => {
    store.loadClassico();
    const biere = store.getState().drinks.find((d) => d.name === "Bière");

    store.updateQuantity(biere.id, -1);

    const drinks = store.getState().drinks;
    expect(drinks.length).toBe(6);
    expect(drinks.find((d) => d.name === "Bière")).toBeUndefined();
  });

  it("devrait calculer correctement le total de boissons au fur et à mesure", () => {
    store.loadClassico();
    expect(store.getTotalCount()).toBe(0);

    const biere = store.getState().drinks.find((d) => d.name === "Bière");
    const get27 = store.getState().drinks.find((d) => d.name === "Get 27");

    store.updateQuantity(biere.id, 1);
    store.updateQuantity(get27.id, 2);

    expect(store.getTotalCount()).toBe(3);
  });
});
