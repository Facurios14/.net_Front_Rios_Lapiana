/* export function checkAuth(requiredRole?: string) {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
        alert("Debes iniciar sesión primero");
        window.location.href = "../../auth/login/login.html";
        return;
    }

    const user = JSON.parse(userStr);

    // Si se requiere un rol específico (por ejemplo ADMIN)
    if (requiredRole && user.role !== requiredRole) {
        alert("Acceso denegado: no tienes permisos");
        window.location.href = "../../auth/login/login.html";
        return;
    }
} */

/**
 * Verifica si hay un usuario logueado en localStorage.
 * Si no existe o no tiene el rol requerido, redirige al login o al home correspondiente.
 *
 * @param requiredRole Rol necesario para acceder a la página ("ADMIN" o "CLIENT")
 */
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

