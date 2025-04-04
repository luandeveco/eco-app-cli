import SQLite from 'react-native-sqlite-storage';

export async function up(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    CREATE TABLE IF NOT EXISTS TypePayment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT,
      descricao TEXT,
      ATIVO TEXT,
      IMPRIME_RECIBO TEXT,
      ENTRA_MOVIMENTO_DIARIO TEXT,
      ORDEM_DISPLAY TEXT,
      PERMITE_AGRUPAR TEXT,
      SIGLA TEXT,
      COD_MENSAGEIRO_PADRAO TEXT,
      ENTRA_CALENDARIO_INTERIOR TEXT,
      FiltroRecebido TEXT,
      FiltroDevolucao TEXT,
      operador TEXT
    );
  `);
}

export async function down(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    DROP TABLE IF EXISTS TypePayment;
  `);
}
