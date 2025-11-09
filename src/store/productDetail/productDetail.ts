import { checkAuth, logout  } from "../../utils/auth";
import { getProductById } from "../../utils/api";
import { addToCart } from "../../utils/cart";

checkAuth("client");


const container = document.getElementById("product-container")!;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
// Cerrar sesión
if (logoutBtn) logoutBtn.addEventListener("click", logout);

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

                    <div class="input-group mb-3" style="max-width: 150px;">
                        <span class="input-group-text">Cantidad:</span>
                        <input type="number" id="quantity-input" class="form-control" 
                                value="1" min="1" max="${p.stock}">
                    </div>
                    <button id="add-cart" class="btn btn-success mt-3"
                        ${p.stock === 0 ? "disabled" : ""}>
                        <i class="bi bi-cart-plus"></i> Agregar al carrito
                    </button>
                </div>
            </div>
        `;

        const btn = document.getElementById("add-cart")!;
        const quantityInput = document.getElementById("quantity-input") as HTMLInputElement;

        btn.addEventListener("click", () => {
            // Leemos la cantidad del input
            const quantity = parseInt(quantityInput.value) || 1;

            // Validamos contra el stock (aunque el 'max' del input ayuda)
            if (quantity > p.stock) {
                alert("No hay suficiente stock disponible.");
                return;
            }
            if (quantity < 1) {
                alert("Debe agregar al menos 1 unidad.");
                return;
            }

            // Pasamos el producto Y la cantidad
            addToCart(p, quantity); 

            alert(`${quantity} ${p.name}(s) agregado(s) al carrito`);
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
