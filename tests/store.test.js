import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from '../src/js/store.js';

describe('Drink Store', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('devrait démarrer avec une liste de boissons vide', () => {
    expect(store.getState().drinks.length).toBe(0);
    expect(store.getTotalCount()).toBe(0);
  });

  it('devrait ajouter une nouvelle boisson', () => {
    store.addDrink('Bière', 'pint', '#f59e0b');

    const drinks = store.getState().drinks;
    expect(drinks.length).toBe(1);
    expect(drinks[0].name).toBe('Bière');
    expect(drinks[0].qty).toBe(1);
  });

  it('devrait incrémenter la quantité si la boisson existe déjà', () => {
    store.addDrink('Bière', 'pint', '#f59e0b');
    store.addDrink('Bière', 'pint', '#f59e0b');

    const drinks = store.getState().drinks;
    expect(drinks.length).toBe(1);
    expect(drinks[0].qty).toBe(2);
  });

  it('devrait charger le template Classico', () => {
    store.loadClassico();

    const drinks = store.getState().drinks;
    expect(drinks.length).toBe(5);
    expect(drinks.map(d => d.name)).toEqual([
      'Bière',
      'Mazout',
      'Panaché',
      'Get 27',
      'Ricard / Reggio'
    ]);
  });

  it('devrait passer la quantité à 0 au premier appui sur -', () => {
    store.addDrink('Bière', 'pint', '#f59e0b');
    const id = store.getState().drinks[0].id;

    store.updateQuantity(id, -1);

    const drinks = store.getState().drinks;
    expect(drinks.length).toBe(1);
    expect(drinks[0].qty).toBe(0);
  });

  it('devrait supprimer la boisson au second appui sur - (quand déjà à 0)', () => {
    store.addDrink('Bière', 'pint', '#f59e0b');
    const id = store.getState().drinks[0].id;

    store.updateQuantity(id, -1); // Passe à 0
    store.updateQuantity(id, -1); // Supprime de la liste

    const drinks = store.getState().drinks;
    expect(drinks.length).toBe(0);
  });

  it('devrait calculer correctement le total de boissons', () => {
    store.loadClassico(); // 5 boissons de quantité 1
    expect(store.getTotalCount()).toBe(5);

    const id = store.getState().drinks[0].id;
    store.updateQuantity(id, 1); // +1 Bière (total 6)

    expect(store.getTotalCount()).toBe(6);
  });
});