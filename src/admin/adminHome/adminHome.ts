/* const user = JSON.parse(localStorage.getItem("user") || "null");

if (!user || user.role !== "ADMIN") {
    alert("Acceso denegado. Solo para administradores.");
    window.location.href = "../../auth/login/login.html";
} */


import { checkAuth, logout } from "../../utils/auth";

checkAuth("admin"); // Solo admin puede acceder

const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
// Cerrar sesión
if (logoutBtn) logoutBtn.addEventListener("click", logout);


