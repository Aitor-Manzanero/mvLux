const DATA = [

  {
    section:"Tendencias",
    title:"Los odiosos ocho",
    year:2015,

    poster:"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=900&auto=format&fit=crop",

    synopsis:"El cazarrecompensas John Ruth y su fugitiva Daisy Domergue intentan llegar al pueblo de Red Rock.",

    video:"./videos/pelicula.mp4"
  },

  {
    section:"Tendencias",
    title:"Dune",
    year:2021,

    poster:"https://picsum.photos/seed/dune/600/900",

    synopsis:"Paul Atreides viaja a Arrakis.",

    video:"./videos/pelicula.mp4"
  },

  {
    section:"Acción",
    title:"John Wick",
    year:2014,

    poster:"https://picsum.photos/seed/johnwick/600/900",

    synopsis:"Un exasesino vuelve.",

    video:"./videos/pelicula.mp4"
  }

];

/* =========================
   HELPERS
========================= */

function el(tag, className){

  const node = document.createElement(tag);

  if(className){
    node.className = className;
  }

  return node;
}

/* =========================
   HERO
========================= */

function setupHero(movie){

  const hero = document.getElementById("hero");

  document.getElementById("heroTitle").textContent =
  movie.title;

  document.getElementById("heroDescription").textContent =
  movie.synopsis;

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

  document.getElementById("heroPlay").onclick = () => {
    openMovie(movie);
  };

  document.getElementById("heroInfo").onclick = () => {
    openMovie(movie);
  };
}

/* =========================
   CREATE CARD
========================= */

function createCard(movie){

  const card = el("article","card");

  card.innerHTML = `
    <img
      class="poster"
      src="${movie.poster}"
    >

    <div class="card__meta">

      <p class="card__title">
        ${movie.title}
      </p>

      <p class="card__year">
        ${movie.year}
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

function render(data){

  const sections = {};

  data.forEach(movie => {

    if(!sections[movie.section]){
      sections[movie.section] = [];
    }

    sections[movie.section].push(movie);

  });

  const root =
  document.getElementById("sections");

  root.innerHTML = "";

  Object.entries(sections).forEach(([name,movies]) => {

    const section = el("section","section");

    section.innerHTML = `
      <h2 class="section__title">
        ${name}
      </h2>
    `;

    const row = el("div","row");

    movies.forEach(movie => {
      row.appendChild(createCard(movie));
    });

    section.appendChild(row);

    root.appendChild(section);

  });

}

/* =========================
   OPEN MOVIE
========================= */

function openMovie(movie){

  const modal =
  document.createElement("div");

  modal.className =
  "movie-modal";

  modal.innerHTML = `
    <div class="movie-modal__content">

      <button class="movie-close">
        ✕
      </button>

      <video controls autoplay>

        <source
          src="${movie.video}"
          type="video/mp4"
        >

      </video>

      <h2>${movie.title}</h2>

      <p>${movie.synopsis}</p>

    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".movie-close")
  .onclick = () => {
    modal.remove();
  };
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
    DATA.filter(movie =>
      movie.title
      .toLowerCase()
      .includes(value)
    );

    render(filtered);

  });

}

/* =========================
   INIT
========================= */

render(DATA);

setupHero(DATA[0]);

setupSearch();