import { StatusMessenger } from "../../interfaces/StatusMessenger";
import { TypeOccurrence } from "../../interfaces/TypeOccurrence";
import { TypePayment } from "../../interfaces/TypePayment";
import { Messenger } from "../interfaces/Messenger";
import { Institution } from "../interfaces/institution";

export interface Auth {
  access_token: any;
  instituicao: Institution;
}
