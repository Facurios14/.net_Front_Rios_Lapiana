import { checkAuth, logout } from "../../utils/auth";

const API_URL_CATEGORIES = import.meta.env.VITE_API_URL_CATEGORIES;
const API_URL_PRODUCTS = import.meta.env.VITE_API_URL_PRODUCTS;

// login de cliente
checkAuth("client");



const catContainer = document.getElementById("categories-container")!;
const prodContainer = document.getElementById("products-container")!;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
// Cerrar sesión
if (logoutBtn) logoutBtn.addEventListener("click", logout);

let categories: any[] = [];
let products: any[] = [];
let selectedCategory = 0;

// Cargar categorías
async function loadCategories() {
    const res = await fetch(API_URL_CATEGORIES);
    categories = await res.json();

    catContainer.innerHTML = `
        <span class="category-chip ${selectedCategory === 0 ? "active" : ""}" data-id="0">
            Todos
        </span>
    `;

    categories.forEach((c: any) => {
        catContainer.innerHTML += `
            <span class="category-chip ${selectedCategory === c.id ? "active" : ""}" data-id="${c.id}">
                ${c.name}
            </span>
        `;
    });

    document.querySelectorAll(".category-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
            selectedCategory = Number(chip.getAttribute("data-id"));
            renderProducts();
            loadCategories();
        });
    });
}

// Cargar productos
async function loadProducts() {
    const res = await fetch(API_URL_PRODUCTS);
    products = await res.json();
    renderProducts();
}

//  Mostrar productos
function renderProducts() {
    prodContainer.innerHTML = "";

    const filtered =
        selectedCategory === 0
            ? products
            : products.filter((p) => p.category?.id === selectedCategory);

    if (filtered.length === 0) {
        prodContainer.innerHTML = `
            <div class="text-center text-muted mt-5">No hay productos disponibles</div>
        `;
        return;
    }

    filtered.forEach((p) => {
        prodContainer.innerHTML += `
            <div class="col-md-4 col-lg-3">
                <div class="card shadow product-card" onclick="window.location.href='../productDetail/productDetail.html?id=${p.id}'">
                    <img src="${p.imageUrl}" class="product-img">
                    <div class="card-body">
                        <h5 class="card-title fw-bold text-success">${p.name}</h5>
                        <p class="text-muted">${p.category?.name || "Sin categoría"}</p>
                        <h4 class="fw-bold">$${p.price}</h4>
                    </div>
                </div>
            </div>
        `;
    });
}

loadCategories();
loadProducts();

