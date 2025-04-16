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
  Title: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  ContainerSwitch:{
    flex: 1,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    paddingRight: '5%'
  },
  Outter:{
    width:55,
    height:25,
    borderRadius: 18,
    alignItems:'center',
    flexDirection: 'row',
    padding: '2%'
  },
  Inner:{
    width: 17,
    height:17,
    backgroundColor: '#ffffff',
    borderRadius:15,
    elevation: 8,
    shadowOffset: {width: 0, height:0},
    shadowOpacity: 0.15,
    shadowRadius: 2,
  }
});
