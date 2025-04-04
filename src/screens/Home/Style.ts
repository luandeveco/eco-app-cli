import {Dimensions, StyleSheet} from 'react-native';

const { width, height } = Dimensions.get('screen');

export const Styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerTitle: {
    flexDirection: 'column',
  },
  containerMen: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerHome: {
    paddingHorizontal: '5%',
  },
  styleContainer: {
    paddingHorizontal: '5%',
    backgroundColor: '#2974b5',
    paddingVertical: '10%',
    borderRadius: 20,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '5%',
  },
  textMensa: {
    paddingLeft: '5.5%',
    color: '#7f7f7f',
  },
  view: {
    flex: 1,
    backgroundColor: '#2974B4',
    paddingHorizontal: '2%',
  },
  text: {
    color: '#000000',
  },
  textMens: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '500',
  },
  textMen: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: '500',
  },
  inputText: {
    width: '100%',
    height: 50,
    marginTop: 10,
    borderColor: '#ffffff',
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  Syncbutton: {
    width: '100%',
    height: '11%',
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2974b5',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1.85,
    shadowRadius: 3.84,
    elevation: 5,
  },
  downButton: {
    width: '48%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2974b5',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1.85,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainerDown: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    justifyContent:'space-between',
    marginTop:10,
    height: '11%'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
  },
  buttonTextDown: {
    color: '#ffffff',
    fontSize: 17,
  },
  Settingbutton: {
    width: '20%',
    height: 43,
    marginTop: 10,
    marginBottom: '5%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000000',
    alignSelf: 'flex-end',
  },
  containerVersion: {
    justifyContent: 'flex-end', 
    alignItems: 'flex-start',
    paddingBottom: 20,
    bottom: width * -0.27,
    left: 15
  },
  versionText: {
    fontSize: 15,
    color: '#2974b5',
    fontWeight: '700'
  },
});
