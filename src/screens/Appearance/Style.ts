import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  Container: {
    paddingHorizontal: "5%"
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
