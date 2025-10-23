export {}; 
const form = document.getElementById("loginForm") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const user = await response.json();

        // Guardamos el usuario en localStorage (sin la contraseña)
        localStorage.setItem("user", JSON.stringify(user));

        alert(`Bienvenido ${user.username}`);
        if (user.role === "admin") {
            console.log("Redirigiendo a admin.html");
            /* window.location.href = "admin.html"; */
        } else {
            console.log("Redirigiendo a client.html");
            /* window.location.href = "client.html"; */
        }
    } else {
        const error = await response.text();
        alert(`Error: ${error}`);
    }
});

