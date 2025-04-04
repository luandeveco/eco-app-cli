import SQLite from 'react-native-sqlite-storage';

export async function up(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    CREATE TABLE IF NOT EXISTS BankAccount (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      CODIGO DECIMAL(10,0),
      COD_BANCO DECIMAL(10,0),
      BANCO VACHAR(50),
      AGENCIA VACHAR(50),
      ANDROID INTERGER
    );
  `);
}

export async function down(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    DROP TABLE IF EXISTS BankAccount;
  `);
}
