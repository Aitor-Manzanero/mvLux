import os
from collections import defaultdict
from datetime import datetime
from typing import Optional, List, Dict, Any

import pandas as pd
import requests
import mysql.connector

# ==========================
#  CONFIG TMDB
# ==========================

TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_SEARCH_URL = f"{TMDB_BASE_URL}/search/movie"
TMDB_MOVIE_URL = f"{TMDB_BASE_URL}/movie"
TMDB_PERSON_URL = f"{TMDB_BASE_URL}/person"
TMDB_GENRE_MOVIE_LIST_URL = f"{TMDB_BASE_URL}/genre/movie/list"
TMDB_CONFIG_URL = f"{TMDB_BASE_URL}/configuration"

TMDB_API_KEY = "d2f23c037a09c76eff5d98d6b04a3f19"
TMDB_TIMEOUT = 20

TMDB_IMAGE_BASE_URL = None
TMDB_IMAGE_SECURE_BASE_URL = None
TMDB_IMAGE_SIZES = {}


# ==========================
#  CONFIG MySQL
# ==========================

DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "root",
    "database": "fakeflix",
}

MAX_PELIS = 100
MAX_CONSULTAS_POR_TITULO = 1
MAX_ACTORES_POR_PELICULA = 20


# ==========================
#  HELPERS GENERALES
# ==========================

def normalizar_titulo(titulo: str) -> str:
    return " ".join(str(titulo).strip().lower().split())


def parse_fecha_date(fecha_str: Optional[str]) -> Optional[str]:
    if not fecha_str or not isinstance(fecha_str, str):
        return None
    try:
        datetime.strptime(fecha_str, "%Y-%m-%d")
        return fecha_str
    except ValueError:
        return None


def parse_release_year(fecha_str: Optional[str]) -> Optional[int]:
    if not fecha_str or not isinstance(fecha_str, str):
        return None
    try:
        return datetime.strptime(fecha_str, "%Y-%m-%d").year
    except ValueError:
        return None


def extraer_country_origin(place_of_birth: Optional[str]) -> Optional[str]:
    if not place_of_birth:
        return None

    partes = [p.strip() for p in place_of_birth.split(",") if p.strip()]
    if not partes:
        return None

    return partes[-1][:30]


def safe_decimal_vote(value: Any) -> Optional[float]:
    if value is None:
        return None
    try:
        return round(float(value), 1)
    except (TypeError, ValueError):
        return None


def obtener_configuracion_tmdb() -> None:
    global TMDB_IMAGE_BASE_URL, TMDB_IMAGE_SECURE_BASE_URL, TMDB_IMAGE_SIZES
    if TMDB_IMAGE_SECURE_BASE_URL or TMDB_IMAGE_BASE_URL:
        return

    try:
        data = tmdb_get(TMDB_CONFIG_URL)
    except requests.RequestException:
        return

    images = data.get("images", {})
    TMDB_IMAGE_BASE_URL = images.get("base_url")
    TMDB_IMAGE_SECURE_BASE_URL = images.get("secure_base_url")
    TMDB_IMAGE_SIZES = {
        "poster": images.get("poster_sizes", []),
        "profile": images.get("profile_sizes", []),
        "logo": images.get("logo_sizes", []),
    }


def construir_tmdb_image_url(path: Optional[str], size_type: str = "poster") -> Optional[str]:
    if not path:
        return None

    obtener_configuracion_tmdb()
    base_url = TMDB_IMAGE_SECURE_BASE_URL or TMDB_IMAGE_BASE_URL
    if not base_url:
        return None

    sizes = TMDB_IMAGE_SIZES.get(size_type, []) or []
    preferred_sizes = ["w500", "w300", "w185", "original"]
    selected_size = None

    for size in preferred_sizes:
        if size in sizes:
            selected_size = size
            break

    if not selected_size and sizes:
        selected_size = sizes[-1]

    if not selected_size:
        selected_size = "original"

    if path.startswith("/"):
        return f"{base_url}{selected_size}{path}"
    return f"{base_url}{selected_size}/{path}"


def calcular_is_legal_director(deathdate_str: Optional[str]) -> int:
    if not deathdate_str:
        return 0

    try:
        death_date = datetime.strptime(deathdate_str, "%Y-%m-%d").date()
    except ValueError:
        return 0

    legal_start = datetime(death_date.year + 1, 1, 1).date()
    legal_date = datetime(legal_start.year + 70, 1, 1).date()
    return 1 if datetime.utcnow().date() >= legal_date else 0


# ==========================
#  DB CONNECTION
# ==========================

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)


# ==========================
#  LECTURA DE EXCEL
# ==========================

def leer_peliculas_desde_excel(ruta_excel: str) -> List[str]:
    df = pd.read_excel(ruta_excel, usecols=[0], header=None)

    titulos = (
        df.iloc[:, 0]
        .dropna()
        .astype(str)
        .str.strip()
    )

    return titulos.tolist()


# ==========================
#  TMDB: REQUEST HELPERS
# ==========================

def tmdb_get(url: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    final_params = dict(params or {})
    final_params["api_key"] = TMDB_API_KEY

    response = requests.get(
        url,
        headers={"accept": "application/json"},
        params=final_params,
        timeout=TMDB_TIMEOUT
    )
    response.raise_for_status()
    return response.json()


def buscar_pelicula_tmdb(titulo: str) -> Optional[Dict[str, Any]]:
    params = {
        "query": titulo,
        "language": "es-ES",
        "include_adult": "false",
    }

    data = tmdb_get(TMDB_SEARCH_URL, params=params)
    results = data.get("results", [])

    if not results:
        return None

    titulo_norm = normalizar_titulo(titulo)

    def score(item: Dict[str, Any]) -> tuple:
        title = normalizar_titulo(item.get("title", ""))
        original_title = normalizar_titulo(item.get("original_title", ""))
        exact = 1 if titulo_norm in (title, original_title) else 0
        popularity = item.get("popularity") or 0
        votes = item.get("vote_count") or 0
        release = item.get("release_date") or ""
        return (exact, popularity, votes, release)

    results.sort(key=score, reverse=True)
    return results[0]


def obtener_detalle_pelicula_tmdb(id_tmdb_pelicula: int) -> Dict[str, Any]:
    url = f"{TMDB_MOVIE_URL}/{id_tmdb_pelicula}"
    params = {
        "language": "es-ES",
        "append_to_response": "credits",
    }

    movie_detail = tmdb_get(url, params=params)
    overview = movie_detail.get("overview") or ""

    if not overview.strip():
        try:
            fallback_detail = tmdb_get(url, params={"language": "en-US", "append_to_response": "credits"})
            movie_detail["overview"] = fallback_detail.get("overview") or movie_detail.get("overview")
            movie_detail["title"] = movie_detail.get("title") or fallback_detail.get("title")
            if not movie_detail.get("credits"):
                movie_detail["credits"] = fallback_detail.get("credits")
        except requests.RequestException:
            pass

    return movie_detail


def obtener_persona_tmdb(id_tmdb_persona: int) -> Optional[Dict[str, Any]]:
    url = f"{TMDB_PERSON_URL}/{id_tmdb_persona}"

    try:
        data_es = tmdb_get(url, params={"language": "es-ES"})
    except requests.RequestException:
        data_es = None

    biography_es = (data_es.get("biography") or "").strip() if data_es else ""

    if biography_es:
        return data_es

    try:
        data_en = tmdb_get(url, params={"language": "en-US"})
    except requests.RequestException:
        data_en = None

    biography_en = (data_en.get("biography") or "").strip() if data_en else ""

    if biography_en:
        if data_es:
            data_es["biography"] = data_en.get("biography")
            return data_es
        return data_en

    return data_es or data_en


def obtener_mapa_generos_tmdb() -> Dict[int, str]:
    data = tmdb_get(TMDB_GENRE_MOVIE_LIST_URL, params={"language": "es-ES"})
    genres = data.get("genres", [])

    if not genres:
        try:
            data = tmdb_get(TMDB_GENRE_MOVIE_LIST_URL, params={"language": "en-US"})
            genres = data.get("genres", [])
        except requests.RequestException:
            genres = []

    return {g["id"]: g["name"] for g in genres if g.get("id") and g.get("name")}


# ==========================
#  MAPEOS TMDB
# ==========================

def mapear_film_desde_tmdb(movie_detail: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id_tmdb": movie_detail.get("id"),
        "original_title": movie_detail.get("original_title"),
        "overview": movie_detail.get("overview"),
        "title_es": movie_detail.get("title"),
        "poster_url": construir_tmdb_image_url(movie_detail.get("poster_path"), "poster"),
        "backdrop_url": construir_tmdb_image_url(movie_detail.get("backdrop_path"), "poster"),
        "vote_avg": safe_decimal_vote(movie_detail.get("vote_average")),
        "vote_count": movie_detail.get("vote_count"),
        "is_published": 0,
        "internal_comment": None,
        "quality": None,
        "duration": movie_detail.get("runtime"),
        "release_date": parse_release_year(movie_detail.get("release_date")),
    }


def extraer_directores(movie_detail: Dict[str, Any]) -> List[Dict[str, Any]]:
    crew = movie_detail.get("credits", {}).get("crew", [])
    directores = []

    for persona in crew:
        if persona.get("job") == "Director" and persona.get("id"):
            directores.append({
                "id_tmdb": persona.get("id"),
                "complete_name": persona.get("name"),
            })

    seen = set()
    resultado = []
    for d in directores:
        if d["id_tmdb"] not in seen:
            resultado.append(d)
            seen.add(d["id_tmdb"])
    return resultado


def extraer_actores(movie_detail: Dict[str, Any], max_actores: int) -> List[Dict[str, Any]]:
    cast = movie_detail.get("credits", {}).get("cast", [])
    actores = []

    for persona in cast[:max_actores]:
        if persona.get("id"):
            actores.append({
                "id_tmdb": persona.get("id"),
                "complete_name": persona.get("name"),
            })

    seen = set()
    resultado = []
    for a in actores:
        if a["id_tmdb"] not in seen:
            resultado.append(a)
            seen.add(a["id_tmdb"])
    return resultado


def extraer_companias(movie_detail: Dict[str, Any]) -> List[Dict[str, Any]]:
    companies = movie_detail.get("production_companies", [])
    resultado = []

    for c in companies:
        if c.get("id") and c.get("name"):
            resultado.append({
                "id_tmdb": c.get("id"),
                "name": c.get("name"),
                "logo_url": construir_tmdb_image_url(c.get("logo_path"), "logo"),
            })

    return resultado


def extraer_generos(movie_detail: Dict[str, Any], mapa_generos: Dict[int, str]) -> List[Dict[str, Any]]:
    genres = movie_detail.get("genres", [])
    resultado = []

    for g in genres:
        gid = g.get("id")
        gname = g.get("name") or mapa_generos.get(gid)
        if gid and gname:
            resultado.append({
                "id_tmdb": gid,
                "name": gname,
            })

    if not resultado and movie_detail.get("genre_ids"):
        for gid in movie_detail.get("genre_ids", []):
            gname = mapa_generos.get(gid)
            if gname:
                resultado.append({
                    "id_tmdb": gid,
                    "name": gname,
                })

    return resultado


# ==========================
#  MYSQL: FILM
# ==========================

def obtener_o_crear_film(conn, film_data: Dict[str, Any]) -> int:
    cur = conn.cursor()

    cur.execute("SELECT id FROM film WHERE id_tmdb = %s", (film_data["id_tmdb"],))
    row = cur.fetchone()

    if row:
        film_id = row[0]
        cur.execute(
            """
            UPDATE film
            SET original_title = %s,
                overview = %s,
                title_es = %s,
                poster_url = %s,
                backdrop_url = %s,
                vote_avg = %s,
                vote_count = %s,
                duration = %s,
                release_date = %s
            WHERE id = %s
            """,
            (
                film_data["original_title"],
                film_data["overview"],
                film_data["title_es"],
                film_data["poster_url"],
                film_data["backdrop_url"],
                film_data["vote_avg"],
                film_data["vote_count"],
                film_data["duration"],
                film_data["release_date"],
                film_id,
            ),
        )
        conn.commit()
        cur.close()
        return film_id

    cur.execute(
        """
        INSERT INTO film (
            id_tmdb,
            original_title,
            overview,
            title_es,
            poster_url,
            backdrop_url,
            vote_avg,
            vote_count,
            is_published,
            internal_comment,
            quality,
            duration,
            release_date
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            film_data["id_tmdb"],
            film_data["original_title"],
            film_data["overview"],
            film_data["title_es"],
            film_data["poster_url"],
            film_data["backdrop_url"],
            film_data["vote_avg"],
            film_data["vote_count"],
            film_data["is_published"],
            film_data["internal_comment"],
            film_data["quality"],
            film_data["duration"],
            film_data["release_date"],
        ),
    )
    conn.commit()
    nuevo_id = cur.lastrowid
    cur.close()
    return nuevo_id


# ==========================
#  MYSQL: DIRECTOR
# ==========================

def obtener_o_crear_director(conn, persona_tmdb: Dict[str, Any], detalle_persona: Optional[Dict[str, Any]]) -> int:
    cur = conn.cursor()

    id_tmdb = persona_tmdb["id_tmdb"]
    complete_name = persona_tmdb["complete_name"]

    cur.execute("SELECT id FROM director WHERE id_tmdb = %s", (id_tmdb,))
    row = cur.fetchone()

    if not detalle_persona:
        detalle_persona = obtener_persona_tmdb(id_tmdb)

    birthday = parse_fecha_date(detalle_persona.get("birthday")) if detalle_persona else None
    deathdate = parse_fecha_date(detalle_persona.get("deathday")) if detalle_persona else None
    country_origin = extraer_country_origin(detalle_persona.get("place_of_birth")) if detalle_persona else None
    biography = detalle_persona.get("biography") if detalle_persona else None
    biography = biography.strip() if biography and isinstance(biography, str) else biography
    profile_url = construir_tmdb_image_url(detalle_persona.get("profile_path"), "profile") if detalle_persona else None
    is_legal = calcular_is_legal_director(detalle_persona.get("deathday") if detalle_persona else None)

    if row:
        director_id = row[0]
        cur.execute(
            """
            UPDATE director
            SET complete_name = %s,
                birthday = %s,
                deathdate = %s,
                country_origin = %s,
                is_legal = %s,
                biography = %s,
                profile_url = %s
            WHERE id = %s
            """,
            (
                complete_name,
                birthday,
                deathdate,
                country_origin,
                is_legal,
                biography,
                profile_url,
                director_id,
            ),
        )
        conn.commit()
        cur.close()
        return director_id

    cur.execute(
        """
        INSERT INTO director (
            id_tmdb,
            complete_name,
            birthday,
            deathdate,
            country_origin,
            is_legal,
            is_published,
            biography,
            profile_url
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            id_tmdb,
            complete_name,
            birthday,
            deathdate,
            country_origin,
            is_legal,
            1,
            biography,
            profile_url,
        ),
    )
    conn.commit()
    nuevo_id = cur.lastrowid
    cur.close()
    return nuevo_id


def vincular_film_y_director(conn, film_id: int, director_id: int):
    cur = conn.cursor()
    cur.execute(
        "SELECT 1 FROM film_director WHERE film_id = %s AND director_id = %s",
        (film_id, director_id),
    )
    if cur.fetchone() is None:
        cur.execute(
            "INSERT INTO film_director (film_id, director_id) VALUES (%s, %s)",
            (film_id, director_id),
        )
        conn.commit()
    cur.close()


# ==========================
#  MYSQL: ACTOR
# ==========================

def obtener_o_crear_actor(conn, persona_tmdb: Dict[str, Any], detalle_persona: Optional[Dict[str, Any]]) -> int:
    cur = conn.cursor()

    id_tmdb = persona_tmdb["id_tmdb"]
    complete_name = persona_tmdb["complete_name"]

    cur.execute("SELECT id FROM actor WHERE id_tmdb = %s", (id_tmdb,))
    row = cur.fetchone()

    birthday = parse_fecha_date(detalle_persona.get("birthday")) if detalle_persona else None
    deathdate = parse_fecha_date(detalle_persona.get("deathday")) if detalle_persona else None
    country_origin = extraer_country_origin(detalle_persona.get("place_of_birth")) if detalle_persona else None
    biography = detalle_persona.get("biography") if detalle_persona else None
    biography = biography.strip() if biography and isinstance(biography, str) else biography
    profile_url = construir_tmdb_image_url(detalle_persona.get("profile_path"), "profile") if detalle_persona else None

    if row:
        actor_id = row[0]
        cur.execute(
            """
            UPDATE actor
            SET complete_name = %s,
                birthday = %s,
                deathdate = %s,
                country_origin = %s,
                biography = %s,
                profile_url = %s
            WHERE id = %s
            """,
            (
                complete_name,
                birthday,
                deathdate,
                country_origin,
                biography,
                profile_url,
                actor_id,
            ),
        )
        conn.commit()
        cur.close()
        return actor_id

    cur.execute(
        """
        INSERT INTO actor (
            id_tmdb,
            complete_name,
            birthday,
            deathdate,
            country_origin,
            biography,
            profile_url,
            country_historical
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            id_tmdb,
            complete_name,
            birthday,
            deathdate,
            country_origin,
            biography,
            profile_url,
            None,
        ),
    )
    conn.commit()
    nuevo_id = cur.lastrowid
    cur.close()
    return nuevo_id


def vincular_film_y_actor(conn, film_id: int, actor_id: int):
    cur = conn.cursor()
    cur.execute(
        "SELECT 1 FROM film_actor WHERE film_id = %s AND actor_id = %s",
        (film_id, actor_id),
    )
    if cur.fetchone() is None:
        cur.execute(
            "INSERT INTO film_actor (film_id, actor_id) VALUES (%s, %s)",
            (film_id, actor_id),
        )
        conn.commit()
    cur.close()


# ==========================
#  MYSQL: COMPANY
# ==========================

def obtener_o_crear_company(conn, company_tmdb: Dict[str, Any]) -> int:
    cur = conn.cursor()

    id_tmdb = company_tmdb["id_tmdb"]
    name = company_tmdb["name"]
    logo_url = company_tmdb.get("logo_url")

    cur.execute("SELECT id FROM company WHERE id_tmdb = %s", (id_tmdb,))
    row = cur.fetchone()

    if row:
        company_id = row[0]
        cur.execute("UPDATE company SET name = %s, logo_url = %s WHERE id = %s", (name, logo_url, company_id))
        conn.commit()
        cur.close()
        return company_id

    cur.execute(
        "INSERT INTO company (id_tmdb, name, logo_url) VALUES (%s, %s, %s)",
        (id_tmdb, name, logo_url),
    )
    conn.commit()
    nuevo_id = cur.lastrowid
    cur.close()
    return nuevo_id


def vincular_film_y_company(conn, film_id: int, company_id: int):
    cur = conn.cursor()
    cur.execute(
        "SELECT 1 FROM film_company WHERE film_id = %s AND company_id = %s",
        (film_id, company_id),
    )
    if cur.fetchone() is None:
        cur.execute(
            "INSERT INTO film_company (film_id, company_id) VALUES (%s, %s)",
            (film_id, company_id),
        )
        conn.commit()
    cur.close()


# ==========================
#  MYSQL: GENRE
# ==========================

def obtener_o_crear_genre(conn, genre_tmdb: Dict[str, Any]) -> int:
    cur = conn.cursor()

    id_tmdb = genre_tmdb["id_tmdb"]
    nombre = genre_tmdb["name"]

    cur.execute("SELECT id FROM genre WHERE id_tmdb = %s", (id_tmdb,))
    row = cur.fetchone()

    if row:
        genre_id = row[0]
        cur.close()
        return genre_id

    cur.execute(
        "INSERT INTO genre (id_tmdb, genre_name, description) VALUES (%s, %s, %s)",
        (id_tmdb, nombre, None),
    )
    conn.commit()
    nuevo_id = cur.lastrowid
    cur.close()
    return nuevo_id


def vincular_film_y_genre(conn, film_id: int, genre_id: int):
    cur = conn.cursor()
    cur.execute(
        "SELECT 1 FROM film_genre WHERE film_id = %s AND genre_id = %s",
        (film_id, genre_id),
    )
    if cur.fetchone() is None:
        cur.execute(
            "INSERT INTO film_genre (film_id, genre_id) VALUES (%s, %s)",
            (film_id, genre_id),
        )
        conn.commit()
    cur.close()


# ==========================
#  MAIN
# ==========================

def main():
    counter = 0
    ruta_excel = "peliculas.xlsx"

    consultas_por_titulo = defaultdict(int)
    cache_personas = {}

    print("Leyendo títulos desde el Excel...")
    titulos = leer_peliculas_desde_excel(ruta_excel)
    print(f"Se han leído {len(titulos)} títulos.")

    print("Cargando mapa oficial de géneros desde TMDb...")
    try:
        mapa_generos = obtener_mapa_generos_tmdb()
        print(f"Mapa de géneros cargado: {len(mapa_generos)} géneros.")
    except requests.RequestException as e:
        print(f"❌ Error cargando géneros oficiales TMDb: {e}")
        mapa_generos = {}

    conn = get_db_connection()
    print("Conectado a MySQL.\n")

    try:
        for titulo in titulos:
            if counter >= MAX_PELIS:
                print(f"⚠️ Se alcanzó MAX_PELIS={MAX_PELIS}. Fin del proceso.")
                break

            titulo_norm = normalizar_titulo(titulo)

            if consultas_por_titulo[titulo_norm] >= MAX_CONSULTAS_POR_TITULO:
                print(
                    f"⏭️ Saltando '{titulo}' porque ya alcanzó "
                    f"MAX_CONSULTAS_POR_TITULO={MAX_CONSULTAS_POR_TITULO}"
                )
                continue

            consultas_por_titulo[titulo_norm] += 1
            counter += 1

            print(f"\n🔍 Buscando película: {titulo} | Counter: {counter}")

            try:
                search_result = buscar_pelicula_tmdb(titulo)
            except requests.RequestException as e:
                print(f"❌ Error al consultar TMDb en búsqueda: {e}")
                continue

            if search_result is None:
                print("   ➜ No se encontró ninguna coincidencia en TMDb.")
                continue

            id_tmdb_pelicula = search_result.get("id")
            print(
                f"   ✅ Encontrada en TMDb: {search_result.get('title')} "
                f"(id_tmdb={id_tmdb_pelicula})"
            )

            try:
                movie_detail = obtener_detalle_pelicula_tmdb(id_tmdb_pelicula)
            except requests.RequestException as e:
                print(f"   ❌ Error al obtener detalle de TMDb: {e}")
                continue

            film_data = mapear_film_desde_tmdb(movie_detail)

            try:
                film_id_db = obtener_o_crear_film(conn, film_data)
                print(f"   💾 Film en BD con id={film_id_db}")
            except mysql.connector.Error as e:
                print(f"   ❌ Error guardando film en MySQL: {e}")
                continue

            directores = extraer_directores(movie_detail)
            if not directores:
                print("   ⚠️ No se encontraron directores para esta película.")
            else:
                for director in directores:
                    persona_id = director["id_tmdb"]
                    if persona_id not in cache_personas:
                        cache_personas[persona_id] = obtener_persona_tmdb(persona_id)
                    detalle_persona = cache_personas[persona_id]

                    try:
                        director_id_db = obtener_o_crear_director(conn, director, detalle_persona)
                        vincular_film_y_director(conn, film_id_db, director_id_db)
                        print(
                            f"   🎬 Director: {director['complete_name']} "
                            f"(id_tmdb={director['id_tmdb']}, id_bd={director_id_db})"
                        )
                    except mysql.connector.Error as e:
                        print(f"   ❌ Error guardando director '{director['complete_name']}': {e}")

            actores = extraer_actores(movie_detail, MAX_ACTORES_POR_PELICULA)
            if not actores:
                print("   ⚠️ No se encontraron actores para esta película.")
            else:
                for actor in actores:
                    persona_id = actor["id_tmdb"]
                    if persona_id not in cache_personas:
                        cache_personas[persona_id] = obtener_persona_tmdb(persona_id)
                    detalle_persona = cache_personas[persona_id]

                    try:
                        actor_id_db = obtener_o_crear_actor(conn, actor, detalle_persona)
                        vincular_film_y_actor(conn, film_id_db, actor_id_db)
                        print(
                            f"   👤 Actor: {actor['complete_name']} "
                            f"(id_tmdb={actor['id_tmdb']}, id_bd={actor_id_db})"
                        )
                    except mysql.connector.Error as e:
                        print(f"   ❌ Error guardando actor '{actor['complete_name']}': {e}")

            companies = extraer_companias(movie_detail)
            if not companies:
                print("   ⚠️ No se encontraron compañías para esta película.")
            else:
                for company in companies:
                    try:
                        company_id_db = obtener_o_crear_company(conn, company)
                        vincular_film_y_company(conn, film_id_db, company_id_db)
                        print(
                            f"   🏢 Company: {company['name']} "
                            f"(id_tmdb={company['id_tmdb']}, id_bd={company_id_db})"
                        )
                    except mysql.connector.Error as e:
                        print(f"   ❌ Error guardando company '{company['name']}': {e}")

            genres = extraer_generos(movie_detail, mapa_generos)
            if not genres:
                print("   ⚠️ No se encontraron géneros para esta película.")
            else:
                for genre in genres:
                    try:
                        genre_id_db = obtener_o_crear_genre(conn, genre)
                        vincular_film_y_genre(conn, film_id_db, genre_id_db)
                        print(
                            f"   🏷️ Género: {genre['name']} "
                            f"(id_tmdb={genre['id_tmdb']}, id_bd={genre_id_db}) vinculado."
                        )
                    except mysql.connector.Error as e:
                        print(f"   ❌ Error guardando género '{genre['name']}': {e}")

    finally:
        conn.close()
        print("\nConexión a MySQL cerrada.")


if __name__ == "__main__":
    main()