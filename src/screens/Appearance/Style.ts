import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  text: {
    color: '#000000',
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 18,
    justifyContent: 'center'
  },
  containerSetAparencia:{
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e2e2e2',
    borderWidth: 1,
    borderRadius: 5,
    width: '30%',
    height: '90%',
    justifyContent:'space-between'
  },
  setPress: {
    backgroundColor: '#e2e2e2',
    width: '30%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
});
