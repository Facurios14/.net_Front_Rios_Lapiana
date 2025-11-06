export const API_BASE = import.meta.env.VITE_API_URL;

// ENDPOINTS CLIENTE
export const API_URL_PRODUCTS = `${API_BASE}/products`;
export const API_URL_CATEGORIES = `${API_BASE}/categories`;
export const API_URL_ORDERS = `${API_BASE}/orders`;
export const API_URL_USERS = `${API_BASE}/auth`;

// Obtener un producto por ID
export const getProductById = async (id: number) => {
    const res = await fetch(`${API_URL_PRODUCTS}/${id}`);
    if (!res.ok) throw new Error("Error al cargar producto");
    return await res.json();
};
