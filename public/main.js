/* =========================
   MAIN.JS
========================= */

document
.getElementById("btnBuscar")
?.addEventListener("click", async () => {

  const texto =
  document
  .getElementById("texto")
  .value
  .trim();

  const tipo =
  document
  .getElementById("tipo")
  .value;

  if(!texto){

    alert("Escribe algo");

    return;

  }

  let url = "";

  if(tipo === "film"){

    url =
    `http://localhost:3000/api/films?name=${encodeURIComponent(texto)}`;

  }else{

    url =
    `http://localhost:3000/api/films/director?name=${encodeURIComponent(texto)}`;

  }

  try{

    const response =
    await fetch(url);

    const data =
    await response.json();

    const resultado =
    document.getElementById("resultado");

    resultado.innerHTML = "";

    if(!data.results.length){

      resultado.innerHTML =
      "<li>No se encontraron películas</li>";

      return;

    }

    data.results.forEach(movie => {

      const li =
      document.createElement("li");

      li.innerHTML = `
        <a href="index2.html?id=${movie.id}">
          🎬 ${movie.original_title}
        </a>
      `;

      resultado.appendChild(li);

    });

  }catch(error){

    console.error(error);

  }

});