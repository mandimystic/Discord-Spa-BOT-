const db = require('.');

const createUsersTable = async () => {
  db.prepare('DROP TABLE IF EXISTS users').run();

  db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
      discord_id TEXT PRIMARY KEY,
      name TEXT NOT NULL
  )
  `).run();
};

const createDatesTable = async () => {
  db.prepare('DROP TABLE IF EXISTS citas').run();

  db.prepare(`
  CREATE TABLE IF NOT EXISTS citas (
      citas_id INTEGER PRIMARY KEY AUTOINCREMENT,
      servicio TEXT NOT NULL,
      fecha
        TEXT NOT NULL
        UNIQUE,
      discord_id TEXT NO NULL,
      FOREIGN KEY (discord_id)
        REFERENCES users (discord_id)
        ON DELETE CASCADE
  )
  `).run();
};

const createTables = async () => {
  await createUsersTable();
  console.log('Tabla de usuarios creadas');
  await createDatesTable ();
  console.log('Tabla de notas creada');
  console.log('Tablas creadas');
};

createTables();