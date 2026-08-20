/**
 * État global de la commande
 */
const state = {
  selectedGlass: 'pint',
  drinks: []
};

// Éléments DOM
const form = document.getElementById('drink-form');
const glassButtons = document.querySelectorAll('.btn-glass');
const orderList = document.getElementById('order-list');
const totalCount = document.getElementById('total-count');
const resetBtn = document.getElementById('reset-order');

// Gestion du choix de verre
glassButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    glassButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedGlass = btn.dataset.glass;
  });
});

// Ajout d'une boisson
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('drink-name');
  const colorInput = document.getElementById('drink-color');

  const drink = {
    id: Date.now(),
    name: nameInput.value.trim(),
    glass: state.selectedGlass,
    icon: document.querySelector(`.btn-glass[data-glass="${state.selectedGlass}"]`).textContent,
    color: colorInput.value,
    qty: 1
  };

  state.drinks.push(drink);
  nameInput.value = '';
  renderOrder();
});

// Mise à jour des quantités et suppression
orderList.addEventListener('click', (e) => {
  const target = e.target;
  const id = Number(target.dataset.id);
  if (!id) return;

  const drink = state.drinks.find(d => d.id === id);
  if (!drink) return;

  if (target.classList.contains('btn-plus')) {
    drink.qty++;
  } else if (target.classList.contains('btn-minus')) {
    drink.qty--;
    if (drink.qty <= 0) {
      state.drinks = state.drinks.filter(d => d.id !== id);
    }
  }
  renderOrder();
});

resetBtn.addEventListener('click', () => {
  state.drinks = [];
  renderOrder();
});

/* Point critique : Rendu dynamique synchronisé */
function renderOrder() {
  orderList.innerHTML = '';
  let total = 0;

  state.drinks.forEach(drink => {
    total += drink.qty;
    const item = document.createElement('div');
    item.className = 'order-item';
    item.style.borderLeftColor = drink.color;

    item.innerHTML = `
      <div class="order-item-info">
        <span style="font-size: 1.5rem;">${drink.icon}</span>
        <div>
          <strong>${drink.name}</strong>
        </div>
      </div>
      <div class="order-item-controls">
        <button class="btn-qty btn-minus" data-id="${drink.id}">-</button>
        <span>${drink.qty}</span>
        <button class="btn-qty btn-plus" data-id="${drink.id}">+</button>
      </div>
    `;
    orderList.appendChild(item);
  });

  totalCount.textContent = total;
}