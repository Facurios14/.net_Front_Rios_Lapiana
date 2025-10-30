/* const user = JSON.parse(localStorage.getItem("user") || "null");

if (!user || user.role !== "ADMIN") {
    alert("Acceso denegado. Solo para administradores.");
    window.location.href = "../../auth/login/login.html";
} */


import { checkAuth } from "../../utils/auth";

checkAuth("admin"); // Solo admin puede acceder

const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    alert("Cerrando sesion");
    window.location.href = "../../auth/login/login.html";
});
