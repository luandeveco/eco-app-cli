import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#2974B4',
    paddingHorizontal: '2%',
  },
  ButtonDownView: {
    marginTop: "16.5%",
    marginBottom:'3%'
  },
  containerReceipt: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: "2%"
  },
  ReceiptTitle: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: '2%'
  },
  titleText: {
    color: '#000000',
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 18
  },
  titleTextData: {
    color: '#646464',
    marginRight: "35%",
    marginLeft: '1%',
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 16
  },
  titleTextstatus: {
    color: '#000000',
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 16
  },
  receiptInformation:{
    alignItems:'flex-start',
    justifyContent: 'center',
    paddingHorizontal: "5%"
  },
  receiptInformationData:{
    color: '#646464',
    fontFamily: 'Inter-Bold',
    fontWeight: '400',
    fontSize: 16
  },
  Cell:{
    flexDirection:'row',
    width: '100%'
  },
  CellModal:{
    flexDirection:'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor:'#000000'
  },
  ButtonCall: {
    width: '55%',
    color: '#000000'
  },
  ButtonCallModal: {
    width: '100%',
    backgroundColor: '#2974B4',
    textAlign: 'center',
    borderRadius: 12,
    padding: 20,
    marginBottom: "4%",
  },
  TextData: {
    color: '#646464',
    fontFamily: 'Inter-Bold',
    fontWeight: '400',
    fontSize: 16,
    width: 279
  },
  ModalCPFTitleText:{
    color: 'rgba(255,255,255,0.71)',
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 18,
  },
  ModalCPFReceiptInformationData:{
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontWeight: '400',
    fontSize: 16,
    marginBottom: '5%'
  },
  inputLabelCPF:{
    flexDirection: 'row'
  },
});