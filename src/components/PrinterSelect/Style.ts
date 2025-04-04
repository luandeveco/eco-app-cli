import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  Container:{
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
    paddingHorizontal: '5%'
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
    flex: 1,
    backgroundColor: '#2974b4',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '3%',
    marginBottom: '2%'
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
    flex:1,
    zIndex: 9,
  }
})