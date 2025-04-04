import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('screen');

const containerHeight = height * 0.5;

export const Styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent:'center',
  },
  container:{
    height: containerHeight,
    paddingHorizontal: 20,
    justifyContent:'center',
    backgroundColor: 'rgba(41, 116, 180, 0.5)',
    marginHorizontal: '5%',
    borderRadius: 30,
    paddingVertical: 80
  },
  Logo:{
    width: width * 0.45,
    height: height * 0.06,
    alignSelf: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: width * 0.05,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
    marginTop: width * 0.009,
  },
  
  text:{
    color: '#ffffff',
    fontFamily:'Inter-bold',
    marginTop: width * 0.002,
    fontSize:16
  },
  textTitle:{
    color: '#ffffff',
    fontFamily:'Inter-bold',
    fontWeight:'bold',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center',
    fontSize: 20,
    marginTop: width * 0.01,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
    showPasswordButton: {
    position: 'absolute',
    right: 8,
    top: '30%',
    bottom: 0,
    justifyContent: 'center',
  },
  eyeIcon: {
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
  InputArea:{
    width: '100%',
    height: 43,
    marginTop: width * 0.003,
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderBottomWidth: 1,
    borderRadius: 8,
    borderBottomColor: "#ffffff",
    paddingHorizontal: 8
  },
  boxButton:{
    width: '90%',
    height: width * 0.1,
    backgroundColor: 'rgba(41, 116, 180, 0.6)',
    borderColor: "#ffffff",
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent:'center',
    alignSelf: 'center',
    marginTop: width * 0.05,
    borderRadius: 10,
  },
  textBotton: {
    color: '#ffffff',
  },
  containerVersion: {
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: '3%'
  },
  versionText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
    justifyContent: 'center', 
    alignItems: 'center',
  },
});
