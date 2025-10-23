export {};
const form = document.getElementById("registerForm") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
    const role = (document.getElementById("role") as HTMLSelectElement).value;

    const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
    });

    if (response.ok) {
        const user = await response.json();
        alert(`Usuario ${user.username} registrado correctamente`);
        window.location.href = "../login/login.html";
    } else {
        const error = await response.text();
        alert(`Error: ${error}`);
    }
});
