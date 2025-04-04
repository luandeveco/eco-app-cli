import SQLite from 'react-native-sqlite-storage';

export async function up(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    CREATE TABLE IF NOT EXISTS Suburb (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT,
      descricao TEXT,
      cod_mensageiro TEXT,
      cod_municipio TEXT
    );
  `);
}

export async function down(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    DROP TABLE IF EXISTS Suburb;
  `);
}
