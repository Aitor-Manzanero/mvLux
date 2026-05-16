/* MAIN.JS */

const movie =
JSON.parse(
  localStorage.getItem("movie")
);

/* =========================
   LOAD MOVIE
========================= */

if(movie){

  document.getElementById(
    "movieTitle"
  ).textContent =
  movie.original_title;

  document.getElementById(
    "movieDescription"
  ).textContent =
  movie.overview;

  const video =
  document.getElementById(
    "movieVideo"
  );

  video.innerHTML = `
    <source
      src="${movie.video || "./videos/pelicula.mp4"}"
      type="video/mp4"
    >
  `;

}