import SQLite from 'react-native-sqlite-storage';

export async function up(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    CREATE TABLE IF NOT EXISTS Institution (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mensagem_boleto TEXT,
      cabecalho_android TEXT,
      telefone_finalizar_android1 TEXT,
      telefone_finalizar_android2 TEXT
    );
  `);
}

export async function down(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    DROP TABLE IF EXISTS Institution;
  `);
}
