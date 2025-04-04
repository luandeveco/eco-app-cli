import { dataSource } from "../../../database/database";
import { Movement } from "../../../database/entities/Movement";
import { TypeOccurrence } from "../../../database/entities/TypeOccurrence";
import { accountMovementChosen } from './../../../database/entities/accountMovementChosen';
import { AccountsBank } from './../../../database/entities/AccountsBank';
import { BankAccount } from './../../../database/entities/BankAccount';
import { Counties } from './../../../database/entities/Counties';
import { CountiesMovement } from './../../../database/entities/CountiesMovement';
import { DateMovement } from './../../../database/entities/DateMovement';
import { DateMovementChosen } from './../../../database/entities/DateMovementChosen';
import { Institution } from './../../../database/entities/Institution';
import { Messenger } from './../../../database/entities/Messenger';
import { Routes } from './../../../database/entities/Routes';
import { StatusMessenger } from './../../../database/entities/StatusMessenger';
import { Suburb } from './../../../database/entities/Suburb';
import { SuburbMovement } from './../../../database/entities/SuburbMovement';
import { TypePayment } from './../../../database/entities/TypePayment';
import { Auth } from './../../../database/entities/Auth';
import { InstitutionInformation } from "../../../database/entities/InstitutionInformation";

export async function clearDatabase() {
  const entities = [
    Movement,
    accountMovementChosen,
    AccountsBank,
    BankAccount,
    Counties,
    CountiesMovement,
    DateMovement,
    DateMovementChosen,
    Auth,
    TypePayment,
    SuburbMovement,
    Suburb,
    StatusMessenger,
    Messenger,
    Institution,
    TypeOccurrence,
    Routes,
    InstitutionInformation
  ];

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity);
    await repository.delete({});
    console.log(`Todos os dados da entidade ${entity.name} foram apagados.`);
  }
}
