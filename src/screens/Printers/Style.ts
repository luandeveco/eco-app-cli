import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 13,
  },
  containerPrinters:{
    paddingHorizontal: '5%',
  },
    LineContainer: {
    width: '28%',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    borderColor: '#2974B4',
    borderWidth: 1,
  },
    LineContainerButton: {
    width: '28%',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2974B4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    borderColor: '#2974B4',
    borderWidth: 1,
  },
  Container: {
    paddingHorizontal: "5%"

  },
  button:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  Title: {
    flexDirection: 'row',
    alignSelf: 'center',
  },

  /** Modal */

  ContainerModal:{
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.7)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  Content:{
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: '35%',
    justifyContent: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: '5%',
    paddingHorizontal: '5%',
  },
  ContentError: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: '35%',
    justifyContent: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: '5%',
    paddingHorizontal: '5%'
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
  PrinterError: {
    width: '100%',
    height: 100,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: '5%',
    justifyContent: 'center'
  },
  BackgroundClose: {
    //flex:1,
    //zIndex: 9,
  },
  buttonPrinter: {
    backgroundColor: '#FFFFFF',
    padding: "3%",
    marginLeft: '5%',
    marginBottom: '2%',
    borderBottomWidth: 1,
    borderBottomColor: '#2974b4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  /** Modal de ações */
  buttonAction:{
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 15,
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '4%',
    marginVertical: '3%',
  },
  ContainerModalAction:{
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.7)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
