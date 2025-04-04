import SQLite from 'react-native-sqlite-storage';

export async function up(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    CREATE TABLE IF NOT EXISTS Movement (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_recibo TEXT,
      cod_contribuinte DECIMAL(38,0),
      nome_contribuinte TEXT,
      end_logradouro TEXT,
      end_numero TEXT,
      end_complemento TEXT,
      end_referencia TEXT,
      end_municipio TEXT,
      end_municipio_cod TEXT,
      end_bairro_cod TEXT,
      end_bairro TEXT,
      telefone1 VARCHAR(50),
      telefone2 VARCHAR(50),
      telefone3 VARCHAR(50),
      memo_obs_mensageiro TEXT,
      valor_prev FLOAT,
      valor_pago FLOAT,
      cod_ultima_ocorrencia INT,
      cod_banco_baixa DECIMAL(38,0),
      turno TEXT,
      status DECIMAL(18,0),
      operador TEXT,
      cod_tipo_pagamento DECIMAL(18,0),
      ordem TEXT,
      data_prev SMALLDATETIME,
      data_ultima_contribuicoes SMALLDATETIME,
      saldos INTEGER,
      doador_novo BIT,
      texto_obs TEXT,
      usuario_baixa VARCHAR(50),
      ultima_visita SMALLDATETIME,
      latitude VARCHAR(50),
      longitude VARCHAR(50),
      endereco_cobranca TEXT 
    );
  `);
}

export async function down(db: SQLite.SQLiteDatabase) {
  return db.executeSql(`
    DROP TABLE IF EXISTS Movement;
  `);
}
