import { checkAuth, logout } from "../../utils/auth";

checkAuth("admin");

const ORDERS_URL = import.meta.env.VITE_API_URL_ORDERS;
const container = document.getElementById("orders-container")!;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
// Cerrar sesión
if (logoutBtn) logoutBtn.addEventListener("click", logout);

// Opciones de estado (igual que en el PDF)
const STATUS_OPTIONS = [
    { value: "PENDIENTE", text: "Pendiente" },
    { value: "EN PREPARACIÓN", text: "En Preparación" },
    { value: "ENTREGADO", text: "Entregado" },
    { value: "CANCELADO", text: "Cancelado" },
];

// Cargar todos los pedidos
async function loadOrders() {
    try {
        const res = await fetch(ORDERS_URL); // Llama a GET /api/orders

        if (!res.ok) {
            throw new Error(`Error ${res.status}`);
        }

        const orders = await res.json();
        container.innerHTML = "";

        if (orders.length === 0) {
            container.innerHTML = `<div class="alert alert-info">No hay pedidos para mostrar.</div>`;
            return;
        }

        orders.forEach((order: any) => {
            const card = document.createElement("div");
            card.className = "card shadow-sm mb-3";

            // Creamos las opciones del <select>
            const optionsHtml = STATUS_OPTIONS.map(opt => 
                `<option value="${opt.value}" ${order.status === opt.value ? "selected" : ""}>
                    ${opt.text}
                </option>`
            ).join("");

            // Formatear la fecha
            const date = new Date(order.createdAt).toLocaleString();

            card.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title fw-bold text-success">Pedido #${order.id}</h5>
                        <span class="text-muted">Cliente ID: ${order.userId}</span>
                    </div>

                    <p><strong>Fecha:</strong> ${date}</p>
                    <p><strong>Total:</strong> $${order.total}</p>
                    <p><strong>Dirección:</strong> ${order.address}</p>
                    <p><strong>Teléfono:</strong> ${order.phone}</p>

                    <div class="d-flex align-items-center gap-2 mt-3">
                        <label class="form-label fw-semibold">Estado:</label>
                        <select class="form-select form-select-sm w-auto" id="status-select-${order.id}">
                            ${optionsHtml}
                        </select>
                        <button 
                            class="btn btn-success btn-sm ms-auto update-btn" 
                            data-id="${order.id}"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        attachUpdateEvents();

    } catch (err) {
        console.error("Error al cargar pedidos:", err);
        container.innerHTML = `<div class="alert alert-danger">Error al cargar pedidos</div>`;
    }
}

// ✅ Asignar eventos a los botones "Actualizar"
function attachUpdateEvents() {
    document.querySelectorAll(".update-btn").forEach(btn => {
        btn.addEventListener("click", async (e: any) => {
            
            const id = e.target.getAttribute("data-id");
            
            // Buscamos el <select> específico para este pedido
            const select = document.getElementById(`status-select-${id}`) as HTMLSelectElement;
            const newStatus = select.value;

            // Mostramos feedback
            e.target.textContent = "Actualizando...";
            e.target.disabled = true;

            try {
                // Llamamos a la nueva ruta del backend
                const res = await fetch(`${ORDERS_URL}/${id}/status`, { 
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }) // Enviamos el JSON { "status": "..." }
                });

                if (!res.ok) throw new Error("Error al actualizar");

                alert("✅ Pedido actualizado");
                loadOrders(); // Recargar lista para mostrar cambios

            } catch (err) {
                console.error("Error al actualizar:", err);
                alert("❌ Error al actualizar el pedido");
                e.target.textContent = "Actualizar";
                e.target.disabled = false;
            }
        });
    });
}

loadOrders();
