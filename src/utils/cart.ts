
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("main-content");

sidebarToggle?.addEventListener("click", () => {
    sidebar?.classList.toggle("d-none");
    if (sidebar?.classList.contains("d-none")) {
        mainContent?.classList.remove("offset-md-3", "offset-lg-2");
    } else {
        mainContent?.classList.add("offset-md-3", "offset-lg-2");
    }
});

// Obtener carrito (si no existe, devuelve un array vacío)
export const getCart = () => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
};

// Guardar carrito
const saveCart = (cart: any[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
};

// ✅ Agregar un producto al carrito
export const addToCart = (product: any) => {
    const cart = getCart();

    const item = cart.find((p: any) => p.id === product.id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1,
        });
    }

    saveCart(cart);
};

// ✅ Eliminar un producto del carrito por ID
export const removeFromCart = (id: number) => {
    let cart = getCart();
    cart = cart.filter((p: any) => p.id !== id);
    saveCart(cart);
};

// ✅ Vaciar el carrito
export const clearCart = () => {
    localStorage.removeItem("cart");
    updateCartCount();
};

// ✅ Actualizar cantidad (ej: sumar/restar)
export const updateQuantity = (id: number, qty: number) => {
    const cart = getCart();
    const item = cart.find((p: any) => p.id === id);

    if (item) {
        item.quantity = qty;
        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
    }

    saveCart(cart);
};

// ✅ Actualiza el número que aparece en el ícono del carrito
export const updateCartCount = () => {
    const cart = getCart();
    const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);

    const badge = document.getElementById("cart-count");
    if (badge) {
        badge.textContent = String(count);
        badge.style.display = count > 0 ? "inline-block" : "none";
    }
};


