// ENDPOINTS CLIENTE
export const API_URL_PRODUCTS = import.meta.env.VITE_API_URL_PRODUCTS;
export const API_URL_CATEGORIES = import.meta.env.VITE_API_URL_CATEGORIES;
export const API_URL_ORDERS = import.meta.env.VITE_API_URL_ORDERS;
export const API_URL_USERS = import.meta.env.VITE_API_URL_USERS;

// Obtener un producto por ID
export const getProductById = async (id: number) => {
    const res = await fetch(`${API_URL_PRODUCTS}/${id}`);
    if (!res.ok) throw new Error("Error al cargar producto");
    return await res.json();
};
