import { checkAuth, logout  } from "../../utils/auth";

checkAuth("client");
const API_URL_CATEGORIES = import.meta.env.VITE_API_URL_CATEGORIES;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
// Cerrar sesión
if (logoutBtn) logoutBtn.addEventListener("click", logout);

// MOSTRAR CATEGORÍAS DESTACADAS
const catContainer = document.getElementById("featured-categories")!;

async function loadCategories() {
    try {
        const res = await fetch(API_URL_CATEGORIES);
        const categories = await res.json();

        catContainer.innerHTML = "";

        categories.slice(0, 3).forEach((cat: any) => {
            const div = document.createElement("div");
            div.className = "col-md-4";

            div.innerHTML = `
                <a href="../store/store.html?category=${cat.id}" class="text-decoration-none">
                    <div class="card category-card">
                        <img src="${cat.imageUrl}" class="card-img-top" style="height: 180px; object-fit: cover;">
                        <div class="card-body text-center">
                            <h5 class="text-success fw-bold">${cat.name}</h5>
                        </div>
                    </div>
                </a>
            `;

            catContainer.appendChild(div);
        });

    } catch (error) {
        catContainer.innerHTML = `
            <div class="alert alert-danger">Error al cargar las categorías</div>
        `;
    }
}

loadCategories();
