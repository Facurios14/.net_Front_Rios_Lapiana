import { checkAuth } from "../../utils/auth";
import { getProductById } from "../../utils/api";
import { addToCart } from "../../utils/cart";

checkAuth("client");

// Insertar navbar
const navbarContainer = document.getElementById("navbar")!;
fetch("../../client/layouts/navbar.html")
    .then(r => r.text())
    .then(html => (navbarContainer.innerHTML = html));

const container = document.getElementById("product-container")!;

// Obtener ID desde URL
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

if (!productId) {
    container.innerHTML = `<div class="alert alert-danger">Producto no encontrado</div>`;
}

async function loadProduct() {
    try {
        const p = await getProductById(productId);

        container.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${p.imageUrl}" class="product-img shadow" />
                </div>

                <div class="col-md-6">
                    <h2 class="text-success fw-bold">${p.name}</h2>
                    <h4 class="text-muted">${p.category?.name || "Sin categoría"}</h4>

                    <p class="mt-3">${p.description || "Sin descripción"}</p>

                    <h3 class="text-success fw-bold mt-3">$${p.price}</h3>

                    <p class="mt-2 ${
                        p.stock === 0 ? "text-danger" : "text-success"
                    } fw-bold">
                        Stock: ${p.stock}
                    </p>

                    <button id="add-cart" class="btn btn-success mt-3"
                        ${p.stock === 0 ? "disabled" : ""}>
                        <i class="bi bi-cart-plus"></i> Agregar al carrito
                    </button>
                </div>
            </div>
        `;

        // Botón agregar carrito
        const btn = document.getElementById("add-cart")!;
        btn.addEventListener("click", () => {
            addToCart(p);
            alert("Producto agregado al carrito");
        });

    } catch (err) {
        container.innerHTML = `
            <div class="alert alert-danger mt-5">
                Error cargando producto
            </div>
        `;
    }
}

loadProduct();
