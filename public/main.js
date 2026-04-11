document.getElementById("btnBuscar").addEventListener("click", async function () {

    const texto = document.getElementById("texto").value.trim();
    const tipo = document.getElementById("tipo").value;

    if (!texto) {
        alert("Escribe algo para buscar");
        return;
    }

    let url = "";

    if (tipo === "film") {
        // @TODO: Crear variables de entorno
        url = `http://localhost:3000/api/films?name=${encodeURIComponent(texto)}`;
    } else if (tipo === "director") {
        url = `http://localhost:3000/api/films/director?name=${encodeURIComponent(texto)}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        const list = document.getElementById("resultado");
        list.innerHTML = ""; // limpiar resultados anteriores

        if (data.results.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No se encontraron resultados.";
            list.appendChild(li);
            return;
        }

        data.results.forEach(film => {
            const li = document.createElement("li");
            li.textContent = film.original_title;
            list.appendChild(li);
        });

    } catch (error) {
        const list = document.getElementById("resultado");
        list.innerHTML = "<li>Error al llamar a la API</li>";
        console.error(error);
    }
});
