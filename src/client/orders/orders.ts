import { checkAuth, logout } from "../../utils/auth";
import { updateCartCount } from "../../utils/cart"; 

checkAuth("client");

const ORDER_URL = import.meta.env.VITE_API_URL_ORDERS;
const ordersContainer = document.getElementById("orders-container")!;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
// Cerrar sesión
if (logoutBtn) logoutBtn.addEventListener("click", logout);


async function loadOrders() {
    
    const userString = localStorage.getItem('user');
    if (!userString) {
        ordersContainer.innerHTML = `<div class="alert alert-danger">Error de autenticación.</div>`;
        return;
    }
    const user = JSON.parse(userString);
    const userId = user.id;

    if (!userId) {
        ordersContainer.innerHTML = `<div class="alert alert-danger">ID de usuario no encontrado.</div>`;
        return;
    }

    try {
        // 2. Usar la URL correcta (la que pide el ID del usuario)
        const res = await fetch(`${ORDER_URL}/user/${userId}`);
        // --- FIN DEL ARREGLO ---

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${await res.text()}`);
        }

        const orders = await res.json();

        if (orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="alert alert-warning">Todavía no tenés pedidos.</div>
            `;
            return;
        }

        ordersContainer.innerHTML = "";

        // 3. (Opcional) Mapeo de datos (actualicé los campos según tu DTO)
        orders.forEach((order: any) => {
            const div = document.createElement("div");
            div.className = "card mb-3 shadow-sm p-3";

            // Mapeamos los items que vienen del OrderDTO
            const itemsHtml = order.items.map((it: any) => `
                <li>(Producto ID: ${it.productId}) x${it.quantity} — $${it.price}</li>
            `).join("");

            const date = new Date(order.createdAt).toLocaleString();

            div.innerHTML = `
                <div classd="d-flex justify-content-between">
                    <h5 class="fw-bold text-success">Pedido #${order.id}</h5>
                    <span class="badge bg-secondary">${order.status || 'PENDIENTE'}</span>
                </div>
                <p class="text-muted">${date}</p>
                <p><strong>Dirección:</strong> ${order.address || 'No especificada'}</p>
                <p><strong>Teléfono:</strong> ${order.phone || 'No especificado'}</p>
                
                <h6 class="fw-semibold mt-2">Productos:</h6>
                <ul>${itemsHtml}</ul>

                <h4 class="fw-bold text-end">Total: $${order.total}</h4>
            `;

            ordersContainer.appendChild(div);
        });

    } catch (error) {
        console.error("Error al cargar pedidos:", error);
        ordersContainer.innerHTML = `<div class="alert alert-danger">No se pudo cargar el historial de pedidos.</div>`;
    }
}

// Cargar al inicio
loadOrders();

// Actualizar contador de carrito
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount(); 
});

