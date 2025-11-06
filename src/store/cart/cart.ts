import { checkAuth, logout } from "../../utils/auth";
import { getCart, removeFromCart, clearCart, updateCartCount } from "../../utils/cart";

checkAuth("client");

const PRODUCTS_URL = import.meta.env.VITE_API_URL_PRODUCTS;
const ORDER_URL = import.meta.env.VITE_API_URL_ORDERS;

const navbarContainer = document.getElementById("navbar")!;
const cartItemsDiv = document.getElementById("cart-items")!;
const cartTotalEl = document.getElementById("cart-total")!;
const checkoutBtn = document.getElementById("checkout-btn")!;

// Cargar Navbar
fetch("/src/client/layout/navbar.html")
    .then(res => res.text())
    .then(html => navbarContainer.innerHTML = html);

// Renderizar carrito
async function loadCart() {
    const cart = getCart();
    cartItemsDiv.innerHTML = "";

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="alert alert-warning">Tu carrito está vacío</div>
        `;
        cartTotalEl.textContent = "$0";
        return;
    }

    let total = 0;

    for (const item of cart) {
        const res = await fetch(`${PRODUCTS_URL}/${item.id}`);
        const product = await res.json();

        total += product.price * item.quantity;

        const div = document.createElement("div");
        div.className = "card mb-3 shadow-sm";

        div.innerHTML = `
            <div class="row g-0 p-2">
                <div class="col-3">
                    <img src="${product.imageUrl}" class="img-fluid rounded" style="height: 80px; object-fit: cover;">
                </div>

                <div class="col-6 ps-3">
                    <h5>${product.name}</h5>
                    <p class="text-success fw-bold">$${product.price}</p>
                    <p class="text-muted">Cantidad: ${item.quantity}</p>
                </div>

                <div class="col-3 d-flex align-items-center justify-content-end">
                    <button class="btn btn-danger btn-sm" onclick="removeItem(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;

        cartItemsDiv.appendChild(div);
    }

    cartTotalEl.textContent = `$${total}`;
}

// Exponer eliminar producto
(window as any).removeItem = (id: number) => {
    removeFromCart(id);
    updateCartCount();
    loadCart();
};

// Checkout (realizar pedido)
checkoutBtn.addEventListener("click", async () => {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    const res = await fetch(ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart), // [{id, quantity}]
    });

    if (res.ok) {
        clearCart();
        updateCartCount();
        alert("✅ Pedido realizado con éxito");
        window.location.href = "../orders/orders.html";
    } else {
        alert("❌ Error al procesar el pedido");
    }
});

loadCart();
updateCartCount();
