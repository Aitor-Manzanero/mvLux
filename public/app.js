/* app.js — Fakeflix index catalog
   - Generación dinámica por dataset
   - Hover con panel debajo (layout real: width/height)
   - Scroll horizontal con rueda del ratón
   - Header cambia con scroll
   - Búsqueda simple por título (filtra cards)
   - Flechas izquierda/derecha por fila (scroll por página)
*/

const DATA = [
  {
    section: "Tendencias",
    title: "Dune",
    year: 2021,
    poster: "https://picsum.photos/seed/dune/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Warner Bros",
    duration: "155 min",
    synopsis: "Paul Atreides viaja a Arrakis, un planeta clave por la especia. Entre traiciones y profecías, su destino se cruza con el futuro del imperio.Paul Atreides viaja a Arrakis, un planeta clave por la especia. Entre traiciones y profecías, su destino se cruza con el futuro del imperio.Paul Atreides viaja a Arrakis, un planeta clave por la especia. Entre traiciones y profecías, su destino se cruza con el futuro del imperio."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049",
    year: 2017,
    poster: "https://picsum.photos/seed/br2049/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  // Duplicados a propósito para forzar overflow en Tendencias
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (2)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20492/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (3)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20493/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (4)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20494/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (5)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20495/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (6)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20496/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (7)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20497/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Tendencias",
    title: "Dune",
    year: 2021,
    poster: "https://picsum.photos/seed/dune/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Warner Bros",
    duration: "155 min",
    synopsis: "Paul Atreides viaja a Arrakis, un planeta clave por la especia. Entre traiciones y profecías, su destino se cruza con el futuro del imperio."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049",
    year: 2017,
    poster: "https://picsum.photos/seed/br2049/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  // Duplicados a propósito para forzar overflow en Tendencias
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (2)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20492/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (3)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20493/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (4)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20494/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (5)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20495/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (6)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20496/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Tendencias",
    title: "Blade Runner 2049 (7)",
    year: 2017,
    poster: "https://picsum.photos/seed/br20497/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Alcon / Sony",
    duration: "164 min",
    synopsis: "El agente K descubre un secreto enterrado que puede alterar la frágil convivencia entre humanos y replicantes."
  },
  {
    section: "Recomendadas",
    title: "Mad Max: Fury Road",
    year: 2015,
    poster: "https://picsum.photos/seed/madmax/600/900",
    director: "George Miller",
    country: "Australia / USA",
    studio: "Warner Bros",
    duration: "120 min",
    synopsis: "Una persecución imparable en el desierto. Alianzas inesperadas y gasolina como moneda de supervivencia."
  },
  {
    section: "Recomendadas",
    title: "Interstellar",
    year: 2014,
    poster: "https://picsum.photos/seed/interstellar/600/900",
    director: "Christopher Nolan",
    country: "USA",
    studio: "Paramount",
    duration: "169 min",
    synopsis: "La Tierra se apaga. Un grupo cruza un agujero de gusano para buscar un nuevo hogar, pagando el precio del tiempo."
  },
  {
    section: "Acción",
    title: "John Wick",
    year: 2014,
    poster: "https://picsum.photos/seed/johnwick/600/900",
    director: "Chad Stahelski",
    country: "USA",
    studio: "Lionsgate",
    duration: "101 min",
    synopsis: "Un exasesino regresa a la acción tras perder lo último que le quedaba. El submundo responde con reglas de hierro."
  },
  {
    section: "Acción",
    title: "The Raid",
    year: 2011,
    poster: "https://picsum.photos/seed/theraid/600/900",
    director: "Gareth Evans",
    country: "Indonesia",
    studio: "XYZ Films",
    duration: "101 min",
    synopsis: "Un asalto a un edificio controlado por un capo se convierte en una trampa. Combate cuerpo a cuerpo sin tregua."
  },
  {
    section: "Ciencia ficción",
    title: "Arrival",
    year: 2016,
    poster: "https://picsum.photos/seed/arrival/600/900",
    director: "Denis Villeneuve",
    country: "USA",
    studio: "Paramount",
    duration: "116 min",
    synopsis: "Doce naves aterrizan. Una lingüista intenta comunicarse con los visitantes, mientras el mundo se precipita al miedo."
  },
  {
    section: "Ciencia ficción",
    title: "Ex Machina",
    year: 2014,
    poster: "https://picsum.photos/seed/exmachina/600/900",
    director: "Alex Garland",
    country: "UK",
    studio: "A24",
    duration: "108 min",
    synopsis: "Un programador evalúa a una IA avanzada. El test se convierte en un juego psicológico sobre control y conciencia."
  },
  {
    section: "Clásicos",
    title: "The Godfather",
    year: 1972,
    poster: "https://picsum.photos/seed/godfather/600/900",
    director: "Francis Ford Coppola",
    country: "USA",
    studio: "Paramount",
    duration: "175 min",
    synopsis: "La familia Corleone equilibra tradición, poder y sangre. La sucesión transforma a Michael en algo inevitable."
  },
  {
    section: "Clásicos",
    title: "Alien",
    year: 1979,
    poster: "https://picsum.photos/seed/alien/600/900",
    director: "Ridley Scott",
    country: "UK / USA",
    studio: "20th Century Fox",
    duration: "117 min",
    synopsis: "Una señal de auxilio, una nave industrial y una criatura. El terror se cuela por cada pasillo metálico."
  }
];

/* ===== Helpers ===== */
function groupBySection(movies) {
  const map = {};
  for (const m of movies) {
    if (!map[m.section]) map[m.section] = [];
    map[m.section].push(m);
  }
  return map;
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  return node;
}

function createCard(movie) {
  const card = el("article", "card", { tabindex: "0", "data-title": movie.title.toLowerCase() });

  const shell = el("div", "card__shell");
  const img = el("img", "poster", {
    src: movie.poster,
    alt: `Póster de ${movie.title}`,
    loading: "lazy"
  });

  const meta = el("div", "card__meta");
  const title = el("p", "card__title", { text: movie.title });
  const year = el("p", "card__year", { text: String(movie.year) });
  meta.append(title, year);

  shell.append(img, meta);

  const hover = el("div", "card__hover");
  const grid = el("div", "hover__grid");

  const kv = (k, v) => {
    const row = el("div", "hover__kv");
    row.append(
      el("span", "hover__k", { text: k }),
      el("span", "hover__v", { text: v })
    );
    return row;
  };

  grid.append(
    kv("Director:", movie.director),
    kv("País:", movie.country),
    kv("Productora:", movie.studio),
    kv("Duración:", movie.duration),
  );

  const syn = el("div", "hover__syn", { text: movie.synopsis });
  hover.append(grid, syn);

  card.append(shell, hover);

  // Hover interactions (mouse + keyboard focus)
  card.addEventListener("mouseenter", () => setHovered(card, true));
  card.addEventListener("mouseleave", () => setHovered(card, false));
  card.addEventListener("focus", () => setHovered(card, true));
  card.addEventListener("blur", () => setHovered(card, false));

  return card;
}

function setHovered(card, on) {
  const row = card.closest(".row");
  if (!row) return;

  if (on) {
    for (const c of row.querySelectorAll(".card.is-hovered")) c.classList.remove("is-hovered");
    card.classList.add("is-hovered");
    row.classList.add("is-hovering");
  } else {
    card.classList.remove("is-hovered");
    if (!row.querySelector(".card.is-hovered")) row.classList.remove("is-hovering");
  }
}

/* Horizontal wheel scroll on rows */
/*function enableWheelScroll(row) {
  row.addEventListener(
    "wheel",
    (e) => {
      // ✅ Si el usuario NO mantiene Shift, dejamos que la página haga scroll vertical
      if (!e.shiftKey) return;

      // ✅ Con Shift, convertimos la rueda en scroll horizontal
      e.preventDefault();
      row.scrollLeft += e.deltaY;
    },
    { passive: false }
  );
}*/

/* ===== Arrows per row ===== */
function addRowArrows(row) {
  // Wrap row
  const wrap = el("div", "rowwrap");
  row.parentNode.insertBefore(wrap, row);
  wrap.appendChild(row);

  // Fades
  const fadeL = el("div", "rowfade rowfade--left");
  const fadeR = el("div", "rowfade rowfade--right");

  // Buttons
  const leftBtn = el("button", "rowarrow rowarrow--left", {
    type: "button",
    "aria-label": "Desplazar a la izquierda"
  });
  leftBtn.innerHTML = `<span class="rowarrow__icon">‹</span>`;

  const rightBtn = el("button", "rowarrow rowarrow--right", {
    type: "button",
    "aria-label": "Desplazar a la derecha"
  });
  rightBtn.innerHTML = `<span class="rowarrow__icon">›</span>`;

  wrap.append(fadeL, fadeR, leftBtn, rightBtn);

  const scrollStep = () => Math.max(320, Math.floor(row.clientWidth * 0.9));

  leftBtn.addEventListener("click", () => row.scrollBy({ left: -scrollStep(), behavior: "smooth" }));
  rightBtn.addEventListener("click", () => row.scrollBy({ left: scrollStep(), behavior: "smooth" }));

  const update = () => {
    const canScroll = row.scrollWidth > row.clientWidth + 2;
    wrap.classList.toggle("no-arrows", !canScroll);
    if (!canScroll) return;

    const atStart = row.scrollLeft <= 2;
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;

    wrap.classList.toggle("at-start", atStart);
    wrap.classList.toggle("at-end", atEnd);
  };

  row.addEventListener("scroll", update, { passive: true });
  requestAnimationFrame(update);

  // Resize observer
  const ro = new ResizeObserver(() => update());
  ro.observe(row);

  // Images load can change dimensions
  row.querySelectorAll("img").forEach(img => {
    if (!img.complete) img.addEventListener("load", update, { once: true });
  });

  // Store for filtering updates
  wrap._updateArrows = update;
}

/* ===== Render ===== */
function render(movies) {
  const sectionsRoot = document.getElementById("sections");
  sectionsRoot.innerHTML = "";

  console.log(movies);
  const grouped = groupBySection(movies);

  for (const [sectionName, items] of Object.entries(grouped)) {
    const section = el("section", "section");

    const header = el("div", "section__header");
    header.append(
      el("h2", "section__title", { text: sectionName })
    );

    const row = el("div", "row", { role: "list" });
    //enableWheelScroll(row);

    for (const movie of items) {
      const card = createCard(movie);
      card.setAttribute("role", "listitem");
      row.append(card);
    }

    section.append(header, row);
    sectionsRoot.append(section);

    // ✅ after append, add arrows/wrap
    addRowArrows(row);
  }
}

/* ===== Header scroll state ===== */
function setupHeaderScroll() {
  const topbar = document.getElementById("topbar");
  const onScroll = () => {
    const scrolled = window.scrollY > 10;
    topbar.classList.toggle("is-scrolled", scrolled);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ===== Search ===== */
function setupSearch() {
  const search = document.querySelector(".search");
  const input = document.getElementById("searchInput");
  const toggleLeft = document.getElementById("searchToggle");
  const toggleRight = document.getElementById("searchToggleRight"); // puede no existir

  search.classList.add("is-collapsed");

  const openSearch = () => {
    search.classList.remove("is-collapsed");
    input.focus();
  };

  const toggleSearch = () => {
    const collapsed = search.classList.contains("is-collapsed");
    if (collapsed) openSearch();
    else {
      search.classList.add("is-collapsed");
      input.value = "";
      applyFilter("");
    }
  };

  if (toggleLeft) toggleLeft.addEventListener("click", toggleSearch);
  if (toggleRight) toggleRight.addEventListener("click", toggleSearch);

  input.addEventListener("input", (e) => applyFilter(e.target.value));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      search.classList.add("is-collapsed");
      input.value = "";
      applyFilter("");
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
  });
}

function applyFilter(query) {
  const q = (query || "").trim().toLowerCase();
  const cards = document.querySelectorAll(".card");

  for (const card of cards) {
    const title = card.getAttribute("data-title") || "";
    const match = !q || title.includes(q);
    card.style.display = match ? "" : "none";
  }

  // ✅ recalcula flechas tras filtrar
  document.querySelectorAll(".rowwrap").forEach(w => {
    if (typeof w._updateArrows === "function") w._updateArrows();
  });
}

async function start() {
  // if (!texto) {
  //   alert("Escribe algo para buscar");
  //   return [];
  // }

  // let url = "";

  // if (tipo === "film") {
  //   url = `http://localhost:3000/api/films?name=${encodeURIComponent(texto)}`;
  // } else if (tipo === "director") {
  //   url = `http://localhost:3000/api/films/director?name=${encodeURIComponent(texto)}`;
  // }

  let url = 'http://localhost:3000/api/films/mainInfo?name=eee';

  try {
    const response = await fetch(url);
    const data = await response.json(); // 👈 array directamente

    console.log("Resultado:", data);

    return data; // 👈 devuelves el array

  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return [];
  }
}

/* ===== Init ===== */
// render(DATA);
// setupHeaderScroll();
// setupSearch();

start().then(films => {
  // console.log("Films:", films);
    render(films.results);
  setupHeaderScroll();
  setupSearch();
});