import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  text: {
    marginTop:'5%',
    color: '#000000',
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 16,
  },
  containerSettings:{
    paddingHorizontal: '5%',
  },
  Container: {
    paddingHorizontal: "5%"

  },
  buttonConfig:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '2%',
    borderBottomWidth: 1,
    paddingVertical: '5%',
    justifyContent: 'space-between',
  },
  titleConfig:{
    color: '#000000',
    fontWeight: '500',
    marginLeft: '3%',
    fontSize: 18,
  },
  Title: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  model: {
    flex:1,
    backgroundColor: 'rgba(37, 150, 190,0.7)',
    alignItems: 'center',
    justifyContent:"center"
  },
  modelCenter: {
    backgroundColor: '#FFFFFF',
    padding: '5%',
    borderRadius: 8
  },
  TitleModel:{
    color: "#000000",
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOptions: {
    flexDirection: 'row',
    marginTop: '5%',
    justifyContent: 'space-between'
  },
  ButtonOptionsWhatsapp:{
    backgroundColor: 'rgba(0,100,0,0.9)',
    padding: '2%',
    borderRadius: 8
  },
  textButtonModel: {
    color: "#FFFFFF",
    fontWeight: '600',
    fontSize: 14,
  },
  ButtonOptionscancel:{
    backgroundColor: 'rgba(37, 150, 190,0.9)',
    padding: '2%',
    borderRadius: 8
  },
});
