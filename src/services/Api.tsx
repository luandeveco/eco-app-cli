import axios from 'axios';

export const api = axios.create({
  //baseURL: 'http://adotern.ddns.net:8653/api', // ADOTE RN DDNS
  //baseURL: 'http://caccrn.ddns.net:8653/api', // CDP DDNS
  //baseURL: 'http://ipredeeco.ddns.net:6924/api', // IPREDE CE DDNS

  baseURL: 'http://206.42.35.216:8698/api', //TESTE LOCAL
});
