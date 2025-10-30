import { apiFetch } from '../../utils/api';
import { checkAuth } from '../../utils/auth.ts';
import { navigateTo } from '../../../utils/navigate';
import { renderNavbar, updateCartBadge } from '../../../components/Navbar/Navbar';
import { addToCart } from '../../../utils/cart';
import { IProduct } from '../../../types/IProduct';

// --- Variables Globales ---
let currentProduct: IProduct | null = null;
let currentQuantity: number = 1;

// --- Elementos del DOM ---
let loader: HTMLDivElement;
let content: HTMLDivElement;
let productImage: HTMLImageElement;
let productName: HTMLHeadingElement;
let productStatus: HTMLSpanElement;
let productDesc: HTMLParagraphElement;
let productStock: HTMLParagraphElement;
let productPrice: HTMLParagraphElement;
let quantityInput: HTMLInputElement;
let quantityDecreaseBtn: HTMLButtonElement;
let quantityIncreaseBtn: HTMLButtonElement;
let addToCartBtn: HTMLButtonElement;
let confirmMessage: HTMLParagraphElement;
let backBtn: HTMLButtonElement;

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Proteger ruta y renderizar Navbar
    checkAuth(['cliente', 'admin']);
    renderNavbar();

    // 2. Obtener elementos del DOM
    loader = document.getElementById('product-loader') as HTMLDivElement;
    content = document.getElementById('product-content') as HTMLDivElement;
    productImage = document.getElementById('product-image') as HTMLImageElement;
    productName = document.getElementById('product-name') as HTMLHeadingElement;
    productStatus = document.getElementById('product-status') as HTMLSpanElement;
    productDesc = document.getElementById('product-desc') as HTMLParagraphElement;
    productStock = document.getElementById('product-stock') as HTMLParagraphElement;
    productPrice = document.getElementById('product-price') as HTMLParagraphElement;
    quantityInput = document.getElementById('quantity-input') as HTMLInputElement;
    quantityDecreaseBtn = document.getElementById('quantity-decrease') as HTMLButtonElement;
    quantityIncreaseBtn = document.getElementById('quantity-increase') as HTMLButtonElement;
    addToCartBtn = document.getElementById('add-to-cart-btn') as HTMLButtonElement;
    confirmMessage = document.getElementById('confirm-message') as HTMLParagraphElement;
    backBtn = document.getElementById('back-btn') as HTMLButtonElement;

    // 3. Cargar datos del producto
    loadProductDetails();

    // 4. Conectar eventos
    addEventListeners();
});

// --- LÓGICA DE CARGA ---
function getProductIdFromUrl(): number | null {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
        return Number(id);
    }
    return null;
}

async function loadProductDetails() {
    const productId = getProductIdFromUrl();
    if (!productId) {
        loader.textContent = 'Error: No se especificó un producto.';
        return;
    }

    // Llamamos al endpoint de backend: /api/products/{id}
    const response = await apiFetch<IProduct>(`/products/${productId}`);

    if (response.error || !response.data) {
        loader.textContent = 'Error: Producto no encontrado.';
        return;
    }

    currentProduct = response.data;
    renderProductDetails();

    // Ocultar loader y mostrar contenido
    loader.style.display = 'none';
    content.style.display = 'flex'; // Usamos flex para el layout
}

// --- RENDERIZADO ---
function renderProductDetails() {
    if (!currentProduct) return;

    productImage.src = currentProduct.imagenUrl;
    productName.textContent = currentProduct.nombre;
    productDesc.textContent = currentProduct.descripcion;
    productPrice.textContent = `$${currentProduct.precio.toFixed(2)}`;
    [cite_start]productStock.textContent = `Stock disponible: ${currentProduct.stock}`;[cite: 209]

    [cite_start]// Validaciones de stock y estado [cite: 216, 218]
    const isAvailable = currentProduct.disponible && currentProduct.stock > 0;

    if (isAvailable) {
        productStatus.textContent = 'Disponible';
        productStatus.className = 'badge badge-success';
        addToCartBtn.disabled = false;
        quantityInput.disabled = false;
        quantityIncreaseBtn.disabled = false;
        quantityDecreaseBtn.disabled = false;
    } else {
        productStatus.textContent = 'No Disponible';
        productStatus.className = 'badge badge-danger';
        addToCartBtn.disabled = true; // No permite agregar si no hay stock o está inactivo
        addToCartBtn.textContent = 'No disponible';
        quantityInput.disabled = true;
        quantityIncreaseBtn.disabled = true;
        quantityDecreaseBtn.disabled = true;
    }
}

// --- MANEJO DE EVENTOS ---
function addEventListeners() {
    // Botón Volver
    backBtn.addEventListener('click', () => {
        navigateTo('/src/pages/store/home/home.html');
    });

    // Control de Cantidad
    quantityIncreaseBtn.addEventListener('click', () => handleQuantityChange(1));
    quantityDecreaseBtn.addEventListener('click', () => handleQuantityChange(-1));
    quantityInput.addEventListener('change', () => handleQuantityChange(0));

    // Agregar al Carrito
    addToCartBtn.addEventListener('click', handleAddToCart);
}

function handleQuantityChange(change: number) {
    if (!currentProduct) return;

    // Actualiza el valor (si change es 0, lee el input)
    currentQuantity = (change === 0) ? parseInt(quantityInput.value) : currentQuantity + change;

    // Validaciones
    if (currentQuantity < 1) {
        currentQuantity = 1;
    }

    [cite_start]// No permite cantidad mayor al stock disponible [cite: 217]
    if (currentQuantity > currentProduct.stock) {
        currentQuantity = currentProduct.stock;
        confirmMessage.textContent = 'No puedes seleccionar más que el stock disponible.';
        confirmMessage.className = 'error-text';
    } else {
        confirmMessage.textContent = ''; // Limpiar error de stock
    }

    quantityInput.value = currentQuantity.toString();
}

function handleAddToCart() {
    if (!currentProduct || currentQuantity === 0) return;

    // 1. Usar la utilidad del carrito
    addToCart(currentProduct, currentQuantity);

    // 2. Actualizar el badge del navbar
    updateCartBadge();

    [cite_start]// 3. Mostrar mensaje de confirmación [cite: 213]
    confirmMessage.textContent = `¡"${currentProduct.nombre}" (x${currentQuantity}) agregado al carrito!`;
    confirmMessage.className = 'confirm-text';

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        confirmMessage.textContent = '';
    }, 3000);
}