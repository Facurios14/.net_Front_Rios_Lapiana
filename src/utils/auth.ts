export function logout() {
    localStorage.removeItem("user");
    alert("Cerrando sesión...");
    window.location.href = "../../auth/login/login.html";
}

//  Función para obtener el usuario logueado
/* export function getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
} */

export function checkAuth(requiredRole?: string) {
    const userStr = localStorage.getItem("user");

    // No hay usuario logueado
    if (!userStr) {
        alert("Debes iniciar sesión primero.");
        window.location.href = "../../auth/login/login.html";
        return;
    }

    try {
        const user = JSON.parse(userStr);

        // Si se requiere un rol específico
        if (requiredRole && user.role !== requiredRole) {
            alert("Acceso denegado: no tienes permisos para esta sección.");
            window.location.href = "../../auth/login/login.html";
            return;
        }
        
    } catch (err) {
        console.error("Error leyendo el usuario del localStorage:", err);
        localStorage.removeItem("user");
        window.location.href = "../../auth/login/login.html";
    }
}

