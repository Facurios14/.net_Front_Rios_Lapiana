const API_URL = "http://localhost:8080/api/hello";

async function testConnection() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const message = await response.text();
            console.log(message);
            alert(message); // muestra el mensaje en pantalla
        } else {
            console.error("Error al conectar con el backend");
        }
    } catch (error) {
        console.error("Backend no disponible:", error);
    }
}

testConnection();
