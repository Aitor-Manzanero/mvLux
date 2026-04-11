// import mysql from 'mysql2/promise';

// async function connect() {
//   try {
//       const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'root',
//       database: 'fakeflix',
//     });
//     console.log('Conexión a MySQL establecida.');
//     return connection;
//   } catch (error) {
//     console.error('Error al conectar a MySQL:', error);
//     throw error;
//   }
// }

// export default connect;








// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'fakeflix',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// export default pool;





// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'root',
//   database: process.env.DB_NAME || 'fakeflix',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// export default pool;

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? 'root',
  database: process.env.DB_NAME ?? 'fakeflix',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
