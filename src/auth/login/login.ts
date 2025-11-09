export {}; 
const API_URL = import.meta.env.VITE_API_URL;
const form = document.getElementById("loginForm") as HTMLFormElement;

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById("username") as HTMLInputElement;
        const passwordInput = document.getElementById("password") as HTMLInputElement;
        
        if (!usernameInput || !passwordInput) {
            console.error("Faltan elementos en el formulario");
            alert("Error interno: faltan campos en el formulario");
            return;
        }
        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const user = await res.json(); 
                localStorage.setItem("user", JSON.stringify(user));
                alert("Login exitoso");
                /* mayusculas por que no lo distinguia */
                if (user.role.toUpperCase() === "ADMIN") {
                    window.location.href = "../../admin/adminHome/adminHome.html";
                } else {
                    window.location.href = "../../store/home/home.html";
                }
            } else {
                alert("Credenciales incorrectas");
            }
        } catch (err) {
            console.error(err);
            alert("Error al conectar con el servidor");
        }
    });
} else {
    console.error("Formulario no encontrado");
}