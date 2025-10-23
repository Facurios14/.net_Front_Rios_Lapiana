export {}; 
const form = document.getElementById("loginForm") as HTMLFormElement;

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById("username") as HTMLInputElement;
        const passwordInput = document.getElementById("password") as HTMLInputElement;
        const roleSelect = document.getElementById("role") as HTMLSelectElement;

        if (!usernameInput || !passwordInput || !roleSelect) {
            console.error("Faltan elementos en el formulario");
            alert("Error interno: faltan campos en el formulario");
            return;
        }

        const username = usernameInput.value;
        const password = passwordInput.value;
        const role = roleSelect.value;

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, role }),
            });

            if (res.ok) {
                const user = await res.json();
                localStorage.setItem("user", JSON.stringify(user));
                alert("Login exitoso");

                if (role === "ADMIN") {
                    window.location.href = "../../admin/adminHome/adminHome.html";
                } else {
                    window.location.href = "cliente.html";
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

