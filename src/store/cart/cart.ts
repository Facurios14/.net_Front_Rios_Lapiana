import { checkAuth, logout } from "../../utils/auth";
import { getCart, removeFromCart, clearCart, updateCartCount } from "../../utils/cart";
import * as bootstrap from 'bootstrap';

checkAuth("client");

const PRODUCTS_URL = import.meta.env.VITE_API_URL_PRODUCTS;
const ORDER_URL = import.meta.env.VITE_API_URL_ORDERS;
const cartItemsDiv = document.getElementById("cart-items")!;
const cartTotalEl = document.getElementById("cart-total")!;
const checkoutBtn = document.getElementById("checkout-btn")!;
const checkoutModalEl = document.getElementById('checkoutModal') as HTMLElement;
const checkoutModal = new bootstrap.Modal(checkoutModalEl);
const checkoutForm = document.getElementById('checkout-form') as HTMLFormElement;
const modalTotal = document.getElementById('modal-total') as HTMLElement;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
// Cerrar sesión
if (logoutBtn) logoutBtn.addEventListener("click", logout);

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

/// (Necesitarás importar Bootstrap al inicio de tu script si no lo tienes)

// --- 1. Lógica del Botón "Realizar Pedido" ---
// (Esto reemplaza tu 'checkoutBtn.addEventListener' anterior)
checkoutBtn.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }
    
    // Mostramos el total en el modal
    modalTotal.textContent = cartTotalEl.textContent;
    
    // ¡Abrimos el modal!
    checkoutModal.show();
});

// --- 2. Lógica del Formulario del Modal ---
// (Esto es lo que realmente envía el pedido)
checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitamos que la página se recargue

    const cart = getCart();
    const userString = localStorage.getItem('user');
    
    if (!userString || cart.length === 0) {
        alert("Error: Sesión o carrito no encontrados.");
        return;
    }
    
    const user = JSON.parse(userString);

    // Capturamos los datos del formulario
    const phone = (document.getElementById('checkout-phone') as HTMLInputElement).value;
    const address = (document.getElementById('checkout-address') as HTMLInputElement).value;
    const paymentMethod = (document.getElementById('checkout-payment') as HTMLSelectElement).value;
    const notes = (document.getElementById('checkout-notes') as HTMLTextAreaElement).value;

    // Mapeamos el carrito
    const orderItems = cart.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
    }));

    // Construimos el DTO completo (OrderDTO)
    const orderData = {
        userId: user.id,
        items: orderItems,
        phone: phone,
        address: address,
        paymentMethod: paymentMethod,
        notes: notes,
        // El backend debe calcular el total y poner el status
    };

    // Ocultamos el modal y mostramos feedback de "cargando"
    checkoutModal.hide();
    alert("Procesando pedido..."); 

    // --- 3. Llamada a la API (la que tenías antes, pero con más datos) ---
    try {
        const res = await fetch(ORDER_URL, { // ORDER_URL viene de tu .env
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData), // ¡Enviamos el DTO completo!
        });

        if (res.ok) {
            clearCart();
            updateCartCount();
            alert("✅ Pedido realizado con éxito");
            window.location.href = "../home/home.html"; 
        } else {
            const errorData = await res.json();
            alert(`❌ Error al procesar el pedido: ${errorData.message || 'Error desconocido'}`);
        }
    } catch (err) {
        console.error("Error en el fetch:", err);
        alert("❌ Error de conexión al realizar el pedido.");
    }
});

loadCart();
updateCartCount();
