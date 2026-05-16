/* APP.JS */

const API =
"http://localhost:3000/api/films";

/* =========================
   FETCH MOVIES
========================= */

async function getMovies(){

  try{

    const response =
    await fetch(API);

    const data =
    await response.json();

    return data.results || [];

  }catch(error){

    console.error(error);

    return [];
  }

}

/* =========================
   HERO
========================= */

function setupHero(movie){

  const hero =
  document.getElementById("hero");

  document.getElementById(
    "heroTitle"
  ).textContent =
  movie.original_title;

  document.getElementById(
    "heroDescription"
  ).textContent =
  movie.overview;

  hero.style.background = `
    linear-gradient(
      to right,
      rgba(0,0,0,.9),
      rgba(0,0,0,.2)
    ),
    url("${movie.poster}")
    center/cover no-repeat
  `;

  document.getElementById(
    "heroPlay"
  ).onclick = () => {

    openMovie(movie);

  };

}

/* =========================
   OPEN MOVIE
========================= */

function openMovie(movie){

  localStorage.setItem(
    "movie",
    JSON.stringify(movie)
  );

  window.location.href =
  "./index2.html";

}

/* =========================
   CREATE CARD
========================= */

function createCard(movie){

  const card =
  document.createElement("article");

  card.className =
  "card";

  card.innerHTML = `
    <img
      class="poster"
      src="${movie.poster}"
    >

    <div class="card__meta">

      <p class="card__title">
        ${movie.original_title}
      </p>

      <p class="card__year">
        ${movie.release_date || ""}
      </p>

    </div>
  `;

  card.onclick = () => {
    openMovie(movie);
  };

  return card;
}

/* =========================
   RENDER
========================= */

function render(movies){

  const root =
  document.getElementById(
    "sections"
  );

  root.innerHTML = "";

  const section =
  document.createElement("section");

  section.className =
  "section";

  section.innerHTML = `
    <h2 class="section__title">
      Películas
    </h2>
  `;

  const row =
  document.createElement("div");

  row.className = "row";

  movies.forEach(movie => {

    row.appendChild(
      createCard(movie)
    );

  });

  section.appendChild(row);

  root.appendChild(section);

}

/* =========================
   SEARCH
========================= */

function setupSearch(allMovies){

  const input =
  document.getElementById(
    "searchInput"
  );

  input.addEventListener(
    "input",
    () => {

      const value =
      input.value.toLowerCase();

      const filtered =
      allMovies.filter(movie => {

        return movie
        .original_title
        .toLowerCase()
        .includes(value);

      });

      render(filtered);

    }
  );

}

/* =========================
   INIT
========================= */

async function init(){

  const movies =
  await getMovies();

  if(!movies.length){
    return;
  }

  setupHero(movies[0]);

  render(movies);

  setupSearch(movies);

}

init();