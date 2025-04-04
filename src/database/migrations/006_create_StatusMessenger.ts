import SQLite from 'react-native-sqlite-storage';

export async function up(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    CREATE TABLE IF NOT EXISTS StatusMessenger (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT,
      descricao TEXT
    );
  `);
}

export async function down(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    DROP TABLE IF EXISTS StatusMessenger;
  `);
}
