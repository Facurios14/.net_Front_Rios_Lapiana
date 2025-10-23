const user = JSON.parse(localStorage.getItem("user") || "null");

if (!user || user.role !== "ADMIN") {
    alert("Acceso denegado. Solo para administradores.");
    window.location.href = "../../auth/login/login.html";
}
