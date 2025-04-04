import {typeORMDriver} from 'react-native-quick-sqlite';
import {DataSource} from 'typeorm';
import {Auth} from './entities/Auth';
import {Messenger} from './entities/Messenger';
import {Counties} from './entities/Counties';
import {DateMovement} from './entities/DateMovement';
import {Institution} from './entities/Institution';
import {Movement} from './entities/Movement';
import {StatusMessenger} from './entities/StatusMessenger';
import {Suburb} from './entities/Suburb';
import {TypeOccurrence} from './entities/TypeOccurrence';
import {TypePayment} from './entities/TypePayment';
import { CountiesMovement } from './entities/CountiesMovement';
import { SuburbMovement } from './entities/SuburbMovement';
import { AccountsBank } from './entities/AccountsBank';
import { DateMovementChosen } from './entities/DateMovementChosen';
import { accountMovementChosen } from './entities/accountMovementChosen';
import { Routes } from './entities/Routes';
import { Printer } from './entities/Printers';
import { BankAccount } from './entities/BankAccount';
import { InstitutionInformation } from './entities/InstitutionInformation';
import { ReceiptSettings } from './entities/ReceiptSettings';
import { Shift } from './entities/Shift';

export const dataSource = new DataSource({
  database: 'MensageiroEco.db',
  entities: [
    Auth,
    BankAccount,
    Messenger,
    Counties,
    CountiesMovement,
    DateMovement,
    Institution,
    Movement,
    StatusMessenger,
    Suburb,
    SuburbMovement,
    TypeOccurrence,
    TypePayment,
    AccountsBank,
    DateMovementChosen,
    accountMovementChosen,
    Routes,
    Printer,
    InstitutionInformation,
    ReceiptSettings,
    Shift,
  ],
  location: '.',
  logging: [],
  synchronize: true,
  type: 'react-native',
  driver: typeORMDriver,
});
