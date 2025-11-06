import { checkAuth } from "../../utils/auth";

checkAuth("client");

const ORDER_URL = import.meta.env.VITE_API_URL_ORDERS;
const navbarContainer = document.getElementById("navbar")!;
const ordersContainer = document.getElementById("orders-container")!;

fetch("/src/client/layout/navbar.html")
    .then(res => res.text())
    .then(html => navbarContainer.innerHTML = html);

async function loadOrders() {
    const res = await fetch(ORDER_URL);
    const orders = await res.json();

    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="alert alert-warning">Todavía no tenés pedidos.</div>
        `;
        return;
    }

    ordersContainer.innerHTML = "";

    orders.forEach((order: any) => {
        const div = document.createElement("div");
        div.className = "card mb-3 shadow-sm p-3";

        const itemsHtml = order.items.map((it: any) => `
            <li>${it.productName} x${it.quantity} — $${it.subtotal}</li>
        `).join("");

        div.innerHTML = `
            <h5 class="fw-bold text-success">Pedido #${order.id}</h5>
            <p class="text-muted">${order.date}</p>

            <h6 class="fw-semibold">Productos:</h6>
            <ul>${itemsHtml}</ul>

            <p class="fw-bold">Total: $${order.total}</p>
        `;

        ordersContainer.appendChild(div);
    });
}

loadOrders();

