import SQLite from 'react-native-sqlite-storage';

export async function up(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    CREATE TABLE IF NOT EXISTS DateMovement (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      DATA_MOVIMENTO DATE,
      SITUACAO VARCHAR(100),
      MENSAGEIRO VARCHAR(100),
      QDE_RUA DECIMAL(10, 2),
      VAL_RUA DECIMAL(10, 2),
      QDE_SALDO DECIMAL(10, 2),
      VAL_SALDO DECIMAL(10, 2),
      QDE_RECDIN DECIMAL(10, 2),
      VAL_RECDIN DECIMAL(10, 2),
      QDE_RECBF DECIMAL(10, 2),
      VAL_RECBF DECIMAL(10, 2),
      QDE_CAN DECIMAL(10, 2),
      VAL_CAN DECIMAL(10, 2),
      QDE_DEV DECIMAL(10, 2),
      VAL_DEV DECIMAL(10, 2),
      QDE_RET DECIMAL(10, 2),
      VAL_RET DECIMAL(10, 2),
      SALDOS_ANT DECIMAL(10, 2),
      VAL_SALDOS_ANT DECIMAL(10, 2)
    );
  `);
}

export async function down(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    DROP TABLE IF EXISTS DateMovement;
  `);
}
