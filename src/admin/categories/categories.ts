import { checkAuth, logout } from "../../utils/auth";
import * as bootstrap from "bootstrap";
// ✅ Verificar autenticación de admin
checkAuth("admin");

// ✅ Constantes y referencias
const API_URL = import.meta.env.VITE_API_URL_CATEGORIES;
const form = document.getElementById("category-form") as HTMLFormElement;
const tableBody = document.getElementById("table-body") as HTMLTableSectionElement;
const idInput = document.getElementById("category-id") as HTMLInputElement;
const nameInput = document.getElementById("category-name") as HTMLInputElement;
const imageInput = document.getElementById("category-image") as HTMLInputElement;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
const modalEl = document.getElementById("categoryModal") as HTMLElement;
const modal = new bootstrap.Modal(modalEl);

// Cerrar sesión
if (logoutBtn) logoutBtn.addEventListener("click", logout);

// ✅ Cargar categorías
async function loadCategories() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

        const categories = await res.json();
        tableBody.innerHTML = "";

        if (categories.length === 0) {
            tableBody.innerHTML = `
                <tr><td colspan="4" class="text-center text-muted">No hay categorías cargadas.</td></tr>
            `;
            return;
        }

        categories.forEach((cat: any) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${cat.id}</td>
                <td>${cat.name}</td>
                <td>
                    <img src="${cat.imageUrl || "./default.jpg"}" 
                        alt="${cat.name}" 
                        width="80" height="60" 
                        class="rounded shadow-sm border">
                </td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" 
                            onclick="editCategory(${cat.id}, '${cat.name}', '${cat.imageUrl || ""}')">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger" 
                            onclick="deleteCategory(${cat.id})">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error("⚠️ Error al cargar categorías:", err);
        tableBody.innerHTML = `
            <tr><td colspan="4" class="text-center text-danger">Error al cargar categorías.</td></tr>
        `;
    }
}

// ✅ Guardar (crear / editar)
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = idInput.value;
    const name = nameInput.value.trim();
    const imageUrl = imageInput.value.trim();

    if (!name) {
        alert("El nombre es obligatorio");
        return;
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, imageUrl }),
        });

        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

        modal.hide();
        form.reset();
        idInput.value = "";
        await loadCategories();

        alert(id ? "Categoría actualizada" : "Categoría creada correctamente");
    } catch (err) {
        console.error("⚠️ Error al guardar categoría:", err);
        alert("Error al guardar la categoría. Ver consola.");
    }
});

// ✅ Editar categoría (abrir modal con datos)
(window as any).editCategory = (id: number, name: string, imageUrl: string) => {
    idInput.value = String(id);
    nameInput.value = name;
    imageInput.value = imageUrl || "";
    (document.getElementById("categoryModalLabel") as HTMLElement).textContent = "Editar Categoría";
    modal.show();
};

// ✅ Eliminar categoría
(window as any).deleteCategory = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        await loadCategories();
    } catch (err) {
        console.error("⚠️ Error al eliminar categoría:", err);
        alert("No se pudo eliminar la categoría.");
    }
};

// ✅ Cargar categorías al iniciar
document.addEventListener("DOMContentLoaded", loadCategories);


/* export {}; 
import { checkAuth, logout } from "../../utils/auth";

checkAuth("admin");

const API_URL = import.meta.env.VITE_API_URL_CATEGORIES;

const form = document.getElementById("categoryForm") as HTMLFormElement;
const tableBody = document.getElementById("categoriesTable") as HTMLTableSectionElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const idInput = document.getElementById("categoryId") as HTMLInputElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

async function loadCategories() {
    const res = await fetch(API_URL);
    const data = await res.json();

    tableBody.innerHTML = "";
    data.forEach((cat: any) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td>
        <button class="button edit" onclick="editCategory(${cat.id}, '${cat.name}')">Editar</button>
        <button class="button delete" onclick="deleteCategory(${cat.id})">Eliminar</button>
        </td>
    `;
        tableBody.appendChild(row);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const id = idInput.value;

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    form.reset();
    idInput.value = "";
    loadCategories();
});

(window as any).editCategory = (id: number, name: string) => {
    idInput.value = String(id);
    nameInput.value = name;
};

(window as any).deleteCategory = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadCategories();
};

loadCategories(); */
