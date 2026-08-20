import { describe, it, expect, beforeEach } from 'vitest';
import { createStore, TEMPLATES } from '../src/js/store.js';

describe('Drink Store (Clean Code Architecture)', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  describe('Initialisation', () => {
    it('devrait démarrer avec un état vide', () => {
      expect(store.getState().drinks).toEqual([]);
      expect(store.getTotalCount()).toBe(0);
    });

    it('devrait permettre de définir le verre sélectionné', () => {
      store.setSelectedGlass('cocktail');
      expect(store.getState().selectedGlass).toBe('cocktail');
    });
  });

  describe('Gestion des Templates', () => {
    it('devrait charger le template Classico avec toutes les quantités à 0', () => {
      store.loadTemplate('classico');
      const drinks = store.getState().drinks;

      // CORRECTION: Le template 'classico' contient 7 boissons (et non 5)
      expect(drinks.length).toBe(7);
      expect(drinks[0].name).toBe('Bière');
      drinks.forEach(drink => expect(drink.qty).toBe(0));
      expect(store.getTotalCount()).toBe(0);
    });

    it('devrait charger le template Souper (Vin) avec toutes les quantités à 0', () => {
      store.loadTemplate('souper');
      const drinks = store.getState().drinks;

      expect(drinks.length).toBe(5);
      expect(drinks.map(d => d.name)).toContain('Vin Rouge');
      drinks.forEach(drink => expect(drink.qty).toBe(0));
    });

    it('ne devrait pas modifier l état si le nom du template est invalide', () => {
      store.loadTemplate('invalid_key');
      expect(store.getState().drinks.length).toBe(0);
    });

    it('devrait créer des copies indépendantes pour éviter de muter TEMPLATES', () => {
      store.loadTemplate('classico');
      const biere = store.getState().drinks[0];
      
      store.updateQuantity(biere.id, 5);

      // Le store local doit avoir changé mais le template figé reste intact à 0
      expect(biere.qty).toBe(5);
      expect(TEMPLATES.classico.drinks[0].qty).toBe(0);
    });
  });

  describe('Ajout de Boissons', () => {
    it('devrait ajouter une nouvelle boisson avec une quantité initiale de 1', () => {
      store.addDrink(' Mojito ', 'cocktail', '#10b981');
      const drinks = store.getState().drinks;

      expect(drinks.length).toBe(1);
      expect(drinks[0].name).toBe('Mojito'); // doìt être trimé
      expect(drinks[0].qty).toBe(1);
    });

    it('devrait ignorer l ajout si le nom de la boisson est vide', () => {
      store.addDrink('   ', 'pint', '#f59e0b');
      expect(store.getState().drinks.length).toBe(0);
    });

    it('devrait incrémenter la quantité au lieu de dupliquer si la boisson existe déjà (insensible à la casse)', () => {
      store.addDrink('Bière', 'pint', '#f59e0b');
      store.addDrink('bière', 'pint', '#f59e0b'); // Minuscules identiques

      const drinks = store.getState().drinks;
      expect(drinks.length).toBe(1);
      expect(drinks[0].qty).toBe(2);
    });
  });

  describe('Mise à jour des Quantités (Delta)', () => {
    it('devrait appliquer le delta positif et négatif correctement', () => {
      store.addDrink('Bière', 'pint', '#f59e0b'); // qty = 1
      const id = store.getState().drinks[0].id;

      store.updateQuantity(id, 2); // +2 -> 3
      expect(store.getState().drinks[0].qty).toBe(3);

      store.updateQuantity(id, -1); // -1 -> 2
      expect(store.getState().drinks[0].qty).toBe(2);
    });

    it('devrait décrémenter jusqu à 0 sans supprimer la carte', () => {
      store.addDrink('Bière', 'pint', '#f59e0b'); // qty = 1
      const id = store.getState().drinks[0].id;

      store.updateQuantity(id, -1); // Passe à 0

      const drinks = store.getState().drinks;
      expect(drinks.length).toBe(1);
      expect(drinks[0].qty).toBe(0);
    });

    it('devrait supprimer la boisson si elle est déjà à 0 et qu on applique un delta négatif', () => {
      store.loadTemplate('classico'); // Boissons chargées à 0
      const biere = store.getState().drinks[0];

      expect(biere.qty).toBe(0);
      store.updateQuantity(biere.id, -1); // Supprime du store

      const drinks = store.getState().drinks;
      // CORRECTION: Le nombre initial de boissons étant 7, il en reste 6 après suppression
      expect(drinks.length).toBe(6);
      expect(drinks.find(d => d.id === biere.id)).toBeUndefined();
    });

    it('ne devrait jamais permettre à la quantité de devenir négative', () => {
      store.addDrink('Bière', 'pint', '#f59e0b');
      const id = store.getState().drinks[0].id;

      store.updateQuantity(id, -5); // Tente un grand saut négatif
      expect(store.getState().drinks[0].qty).toBe(0);
    });
  });

  describe('Remise à zéro (Clear) et Compteur Total', () => {
    it('devrait vider intégralement la liste des boissons avec clear()', () => {
      store.loadTemplate('classico');
      // CORRECTION: Mis à jour de 5 à 7 pour correspondre à TEMPLATES.classico
      expect(store.getState().drinks.length).toBe(7);

      store.clear();
      expect(store.getState().drinks.length).toBe(0);
    });

    it('devrait calculer la somme exacte de toutes les quantités', () => {
      store.loadTemplate('classico'); // 7 verres à 0
      const drinks = store.getState().drinks;

      store.updateQuantity(drinks[0].id, 2); // 2 Bieres
      store.updateQuantity(drinks[1].id, 3); // 3 Mazouts

      expect(store.getTotalCount()).toBe(5);
    });
  });
});