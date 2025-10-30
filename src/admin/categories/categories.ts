export {}; 

const API_URL = "http://localhost:8080/api/categories";

const form = document.getElementById("categoryForm") as HTMLFormElement;
const tableBody = document.getElementById("categoriesTable") as HTMLTableSectionElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const idInput = document.getElementById("categoryId") as HTMLInputElement;

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
        <button onclick="editCategory(${cat.id}, '${cat.name}')">Editar</button>
        <button onclick="deleteCategory(${cat.id})">Eliminar</button>
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

loadCategories();
