/* =========================
   API URL
========================= */

const API =
"http://localhost:3000/api/films";

/* =========================
   GLOBAL DATA
========================= */

let MOVIES = [];

/* =========================
   HELPERS
========================= */

function el(tag, className){

  const node =
  document.createElement(tag);

  if(className){
    node.className = className;
  }

  return node;
}

/* =========================
   FETCH MOVIES
========================= */

async function fetchMovies(){

  try{

    const response =
    await fetch(API);

    const data =
    await response.json();

    MOVIES =
    data.results || data;

    render(MOVIES);

    if(MOVIES.length){
      setupHero(MOVIES[0]);
    }

  }catch(error){

    console.error(error);

  }

}

/* =========================
   HERO
========================= */

function setupHero(movie){

  const hero =
  document.getElementById("hero");

  document.getElementById("heroTitle")
  .textContent =
  movie.title ||
  movie.original_title;

  document.getElementById("heroDescription")
  .textContent =
  movie.synopsis ||
  movie.overview;

  hero.style.background = `
    linear-gradient(
      to right,
      rgba(0,0,0,.92) 20%,
      rgba(0,0,0,.2)
    ),
    linear-gradient(
      to top,
      rgba(20,20,20,1),
      rgba(20,20,20,.2)
    ),
    url("${movie.poster}")
    center/cover no-repeat
  `;

  document.getElementById("heroPlay")
  .onclick = () => {

    openMovie(movie);

  };

  document.getElementById("heroInfo")
  .onclick = () => {

    openMovie(movie);

  };

}

/* =========================
   CREATE CARD
========================= */

function createCard(movie){

  const card =
  el("article","card");

  card.innerHTML = `
    <img
      class="poster"
      src="${movie.poster}"
    >

    <div class="card__meta">

      <p class="card__title">
        ${movie.title || movie.original_title}
      </p>

      <p class="card__year">
        ${movie.year || ""}
      </p>

    </div>
  `;

  card.onclick = () => {

    openMovie(movie);

  };

  return card;
}

/* =========================
   OPEN MOVIE PAGE
========================= */

function openMovie(movie){

  window.location.href =
  `index2.html?id=${movie.id}`;

}

/* =========================
   RENDER
========================= */

function render(data){

  const sections = {};

  data.forEach(movie => {

    const section =
    movie.section || "Películas";

    if(!sections[section]){

      sections[section] = [];

    }

    sections[section]
    .push(movie);

  });

  const root =
  document.getElementById("sections");

  root.innerHTML = "";

  Object.entries(sections)
  .forEach(([name,movies]) => {

    const section =
    el("section","section");

    section.innerHTML = `
      <h2 class="section__title">
        ${name}
      </h2>
    `;

    const row =
    el("div","row");

    movies.forEach(movie => {

      row.appendChild(
        createCard(movie)
      );

    });

    section.appendChild(row);

    root.appendChild(section);

  });

}

/* =========================
   SEARCH
========================= */

function setupSearch(){

  const input =
  document.getElementById("searchInput");

  input.addEventListener("input", () => {

    const value =
    input.value.toLowerCase();

    const filtered =
    MOVIES.filter(movie => {

      const title =
      (
        movie.title ||
        movie.original_title ||
        ""
      ).toLowerCase();

      return title.includes(value);

    });

    render(filtered);

  });

}

/* =========================
   INIT
========================= */

fetchMovies();

setupSearch();