import axios from 'axios';

export const api = axios.create({
  // ------- NOVO ------
  //baseURL: 'http://adotern.ddns.net:8653/api', // ADOTE RN DDNS
  //baseURL: 'http://caccrn.ddns.net:8653/api', // CDP DDNS
  //baseURL: 'http://ipredeeco.ddns.net:6924/api', // IPREDE CE DDNS

  baseURL: 'http://206.42.35.216:8698/api', //TESTE LOCAL

   // ------- ANTIGO ------
   //baseURL: "http://gaccba.ddns.net:8081/api", // GACC BA DDNS
  //baseURL: 'http://gaccam.ddns.net:8735/api' // GACC AM
  //baseURL: 'http://amose.ddns.net:8735/api' // AMO SE DDNS
  //baseURL: 'http://ipredeeco.ddns.net:6924/api' // IPREDE CE DDNS
  //baseURL: 'http://iciaeco.ddns.net:8675/api' // ICIA SE DDNS NOVO
  //baseURL: 'http://aaccmteco.ddns.net:7078/api' // AACC MT DDNS
  //baseURL: 'http://acaccieco.ddns.net:6978/api' // ACACCI
  //baseURL: 'http://avossceco.ddns.net:7078/api' // AVOS
  //baseURL: 'http://apaepoa.ddns.net:8653/api' // APAE POA
  //baseURL: 'http://apamipe.ddns.net:8735/api' // APAMI

  //baseURL: 'http://201.21.208.122:8653/api' // APAE POA
  //baseURL: 'http://189.42.247.163:8735/api' //CDP
  //baseURL: 'http://179.185.29.34:4937/api' //ICIA
  //baseURL: 'http://177.16.99.232:8081/api' // GACC BA
  //baseURL: 'http://177.70.175.108:8735/api' // AMO SE
  //baseURL: 'http://201.20.118.102:6924/api' // IPREDE CE
  //baseURL: 'http://179.185.118.57:7078/api' // AACC MT
  //baseURL: 'http://179.83.128.54:8735/api' // APAMI

  //baseURL: 'http://206.42.35.216:8465/api', //TESTE LOCAL
});

//Não precisa
//baseURL: 'http://iciaeco.ddns.net:4937/api' // ICIA SE DDNS (NÃO UTILIZAR ESSA)
//baseURL: 'http://adotern.ddns.net:8735/api' // ADOTE RN DDNS (NÃO PRECISA GERAR)
//baseURL: 'http://caccrn.ddns.net:8735/api' //CDP

//Não precisa (Mas já usou)
//baseURL: 'http://aaccmseco.ddns.net:7078/api' // AACC MS DDNS
