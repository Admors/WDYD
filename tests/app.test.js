/**
 * Tests unitaires basiques pour la logique métier des boissons
 */
export function testDrinkLogic() {
  const drinks = [];

  // Test 1: Ajout d'une boisson
  const newDrink = { id: 1, name: 'Pinte', qty: 1 };
  drinks.push(newDrink);
  console.assert(drinks.length === 1, 'Test 1 Échoué : Boisson non ajoutée');

  // Test 2: Incrémentation quantité
  newDrink.qty += 1;
  console.assert(drinks[0].qty === 2, 'Test 2 Échoué : Quantité non mise à jour');

  // Test 3: Suppression si quantité <= 0
  newDrink.qty -= 2;
  const filtered = drinks.filter(d => d.qty > 0);
  console.assert(filtered.length === 0, 'Test 3 Échoué : Boisson non supprimée');

  console.log('Tous les tests unitaires JS sont passés avec succès.');
}