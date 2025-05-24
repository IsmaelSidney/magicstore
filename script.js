const productList = document.getElementById("product-list");
const checkoutBtn = document.querySelector(".checkout-btn");
const modal = document.getElementById("success-modal");
const closeModalBtn = document.querySelector(".close-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const sidebar = document.getElementById("cart-sidebar");

const cart = [];

function toggleCart() {
  sidebar.classList.toggle("open");
}

function addToCart(card) {
  const existing = cart.find(item => item.name === card.name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...card, quantity: 1 });
  }
  updateCart();
}

function removeFromCart(name) {
  const index = cart.findIndex(item => item.name === name);
  if (index !== -1) {
    cart.splice(index, 1);
    updateCart();
  }
}

function changeQuantity(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(name);
  } else {
    updateCart();
  }
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="info">
        <strong>${item.name}</strong><br>
        <small>R$ ${(item.price * item.quantity).toFixed(2)} (${item.quantity}x)</small>
      </div>
      <div class="actions">
        <button onclick="changeQuantity('${item.name}', 1)">+</button>
        <button onclick="changeQuantity('${item.name}', -1)">−</button>
        <button onclick="removeFromCart('${item.name}')">🗑️</button>
      </div>
    `;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
    count += item.quantity;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = count;
}

// Função para limpar carrinho
function clearCart() {
  cart.length = 0;            // Esvazia o array do carrinho
  updateCart();
}

// Finalizar venda
checkoutBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  clearCart();
  sidebar.classList.remove("open"); // Fecha o sidebar
});

// Fechar o modal
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

async function fetchRandomCard() {
  const res = await fetch('https://api.scryfall.com/cards/random');
  const data = await res.json();
  return {
    name: data.name,
    image: data.image_uris?.normal || "",
    price: (Math.random() * 100 + 1), // preço fictício
  };
}

async function loadCards() {
  const cards = [];
  while (cards.length < 6) {
    try {
      const card = await fetchRandomCard();
      if (card.image) {
        cards.push(card);
      }
    } catch (e) {
      console.error("Erro ao buscar carta:", e);
    }
  }
  displayCards(cards);
}

function displayCards(cards) {
  productList.innerHTML = "";
  cards.forEach(card => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.innerHTML = `
      <img src="${card.image}" alt="${card.name}">
      <h3>${card.name}</h3>
      <p>R$ ${card.price.toFixed(2)}</p>
      <button>Adicionar ao Carrinho</button>
    `;
    cardElement.querySelector("button").onclick = () => addToCart(card);
    productList.appendChild(cardElement);
  });
}

function moreCards(){
    loadCards();
}

loadCards();
