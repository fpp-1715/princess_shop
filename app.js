// Princess Shop - Frontend Database with LocalStorage

// Product data structure
const products = [
  {
    id: 1,
    name: "Velvet Rose Blush",
    description: "Pigmento sedoso natural",
    price: 34.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqfpkn1Ny0ihm7aJLP10Vd6fcXeyaqdySDsk-Jh2P2Nsg4O2QNmlete4fpBFNWYBbZA51H3Xw1ruyRYKS-_MCY7JjVdioSUyNM8gDhrYYN8VE5SVPKFpiKrPTx8Zuzjw0ERALl_V4IXYsNDEFqu1lfKeoD6b4Lzxac17Oio76cXxN1_kSby8erdSAA4QTx4Ywxb3zSQsiqZrns3ww5JdSoRDniILS4MNDuoBEWf01AuatbVqTtXvPiCROc0lLY2ncOA5cDU5OfExmf",
    category: "Rostro"
  },
  {
    id: 2,
    name: "Silk Matte Lip",
    description: "Acabado hidratante 12h",
    price: 28.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAit0hWnNd6iiLvFacjVOr5kicIqN0oHw24c49mgdbmx4QnhHkJgW9nAzV6WuRgv5A5HyuixiP7Luzv2mCe4R-cUI7bG3b0r2d9hsbO0BJrClbBCvWvIQ1Y1OZPou6rNbARd6sTx5JGP4Mi92H4acFp4MOFObX-TZsvpnrMB4SwHK4uADyrBT38WC7CRt5Q3uZUryrr71w4wlm7k1tr-76ydhoLtXIuxgg9fsKQRAFBLieHS6abS_Mk2lsT9BR1riJ2u_8nZwPQmKlY",
    category: "Labios"
  },
  {
    id: 3,
    name: "Glow Drops",
    description: "Luminosidad interna",
    price: 42.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAug1quozrijFs0VRkVtiGysLZxraaOl0uDJBlCqtOvwIRpgmoBa7yJRx2R3OX5PUNem59kVBHA5IsbleinRtwBf4QMgfuqjSzBB39G5MkqEf5zh1FjpiM85otwUG8f1LLEUpj3MduXu94t30_E3O4bxgl-9Q7twp2u44sJhlRRXnDP2jqyrv-ccPVtE0tUAZcLbNrz2wlPxHnlpC71OL5KOsUsrTiajqBChNdbyqU1yMGAthVvDyiiPbzC1x08fKunLWF73XgfDrtv",
    category: "Rostro"
  },
  {
    id: 4,
    name: "Duo Contour Kit",
    description: "Esculpe con delicadeza",
    price: 45.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCo2oIiHrvq_40MhhEHS6BHw9VJnmRgSA29mLT2uO3XpmIbdWQVifhGbx8YQuWzcWSnslgdZBCmNl5GkZtCeDEXkzFwCBvBzYJ9RxhgavKMFl0nB1EaKS_4I0MEwJy8wFgPlI9F3HH6dno0Xb3-M5XAgTP4Rcpt0QnvPCj777QnKOhk4zk9HepsqQ7p78JSZ43FCh1furaP0tsYnPX8P5gj936o0D-u6Erk3qnjdf5lr6XRCkKlx--c3Y5kt1TL9yhj5dSzKxscAC9l",
    category: "Accesorios"
  },
  {
    id: 5,
    name: "Essence No. 7",
    description: "Perfume artesanal floral",
    price: 85.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCYV-Q3blnjQP2HvoL0Fw-NMA3NQNFpWcVogdgUijLMYgt_mwEQQ-Yb4y0cUp8iUslLrUZJw5bV_Vval5_v4qY1kq31ST3xu5mxgMdJZ2w8kirCh_65b-YR10QqGcxeGZD2uUbi-CZvayFVILOZ4X2qsL3GxU9vXy-eoyXzbWGpbf-thcCj80z2c21Z5J_InmMIqI9AjGd2cCyaE0zJCj_EusuP8tIT8g8SQga-Pbdw8dRc6oOp0_mieCVlQwe8H7amr3gFoVmho7D",
    category: "Accesorios"
  },
  {
    id: 6,
    name: "Botanical Elixir",
    description: "Aceite facial revitalizante",
    price: 56.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwNKXH2Ci1MtuuJhm0MNKHFHJsolE6qfkpPdKj6I2lNprSq7E8sGWBAD0Qxj3nBdhtgdjnBgl1ctG2iSZvXXQny6nQNs7sVwyIKcoBmSDJOL-dpY66JAXb-YSs5Fx8ifwIy9ekcsvBGxPJFMoVW8SIXqIETRMBo-qw_dW26dgFaBdZSfy6xfxkBl__kv_5ufSq5_m3VSdRF-Xf0732x2Ym258x9w_i3hXH6mRyEJBh2XZ_yq4vaVl7kR0Nr3vn7zx_wMB8bjwxb9oR",
    category: "Rostro"
  },
  {
    id: 7,
    name: "Nude Dreams",
    description: "Paleta de 12 tonos cálidos",
    price: 48.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2OpfPvr-zqf41jfr0eFUk9kV0dkMphWVys5B5ckK8PeQO1_E2fmYJUgdWzfVz1Rye6bggnwNsQ9uUCuNgHDtXurABhcMaiQpieal1c3yogPZcbeUbZvQT82a0G0ryDJniCwp960zE3drPRFPe15qFI6rX7jSFvs9tXSZK8tAiASqrIBtl4BPEKvsf1Z_UTYKK9o7FJntJpjAdTSuIJbU5Dhro2C1MKYddRRaF-0-vAlw0wMxrHeL1AGqrQeApXhJ-TauWEK9Yi2B9",
    category: "Ojos"
  },
  {
    id: 8,
    name: "Cloud Cream",
    description: "Hidratación ligera 24h",
    price: 39.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPkQGNFVxlZS5KIFuklhHrxNpHYzDsLmqG7sLW7ZVPs0QfCj5z7EQvROuUC5DdIPgDahD2x86ZQX1ATAjZmOQ3sNkmOZfC8427rJUhkuMnIJ8utpFzImSswIG_zYKGC4SJzcpGM1fnbS3b8a8m0fL2f9bT7kPgefSSKn4rzvnHTpBMsTTvA5P0-N3mvbmgJAvDEqXMzbsf9ZT9IbAwEQuUhmUXikjUFr1Oe37mqFVy3Tgq0dvlVz8Jm2HICTtMeo6HxQjnXu7spWXX",
    category: "Rostro"
  }
];

// Cart functionality
function getCart() {
  const cart = localStorage.getItem('princessShopCart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('princessShopCart', JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push({ ...product, quantity: 1 });
    }
  }
  saveCart(cart);
  updateCartCount();
  alert('Producto agregado al carrito!');
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.querySelector('.cart-count');
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
});

// Filter products by category
function filterProducts(category) {
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const productCategory = card.dataset.category;
    if (category === 'Todos' || productCategory === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Attach event listeners to filter buttons
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.textContent.trim();
      filterProducts(category);
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('bg-primary', 'text-on-primary'));
      this.classList.add('bg-primary', 'text-on-primary');
    });
  });
});