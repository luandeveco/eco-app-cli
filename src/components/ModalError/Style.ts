import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: '5%',
  },
  containerModal:{
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15
  },
  textColorTitle: {
    color: "#2974b5",
    fontWeight:'bold',
    fontSize: 28,
    marginBottom: '5%',
    textAlign: "center",
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColorMessage: {
    color: "#2974b5",
    fontWeight:'400',
    fontSize: 18,
    marginBottom: '5%',
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2974b5",
    height: "10%",
    width:"100%",
    alignItems:"center",
    justifyContent:"center",
    borderRadius: 10,
    paddingHorizontal:"30%",
    marginBottom: '5%'
  },
  buttonText: {
    color:"#ffffff",
    fontSize: 18,
    fontWeight:'400'
  }
})
