//import pool from './db/DBConnection.js';

// async function fetchData() {
//     const db = await connect();
//     try {
//         const [rows, fields] = await db.execute('SELECT * FROM film');
//         console.log('Todos los usuarios:', rows);
//         //console.table(rows);
//     } catch (error) {
//         console.error('Error al obtener datos:', error);
//     } finally {
//         db.end();
//     }
// }

//fetchData();













// import { RowDataPacket } from 'mysql2/promise';

// // Definimos la interfaz para tener autocompletado y evitar errores de tipo
// interface Film extends RowDataPacket {
//   id: number;
//   complete_name: string;
// }

// async function fetchData(name: string) {
//   try {
//     const sql = `SELECT id, complete_name FROM film WHERE complete_name LIKE ?`;
    
//     // El método .execute() ahora es reconocido correctamente por el compilador
//     const [rows] = await pool.execute<Film[]>(sql, [`%${name}%`]);
    
//     console.log('Películas encontradas:', rows);
//     return rows;
//   } catch (error) {
//     console.error('Error al obtener datos:', error);
//     throw error;
//   }
// }

// fetchData('klov');

import pool from './db/DBConnection.js';
import { RowDataPacket } from 'mysql2/promise';

interface Film extends RowDataPacket {
  id: number;
  complete_name: string;
}

async function fetchData(name: string) {
  try {
    const sql = `SELECT id, original_title FROM film WHERE original_title LIKE ?`;
    
    // Especificamos que devuelve un array de Film
    const [rows] = await pool.execute<Film[]>(sql, [`%${name}%`]);
    
    if (rows.length === 0) {
      console.log('No se encontraron películas con ese nombre.');
    } else {
      console.log('Películas encontradas:', rows);
    }
    return rows;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  }
}

// Ejecución de prueba
fetchData('klov');
