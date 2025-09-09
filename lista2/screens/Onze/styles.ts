import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#DCDCDC',
  },  
  box: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    paddingBottom: 20,
    marginHorizontal: 20,
    alignSelf: 'center',
    maxWidth: 270,
    width: '100%'
  },
  title: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center'
  },
  rowButton: {
    flexDirection: 'row',
    justifyContent:'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginHorizontal: 5,
  },
  button: {
    borderColor: '#f8b20f',
    backgroundColor:'#f8b20f',
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: 100
  },
  buttonLabel: {
    color: '#333',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  image: {
    alignSelf: 'center',
    width: 140,
    height: 140
  }
});

export default styles;
