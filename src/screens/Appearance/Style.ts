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
});
