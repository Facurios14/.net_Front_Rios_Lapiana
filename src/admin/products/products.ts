export {}; 

const API_URL = "http://localhost:8080/api/products";
const CATEGORY_URL = "http://localhost:8080/api/categories";

const form = document.getElementById("productForm") as HTMLFormElement;
const tableBody = document.querySelector("#productTable tbody") as HTMLElement;

const idInput = document.getElementById("id") as HTMLInputElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const priceInput = document.getElementById("price") as HTMLInputElement;
const categorySelect = document.getElementById("category") as HTMLSelectElement;

// 🟩 Cargar categorías en el select
async function loadCategories() {
    try {
        const res = await fetch(CATEGORY_URL);
        const categories = await res.json();

        categorySelect.innerHTML = "";
        categories.forEach((cat: any) => {
            const option = document.createElement("option");
            option.value = String(cat.id);
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    } catch (err) {
        console.error("Error al cargar categorías:", err);
    }
}

// 🟦 Cargar productos en la tabla
async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        const products = await res.json();

        tableBody.innerHTML = "";
        products.forEach((p: any) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.category?.name || "Sin categoría"}</td>
        <td>
            <button onclick="editProduct(${p.id}, '${p.name}', ${p.price}, ${p.category?.id || 0})">Editar</button>
            <button onclick="deleteProduct(${p.id})">Eliminar</button>
        </td>
        `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error("Error al cargar productos:", err);
    }
}

// 🟨 Guardar o actualizar producto
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = idInput.value;
    const name = nameInput.value;
    const price = parseFloat(priceInput.value);
    const categoryId = parseInt(categorySelect.value);

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    const body = JSON.stringify({
        name,
        price,
        category: { id: categoryId } // 👈 clave del problema: debe ser objeto
    });

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);
        form.reset();
        idInput.value = "";
        await loadProducts();
    } catch (err) {
        console.error("Error al guardar producto:", err);
    }
});

// 🟥 Eliminar producto
(window as any).deleteProduct = async (id: number) => {
    if (!confirm("¿Seguro que querés eliminar este producto?")) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar producto");
        await loadProducts();
    } catch (err) {
        console.error("Error al eliminar producto:", err);
    }
};

// 🟩 Editar producto
(window as any).editProduct = (id: number, name: string, price: number, categoryId: number) => {
    const idInput = document.querySelector("#id") as HTMLInputElement;
    const nameInput = document.querySelector("#name") as HTMLInputElement;
    const priceInput = document.querySelector("#price") as HTMLInputElement;
    const categorySelect = document.querySelector("#category") as HTMLSelectElement;

    idInput.value = String(id);
    nameInput.value = name;
    priceInput.value = String(price);
    categorySelect.value = String(categoryId);
};

// Inicializar
loadCategories();
loadProducts();

