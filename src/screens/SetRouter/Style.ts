import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#2974B4',
    paddingHorizontal: '2%',
    alignItems: 'center'
  },
  text: {
    marginTop: '5%',
    color: '#000000',
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 16,
  },
  CardReceipt: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingLeft: 25,
    paddingTop: 20,
    paddingBottom:20
  },

  ReceiptData: {
    color: "#000000",
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    gap: 15,
    width: '100%'
  },
  TitleReceipt: {
    color: "#000000",
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 18
  },
  ReceiptDataText: {
    color: '#646464',
    fontFamily: "Inter-Bold",
    fontWeight: '400',
    fontSize: 16
  },
  ContributorData: {
    color: '#646464',
    fontFamily: 'Inter-Bold',
    fontWeight: '400',
    fontSize: 16,
    minHeight: 10,
    width: '90%',
  },
  ReceiptDataBox: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    gap: 15,
    width: "100%"
  },
  FilterBox: {
    width: '100%',
    top: 60,
    marginBottom: 75,
    borderRadius: 8,
    backgroundColor: 'white',
    paddingLeft: 15,
    paddingVertical: 10
  },
  TextFilter: {
    color: 'black',
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 18
  },
  ButtonCall: {
    width: '55%',
    color: 'black'
  },
  FilterLine: {
    width: '100%',
    flexDirection: 'row'
  },
  SetRouteLine: {
    width: '80%',
    flexDirection: 'row',
    marginVertical: '2%'
  },
  SetRouteBox: {
    width: '100%',
    height: 40,
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: 'white',
    paddingLeft: 25,
    paddingTop: 10
  },
  SetRouteBoxFilter: {
    width: '100%',
    height: 42,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: 'white',
    paddingLeft: 25,
    justifyContent: 'flex-start',
    alignContent:'center'
  },
});
