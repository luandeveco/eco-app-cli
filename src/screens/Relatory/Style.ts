import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  Container:{
    flex: 1,
    backgroundColor: '#2974B4',
    paddingHorizontal: '2%',
    justifyContent:'center',
    alignItems:'center'
  },
  TitleRelatory: {
    width:'100%',
    height:43,
    top:60,
    marginBottom:15,
    borderRadius:20,
    backgroundColor: '#ffffff',
    paddingLeft:30,
    paddingTop: 10,
  },
  ButtonTitle: {
    width: '100%',
    marginBottom: '15%',
    height: 46,
    top: '4.6%',
    paddingLeft: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 5
  },
  TitleButton:{
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: '3%'
  },
  text: {
    marginTop:'5%',
    color: '#000000',
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 16,
  },
  Caption:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '64%'
  },
  Data: {
    flexDirection: 'column',
    width: '50%',
    height: '100%',
    marginBottom: 4
  },
  DataValor: {
    flexDirection: 'column',
    height: '100%',
    marginBottom: 4
  },
  VerticalLine:{
    backgroundColor: '#2974B4',
    width: '1%',
    height: '88%',
    marginHorizontal: '5%'
  },
  TextData: {
    color: '#646464',
    fontFamily: 'Inter-Bold',
    fontWeight: '400',
    fontSize: 16
  },
  TextDataValue: {
    color: '#646464',
    fontFamily: 'Inter-Bold',
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'right'
  },
  RelatoryCard: {
    width: '100%',
    height: 85,
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    paddingLeft: 30,
    paddingTop: 20
  },
  StatusCard: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingLeft: 15,
    paddingVertical: 15
  },
  CardTotal: {
    width: '100%',
    height: 43,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingHorizontal: '3%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  Total: {
    color: '#000000',
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 13,
    width: '40%'
  },
  TotalData: {
    color: '#646464',
    fontFamily: 'Inter-Bold',
    fontWeight: '400',
    fontSize: 16
  },
  DownReturnButton: {
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    width: '100%'
  },
  TextDownReturnButton: {
    color: '#000000',
    fontWeight: '500'
  },
  Cell:{
    flexDirection:'row',
    width: '100%'
  },
  ButtonCallModal: {
    width: '100%',
    backgroundColor: '#2974B4',
    textAlign: 'center',
    borderRadius: 12,
    padding: 20,
    marginBottom: "4%",
  },
  TextDataModal: {
    color: '#646464',
    fontFamily: 'Inter-Bold',
    fontWeight: '400',
    fontSize: 16,
    width: 279,
  },
  ContainerModal:{
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.7)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  Printer: {
    width: '100%',
    height: 90,
    backgroundColor: '#2974b4',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '3%',
    marginBottom: '3%'
  },
});