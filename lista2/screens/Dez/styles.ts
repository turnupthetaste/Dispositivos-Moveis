import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'rgb(48, 47, 47)',
  },  
  box: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
    alignSelf: 'center',
    maxWidth: 270,
    width: '100%'
  },
  title: {
    color: '#dfec50',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'column',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
  },
  rowButton: {
    flexDirection: 'row',
    justifyContent:'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginHorizontal: 5,
  },
  rowSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginHorizontal: 5
  },
  button: {
    borderColor: '#f8b20f',
    backgroundColor:'#f8b20f',
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  buttonLabel: {
    color: '#333',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  label: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    padding: 5,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
    minWidth: 200
  },
  output: {
    color: "#fff",
  },
});

export default styles;
