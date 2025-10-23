const user2 = JSON.parse(localStorage.getItem("user") || "null");

if (!user2 || user.role !== "CLIENTE") {
    alert("Acceso denegado. Solo para clientes.");
    window.location.href = "../../auth/login/login.html";
}

